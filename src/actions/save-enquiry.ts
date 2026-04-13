"use server";

import nodemailer from "nodemailer";

/**
 * Server Actions for chatbot leads, newsletter signups, and property requests.
 *
 * ⚠️  SECURITY RULES:
 *  1. Server Actions — run on server only, never client-side.
 *  2. NEVER log PII (email, phone, name) to console.
 *  3. SMTP credentials from env vars only.
 *  4. Zero DB writes (read-only website per zero-trust mandate);
 *     leads are captured via email notification to info@chabrinagencies.co.ke.
 */

function getTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("SMTP environment variables not configured");
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailWrapper(title: string, rows: string): string {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px">
      <div style="background:#0D1B8E;padding:20px 24px;border-radius:6px 6px 0 0">
        <h1 style="color:#00C9C9;margin:0;font-size:20px;font-weight:700">${title}</h1>
        <p style="color:#fff;margin:4px 0 0;font-size:13px;opacity:0.75">Chabrin Agencies — Automated Lead Notification</p>
      </div>
      <div style="padding:24px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 6px 6px">
        ${rows}
        <p style="color:#999;font-size:11px;margin-top:24px;border-top:1px solid #eee;padding-top:12px">
          Automated notification from chabrinagencies.com — do not reply to this email.
        </p>
      </div>
    </div>
  `;
}

function row(label: string, value: string) {
  return `<p style="margin:6px 0"><strong style="color:#0D1B8E">${label}:</strong> ${sanitizeHtml(value)}</p>`;
}

// ── Chatbot Lead ──────────────────────────────────────────────────────────────

export async function saveChatbotLead(data: {
  name: string;
  phone: string;
  lastQuery?: string;
  locale: string;
}): Promise<{ success: boolean }> {
  try {
    const html = emailWrapper(
      "Chatbot Lead Capture",
      [
        row("Name", data.name),
        row("Phone", data.phone),
        data.lastQuery ? row("Unanswered Query", data.lastQuery) : "",
        row("Language", data.locale === "sw" ? "Swahili" : "English"),
        row("Source", "Website Chatbot"),
        row("Time", new Date().toISOString()),
      ].join("")
    );

    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "info@chabrinagencies.co.ke",
      subject: "[Chatbot Lead] Unanswered query — follow up required",
      html,
      text: `Chatbot Lead\nName: ${data.name}\nPhone: ${data.phone}${data.lastQuery ? `\nQuery: ${data.lastQuery}` : ""}`,
    });

    console.info("[chatbot-lead] notification sent", { time: new Date().toISOString() });
    return { success: true };
  } catch (error) {
    console.error("[chatbot-lead] error", {
      message: error instanceof Error ? error.message : "Unknown",
      time: new Date().toISOString(),
    });
    return { success: false };
  }
}

// ── Newsletter / Market Report ────────────────────────────────────────────────

export async function saveNewsletterSignup(data: {
  name: string;
  email: string;
  locale: string;
}): Promise<{ success: boolean }> {
  try {
    const html = emailWrapper(
      "Market Report Download — Newsletter Lead",
      [
        row("Name", data.name),
        row("Email", data.email),
        row("Language", data.locale === "sw" ? "Swahili" : "English"),
        row("Source", "2026 Nairobi Rental Market Report — Lead Magnet"),
        row("Time", new Date().toISOString()),
      ].join("")
    );

    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "info@chabrinagencies.co.ke",
      replyTo: data.email,
      subject: "[Market Report] New report download & newsletter signup",
      html,
      text: `Market Report Download\nName: ${data.name}\nEmail: ${data.email}`,
    });

    console.info("[newsletter-signup] notification sent", { time: new Date().toISOString() });
    return { success: true };
  } catch (error) {
    console.error("[newsletter-signup] error", {
      message: error instanceof Error ? error.message : "Unknown",
      time: new Date().toISOString(),
    });
    return { success: false };
  }
}

// ── Concierge Property Request ────────────────────────────────────────────────

export async function savePropertyRequest(data: {
  name: string;
  phone: string;
  zone?: string;
  propertyType?: string;
  budget?: string;
  notes?: string;
  locale: string;
}): Promise<{ success: boolean }> {
  try {
    const html = emailWrapper(
      "Concierge Property Request",
      [
        row("Name", data.name),
        row("Phone", data.phone),
        data.zone ? row("Preferred Zone", data.zone) : "",
        data.propertyType ? row("Property Type", data.propertyType) : "",
        data.budget ? row("Budget (KES/month)", data.budget) : "",
        data.notes ? row("Additional Notes", data.notes) : "",
        row("Language", data.locale === "sw" ? "Swahili" : "English"),
        row("Source", "Properties Page — Concierge Search"),
        row("Time", new Date().toISOString()),
      ].join("")
    );

    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "info@chabrinagencies.co.ke",
      subject: "[Property Request] Concierge search — follow up required",
      html,
      text: `Property Request\nName: ${data.name}\nPhone: ${data.phone}${data.zone ? `\nZone: ${data.zone}` : ""}`,
    });

    console.info("[property-request] notification sent", { time: new Date().toISOString() });
    return { success: true };
  } catch (error) {
    console.error("[property-request] error", {
      message: error instanceof Error ? error.message : "Unknown",
      time: new Date().toISOString(),
    });
    return { success: false };
  }
}
