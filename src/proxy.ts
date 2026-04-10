import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/request";

/**
 * Combined proxy — handles:
 *  1. Rate limiting for POST /api/contact (5 req/hr per IP)
 *  2. next-intl locale detection and routing for all other paths
 *
 * Next.js 16 allows only one entry file (proxy.ts OR middleware.ts, not both).
 */

// ── Rate Limiting ──────────────────────────────────────────────────────────────

const rateLimitStore = new Map<string, number[]>();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const requestTimes = rateLimitStore.get(ip) || [];
  const recentRequests = requestTimes.filter((time) => time > windowStart);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);

  // Cleanup stale entries to prevent memory leak
  if (rateLimitStore.size > 10000) {
    for (const [ipKey, times] of rateLimitStore.entries()) {
      const activeTimes = times.filter((t) => t > windowStart - RATE_LIMIT_WINDOW_MS);
      if (activeTimes.length === 0) {
        rateLimitStore.delete(ipKey);
      } else {
        rateLimitStore.set(ipKey, activeTimes);
      }
    }
  }

  return false;
}

// ── next-intl middleware ───────────────────────────────────────────────────────

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// ── Combined handler ──────────────────────────────────────────────────────────

export default function middleware(request: NextRequest) {
  // Apply rate limiting to POST /api/contact only
  if (request.method === "POST" && request.nextUrl.pathname.includes("/api/contact")) {
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: RATE_LIMIT_WINDOW_MS / 1000,
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(RATE_LIMIT_WINDOW_MS / 1000).toString(),
            "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
            "X-RateLimit-Window": `${RATE_LIMIT_WINDOW_MS / 1000}s`,
          },
        }
      );
    }
  }

  // Delegate locale routing to next-intl for all non-API paths
  return intlMiddleware(request);
}

export const config = {
  // Match all paths except Next.js internals, static files, and API routes
  matcher: [
    "/api/contact",
    "/((?!_next|_vercel|api|.*\\..*).*)",
  ],
};
