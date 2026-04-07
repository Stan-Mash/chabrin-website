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

    // ── DigitalOcean Spaces (S3-compatible object storage) ─────────────────
    SPACES_KEY: z.string().min(1).describe("DO Spaces access key ID"),
    SPACES_SECRET: z.string().min(1).describe("DO Spaces secret access key"),
    SPACES_BUCKET: z.string().min(1).describe("DO Spaces bucket name"),
    SPACES_ENDPOINT: z
      .string()
      .url()
      .describe("DO Spaces endpoint URL e.g. https://nyc3.digitaloceanspaces.com"),
    SPACES_CDN_URL: z
      .string()
      .url()
      .describe("DO Spaces CDN URL e.g. https://chabrin.nyc3.cdn.digitaloceanspaces.com"),

    // ── Sanity CMS ────────────────────────────────────────────────────────
    SANITY_API_TOKEN: z
      .string()
      .min(1)
      .describe("Sanity read token for server-side CMS queries"),

    // ── Cloudflare Turnstile (server-side secret) ─────────────────────────
    TURNSTILE_SECRET_KEY: z
      .string()
      .min(1)
      .describe("Cloudflare Turnstile secret key — used in Server Actions only"),
  },

  /**
   * Client-side environment variables.
   * These ARE exposed to the browser — NEVER put secrets here.
   */
  client: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: z
      .string()
      .min(1)
      .describe("Sanity project ID"),
    NEXT_PUBLIC_SANITY_DATASET: z
      .enum(["production", "staging"])
      .default("production")
      .describe("Sanity dataset name"),
    NEXT_PUBLIC_MAPBOX_TOKEN: z
      .string()
      .min(1)
      .describe("Mapbox GL JS public token"),
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
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
});
