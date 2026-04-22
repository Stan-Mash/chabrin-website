import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment variable schema — validated at build time.
 * If any required variable is missing, the build FAILS loudly.
 * Never add secrets here as default values.
 *
 * @see https://env.t3.gg/docs/nextjs
 */
export const env = createEnv({
  /**
   * Skip validation in development, or when SKIP_ENV_VALIDATION=1 is set.
   * The latter is used during initial server provisioning before all
   * third-party services (Sanity, Spaces, Mapbox) are configured.
   * Remove SKIP_ENV_VALIDATION from .env.production once all services are live.
   */
  skipValidation:
    process.env.NODE_ENV === "development" ||
    process.env.SKIP_ENV_VALIDATION === "1",

  /**
   * Server-side environment variables.
   * These are NEVER exposed to the browser.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // ── PostgreSQL (website read-only public DB) ───────────────────────────
    DATABASE_URL: z
      .string()
      .url()
      .describe("PostgreSQL connection string for the public listings DB"),

    // ── Vercel Blob (object storage for property images) ───────────────────
    // Optional until Blob store is connected — image upload feature not yet live
    BLOB_READ_WRITE_TOKEN: z
      .string()
      .min(1)
      .optional()
      .describe("Vercel Blob read/write token — auto-injected by Vercel when store is connected"),

    // ── Sanity CMS ────────────────────────────────────────────────────────
    // Optional until Sanity project is provisioned — blog/careers not yet live
    SANITY_API_TOKEN: z
      .string()
      .min(1)
      .optional()
      .describe("Sanity read token for server-side CMS queries"),

    // ── Cloudflare Turnstile (server-side secret) ─────────────────────────
    TURNSTILE_SECRET_KEY: z
      .string()
      .min(1)
      .describe("Cloudflare Turnstile secret key — used in Server Actions only"),

    // ── CV upload + AI parsing ────────────────────────────────────────────────
    CV_UPLOAD_SECRET: z
      .string()
      .min(32)
      .optional()
      .describe("HMAC secret for signed CV upload links (32+ char random string)"),
    GEMINI_API_KEY: z
      .string()
      .min(1)
      .optional()
      .describe("Google Gemini API key for AI CV parsing"),

    // ── Admin panel auth ─────────────────────────────────────────────────────
    ADMIN_PASSWORD: z
      .string()
      .min(12)
      .optional()
      .describe("Staff admin panel password"),
    ADMIN_SESSION_SECRET: z
      .string()
      .min(32)
      .optional()
      .describe("HMAC signing secret for admin session cookie (32+ char random string)"),

    // ── Email (SMTP) ──────────────────────────────────────────────────────
    SMTP_HOST: z
      .string()
      .min(1)
      .describe("SMTP server hostname (e.g., mail.example.com)"),
    SMTP_PORT: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .describe("SMTP server port (587 for TLS, 465 for SSL)"),
    SMTP_USER: z
      .string()
      .min(1)
      .describe("SMTP authentication username"),
    SMTP_PASS: z
      .string()
      .min(1)
      .describe("SMTP authentication password"),
    SMTP_FROM: z
      .string()
      .email()
      .optional()
      .describe("From email address (defaults to SMTP_USER if not set)"),
  },

  /**
   * Client-side environment variables.
   * These ARE exposed to the browser — NEVER put secrets here.
   */
  client: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: z
      .string()
      .min(1)
      .optional()
      .describe("Sanity project ID"),
    NEXT_PUBLIC_SANITY_DATASET: z
      .enum(["production", "staging"])
      .default("production")
      .describe("Sanity dataset name"),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z
      .string()
      .min(1)
      .describe("Cloudflare Turnstile site key — safe to expose publicly"),
    NEXT_PUBLIC_SITE_URL: z
      .string()
      .url()
      .describe("Production URL e.g. https://chabrinagencies.com"),
  },

  /**
   * For Next.js >= 13.4.4, you only need to destructure client variables.
   */
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
});
