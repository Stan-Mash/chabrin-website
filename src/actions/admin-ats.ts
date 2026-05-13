"use server";

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import {
  updateApplicationStage,
  setInterviewDetails,
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
  const meet_link      = (formData.get("meet_link")       as string | null)?.trim() || null;

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

    // Store interview details and send invitation email when scheduling
    if (stage === "interview_scheduled" && interview_raw) {
      const interviewDate = new Date(interview_raw);
      if (!isNaN(interviewDate.getTime())) {
        await setInterviewDetails(reference, interviewDate, meet_link);

        // Send interview invitation email only when first scheduling (stage changed)
        if (prevStage !== stage || meet_link) {
          try {
            await sendInterviewInviteEmail(
              app.email, app.full_name, reference,
              app.job_title, interviewDate, meet_link
            );
          } catch (err) {
            console.error("[admin-ats] interview-invite-email-failed", {
              reference,
              error: err instanceof Error ? err.message : "unknown",
            });
          }
        }
      }
    }

    await logAppEvent(app.id, prevStage, stage, me?.name ?? "admin", stage_note || internal_note);

    // Email candidate on meaningful stage changes
    if (prevStage !== stage) {
      // waiting_list and offer_declined have their own dedicated templates
      if (stage !== "waiting_list" && stage !== "offer_declined") {
        await sendStageChangeEmail(
          app.email, app.full_name, reference, app.job_title, stage, stage_note
        );
      }

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

      // Waiting list: warm, encouraging email
      if (stage === "waiting_list") {
        try {
          await sendWaitingListEmail(app.email, app.full_name, reference, app.job_title, stage_note);
        } catch (err) {
          console.error("[admin-ats] waiting-list-email-failed", {
            reference,
            error: err instanceof Error ? err.message : "unknown",
          });
        }
      }

      // Offer declined: graceful acknowledgment
      if (stage === "offer_declined") {
        try {
          await sendOfferDeclinedEmail(app.email, app.full_name, reference, app.job_title);
        } catch (err) {
          console.error("[admin-ats] offer-declined-email-failed", {
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
    to:      [email, siteConfig.contact.email],
    subject: `Shortlisted &#8212; Upload Your CV for ${jobTitle} (${reference})`,
    html,
  });
}

// ── Invite candidate from talent pool ────────────────────────────────────────

export async function adminInviteFromPool(
  _prev: Record<string, unknown>,
  formData: FormData
): Promise<Record<string, unknown>> {
  const me = await getAdminSession();
  if (!me) redirect("/admin-login");

  const reference = (formData.get("reference") as string | null)?.trim() ?? "";
  const new_job   = (formData.get("new_job")   as string | null)?.trim() || null;
  const message   = (formData.get("message")   as string | null)?.trim() || null;

  if (!reference) return { error: "Reference is required." };

  const app = await getAdminApplication(reference);
  if (!app) return { error: "Application not found." };

  const careersUrl = `${siteConfig.url}/en/careers`;

  try {
    await sendNewOpportunityEmail(
      app.email, app.full_name, reference, new_job || "a new opportunity", careersUrl, message
    );
    await logAppEvent(
      app.id, app.stage, app.stage, me?.name ?? "admin",
      `New opportunity notification sent${new_job ? `: ${new_job}` : ""}`
    );
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to send notification." };
  }
}

// ── Waiting list email ────────────────────────────────────────────────────────

async function sendWaitingListEmail(
  email:    string,
  name:     string,
  reference:string,
  jobTitle: string,
  note:     string | null
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#0D1B8E;padding:24px 20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#00C9C9;margin:0;font-size:20px;">Thank You for Your Time</h1>
    <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">Chabrin Agencies Limited &#8212; ${h(jobTitle)}</p>
  </div>
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:28px 24px;border-radius:0 0 8px 8px;">
    <p style="margin:0 0 16px;font-size:15px;">Dear <strong>${h(name)}</strong>,</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#475569;">
      Thank you for going through our selection process for <strong>${h(jobTitle)}</strong>
      (Ref: <strong>${h(reference)}</strong>).
    </p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#475569;">
      We were genuinely impressed by your background and the quality of your interview.
      While we are unable to make an offer at this time due to current team capacity,
      we would very much like to keep your details on file.
    </p>
    ${note ? `
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:14px 16px;margin-bottom:20px;">
      <p style="margin:0;font-size:14px;color:#0369a1;line-height:1.6;">${h(note)}</p>
    </div>` : ""}
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:18px 20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#166534;">&#127775; What this means for you</p>
      <ul style="margin:0;padding-left:18px;font-size:13px;color:#166534;line-height:1.8;">
        <li>You are on our priority shortlist for future vacancies.</li>
        <li>When a suitable opening arises, we will contact you directly before advertising publicly.</li>
        <li>No further action is required on your part.</li>
      </ul>
    </div>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">
      We genuinely look forward to working with you and hope to be in touch soon.
    </p>
    <p style="margin:0 0 4px;font-size:14px;color:#475569;">
      Warm regards,<br>
      <strong style="color:#0D1B8E;">Chabrin Agencies HR Team</strong>
    </p>
    <p style="margin:0;font-size:13px;color:#475569;">
      <a href="mailto:${siteConfig.contact.careersEmail}" style="color:#0D1B8E;">${siteConfig.contact.careersEmail}</a>
    </p>
    <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:14px;">
      Chabrin Agencies Limited &#183; Nacico Plaza, 5th Floor, Room 517, Landhies Road, Nairobi &#183; EARB Registered<br>
      Your personal data is held securely in accordance with the Kenya Data Protection Act 2019.
      To request removal, reply to this email.
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || process.env.SMTP_USER,
    to:      [email, siteConfig.contact.email],
    subject: `We&#039;d Love to Stay in Touch &#8212; ${jobTitle} (${reference})`,
    html,
  });
}

// ── Offer declined acknowledgment email ───────────────────────────────────────

async function sendOfferDeclinedEmail(
  email:    string,
  name:     string,
  reference:string,
  jobTitle: string
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#0D1B8E;padding:24px 20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#00C9C9;margin:0;font-size:20px;">Thank You for Letting Us Know</h1>
    <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">Chabrin Agencies Limited &#8212; ${h(jobTitle)}</p>
  </div>
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:28px 24px;border-radius:0 0 8px 8px;">
    <p style="margin:0 0 16px;font-size:15px;">Dear <strong>${h(name)}</strong>,</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#475569;">
      Thank you for informing us of your decision regarding the offer for
      <strong>${h(jobTitle)}</strong> (Ref: <strong>${h(reference)}</strong>).
    </p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#475569;">
      We completely understand, and we appreciate the time and effort you invested throughout
      our process. You made an excellent impression on our team.
    </p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">
      Should your circumstances change, or should you be interested in future opportunities
      with Chabrin Agencies, please do not hesitate to reach out. We would love to hear from you.
    </p>
    <p style="margin:0 0 4px;font-size:14px;color:#475569;">
      All the best in your career,<br>
      <strong style="color:#0D1B8E;">Chabrin Agencies HR Team</strong>
    </p>
    <p style="margin:0;font-size:13px;color:#475569;">
      <a href="mailto:${siteConfig.contact.careersEmail}" style="color:#0D1B8E;">${siteConfig.contact.careersEmail}</a>
    </p>
    <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:14px;">
      Chabrin Agencies Limited &#183; Nacico Plaza, 5th Floor, Room 517, Landhies Road, Nairobi &#183; EARB Registered
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || process.env.SMTP_USER,
    to:      [email, siteConfig.contact.email],
    subject: `Regarding Your Application &#8212; ${jobTitle} (${reference})`,
    html,
  });
}

