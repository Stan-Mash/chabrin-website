"use server";

/**
 * submit-complaint.ts — Server Action for the public complaints form.
 *
 * Flow:
 *  1. Validate input with Zod
 *  2. Verify Cloudflare Turnstile token
 *  3. Auto-assign priority based on category
 *  4. Generate unique reference (CMP-YYYY-XXXXX)
 *  5. Insert into chabrin_public.complaints
 *  6. Email staff at info@chabrinagencies.co.ke
 *  7. Email confirmation + reference to submitter
 *  8. Return { success, reference }
 *
 * SECURITY:
 *  - Never log PII (name, email, phone) to console
 *  - HTML sanitisation on all user strings before email rendering
 *  - Turnstile required in production
 */

import { z } from "zod";
import nodemailer from "nodemailer";
import { insertComplaint } from "@/db/queries/complaints";

// ── Validation schema ─────────────────────────────────────────────────────────

const schema = z.object({
  submitter_type: z.enum(["tenant", "landlord", "prospective", "public"]),
  full_name:      z.string().min(2).max(120).trim(),
  email:          z.string().email().max(255).trim(),
  phone:          z.string().min(9).max(25).trim(),
  property_area:  z.string().max(120).trim().optional(),
  category:       z.enum(["maintenance", "billing", "noise_neighbour", "safety", "management", "general"]),
  subcategory:    z.string().max(80).trim().optional(),
  description:    z.string().min(20).max(3000).trim(),
  consent:        z.literal(true),
  token:          z.string().optional(),
});

export type ComplaintInput = z.infer<typeof schema>;

// ── Priority auto-assignment ──────────────────────────────────────────────────

const PRIORITY_MAP: Record<string, "emergency" | "urgent" | "routine" | "enquiry"> = {
  safety:          "emergency",
  maintenance:     "urgent",
  billing:         "enquiry",
  noise_neighbour: "routine",
  management:      "routine",
  general:         "routine",
};

// ── Category display labels ───────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  maintenance:     "Maintenance & Repairs",
  billing:         "Billing Dispute",
  noise_neighbour: "Noise / Neighbour Issue",
  safety:          "Safety & Security",
  management:      "Management Quality",
  general:         "General Feedback",
};

const SUBMITTER_LABELS: Record<string, string> = {
  tenant:      "Tenant",
  landlord:    "Property Owner",
  prospective: "Prospective Tenant",
  public:      "General Public",
};

// ── Reference number generator ────────────────────────────────────────────────

function generateReference(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion
  let suffix = "";
  for (let i = 0; i < 5; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `CMP-${year}-${suffix}`;
}

// ── Turnstile verification ────────────────────────────────────────────────────

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

// ── SMTP transporter ─────────────────────────────────────────────────────────

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) throw new Error("SMTP not configured");
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// ── HTML sanitiser ────────────────────────────────────────────────────────────

