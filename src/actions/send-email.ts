"use server";

import nodemailer from "nodemailer";
import { env } from "@/env";

/**
 * Email delivery service using nodemailer.
 * Sends formatted enquiries to info@chabrinagencies.com
 *
 * ⚠️  SECURITY RULES:
 *  1. This is a Server Action — runs on server only, never client-side.
 *  2. NEVER log PII (email, phone, name) to console in production.
 *  3. SMTP credentials come from env vars only, never hardcoded.
 */

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: "general" | "management" | "tenant" | "valuation" | "other";
  message: string;
}

const SUBJECT_LABELS: Record<string, string> = {
  general: "General Enquiry",
  management: "Property Management",
  tenant: "Tenant Enquiry",
  valuation: "Valuation Request",
  other: "Other",
};

/**
 * Initialize nodemailer transporter with SMTP configuration.
 * Lazy-loads to avoid connection pooling issues in development.
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
    secure: smtpPort === 465, // TLS for 587, SSL for 465
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

/**
 * Send a formatted contact form enquiry to info@chabrinagencies.com
 * @param data - Contact form data (validated on client + server)
 * @returns - Success or error response
 */
export async function sendContactEmail(data: ContactFormData) {
  try {
    const transporter = getTransporter();
    const subjectLabel = SUBJECT_LABELS[data.subject] ?? data.subject;

    // HTML email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background-color: #0D1B8E; padding: 20px; text-align: center; border-radius: 4px;">
          <h1 style="color: #00C9C9; margin: 0; font-size: 24px;">New Enquiry from Chabrin Website</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #e0e0e0; margin-top: 20px; border-radius: 4px;">
          <h2 style="color: #0D1B8E; font-size: 18px; margin-top: 0;">Contact Details</h2>
          <p><strong>Name:</strong> ${sanitizeHtml(data.name)}</p>
          <p><strong>Email:</strong> ${sanitizeHtml(data.email)}</p>
          <p><strong>Phone:</strong> ${sanitizeHtml(data.phone)}</p>
          <p><strong>Subject:</strong> ${sanitizeHtml(subjectLabel)}</p>
          
          <h2 style="color: #0D1B8E; font-size: 18px; margin-top: 24px;">Message</h2>
          <div style="background-color: #f9f9f9; padding: 12px; border-left: 4px solid #00C9C9; border-radius: 2px;">
            <p>${sanitizeHtml(data.message).replace(/\n/g, "<br>")}</p>
          </div>
        </div>
        
        <div style="padding: 20px; background-color: #f5f5f5; margin-top: 20px; border-radius: 4px; font-size: 12px; color: #666;">
          <p>This is an automated message from the Chabrin Agencies website. Please do not reply to this email.</p>
          <p>Reply directly to the enquirer using the contact details above.</p>
        </div>
      </div>
    `;

    // Plain text email template
    const textContent = `
New Enquiry from Chabrin Website
================================

CONTACT DETAILS
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${subjectLabel}

MESSAGE
${data.message}

---
This is an automated message from the Chabrin Agencies website.
Please do not reply to this email. Reply directly to the enquirer using the contact details above.
    `.trim();

    await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpUser,
      to: "info@chabrinagencies.com",
      replyTo: data.email,
      subject: `[${subjectLabel}] New Enquiry from ${data.name}`,
      text: textContent,
      html: htmlContent,
    });

    // Log event (non-PII) to stdout for PM2 logs
    console.info("[contact-form-email] sent", {
      to: "info@chabrinagencies.com",
      subject: subjectLabel,
      time: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("[contact-form-email] error", {
      message: error instanceof Error ? error.message : "Unknown error",
      time: new Date().toISOString(),
    });
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Basic HTML sanitization to prevent injection.
 * In production, consider using a library like DOMPurify (npm install isomorphic-dompurify).
 */
function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