// ── New opportunity notification email (talent pool) ──────────────────────────

async function sendNewOpportunityEmail(
  email:      string,
  name:       string,
  reference:  string,
  jobTitle:   string,
  careersUrl: string,
  message:    string | null
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#0D1B8E;padding:24px 20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#00C9C9;margin:0;font-size:20px;">A New Opportunity Has Opened</h1>
    <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">Chabrin Agencies Limited</p>
  </div>
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:28px 24px;border-radius:0 0 8px 8px;">
    <p style="margin:0 0 16px;font-size:15px;">Dear <strong>${h(name)}</strong>,</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#475569;">
      We are reaching out because <strong>${h(jobTitle)}</strong> has become available
      and, based on your previous application (Ref: <strong>${h(reference)}</strong>),
      we believe you would be an excellent fit.
    </p>
    ${message ? `
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:14px 16px;margin-bottom:20px;">
      <p style="margin:0;font-size:14px;color:#0369a1;line-height:1.6;font-style:italic;">&ldquo;${h(message)}&rdquo;</p>
    </div>` : ""}
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#475569;">
      If you are interested, please visit our careers page to submit your application.
      Mention your previous reference number so our team can fast-track your file.
    </p>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${careersUrl}"
         style="display:inline-block;background:#0D1B8E;color:#fff;text-decoration:none;
                padding:14px 32px;border-radius:50px;font-weight:700;font-size:14px;">
        View Open Positions &#8594;
      </a>
    </div>
    <p style="margin:0 0 4px;font-size:14px;color:#475569;">
      Warm regards,<br>
      <strong style="color:#0D1B8E;">Chabrin Agencies HR Team</strong>
    </p>
    <p style="margin:0;font-size:13px;color:#475569;">
      <a href="mailto:${siteConfig.contact.careersEmail}" style="color:#0D1B8E;">${siteConfig.contact.careersEmail}</a>
    </p>
    <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:14px;">
      Chabrin Agencies Limited &#183; Nacico Plaza, 5th Floor, Room 517, Landhies Road, Nairobi &#183; EARB Registered<br>
      You are receiving this because you previously applied with us and requested to be kept on file.
      To be removed, reply to this email.
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || process.env.SMTP_USER,
    to:      [email, siteConfig.contact.email],
    subject: `New Opportunity at Chabrin Agencies &#8212; ${jobTitle}`,
    html,
  });
}

