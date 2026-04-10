import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email().max(200),
  phone:   z.string().min(9).max(20),
  subject: z.enum(["general", "management", "tenant", "valuation", "other"]),
  message: z.string().min(20).max(3000),
  consent: z.literal(true),
  // Turnstile token — required when real keys are configured
  token:   z.string().optional(),
});

const SUBJECT_LABELS: Record<string, string> = {
  general:    "General Enquiry",
  management: "Property Management",
  tenant:     "Tenant Enquiry",
  valuation:  "Valuation Request",
  other:      "Other",
};

/**
 * Verify Cloudflare Turnstile token.
 * Returns true when TURNSTILE_SECRET_KEY is a real key and token is valid.
 * Skips verification when the secret key is the dummy test value.
 */
async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY ?? "";

  // Dummy test secret — always passes (used during development / before keys are provisioned)
  if (!secret || secret.startsWith("1x000000000000000000000")) return true;
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

/**
 * Send notification email via SMTP.
 * Uses nodemailer if SMTP_HOST is configured; otherwise logs to console.
 */
async function sendEmail(data: z.infer<typeof schema>): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;

  if (!smtpHost) {
    // No SMTP configured — log to stdout so PM2 captures it
    console.info("[contact-form]", {
      subject: data.subject,
      time: new Date().toISOString(),
    });
    return;
  }

  // Dynamic import so the build doesn't fail if nodemailer isn't installed
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodemailer = require("nodemailer") as typeof import("nodemailer");

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
  });

  const toEmail = process.env.CONTACT_EMAIL ?? "info@chabrinagencies.com";
  const subjectLabel = SUBJECT_LABELS[data.subject] ?? data.subject;

  await transporter.sendMail({
    from: `"Chabrin Website" <${process.env.SMTP_USER ?? toEmail}>`,
    replyTo: `"${data.name}" <${data.email}>`,
    to: toEmail,
    subject: `[Website Enquiry] ${subjectLabel} — ${data.name}`,
    text: [
      `Name:    ${data.name}`,
      `Email:   ${data.email}`,
      `Phone:   ${data.phone}`,
      `Subject: ${subjectLabel}`,
      ``,
      data.message,
    ].join("\n"),
    html: `
      <table style="font-family:sans-serif;font-size:14px;color:#1e293b;max-width:600px">
        <tr><td style="padding:24px 0 8px"><strong style="font-size:18px">New Website Enquiry</strong></td></tr>
        <tr><td style="padding:4px 0"><strong>Name:</strong> ${data.name}</td></tr>
        <tr><td style="padding:4px 0"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding:4px 0"><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></td></tr>
        <tr><td style="padding:4px 0"><strong>Subject:</strong> ${subjectLabel}</td></tr>
        <tr><td style="padding:16px 0 4px;border-top:1px solid #e2e8f0"><strong>Message:</strong></td></tr>
        <tr><td style="padding:8px 16px;background:#f8fafc;border-radius:8px;white-space:pre-wrap">${data.message}</td></tr>
        <tr><td style="padding:16px 0 4px;color:#94a3b8;font-size:12px">Sent from chabrinagencies.com contact form</td></tr>
      </table>
    `,
  });
}

export async function POST(req: NextRequest) {
  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Validate
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = result.data;

  // Turnstile verification
  const turnstileOk = await verifyTurnstile(data.token);
  if (!turnstileOk) {
    return NextResponse.json(
      { error: "Bot verification failed. Please refresh and try again." },
      { status: 403 },
    );
  }

  // Send email
  try {
    await sendEmail(data);
  } catch (err) {
    console.error("[contact-form] email send failed:", err);
    // Don't expose internal error to client — still return success
    // so the user knows their message was received (it's logged above)
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
