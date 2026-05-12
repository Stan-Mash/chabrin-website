"use server";

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import {
  updateApplicationStage,
  setInterviewAt,
  logAppEvent,
  getAdminApplication,
  setUploadToken,
  type AppStage,
} from "@/db/queries/applications";
import { insertJob, updateJob, type NewJob } from "@/db/queries/jobs";
import { sendStageChangeEmail } from "@/actions/submit-application";
import { generateUploadToken } from "@/lib/cv-upload-token";
import { siteConfig } from "@/config/site";
import nodemailer from "nodemailer";

// ── Helpers ───────────────────────────────────────────────────────────────────

function h(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

/**
 * Append a timestamped entry to internal_notes.
 * Returns the combined string so it can be passed to the DB update.
 */
function appendNote(existing: string | null, newNote: string, actor: string): string {
  const ts    = new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi", hour12: false });
  const entry = `[${ts} — ${actor}]\n${newNote.trim()}`;
  return existing ? `${entry}\n\n${existing}` : entry;
}

// ── Update application stage ──────────────────────────────────────────────────

export async function adminUpdateApplication(
  _prev: Record<string, unknown>,
  formData: FormData
): Promise<Record<string, unknown>> {
  const me = await getAdminSession();
  if (!me) redirect("/admin-login");

  const reference      = (formData.get("reference")       as string | null)?.trim() ?? "";
  const stage          = (formData.get("stage")           as string | null)?.trim() ?? "";
  const internal_note  = (formData.get("internal_notes")  as string | null)?.trim() || null;
  const stage_note     = (formData.get("stage_note")      as string | null)?.trim() || null;
  const rejection_text = (formData.get("rejection_reason") as string | null)?.trim() || null;
  const interview_raw  = (formData.get("interview_at")    as string | null)?.trim() || null;

  if (!reference || !stage) return { error: "Reference and stage are required." };

  const app = await getAdminApplication(reference);
  if (!app) return { error: "Application not found." };

  const prevStage = app.stage;

  // Build append-only internal notes
  const combined_notes = internal_note
    ? appendNote(app.internal_notes, internal_note, me?.name ?? "admin")
    : null;

  // rejection_reason is only set when stage = 'rejected'; otherwise preserve existing
  const rejection_reason = stage === "rejected" ? rejection_text : null;

  try {
    await updateApplicationStage(
      reference,
      stage as AppStage,
      rejection_reason,
      combined_notes
    );

    // Store interview timestamp when scheduling
    if (stage === "interview_scheduled" && interview_raw) {
      const interviewDate = new Date(interview_raw);
      if (!isNaN(interviewDate.getTime())) {
        await setInterviewAt(reference, interviewDate);
      }
    }

    await logAppEvent(app.id, prevStage, stage, me?.name ?? "admin", stage_note || internal_note);

    // Email candidate on meaningful stage changes
    if (prevStage !== stage) {
      await sendStageChangeEmail(
        app.email, app.full_name, reference, app.job_title, stage, stage_note
      );

      // When shortlisted: generate signed CV upload link and send to candidate
      if (stage === "shortlisted" && process.env.CV_UPLOAD_SECRET) {
        try {
          const { token, expiresAt } = generateUploadToken(reference);
          await setUploadToken(reference, token, expiresAt);
          const exp       = Math.floor(expiresAt.getTime() / 1000);
          const uploadUrl = `${siteConfig.url}/en/careers/upload?ref=${encodeURIComponent(reference)}&tok=${encodeURIComponent(token)}&exp=${exp}`;
          await sendCvUploadEmail(app.email, app.full_name, reference, app.job_title, uploadUrl, expiresAt);
        } catch (err) {
          console.error("[admin-ats] upload-link-email-failed", {
            reference,
            error: err instanceof Error ? err.message : "unknown",
          });
        }
      }
    }

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
}

// ── Resend CV upload link ─────────────────────────────────────────────────────

export async function adminResendUploadLink(
  _prev: Record<string, unknown>,
  formData: FormData
): Promise<Record<string, unknown>> {
  const me = await getAdminSession();
  if (!me) redirect("/admin-login");

  const reference = (formData.get("reference") as string | null)?.trim() ?? "";
  if (!reference) return { error: "Reference is required." };

  if (!process.env.CV_UPLOAD_SECRET) {
    return { error: "CV upload feature is not configured (missing CV_UPLOAD_SECRET)." };
  }

  const app = await getAdminApplication(reference);
  if (!app) return { error: "Application not found." };

  if (app.cv_url) {
    return { error: "A CV has already been uploaded for this application." };
  }

  try {
    const { token, expiresAt } = generateUploadToken(reference);
    await setUploadToken(reference, token, expiresAt);
    const exp       = Math.floor(expiresAt.getTime() / 1000);
    const uploadUrl = `${siteConfig.url}/en/careers/upload?ref=${encodeURIComponent(reference)}&tok=${encodeURIComponent(token)}&exp=${exp}`;
    await sendCvUploadEmail(app.email, app.full_name, reference, app.job_title, uploadUrl, expiresAt);
    await logAppEvent(app.id, app.stage, app.stage, me?.name ?? "admin", "CV upload link resent by HR");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to send upload link." };
  }
}

// ── CV upload link email ──────────────────────────────────────────────────────

async function sendCvUploadEmail(
  email:     string,
  name:      string,
  reference: string,
  jobTitle:  string,
  uploadUrl: string,
  expiresAt: Date
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const expiry = expiresAt.toLocaleDateString("en-KE", {
    day: "numeric", month: "long", year: "numeric"
  });

  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#0D1B8E;padding:24px 20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#00C9C9;margin:0;font-size:20px;">You&#039;ve Been Shortlisted!</h1>
    <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Chabrin Agencies Limited &#8212; ${h(jobTitle)}</p>
  </div>
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:28px 24px;border-radius:0 0 8px 8px;">
    <p style="margin:0 0 16px;font-size:15px;">Dear <strong>${h(name)}</strong>,</p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">
      Congratulations! After reviewing your application for <strong>${h(jobTitle)}</strong>
      (ref: <strong>${h(reference)}</strong>), you have been shortlisted for the next stage
      of our selection process.
    </p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">
      Please upload your CV using the secure link below. Our HR team will review it ahead
      of the interview stage.
    </p>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="${uploadUrl}"
         style="display:inline-block;background:#0D1B8E;color:#fff;text-decoration:none;
                padding:14px 32px;border-radius:50px;font-weight:700;font-size:14px;">
        Upload My CV &#8594;
      </a>
    </div>

    <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:14px 16px;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;color:#92400e;">
        &#9200; <strong>This link expires on ${expiry}</strong>. Please upload your CV before then.
        If it has expired, contact us at
        <a href="mailto:${siteConfig.contact.careersEmail}" style="color:#92400e;">${siteConfig.contact.careersEmail}</a>.
      </p>
    </div>

    <p style="margin:0 0 4px;font-size:13px;color:#475569;">
      Accepted formats: PDF, DOC, DOCX (max 5MB).
    </p>
    <p style="margin:0;font-size:13px;color:#475569;">
      Questions? Contact us at
      <a href="mailto:${siteConfig.contact.careersEmail}" style="color:#0D1B8E;">${siteConfig.contact.careersEmail}</a>.
    </p>

    <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:14px;">
      Chabrin Agencies Limited &#183; Nacico Plaza, 5th Floor, Room 517, Landhies Road, Nairobi &#183; EARB Registered<br>
      Your personal data is handled in accordance with the Kenya Data Protection Act 2019.
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || process.env.SMTP_USER,
    to:      email,
    subject: `Shortlisted &#8212; Upload Your CV for ${jobTitle} (${reference})`,
    html,
  });
}

