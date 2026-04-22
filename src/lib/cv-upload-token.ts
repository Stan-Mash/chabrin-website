/**
 * cv-upload-token.ts — HMAC-SHA256 signed tokens for secure CV upload links.
 *
 * A signed link looks like:
 *   /en/careers/upload?ref=APP-OPS-2025-XXXXX&tok=<hex-sig>&exp=<unix-ts>
 *
 * The token signs: `ref:exp` using HMAC-SHA256 with CV_UPLOAD_SECRET.
 * The link expires after CV_UPLOAD_TTL_HOURS (default 7 days).
 * Once used (cv_url set), the token is cleared from the DB.
 */

import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.CV_UPLOAD_SECRET ?? "";
const TTL_HOURS = parseInt(process.env.CV_UPLOAD_TTL_HOURS ?? "168", 10); // 7 days

function hmac(data: string): string {
  if (!SECRET) throw new Error("CV_UPLOAD_SECRET not set");
  return createHmac("sha256", SECRET).update(data).digest("hex");
}

/** Generate a signed upload token. Returns { token, expiresAt }. */
export function generateUploadToken(ref: string): { token: string; expiresAt: Date } {
  const exp = Math.floor(Date.now() / 1000) + TTL_HOURS * 3600;
  const token = hmac(`${ref}:${exp}`);
  return { token, expiresAt: new Date(exp * 1000) };
}

/** Build the full upload URL for the signed link email. */
export function buildUploadUrl(baseUrl: string, ref: string): string {
  const { token, expiresAt } = generateUploadToken(ref);
  const exp = Math.floor(expiresAt.getTime() / 1000);
  const params = new URLSearchParams({ ref, tok: token, exp: String(exp) });
  return `${baseUrl}/en/careers/upload?${params.toString()}`;
}

/** Verify a token from the URL. Returns true if valid and not expired. */
export function verifyUploadToken(ref: string, token: string, exp: string): boolean {
  if (!SECRET) return false;
  const expNum = parseInt(exp, 10);
  if (!expNum || Date.now() / 1000 > expNum) return false;
  const expected = hmac(`${ref}:${expNum}`);
  try {
    return timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}
