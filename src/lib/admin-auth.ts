/**
 * admin-auth.ts — Session token helpers for the staff admin panel.
 *
 * Strategy:
 *   - ADMIN_PASSWORD and ADMIN_SESSION_SECRET live in .env.production only.
 *   - On login, we compute HMAC-SHA256(ADMIN_PASSWORD, ADMIN_SESSION_SECRET)
 *     and store it as an httpOnly, Secure, SameSite=Strict cookie.
 *   - Every admin layout server component calls isAdminAuthenticated() — if the
 *     cookie is absent or wrong, it redirects to /admin-login.
 *   - No third-party service. Zero CHIPS contact.
 *
 * Brute-force protection:
 *   - Max 5 failed attempts per IP within a 15-minute window.
 *   - State stored in PostgreSQL (admin_login_attempts table) so protection
 *     survives PM2 restarts and is shared across all cluster instances.
 *   - On lockout, all attempts return a generic error with no timing difference.
 *   - Lockout resets automatically after 15 minutes.
 *
 * Rotation: change ADMIN_SESSION_SECRET in .env.production + restart PM2
 *           to instantly invalidate all existing sessions.
 *
 * Migration: run src/db/migrations/002_login_attempts.sql before deploying.
 */

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

export const ADMIN_COOKIE = "chabrin_admin_v1";

const MAX_ATTEMPTS = 5;
const WINDOW_SECS  = 15 * 60; // 15 minutes, used in SQL interval

// ── Brute-force lockout (PostgreSQL-backed) ────────────────────────────────

/** Returns true if the IP is currently locked out. */
export async function isLockedOut(ip: string): Promise<boolean> {
  try {
    const rows = await sql<{ locked_at: Date | null; first_fail_at: Date }[]>`
      SELECT locked_at, first_fail_at
      FROM admin_login_attempts
      WHERE ip = ${ip}
    `;
    if (!rows.length) return false;

    const { locked_at, first_fail_at } = rows[0];
    const windowExpiredMs = Date.now() - new Date(first_fail_at).getTime();
    if (windowExpiredMs > WINDOW_SECS * 1000) {
      await sql`DELETE FROM admin_login_attempts WHERE ip = ${ip}`;
      return false;
    }
    return locked_at !== null;
  } catch {
    // If DB is unavailable, fail open rather than locking everyone out
    return false;
  }
}

/** Record a failed login attempt. Returns true if the IP is now locked out. */
export async function recordFailedAttempt(ip: string): Promise<boolean> {
  try {
    const rows = await sql<{ count: number; locked_at: Date | null }[]>`
      INSERT INTO admin_login_attempts (ip, count, first_fail_at, locked_at)
      VALUES (${ip}, 1, NOW(), NULL)
      ON CONFLICT (ip) DO UPDATE
        SET
          count         = CASE
                            WHEN NOW() - admin_login_attempts.first_fail_at
                                 > (${WINDOW_SECS} || ' seconds')::INTERVAL
                            THEN 1
                            ELSE admin_login_attempts.count + 1
                          END,
          first_fail_at = CASE
                            WHEN NOW() - admin_login_attempts.first_fail_at
                                 > (${WINDOW_SECS} || ' seconds')::INTERVAL
                            THEN NOW()
                            ELSE admin_login_attempts.first_fail_at
                          END,
          locked_at     = CASE
                            WHEN NOW() - admin_login_attempts.first_fail_at
                                 > (${WINDOW_SECS} || ' seconds')::INTERVAL
                            THEN NULL
                            WHEN admin_login_attempts.count + 1 >= ${MAX_ATTEMPTS}
                            THEN NOW()
                            ELSE NULL
                          END
      RETURNING count, locked_at
    `;
    if (!rows.length) return false;
    return rows[0].locked_at !== null;
  } catch {
    return false;
  }
}

/** Clear the failed attempt record on successful login. */
export async function clearFailedAttempts(ip: string): Promise<void> {
  try {
    await sql`DELETE FROM admin_login_attempts WHERE ip = ${ip}`;
  } catch {
    // Non-fatal
  }
}

/** Returns remaining attempts before lockout (for error messages). */
export async function remainingAttempts(ip: string): Promise<number> {
  try {
    const rows = await sql<{ count: number; first_fail_at: Date }[]>`
      SELECT count, first_fail_at
      FROM admin_login_attempts
      WHERE ip = ${ip}
    `;
    if (!rows.length) return MAX_ATTEMPTS;
    const windowExpired =
      Date.now() - new Date(rows[0].first_fail_at).getTime() > WINDOW_SECS * 1000;
    if (windowExpired) return MAX_ATTEMPTS;
    return Math.max(0, MAX_ATTEMPTS - rows[0].count);
  } catch {
    return MAX_ATTEMPTS;
  }
}

// ── Token helpers ─────────────────────────────────────────────────────────────

/** Compute the expected session token from env vars. */
export function computeToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  const secret   = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) {
    throw new Error("ADMIN_PASSWORD or ADMIN_SESSION_SECRET not set");
  }
  return createHmac("sha256", secret).update(password).digest("hex");
}

/** Returns true if the current request carries a valid admin session cookie. */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const jar   = await cookies();
    const token = jar.get(ADMIN_COOKIE)?.value;
    if (!token) return false;
    // Use timing-safe comparison to prevent timing attacks
    const expected = computeToken();
    const a = Buffer.from(token.padEnd(64, "0").slice(0, 64));
    const b = Buffer.from(expected.padEnd(64, "0").slice(0, 64));
    return token.length === expected.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