function h(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── SLA labels ────────────────────────────────────────────────────────────────

const SLA_LABELS: Record<string, { response: string; resolution: string; colour: string }> = {
  emergency: { response: "Within 1 hour",       resolution: "Within 24 hours", colour: "#dc2626" },
  urgent:    { response: "Within 8 hours",       resolution: "Within 7 days",   colour: "#ea580c" },
  routine:   { response: "Within 72 hours",      resolution: "Within 14 days",  colour: "#2563eb" },
  enquiry:   { response: "Within 1 business day", resolution: "Within 5 business days", colour: "#7c3aed" },
};

// ── Email: staff notification ────────────────────────────────────────────────

function staffEmailHtml(data: ComplaintInput, reference: string, priority: string): string {
  const sla = SLA_LABELS[priority];
  const categoryLabel = CATEGORY_LABELS[data.category] ?? data.category;
  const submitterLabel = SUBMITTER_LABELS[data.submitter_type] ?? data.submitter_type;
  const priorityColour = sla.colour;

  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#0D1B8E;padding:24px 20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#00C9C9;margin:0;font-size:22px;">New Complaint — Chabrin Agencies</h1>
    <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Submitted via chabrinagencies.com</p>
  </div>

  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px;">

    <!-- Reference + Priority -->
    <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
      <div style="background:#f0f4ff;border:1px solid #c7d2fe;border-radius:8px;padding:12px 16px;flex:1;min-width:160px;">
        <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#6366f1;font-weight:700;">Reference</p>
        <p style="margin:0;font-size:20px;font-weight:900;color:#0D1B8E;letter-spacing:.05em;">${h(reference)}</p>
      </div>
      <div style="background:#fff8f0;border:1px solid #fed7aa;border-radius:8px;padding:12px 16px;flex:1;min-width:160px;">
        <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:${priorityColour};font-weight:700;">Priority</p>
        <p style="margin:0;font-size:18px;font-weight:800;color:${priorityColour};text-transform:capitalize;">${h(priority)}</p>
        <p style="margin:2px 0 0;font-size:11px;color:#666;">Respond: ${sla.response}</p>
      </div>
    </div>

    <!-- Submitter details -->
    <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:#0D1B8E;margin:0 0 12px;">Submitter</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;">
      <tr><td style="padding:6px 0;color:#666;width:140px;">Type</td><td style="padding:6px 0;font-weight:600;">${h(submitterLabel)}</td></tr>
      <tr style="border-top:1px solid #f1f5f9;"><td style="padding:6px 0;color:#666;">Name</td><td style="padding:6px 0;font-weight:600;">${h(data.full_name)}</td></tr>
      <tr style="border-top:1px solid #f1f5f9;"><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;font-weight:600;">${h(data.email)}</td></tr>
      <tr style="border-top:1px solid #f1f5f9;"><td style="padding:6px 0;color:#666;">Phone</td><td style="padding:6px 0;font-weight:600;">${h(data.phone)}</td></tr>
      ${data.property_area ? `<tr style="border-top:1px solid #f1f5f9;"><td style="padding:6px 0;color:#666;">Property Area</td><td style="padding:6px 0;font-weight:600;">${h(data.property_area)}</td></tr>` : ""}
    </table>

    <!-- Issue details -->
    <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:#0D1B8E;margin:0 0 12px;">Issue</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px;">
      <tr><td style="padding:6px 0;color:#666;width:140px;">Category</td><td style="padding:6px 0;font-weight:600;">${h(categoryLabel)}</td></tr>
      ${data.subcategory ? `<tr style="border-top:1px solid #f1f5f9;"><td style="padding:6px 0;color:#666;">Subcategory</td><td style="padding:6px 0;font-weight:600;">${h(data.subcategory)}</td></tr>` : ""}
    </table>

    <div style="background:#f8fafc;border-left:4px solid #00C9C9;padding:14px 16px;border-radius:0 6px 6px 0;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;line-height:1.6;white-space:pre-wrap;">${h(data.description).replace(/\n/g, "<br>")}</p>
    </div>

    <!-- SLA reminder -->
    <div style="background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:12px 16px;">
      <p style="margin:0;font-size:12px;color:#854d0e;">
        <strong>SLA:</strong> First response ${sla.response} &nbsp;·&nbsp; Resolution target ${sla.resolution}
      </p>
    </div>

    <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;text-align:center;">
      Log into CHIPS to acknowledge and assign this complaint — ref: ${h(reference)}
    </p>
  </div>
</div>`;
}

// ── Email: submitter confirmation ─────────────────────────────────────────────

function confirmationEmailHtml(name: string, reference: string, category: string, priority: string): string {
  const sla = SLA_LABELS[priority];
  const categoryLabel = CATEGORY_LABELS[category] ?? category;
  const statusUrl = `https://chabrinagencies.com/en/complaints#status`;

  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#0D1B8E;padding:24px 20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="color:#00C9C9;margin:0;font-size:22px;">Complaint Received</h1>
    <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Chabrin Agencies Limited</p>
  </div>

  <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:28px 24px;border-radius:0 0 8px 8px;">

    <p style="margin:0 0 20px;font-size:15px;">Dear <strong>${h(name)}</strong>,</p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569;">
      Thank you for reaching out. Your complaint has been received and logged in our system.
      Please keep your reference number safe — you will need it to track the status of your complaint.
    </p>

    <!-- Reference box -->
    <div style="background:#f0f4ff;border:2px solid #0D1B8E;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#6366f1;font-weight:700;">Your Reference Number</p>
      <p style="margin:0;font-size:28px;font-weight:900;color:#0D1B8E;letter-spacing:.1em;">${h(reference)}</p>
    </div>

    <!-- Details -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px;">
      <tr style="background:#f8fafc;"><td style="padding:8px 12px;color:#666;width:130px;border-radius:4px 0 0 0;">Category</td><td style="padding:8px 12px;font-weight:600;">${h(categoryLabel)}</td></tr>
      <tr><td style="padding:8px 12px;color:#666;border-top:1px solid #f1f5f9;">Status</td><td style="padding:8px 12px;font-weight:600;color:#2563eb;">Submitted — Pending Acknowledgement</td></tr>
    </table>

    <!-- SLA commitment -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#15803d;">Our Commitment to You</p>
      <p style="margin:0 0 4px;font-size:13px;color:#166534;">✓ First response: <strong>${sla.response}</strong></p>
      <p style="margin:0;font-size:13px;color:#166534;">✓ Resolution target: <strong>${sla.resolution}</strong></p>
    </div>

    <!-- Track status -->
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${statusUrl}"
         style="display:inline-block;background:#0D1B8E;color:#fff;text-decoration:none;
                padding:12px 28px;border-radius:50px;font-weight:700;font-size:13px;">
        Track Your Complaint
      </a>
    </div>

    <p style="margin:0 0 8px;font-size:13px;color:#475569;">
      You can also reach us directly:
    </p>
    <p style="margin:0;font-size:13px;color:#475569;">
      📞 +254 720 854 389 &nbsp;·&nbsp;
      📧 info@chabrinagencies.co.ke &nbsp;·&nbsp;
      💬 <a href="https://wa.me/254720854389" style="color:#0D1B8E;">WhatsApp</a>
    </p>

    <p style="margin:24px 0 0;font-size:11px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:16px;">
      This is an automated confirmation. Do not reply to this email — use your reference number when contacting us.
      Chabrin Agencies Limited · Nacico Plaza, 5th Floor, Landhies Road, Nairobi · EARB Registered
    </p>
  </div>
</div>`;
}

// ── Main server action ────────────────────────────────────────────────────────

export async function submitComplaint(
  formData: unknown
): Promise<{ success: true; reference: string } | { success: false; error: string }> {
  // 1. Validate
  const result = schema.safeParse(formData);
  if (!result.success) {
    return { success: false, error: "Validation failed. Please check all fields." };
  }
  const data = result.data;

  // 2. Turnstile
  const ok = await verifyTurnstile(data.token);
  if (!ok) {
    return { success: false, error: "Bot verification failed. Please refresh and try again." };
  }

  // 3. Priority
  const priority = PRIORITY_MAP[data.category] ?? "routine";

  // 4. Reference
  const reference = generateReference();

  // 5. DB insert
  try {
    await insertComplaint({
      reference,
      submitter_type: data.submitter_type,
      full_name:      data.full_name,
      email:          data.email,
      phone:          data.phone,
      property_area:  data.property_area,
      category:       data.category,
      subcategory:    data.subcategory,
      priority,
      description:    data.description,
      consent_given:  data.consent,
    });
  } catch (err) {
    // DB failure — still send email so nothing is lost
    console.error("[complaints] db-insert-failed", {
      reference,
      error: err instanceof Error ? err.message : "unknown",
      time:  new Date().toISOString(),
    });
    // Fall through — email is the safety net
  }

  // 6. Email staff + submitter
  try {
    const transporter = getTransporter();
    const categoryLabel = CATEGORY_LABELS[data.category] ?? data.category;

    await Promise.all([
      // Staff notification
      transporter.sendMail({
        from:    process.env.SMTP_FROM || process.env.SMTP_USER,
        to:      "info@chabrinagencies.co.ke",
        replyTo: data.email,
        subject: `[${priority.toUpperCase()}] New Complaint ${reference} — ${categoryLabel}`,
        html:    staffEmailHtml(data, reference, priority),
      }),
      // Submitter confirmation
      transporter.sendMail({
        from:    process.env.SMTP_FROM || process.env.SMTP_USER,
        to:      data.email,
        subject: `Complaint Received — Your Reference: ${reference}`,
        html:    confirmationEmailHtml(data.full_name, reference, data.category, priority),
      }),
    ]);
  } catch (err) {
    console.error("[complaints] email-failed", {
      reference,
      error: err instanceof Error ? err.message : "unknown",
      time:  new Date().toISOString(),
    });
    // Don't fail the user — reference was generated and DB insert attempted
  }

  console.info("[complaints] submitted", {
    reference,
    category: data.category,
    priority,
    submitter_type: data.submitter_type,
    time: new Date().toISOString(),
  });

  return { success: true, reference };
}
