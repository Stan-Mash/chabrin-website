"use server";

/**
 * admin-complaints.ts — Server Actions for the staff admin panel.
 *
 * All actions verify the admin session cookie before doing anything.
 * If the cookie is invalid, they throw — the client shows an error.
 *
 * Status-change emails are sent to the submitter automatically when
 * status moves to: acknowledged, assigned, in_progress, resolved, closed.
 */

import nodemailer from "nodemailer";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateComplaintStatus, getAdminComplaint } from "@/db/queries/admin-complaints";

// ── Auth guard (used inside every action) ────────────────────────────────────

async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Unauthorised");
}

// ── Update complaint ──────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  acknowledged: "Acknowledged",
  assigned:     "Assigned to a Team Member",
  in_progress:  "In Progress",
  resolved:     "Resolved",
  closed:       "Closed",
};

const STATUS_DESCRIPTIONS: Record<string, string> = {
  acknowledged: "A member of our team has reviewed your complaint and it is being processed.",
  assigned:     "Your complaint has been assigned to a staff member who will be in touch.",
  in_progress:  "Work is actively underway to resolve your complaint.",
  resolved:     "Your complaint has been resolved. Please see the resolution notes below.",
  closed:       "Your complaint has been closed. Thank you for contacting us.",
};

function h(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) throw new Error("SMTP not configured");
  return nodemailer.createTransport({
    host, port, secure: port === 465, auth: { user, pass },
  });
}

function statusUpdateEmailHtml(
  name:             string,
  reference:        string,
  status:           string,
  resolution_notes: string | null
): string {
  const label       = STATUS_LABELS[status]       ?? status;
  const description = STATUS_DESCRIPTIONS[status] ?? "Your complaint status has been updated.";
  const isResolved  = status === "resolved" || status === "closed";
  const trackUrl    = `https://chabrinagencies.com/en/complaints#status`;

  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#0D1B8E;padding:24px 20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#00C9C9;margin:0;font-size:20px;">Complaint Update</h1>
    <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:12px;">Chabrin Agencies Limited</p>
  </div>
  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:28px 24px;border-radius:0 0 8px 8px;">
    <p style="margin:0 0 20px;font-size:15px;">Dear <strong>${h(name)}</strong>,</p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">
      We wanted to let you know that the status of your complaint has been updated.
    </p>

    <!-- Reference -->
    <div style="background:#f0f4ff;border:1px solid #c7d2fe;border-radius:10px;padding:14px 18px;margin-bottom:20px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#6366f1;font-weight:700;">Reference</p>
        <p style="margin:0;font-size:18px;font-weight:900;color:#0D1B8E;letter-spacing:.05em;">${h(reference)}</p>
      </div>
      <div>
        <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#6366f1;font-weight:700;">New Status</p>
        <p style="margin:0;font-size:16px;font-weight:800;color:#0D1B8E;">${h(label)}</p>
      </div>
    </div>

    <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">${h(description)}</p>

    ${isResolved && resolution_notes ? `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#15803d;">Resolution Notes</p>
      <p style="margin:0;font-size:13px;color:#166534;line-height:1.6;white-space:pre-wrap;">${h(resolution_notes)}</p>
    </div>` : ""}

    <div style="text-align:center;margin-bottom:24px;">
      <a href="${trackUrl}"
         style="display:inline-block;background:#0D1B8E;color:#fff;text-decoration:none;
                padding:12px 28px;border-radius:50px;font-weight:700;font-size:13px;">
        View Full Status
      </a>
    </div>

    <p style="margin:0;font-size:13px;color:#475569;">
      Questions? WhatsApp us at
      <a href="https://wa.me/254720854389?text=Following+up+on+${h(reference)}"
         style="color:#0D1B8E;">+254 720 854 389</a>
      or email
      <a href="mailto:info@chabrinagencies.co.ke" style="color:#0D1B8E;">info@chabrinagencies.co.ke</a>
    </p>

    <p style="margin:20px 0 0;font-size:10px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:16px;">
      Chabrin Agencies Limited · Nacico Plaza, 5th Floor, Landhies Road, Nairobi · EARB Registered
    </p>
  </div>
</div>`;
}

export async function adminUpdateComplaint(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();

  const reference        = (formData.get("reference")        as string)?.trim().toUpperCase();
  const status           = (formData.get("status")           as string)?.trim();
  const resolution_notes = (formData.get("resolution_notes") as string)?.trim() || null;
  const internal_notes   = (formData.get("internal_notes")   as string)?.trim() || null;

  if (!reference || !status) return { error: "Missing required fields." };

  // Fetch existing record to get submitter email + name + current status
  const existing = await getAdminComplaint(reference);
  if (!existing) return { error: "Complaint not found." };

  const statusChanged = existing.status !== status;

  // Update DB
  await updateComplaintStatus(reference, status, resolution_notes, internal_notes);

  // Email submitter only when status actually changes
  // and only for meaningful milestones (not just internal note edits)
  const NOTIFY_STATUSES = ["acknowledged", "assigned", "in_progress", "resolved", "closed"];
  if (statusChanged && NOTIFY_STATUSES.includes(status)) {
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from:    process.env.SMTP_FROM || process.env.SMTP_USER,
        to:      existing.email,
        subject: `Complaint Update [${reference}] — ${STATUS_LABELS[status] ?? status}`,
        html:    statusUpdateEmailHtml(
          existing.full_name,
          reference,
          status,
          resolution_notes
        ),
      });
    } catch (err) {
      // Log but don't fail — DB was already updated
      console.error("[admin-complaints] email-failed", {
        reference,
        error: err instanceof Error ? err.message : "unknown",
        time:  new Date().toISOString(),
      });
    }
  }

  console.info("[admin-complaints] updated", {
    reference,
    status,
    status_changed: statusChanged,
    time: new Date().toISOString(),
  });

  return { success: true };
}
