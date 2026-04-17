"use server";

/**
 * submit-application.ts — Server Action for job applications.
 *
 * Flow:
 *  1. Validate input with Zod
 *  2. Verify Cloudflare Turnstile token
 *  3. Upload CV to DO Spaces (if provided)
 *  4. Generate reference APP-DEPT-YYYY-XXXXX
 *  5. Insert into applications table
 *  6. Log app_event
 *  7. Email HR + confirmation to candidate
 */

import { z } from "zod";
import nodemailer from "nodemailer";
import { insertApplication, logAppEvent } from "@/db/queries/applications";
import { getJobBySlug } from "@/db/queries/jobs";
import { siteConfig } from "@/config/site";

// ── Validation schema ─────────────────────────────────────────────────────────

const schema = z.object({
  job_slug:     z.string().min(1),
  job_id:       z.string().uuid(),
  full_name:    z.string().min(2).max(120).trim(),
  email:        z.string().email().max(255).trim(),
  phone:        z.string().min(9).max(25).trim(),
  linkedin_url: z.string().url().max(500).optional().or(z.literal("")),
  cover_letter: z.string().max(5000).trim().optional(),
  answers:      z.record(z.string(), z.string()).optional(),
  source:       z.string().max(100).optional(),
  consent:      z.literal(true),
  token:        z.string().optional(),
  // cv_url is set after upload, passed as hidden field
  cv_url:       z.string().url().optional().or(z.literal("")),
});

export type ApplicationInput = z.infer<typeof schema>;

// ── Reference number generator ────────────────────────────────────────────────

function generateReference(department: string): string {
  const year  = new Date().getFullYear();
  const dept  = department.toUpperCase().slice(0, 3).replace(/[^A-Z]/g, "X");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix  = "";
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `APP-${dept}-${year}-${suffix}`;
}

// ── Turnstile ─────────────────────────────────────────────────────────────────

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY ?? "";
  if (!secret || secret.startsWith("1x000000000000000000000")) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

// ── SMTP ──────────────────────────────────────────────────────────────────────

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) throw new Error("SMTP not configured");
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

// ── HTML sanitiser ────────────────────────────────────────────────────────────

