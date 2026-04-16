/**
 * admin-auth.ts — Session token helpers for the staff admin panel.
 *
 * Strategy:
 *   - ADMIN_PASSWORD and ADMIN_SESSION_SECRET live in .env.production only.
 *   - On login, we compute HMAC-SHA256(ADMIN_PASSWORD, ADMIN_SESSION_SECRET)
 *     and store it as an httpOnly, Secure, SameSite=Strict cookie.
 *   - Every admin layout server component calls isAdminAuthenticated() — if the
 *     cookie is absent or wrong, it redirects to /admin-login.
 *   - No database reads. No third-party service. Zero CHIPS contact.
 *
 * Brute-force protection:
 *   - Max 5 failed attempts per IP within a 15-minute window.
 *   - On lockout, all attempts return a generic error with no timing difference.
 *   - Lockout resets automatically after 15 minutes.
 *
 * Rotation: change ADMIN_SESSION_SECRET in .env.production + restart PM2
 *           to instantly invalidate all existing sessions.
 */

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "chabrin_admin_v1";

// ── Brute-force lockout store ─────────────────────────────────────────────────
// In-memory per-process. With 2 PM2 instances an attacker gets at most 10
// attempts before both instances lock them out. Good enough given the Nginx
// IP allowlist is the primary defence.

const MAX_ATTEMPTS  = 5;
const WINDOW_MS     = 15 * 60 * 1000; // 15 minutes

interface AttemptRecord {
  count:     number;
  lockedAt:  number | null; // timestamp when lockout started
  firstFail: number;        // timestamp of first failed attempt in window
}

const failStore = new Map<string, AttemptRecord>();

/** Returns true if the IP is currently locked out. */
export function isLockedOut(ip: string): boolean {
  const rec = failStore.get(ip);
  if (!rec || rec.lockedAt === null) return false;
  if (Date.now() - rec.lockedAt > WINDOW_MS) {
    failStore.delete(ip);
    return false;
  }
  return true;
}

/** Record a failed login attempt. Returns true if the IP is now locked out. */
export function recordFailedAttempt(ip: string): boolean {
  const now = Date.now();
  const rec = failStore.get(ip);

  if (!rec || now - rec.firstFail > WINDOW_MS) {
    // Fresh window
    failStore.set(ip, { count: 1, lockedAt: null, firstFail: now });
    return false;
  }

  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockedAt = now;
    return true;
  }
  return false;
}

/** Clear the failed attempt record on successful login. */
export function clearFailedAttempts(ip: string): void {
  failStore.delete(ip);
}

/** Returns remaining attempts before lockout (for error messages). */
export function remainingAttempts(ip: string): number {
  const rec = failStore.get(ip);
  if (!rec) return MAX_ATTEMPTS;
  return Math.max(0, MAX_ATTEMPTS - rec.count);
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
