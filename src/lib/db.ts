import postgres from "postgres";
import { env } from "@/env";

/**
 * PostgreSQL client — Neon serverless database via the `postgres` package.
 *
 * ⚠️  ARCHITECTURE RULES — READ BEFORE USING:
 *  1. This connects to the website's Neon database ONLY.
 *     It has ZERO connection to CHIPS (internal ERP).
 *  2. Import this file ONLY in Server Components, Server Actions,
 *     Route Handlers, and API routes. NEVER in client components.
 *  3. This DB is READ-ONLY from the website's perspective.
 *     All writes come from the CHIPS sync job (outbound push).
 *  4. Never log query results that contain PII.
 *
 * Neon connection notes:
 *  - Use the POOLED connection string from the Neon dashboard for production
 *    (host ends in -pooler.<region>.aws.neon.tech).
 *  - prepare: false is required when using Neon's PgBouncer pooler
 *    (transaction mode does not support prepared statements).
 *  - ssl is always required by Neon.
 *  - max: 3 is appropriate for Vercel serverless — each cold start gets its
 *    own process; Neon's pooler handles fan-out on the server side.
 *
 * @example
 * import { sql } from "@/lib/db";
 * const listings = await sql`SELECT * FROM public_listings WHERE published = true`;
 */

declare global {
  // eslint-disable-next-line no-var
  var __db: postgres.Sql | undefined;
}

function createDb(): postgres.Sql {
  return postgres(env.DATABASE_URL, {
    max: 3,             // Vercel functions are short-lived; keep pool small
    connect_timeout: 10,
    idle_timeout: 20,
    ssl: "require",     // Neon always requires SSL
    prepare: false,     // Required for Neon's PgBouncer pooler (transaction mode)
    onnotice: () => {}, // Suppress notices — never log DB output to console
    transform: {
      undefined: null,  // Convert undefined → NULL
    },
    // Explicit JSONB/JSON parsers — required because prepare:false (simple-query
    // protocol) can skip automatic OID-based decoding in some postgres driver versions,
    // causing JSONB columns to be returned as raw strings instead of objects.
    types: {
      jsonb: {
        from: [3802],
        parse: (v: string) => JSON.parse(v),
      },
      json: {
        from: [114],
        parse: (v: string) => JSON.parse(v),
      },
    },
  });
}

// Dev singleton prevents pool exhaustion on Next.js hot-reload.
// In production (Vercel), each function invocation may create its own instance
// but Neon's pooler handles the actual connection fan-out.
export const sql: postgres.Sql =
  process.env.NODE_ENV === "production"
    ? createDb()
    : (global.__db ??= createDb());
