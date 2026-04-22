/**
 * admin-auth.ts — Multi-user session auth for the staff admin panel.
 *
 * Strategy:
 *   - Each staff member has their own row in admin_users (email + bcrypt hash).
 *   - On login, bcrypt.compare verifies the password.
 *   - A UUID session ID is stored in admin_sessions (expires in 12h).
 *   - The session ID is stored as an httpOnly Secure SameSite=Strict cookie.
 *   - Every admin layout server component calls getAdminSession() — if absent
 *     or expired, it redirects to /admin-login.
 *
 * Brute-force protection:
 *   - Max 5 failed attempts per IP within a 15-minute window (in-memory).
 *
 * Roles:
 *   - staff      — access to complaints, applications, jobs, blog
 *   - superadmin — everything + user management
 */

import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import {
  findAdminSession,
  findAdminUserById,
  type AdminUserPublic,
} from "@/db/queries/admin-users";

export const ADMIN_COOKIE = "chabrin_admin_v2";

// ── Brute-force lockout (in-memory) ──────────────────────────────────────────

const MAX_ATTEMPTS = 5;
const WINDOW_MS    = 15 * 60 * 1000;

interface AttemptRecord {
  count:     number;
  lockedAt:  number | null;
  firstFail: number;
}

const failStore = new Map<string, AttemptRecord>();

export function isLockedOut(ip: string): boolean {
  const rec = failStore.get(ip);
  if (!rec || rec.lockedAt === null) return false;
  if (Date.now() - rec.lockedAt > WINDOW_MS) {
    failStore.delete(ip);
    return false;
  }
  return true;
}

export function recordFailedAttempt(ip: string): boolean {
  const now = Date.now();
  const rec = failStore.get(ip);
  if (!rec || now - rec.firstFail > WINDOW_MS) {
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

export function clearFailedAttempts(ip: string): void {
  failStore.delete(ip);
}

export function remainingAttempts(ip: string): number {
  const rec = failStore.get(ip);
  if (!rec) return MAX_ATTEMPTS;
  return Math.max(0, MAX_ATTEMPTS - rec.count);
}

// ── Session helpers ───────────────────────────────────────────────────────────

/** Returns the session cookie value (session UUID), or null. */
async function getSessionId(): Promise<string | null> {
  try {
    const jar = await cookies();
    return jar.get(ADMIN_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

/**
 * Returns the logged-in AdminUser, or null if not authenticated.
 * Validates the session is still in the DB and not expired.
 */
export async function getAdminSession(): Promise<AdminUserPublic | null> {
  const sessionId = await getSessionId();
  if (!sessionId) return null;

  try {
    const session = await findAdminSession(sessionId);
    if (!session) return null;

    const user = await findAdminUserById(session.user_id);
    if (!user || !user.is_active) return null;

    return user;
  } catch {
    return null;
  }
}

/** Returns true if there is a valid admin session (any role). */
export async function isAdminAuthenticated(): Promise<boolean> {
  const user = await getAdminSession();
  return user !== null;
}

/** Returns true if the logged-in user is a superadmin. */
export async function isSuperAdmin(): Promise<boolean> {
  const user = await getAdminSession();
  return user?.role === "superadmin";
}

/**
 * Timing-safe string comparison — prevents timing attacks on session IDs.
 * Both strings are padded/truncated to 64 chars before comparison.
 */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const ab = Buffer.from(a.padEnd(64, "0").slice(0, 64));
  const bb = Buffer.from(b.padEnd(64, "0").slice(0, 64));
  return timingSafeEqual(ab, bb);
}
