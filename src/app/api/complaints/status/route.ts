import { NextRequest, NextResponse } from "next/server";
import { getComplaintStatus } from "@/db/queries/complaints";

/**
 * GET /api/complaints/status?ref=CMP-2026-XXXXX
 *
 * Returns public-safe status fields only.
 * Never returns: full_name, email, phone, internal_notes.
 *
 * Rate limited: 20 lookups per IP per minute to prevent reference enumeration.
 */

// ── Simple sliding-window rate limiter ────────────────────────────────────────
// In-memory per-process. Good enough for a low-traffic public endpoint behind
// Nginx and Cloudflare which provide additional rate-limiting layers.

const RATE_LIMIT    = 20;       // max requests
const WINDOW_MS     = 60_000;   // per minute

interface WindowRecord {
  count:    number;
  windowStart: number;
}

const ipStore = new Map<string, WindowRecord>();

// Periodic cleanup to prevent unbounded memory growth
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [ip, rec] of ipStore) {
    if (rec.windowStart < cutoff) ipStore.delete(ip);
  }
}, WINDOW_MS);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = ipStore.get(ip);

  if (!rec || now - rec.windowStart > WINDOW_MS) {
    // New window
    ipStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  rec.count += 1;
  return rec.count > RATE_LIMIT;
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Resolve client IP (Nginx forwards via X-Real-IP; fallback to cf-connecting-ip)
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const ref = req.nextUrl.searchParams.get("ref")?.trim().toUpperCase();

  if (!ref || !/^CMP-\d{4}-[A-Z0-9]{5}$/.test(ref)) {
    return NextResponse.json(
      { error: "Invalid reference format. Expected CMP-YYYY-XXXXX" },
      { status: 400 }
    );
  }

  try {
    const complaint = await getComplaintStatus(ref);
    if (!complaint) {
      return NextResponse.json({ error: "Reference not found" }, { status: 404 });
    }
    return NextResponse.json(complaint, { status: 200 });
  } catch (err) {
    console.error("[complaints/status] db-error", {
      error: err instanceof Error ? err.message : "unknown",
      time:  new Date().toISOString(),
    });
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
  }
}
