import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

/**
 * POST /api/contact
 *
 * Validates, verifies Turnstile, and sends the enquiry email in a single
 * atomic step. If email delivery fails the client receives a 503 — no
 * silent "success" without the email actually going out.
 *
 * ⚠️  SECURITY RULES:
 *  1. NEVER log PII (name, email, phone) to console. Log only subject + time.
 *  2. Turnstile secret from env vars only.
 *  3. SMTP credentials from env vars only.
 */

const schema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email().max(200),
  phone:   z.string().min(9).max(20),
  subject: z.enum(["general", "management", "tenant", "valuation", "other"]),
  message: z.string().min(20).max(3000),
  consent: z.literal(true),
  token:   z.string().optional(),
});

const SUBJECT_LABELS: Record<string, string> = {
  general:    "General Enquiry",
  management: "Property Management",
  tenant:     "Tenant Enquiry",
  valuation:  "Valuation Request",
  other:      "Other",
};

// ── Turnstile ─────────────────────────────────────────────────────────────────

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY ?? "";

  // In production, a missing or dummy secret key is a hard failure — don't
  // silently skip verification and let bots through.
  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.startsWith("1x000000000000000000000")) {
      console.error("[contact] TURNSTILE_SECRET_KEY not configured for production");
      return false;
    }
  } else {
    // Development / test mode: skip if using the dummy key
    if (!secret || secret.startsWith("1x000000000000000000000")) return true;
  }

  if (!token) return false;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    },
  );

  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

// ── Email ─────────────────────────────────────────────────────────────────────

function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEnquiryEmail(data: z.infer<typeof schema>): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("SMTP environment variables not configured");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const subjectLabel = SUBJECT_LABELS[data.subject] ?? data.subject;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px">
      <div style="background:#0D1B8E;padding:20px 24px;border-radius:6px 6px 0 0">
        <h1 style="color:#00C9C9;margin:0;font-size:20px;font-weight:700">New Contact Enquiry</h1>
        <p style="color:#fff;margin:4px 0 0;font-size:13px;opacity:0.75">Chabrin Agencies — Website Lead</p>
      </div>
      <div style="padding:24px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 6px 6px">
        <p style="margin:6px 0"><strong style="color:#0D1B8E">Name:</strong> ${sanitizeHtml(data.name)}</p>
        <p style="margin:6px 0"><strong style="color:#0D1B8E">Email:</strong> ${sanitizeHtml(data.email)}</p>
        <p style="margin:6px 0"><strong style="color:#0D1B8E">Phone:</strong> ${sanitizeHtml(data.phone)}</p>
        <p style="margin:6px 0"><strong style="color:#0D1B8E">Subject:</strong> ${sanitizeHtml(subjectLabel)}</p>
        <div style="margin-top:16px;padding:12px;background:#f9f9f9;border-left:4px solid #00C9C9;border-radius:2px">
          <p style="margin:0;white-space:pre-wrap">${sanitizeHtml(data.message)}</p>
        </div>
        <p style="color:#999;font-size:11px;margin-top:24px;border-top:1px solid #eee;padding-top:12px">
          Automated notification from chabrinagencies.com — reply directly to the enquirer.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM || smtpUser,
    to:      "info@chabrinagencies.co.ke",
    replyTo: data.email,
    subject: `[${subjectLabel}] New enquiry — Chabrin Website`,
    html,
    text: `New Contact Enquiry\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nSubject: ${subjectLabel}\n\n${data.message}`,
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = result.data;

  const turnstileOk = await verifyTurnstile(data.token);
  if (!turnstileOk) {
    return NextResponse.json(
      { error: "Bot verification failed. Please refresh and try again." },
      { status: 403 },
    );
  }

  try {
    await sendEnquiryEmail(data);
    // Log only non-PII metadata — subject and timestamp only
    console.info("[contact] enquiry email sent", {
      subject: SUBJECT_LABELS[data.subject] ?? data.subject,
      time: new Date().toISOString(),
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[contact] email delivery error", {
      message: error instanceof Error ? error.message : "unknown",
      time: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "We couldn't send your message. Please try again or contact us directly." },
      { status: 503 },
    );
  }
}