// ── Interview invitation email ────────────────────────────────────────────────

async function sendInterviewInviteEmail(
  email:       string,
  name:        string,
  reference:   string,
  jobTitle:    string,
  interviewAt: Date,
  meetLink:    string | null
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const dateStr = interviewAt.toLocaleDateString("en-KE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    timeZone: "Africa/Nairobi",
  });
  const timeStr = interviewAt.toLocaleTimeString("en-KE", {
    hour: "2-digit", minute: "2-digit", hour12: true,
    timeZone: "Africa/Nairobi",
  });

  const meetSection = meetLink
    ? `
    <div style="text-align:center;margin:28px 0;">
      <a href="${meetLink}"
         style="display:inline-block;background:#1a73e8;color:#fff;text-decoration:none;
                padding:14px 32px;border-radius:50px;font-weight:700;font-size:15px;
                letter-spacing:0.01em;">
        &#127909; Join Google Meet
      </a>
      <p style="margin:10px 0 0;font-size:12px;color:#94a3b8;">
        Or copy the link: <a href="${meetLink}" style="color:#1a73e8;">${meetLink}</a>
      </p>
    </div>`
    : `
    <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:14px 16px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#92400e;">
        &#128205; Our HR team will share the meeting link closer to the date.
        Please ensure you are available at the scheduled time.
      </p>
    </div>`;

  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#0D1B8E;padding:24px 20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#00C9C9;margin:0;font-size:20px;">Interview Invitation</h1>
    <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">
      Chabrin Agencies Limited &#8212; ${h(jobTitle)}
    </p>
  </div>

  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:28px 24px;border-radius:0 0 8px 8px;">
    <p style="margin:0 0 16px;font-size:15px;">Dear <strong>${h(name)}</strong>,</p>

    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">
      We are pleased to invite you for an interview for the position of
      <strong>${h(jobTitle)}</strong> (Ref: <strong>${h(reference)}</strong>).
    </p>

    <!-- Interview details box -->
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:20px 22px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#64748b;width:110px;">&#128197; Date</td>
          <td style="padding:6px 0;font-size:14px;font-weight:700;color:#0D1B8E;">${dateStr}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#64748b;">&#128336; Time</td>
          <td style="padding:6px 0;font-size:14px;font-weight:700;color:#0D1B8E;">${timeStr} (EAT &#8212; Nairobi)</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#64748b;">&#128203; Format</td>
          <td style="padding:6px 0;font-size:14px;font-weight:700;color:#0D1B8E;">${meetLink ? "Video Interview (Google Meet)" : "Video / Phone Interview"}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#64748b;">&#128216; Reference</td>
          <td style="padding:6px 0;font-size:14px;font-weight:700;color:#0D1B8E;font-family:monospace;">${h(reference)}</td>
        </tr>
      </table>
    </div>

    ${meetSection}

    <!-- Preparation tips -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 20px;margin-bottom:24px;">
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#334155;">&#9989; How to Prepare</p>
      <ul style="margin:0;padding-left:18px;font-size:13px;color:#475569;line-height:1.8;">
        <li>Review the job description and align your experience to the key requirements.</li>
        <li>Prepare 2&#8211;3 examples that demonstrate relevant achievements.</li>
        <li>Test your internet connection and camera/microphone 15 minutes before the call.</li>
        <li>Join from a quiet, well-lit location.</li>
        <li>Have your CV, reference number, and any supporting documents ready.</li>
      </ul>
    </div>

    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">
      If you are unable to attend at this time, please reply to this email as soon as possible
      so we can reschedule. We look forward to speaking with you.
    </p>

    <p style="margin:0 0 4px;font-size:14px;color:#475569;">
      Warm regards,<br>
      <strong style="color:#0D1B8E;">Chabrin Agencies HR Team</strong>
    </p>
    <p style="margin:0;font-size:13px;color:#475569;">
      <a href="mailto:${siteConfig.contact.careersEmail}" style="color:#0D1B8E;">${siteConfig.contact.careersEmail}</a>
    </p>

    <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:14px;">
      Chabrin Agencies Limited &#183; Nacico Plaza, 5th Floor, Room 517, Landhies Road, Nairobi &#183; EARB Registered<br>
      Your personal data is handled in accordance with the Kenya Data Protection Act 2019.
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || process.env.SMTP_USER,
    to:      [email, siteConfig.contact.email],
    subject: `Interview Invitation &#8212; ${jobTitle} (${reference})`,
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
