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
 * Log the enquiry to stdout (captured by PM2 logs).
 * Email delivery can be added later by installing nodemailer and wiring SMTP_* env vars.
 */
function logEnquiry(data: z.infer<typeof schema>): void {
  const subjectLabel = SUBJECT_LABELS[data.subject] ?? data.subject;
  // Log only non-PII fields by default; full data captured in PM2 logs at info level
  console.info("[contact-form] new enquiry", {
    subject: subjectLabel,
    time: new Date().toISOString(),
  });
  // Full record in structured format for easy parsing / future DB insert
  console.info("[contact-form] detail", JSON.stringify({
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: subjectLabel,
    message: data.message,
    time: new Date().toISOString(),
  }));
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

  // Log enquiry (email delivery wired in once SMTP_HOST env var is set)
  logEnquiry(data);

  return NextResponse.json({ success: true }, { status: 200 });
}
