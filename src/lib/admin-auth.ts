/**
 * admin-auth.ts — Session token helpers for the staff admin panel.
 *
 * Strategy:
 *   - ADMIN_PASSWORD and ADMIN_SESSION_SECRET live in .env.production only.
 *   - On login, we compute HMAC-SHA256(ADMIN_PASSWORD, ADMIN_SESSION_SECRET)
 *     and store it as an httpOnly, Secure, SameSite=Strict cookie.
 *   - Every admin layout server component calls verifyAdminSession() — if the
 *     cookie is absent or wrong, it redirects to /admin/login.
 *   - No database reads. No third-party service. Zero CHIPS contact.
 *
 * Rotation: change ADMIN_SESSION_SECRET in .env.production and reload PM2
 *           to instantly invalidate all existing sessions.
 */

import { createHmac } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "chabrin_admin_v1";

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
    return token === computeToken();
  } catch {
    return false;
  }
}