function h(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

// ── Emails ────────────────────────────────────────────────────────────────────

function hrEmailHtml(
  data: ApplicationInput,
  reference: string,
  jobTitle:  string,
  department: string
): string {
  const adminUrl = `${siteConfig.url}/admin/applications/${encodeURIComponent(reference)}`;
  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#0D1B8E;padding:24px 20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#00C9C9;margin:0;font-size:20px;">New Application — Chabrin ATS</h1>
    <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">via chabrinagencies.com/careers</p>
  </div>
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
    <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
      <div style="background:#f0f4ff;border:1px solid #c7d2fe;border-radius:8px;padding:12px 16px;flex:1;min-width:160px;">
        <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#6366f1;font-weight:700;">Reference</p>
        <p style="margin:0;font-size:18px;font-weight:900;color:#0D1B8E;letter-spacing:.04em;">${h(reference)}</p>
      </div>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;flex:1;min-width:160px;">
        <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#15803d;font-weight:700;">Position</p>
        <p style="margin:0;font-size:15px;font-weight:800;color:#15803d;">${h(jobTitle)}</p>
        <p style="margin:2px 0 0;font-size:11px;color:#666;">${h(department)}</p>
      </div>
    </div>

    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#0D1B8E;margin:0 0 10px;">Candidate</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:18px;font-size:13px;">
      <tr><td style="padding:5px 0;color:#666;width:130px;">Name</td><td style="padding:5px 0;font-weight:600;">${h(data.full_name)}</td></tr>
      <tr style="border-top:1px solid #f1f5f9;"><td style="padding:5px 0;color:#666;">Email</td><td style="padding:5px 0;">${h(data.email)}</td></tr>
      <tr style="border-top:1px solid #f1f5f9;"><td style="padding:5px 0;color:#666;">Phone</td><td style="padding:5px 0;">${h(data.phone)}</td></tr>
      ${data.linkedin_url ? `<tr style="border-top:1px solid #f1f5f9;"><td style="padding:5px 0;color:#666;">LinkedIn</td><td style="padding:5px 0;"><a href="${h(data.linkedin_url)}" style="color:#0D1B8E;">${h(data.linkedin_url)}</a></td></tr>` : ""}
      ${data.cv_url ? `<tr style="border-top:1px solid #f1f5f9;"><td style="padding:5px 0;color:#666;">CV</td><td style="padding:5px 0;"><a href="${h(data.cv_url)}" style="color:#0D1B8E;">Download CV</a></td></tr>` : ""}
    </table>

    ${data.cover_letter ? `
    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#0D1B8E;margin:0 0 10px;">Cover Letter</h2>
    <div style="background:#f8fafc;border-left:4px solid #00C9C9;padding:14px 16px;border-radius:0 6px 6px 0;margin-bottom:18px;">
      <p style="margin:0;font-size:13px;line-height:1.6;white-space:pre-wrap;">${h(data.cover_letter)}</p>
    </div>` : ""}

    ${data.answers && Object.keys(data.answers).length > 0 ? `
    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#0D1B8E;margin:0 0 10px;">Screening Answers</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:18px;font-size:13px;">
      ${Object.entries(data.answers).map(([q, a]) =>
        `<tr style="border-top:1px solid #f1f5f9;">
          <td style="padding:6px 0;color:#666;width:50%;vertical-align:top;">${h(q)}</td>
          <td style="padding:6px 0;font-weight:600;">${h(a)}</td>
        </tr>`
      ).join("")}
    </table>` : ""}

    <div style="text-align:center;margin-top:20px;">
      <a href="${adminUrl}" style="display:inline-block;background:#0D1B8E;color:#fff;text-decoration:none;padding:12px 28px;border-radius:50px;font-weight:700;font-size:13px;">
        Review in Admin Panel →
      </a>
    </div>
  </div>
</div>`;
}

function candidateConfirmationHtml(name: string, reference: string, jobTitle: string): string {
  const statusUrl = `${siteConfig.url}/en/careers/track`;
  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#0D1B8E;padding:24px 20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#00C9C9;margin:0;font-size:20px;">Application Received</h1>
    <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Chabrin Agencies Limited</p>
  </div>
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:28px 24px;border-radius:0 0 8px 8px;">
    <p style="margin:0 0 16px;font-size:15px;">Dear <strong>${h(name)}</strong>,</p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">
      Thank you for applying for the <strong>${h(jobTitle)}</strong> position at Chabrin Agencies Limited.
      Your application has been received and is now under review. We will be in touch within <strong>5 business days</strong>.
    </p>

    <div style="background:#f0f4ff;border:2px solid #0D1B8E;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#6366f1;font-weight:700;">Your Application Reference</p>
      <p style="margin:0;font-size:26px;font-weight:900;color:#0D1B8E;letter-spacing:.08em;">${h(reference)}</p>
      <p style="margin:6px 0 0;font-size:12px;color:#475569;">Use this reference to track your application status</p>
    </div>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#15803d;">What happens next?</p>
      <p style="margin:0 0 4px;font-size:13px;color:#166534;">✓ Our HR team will review your application within 5 business days</p>
      <p style="margin:0 0 4px;font-size:13px;color:#166534;">✓ Shortlisted candidates will be contacted for a phone/video screen</p>
      <p style="margin:0;font-size:13px;color:#166534;">✓ You will receive an email update at every stage</p>
    </div>

    <div style="text-align:center;margin-bottom:20px;">
      <a href="${statusUrl}" style="display:inline-block;background:#0D1B8E;color:#fff;text-decoration:none;padding:12px 28px;border-radius:50px;font-weight:700;font-size:13px;">
        Track Your Application
      </a>
    </div>

    <p style="margin:0;font-size:13px;color:#475569;">
      Questions? Contact us at
      <a href="mailto:${siteConfig.contact.careersEmail}" style="color:#0D1B8E;">${siteConfig.contact.careersEmail}</a>
      or call <a href="tel:${siteConfig.contact.phone}" style="color:#0D1B8E;">${siteConfig.contact.phone}</a>.
    </p>

    <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:14px;">
      Chabrin Agencies Limited · Nacico Plaza, 5th Floor, Room 517, Landhies Road, Nairobi · EARB Registered<br>
      Your personal data is handled in accordance with the Kenya Data Protection Act 2019.
      <a href="${siteConfig.url}/en/privacy-policy" style="color:#94a3b8;">Privacy Policy</a>
    </p>
  </div>
</div>`;
}

function stageChangeEmailHtml(
  name: string,
  reference: string,
  jobTitle: string,
  stage: string,
  note?: string | null
): string {
  const STAGE_LABELS: Record<string, string> = {
    reviewing:           "Under Review",
    shortlisted:         "Shortlisted",
    interview_scheduled: "Interview Scheduled",
    interviewed:         "Interview Complete",
    offer_extended:      "Offer Extended",
    hired:               "Offer Accepted — Welcome to Chabrin!",
    rejected:            "Application Outcome",
  };
  const STAGE_COLOURS: Record<string, string> = {
    shortlisted:         "#15803d",
    interview_scheduled: "#2563eb",
    interviewed:         "#7c3aed",
    offer_extended:      "#b45309",
    hired:               "#15803d",
    rejected:            "#dc2626",
    reviewing:           "#475569",
  };
  const label  = STAGE_LABELS[stage]  ?? stage;
  const colour = STAGE_COLOURS[stage] ?? "#0D1B8E";
  const trackUrl = `${siteConfig.url}/en/careers/track`;

  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#0D1B8E;padding:24px 20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#00C9C9;margin:0;font-size:20px;">Application Update</h1>
    <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Chabrin Agencies Limited — ${h(jobTitle)}</p>
  </div>
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:28px 24px;border-radius:0 0 8px 8px;">
    <p style="margin:0 0 16px;font-size:15px;">Dear <strong>${h(name)}</strong>,</p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">
      We have an update on your application for <strong>${h(jobTitle)}</strong>.
    </p>

    <div style="border:2px solid ${colour};border-radius:12px;padding:16px 20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:${colour};font-weight:700;">New Status</p>
      <p style="margin:0;font-size:22px;font-weight:900;color:${colour};">${h(label)}</p>
    </div>

    ${note ? `
    <div style="background:#f8fafc;border-left:4px solid #00C9C9;padding:14px 16px;border-radius:0 6px 6px 0;margin-bottom:20px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.05em;">Message from HR</p>
      <p style="margin:0;font-size:13px;line-height:1.6;white-space:pre-wrap;">${h(note)}</p>
    </div>` : ""}

    <p style="margin:0 0 4px;font-size:13px;color:#475569;">Reference: <strong>${h(reference)}</strong></p>

    <div style="text-align:center;margin:20px 0;">
      <a href="${trackUrl}" style="display:inline-block;background:#0D1B8E;color:#fff;text-decoration:none;padding:12px 28px;border-radius:50px;font-weight:700;font-size:13px;">
        Track Application
      </a>
    </div>

    <p style="margin:0;font-size:13px;color:#475569;">
      Questions? <a href="mailto:${siteConfig.contact.careersEmail}" style="color:#0D1B8E;">${siteConfig.contact.careersEmail}</a>
    </p>
    <p style="margin:18px 0 0;font-size:11px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:14px;">
      Chabrin Agencies Limited · Nacico Plaza, 5th Floor, Room 517, Landhies Road, Nairobi
    </p>
  </div>
</div>`;
}

// ── Main server action ────────────────────────────────────────────────────────

export async function submitApplication(
  formData: unknown
): Promise<{ success: true; reference: string } | { success: false; error: string }> {
  const result = schema.safeParse(formData);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Validation failed.";
    return { success: false, error: firstError };
  }
  const data = result.data;

  const ok = await verifyTurnstile(data.token);
  if (!ok) return { success: false, error: "Bot verification failed. Please refresh and try again." };

  // Get job for department + title
  const job = await getJobBySlug(data.job_slug);
  if (!job) return { success: false, error: "This position is no longer accepting applications." };

  const reference = generateReference(job.department);

  try {
    await insertApplication({
      reference,
      job_id:       data.job_id,
      full_name:    data.full_name,
      email:        data.email,
      phone:        data.phone,
      linkedin_url: data.linkedin_url || null,
      cv_url:       data.cv_url       || null,
      cover_letter: data.cover_letter || null,
      answers:      data.answers      ?? {},
      consent_given: true,
      source:        data.source      || null,
    });
  } catch (err) {
    console.error("[ats] db-insert-failed", {
      reference,
      error: err instanceof Error ? err.message : "unknown",
      time: new Date().toISOString(),
    });
    return { success: false, error: "There was a problem submitting your application. Please try again." };
  }

  // Log initial event
  try {
    const { getAdminApplication } = await import("@/db/queries/applications");
    const app = await getAdminApplication(reference);
    if (app) {
      await logAppEvent(app.id, null, "applied", "system", "Application submitted via website");
    }
  } catch { /* non-critical */ }

  // Emails
  try {
    const transporter = getTransporter();
    await Promise.all([
      transporter.sendMail({
        from:    process.env.SMTP_FROM || process.env.SMTP_USER,
        to:      siteConfig.contact.careersEmail,
        replyTo: data.email,
        subject: `New Application: ${job.title} — ${reference}`,
        html:    hrEmailHtml(data, reference, job.title, job.department),
      }),
      transporter.sendMail({
        from:    process.env.SMTP_FROM || process.env.SMTP_USER,
        to:      data.email,
        subject: `Application Received — ${job.title} (${reference})`,
        html:    candidateConfirmationHtml(data.full_name, reference, job.title),
      }),
    ]);
  } catch (err) {
    console.error("[ats] email-failed", {
      reference,
      error: err instanceof Error ? err.message : "unknown",
      time: new Date().toISOString(),
    });
  }

  console.info("[ats] application-submitted", {
    reference,
    job:  job.title,
    time: new Date().toISOString(),
  });

  return { success: true, reference };
}

// ── Stage change (called from admin action) ───────────────────────────────────

export async function sendStageChangeEmail(
  email:     string,
  name:      string,
  reference: string,
  jobTitle:  string,
  stage:     string,
  note?:     string | null
): Promise<void> {
  const NOTIFY_STAGES = ["shortlisted","interview_scheduled","offer_extended","hired","rejected"];
  if (!NOTIFY_STAGES.includes(stage)) return;
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from:    process.env.SMTP_FROM || process.env.SMTP_USER,
      to:      email,
      subject: `Update on your application — ${jobTitle} (${reference})`,
      html:    stageChangeEmailHtml(name, reference, jobTitle, stage, note),
    });
  } catch (err) {
    console.error("[ats] stage-email-failed", {
      reference,
      stage,
      error: err instanceof Error ? err.message : "unknown",
    });
  }
}
