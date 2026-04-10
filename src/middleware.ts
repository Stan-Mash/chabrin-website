import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiting middleware for API routes.
 * Prevents spam abuse on contact form endpoint.
 *
 * Uses in-memory store (simple approach). For production, use:
 * - Upstash Redis (@upstash/ratelimit)
 * - Redis client
 * - External rate limiting service
 *
 * Current implementation: 5 requests per hour per IP
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

// In-memory store for rate limiting (resets on server restart)
// Key: IP address, Value: array of request timestamps
const rateLimitStore = new Map<string, number[]>();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5;

/**
 * Get client IP from request headers.
 * Handles X-Forwarded-For (proxy) and direct connection.
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Check if request should be rate limited.
 * @returns true if should be blocked, false if allowed
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  // Get or create request history for this IP
  const requestTimes = rateLimitStore.get(ip) || [];

  // Filter out requests outside the window
  const recentRequests = requestTimes.filter((time) => time > windowStart);

  // Check if limit exceeded
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  // Add current request and update store
  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);

  // Cleanup: remove old entries after 2 hours to prevent memory leak
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

/**
 * Middleware function applied to API routes.
 */
export function middleware(request: NextRequest) {
  // Only apply rate limiting to POST /api/contact
  if (request.method !== "POST" || !request.nextUrl.pathname.includes("/api/contact")) {
    return NextResponse.next();
  }

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

  return NextResponse.next();
}

/**
 * Configure which routes the middleware applies to.
 */
export const config = {
  matcher: [
    "/api/contact", // Apply to contact form POST
  ],
};
