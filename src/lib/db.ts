import postgres from "postgres";
import { env } from "@/env";

/**
 * PostgreSQL singleton — public listings read-only database.
 *
 * ⚠️  ARCHITECTURE RULES — READ BEFORE USING:
 *  1. This connects to the WEBSITE's local PostgreSQL only.
 *     It has ZERO connection to CHIPS (internal ERP).
 *  2. Import this file ONLY in Server Components, Server Actions,
 *     Route Handlers, and API routes. NEVER in client components.
 *  3. This DB is READ-ONLY from the website's perspective.
 *     All writes come from the CHIPS sync job (outbound push).
 *  4. Never log query results that contain PII.
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
    max: 10,          // Max pool size — tune based on droplet RAM
    idle_timeout: 20, // Close idle connections after 20s
    connect_timeout: 10,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    onnotice: () => {}, // Suppress notices — never log DB output to console
    transform: {
      undefined: null, // Convert undefined to NULL
    },
  });
}

// Singleton pattern — prevents connection pool exhaustion in dev (hot reload)
export const sql: postgres.Sql =
  process.env.NODE_ENV === "production"
    ? createDb()
    : (global.__db ??= createDb());
