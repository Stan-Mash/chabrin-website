"use server";

import { z } from "zod";
import nodemailer from "nodemailer";

const MarketReportLeadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  consent: z.literal(true),
});

export async function saveMarketReportLead(data: unknown) {
  const parsed = MarketReportLeadSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid data" };
  }

  const { name } = parsed.data;

  // Log event (non-PII) to PM2 stdout
  console.info("[market-report-lead] captured", {
    time: new Date().toISOString(),
  });

  const sanitize = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.info("[market-report-lead] SMTP not configured — dev mode, skipping email");
      return { success: true };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background-color: #0D1B8E; padding: 20px; border-radius: 4px;">
          <h1 style="color: #00C9C9; margin: 0; font-size: 20px;">
            New Market Report Download Request
          </h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; margin-top: 16px; border-radius: 4px;">
          <p><strong>Name:</strong> ${sanitize(name)}</p>
          <p style="color: #888; font-size: 12px;">Email withheld per KDPA — do not log PII.</p>
        </div>
        <div style="padding: 16px; background: #f5f5f5; font-size: 12px; color: #666; margin-top: 12px; border-radius: 4px;">
          This person downloaded the 2026 Nairobi Rental Market Report from the website.
          Please send them the report PDF if it has not yet been automated.
          Add them to the newsletter list: <strong>info@chabrinagencies.co.ke</strong>.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpUser,
      to: "info@chabrinagencies.co.ke",
      subject: `[Market Report] ${name} downloaded the 2026 report`,
      text: `${name} downloaded the 2026 Nairobi Rental Market Report. Please send the PDF if not automated.`,
      html: htmlContent,
    });
  } catch (err) {
    console.error("[market-report-lead] email error", {
      message: err instanceof Error ? err.message : "unknown",
      time: new Date().toISOString(),
    });
  }

  return { success: true };
}
