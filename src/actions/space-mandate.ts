"use server";

import { z } from "zod";
import nodemailer from "nodemailer";

const schema = z.object({
  clientCategory:    z.enum(["residential", "corporate", "industrial"]),
  corridor:          z.string().min(1),
  neighbourhoods:    z.string().max(200).optional(),
  propertySpec:      z.string().min(1),
  budget:            z.string().min(1),
  timeline:          z.enum(["immediate", "1_3_months", "3_6_months"]),
  fullName:          z.string().min(2).max(120),
  phone:             z.string().min(9).max(20),
  email:             z.string().email(),
  consentGiven:      z.literal(true, { error: () => "Consent required" }),
  turnstileToken:    z.string().min(1),
});

export type SpaceMandateInput = z.infer<typeof schema>;

export async function submitSpaceMandate(
  _prev: { success: boolean; error?: string },
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  // ── Turnstile verification ────────────────────────────────────────────────
  const turnstileToken = formData.get("turnstileToken") as string;
  if (!turnstileToken) return { success: false, error: "Bot protection required." };

  const tsRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret:   process.env.TURNSTILE_SECRET_KEY ?? "",
      response: turnstileToken,
    }),
  });
  const tsData = await tsRes.json() as { success: boolean };
  if (!tsData.success) return { success: false, error: "Bot protection failed. Please try again." };

  // ── Validate fields ───────────────────────────────────────────────────────
  const parsed = schema.safeParse({
    clientCategory:  formData.get("clientCategory"),
    corridor:        formData.get("corridor"),
    neighbourhoods:  formData.get("neighbourhoods"),
    propertySpec:    formData.get("propertySpec"),
    budget:          formData.get("budget"),
    timeline:        formData.get("timeline"),
    fullName:        formData.get("fullName"),
    phone:           formData.get("phone"),
    email:           formData.get("email"),
    consentGiven:    formData.get("consentGiven") === "true" ? true : undefined,
    turnstileToken,
  });
  if (!parsed.success) {
    return { success: false, error: "Please fill all required fields correctly." };
  }

  const d = parsed.data;

  // ── Send email notification ───────────────────────────────────────────────
  // No PII is logged — data goes straight to email and is discarded from memory
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const categoryLabel: Record<string, string> = {
      residential: "Residential Tenant",
      corporate:   "Corporate / Commercial Lessee",
      industrial:  "Industrial & Logistics Operator",
    };
    const timelineLabel: Record<string, string> = {
      immediate:   "Immediate (within 30 days)",
      "1_3_months": "1–3 months",
      "3_6_months": "3–6 months",
    };

    await transporter.sendMail({
      from:    `"Chabrin Website" <${process.env.SMTP_USER}>`,
      to:      "letting@chabrinagencies.co.ke",
      subject: `[Space Mandate] ${categoryLabel[d.clientCategory]} — ${d.corridor}`,
      text: [
        `Client Category: ${categoryLabel[d.clientCategory]}`,
        `Preferred Corridor: ${d.corridor}`,
        `Neighbourhoods: ${d.neighbourhoods ?? "Not specified"}`,
        `Property Specification: ${d.propertySpec}`,
        `Monthly Budget (KES): ${d.budget}`,
        `Move-In Timeline: ${timelineLabel[d.timeline]}`,
        ``,
        `Full Name: ${d.fullName}`,
        `Phone / WhatsApp: ${d.phone}`,
        `Email: ${d.email}`,
        ``,
        `KDPA consent: given`,
        `Submitted: ${new Date().toISOString()}`,
      ].join("\n"),
    });
  } catch {
    // Log system error only (no PII)
    console.error("[space-mandate] SMTP send failed");
    return { success: false, error: "Submission failed. Please call us directly." };
  }

  return { success: true };
}