// ── Create job ────────────────────────────────────────────────────────────────

export async function adminCreateJob(
  _prev: Record<string, unknown>,
  formData: FormData
): Promise<Record<string, unknown>> {
  const me = await getAdminSession();
  if (!me) redirect("/admin-login");

  const title       = (formData.get("title")       as string)?.trim();
  const department  = (formData.get("department")  as string)?.trim();
  const job_type    = (formData.get("job_type")    as string)?.trim() || "Full-time";
  const location    = (formData.get("location")    as string)?.trim() || "Nairobi (On-site)";
  const summary     = (formData.get("summary")     as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const salary_range= (formData.get("salary_range") as string)?.trim() || null;
  const status      = (formData.get("status")      as string)?.trim() || "draft";
  const closes_at   = (formData.get("closes_at")   as string)?.trim() || null;

  const requirements_raw = (formData.get("requirements") as string)?.trim() ?? "";
  const requirements = requirements_raw.split("\n").map(s => s.trim()).filter(Boolean);

  const nice_to_have_raw = (formData.get("nice_to_have") as string)?.trim() ?? "";
  const nice_to_have = nice_to_have_raw.split("\n").map(s => s.trim()).filter(Boolean);

  if (!title || !department || !summary || !description) {
    return { error: "Title, department, summary and description are required." };
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  try {
    const id = await insertJob({
      slug, title, department, job_type, location, summary, description,
      requirements, nice_to_have, salary_range,
      screening_questions: [],
      status: status as NewJob["status"],
      closes_at: closes_at ? new Date(closes_at) : null,
    });
    return { success: true, id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create job.";
    if (msg.includes("unique") || msg.includes("slug")) {
      return { error: "A job with this title already exists. Please use a different title." };
    }
    return { error: msg };
  }
}

// ── Update job ────────────────────────────────────────────────────────────────

export async function adminUpdateJob(
  _prev: Record<string, unknown>,
  formData: FormData
): Promise<Record<string, unknown>> {
  const me = await getAdminSession();
  if (!me) redirect("/admin-login");

  const id          = (formData.get("id")          as string)?.trim();
  const title       = (formData.get("title")       as string)?.trim();
  const department  = (formData.get("department")  as string)?.trim();
  const job_type    = (formData.get("job_type")    as string)?.trim();
  const location    = (formData.get("location")    as string)?.trim();
  const summary     = (formData.get("summary")     as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const salary_range= (formData.get("salary_range") as string)?.trim() || null;
  const status      = (formData.get("status")      as string)?.trim();
  const closes_at   = (formData.get("closes_at")   as string)?.trim() || null;

  const requirements_raw = (formData.get("requirements") as string)?.trim() ?? "";
  const requirements = requirements_raw.split("\n").map(s => s.trim()).filter(Boolean);
  const nice_to_have_raw = (formData.get("nice_to_have") as string)?.trim() ?? "";
  const nice_to_have = nice_to_have_raw.split("\n").map(s => s.trim()).filter(Boolean);

  if (!id) return { error: "Job ID is required." };

  try {
    await updateJob(id, {
      title, department, job_type, location, summary, description,
      requirements, nice_to_have, salary_range,
      status: status as NewJob["status"],
      closes_at: closes_at ? new Date(closes_at) : null,
    });
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
}
