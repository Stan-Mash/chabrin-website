import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/request";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  const directives = [
    "default-src 'self'",
    [
      "script-src",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      isDev ? "'unsafe-eval'" : "",
      "https://challenges.cloudflare.com",
      "https://api.mapbox.com",
    ]
      .filter(Boolean)
      .join(" "),
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://*.digitaloceanspaces.com https://cdn.sanity.io https://api.mapbox.com https://events.mapbox.com https://*.tile.openstreetmap.org https://images.unsplash.com",
    "connect-src 'self' https://*.sanity.io https://api.mapbox.com https://events.mapbox.com https://challenges.cloudflare.com https://*.tile.openstreetmap.org",
    "frame-src https://challenges.cloudflare.com",
    "worker-src blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ];
  return directives.join("; ");
}

/**
 * Unified middleware:
 * 1. Generates a per-request CSP nonce and emits Content-Security-Policy header
 * 2. Forwards nonce via x-nonce header so root layout can stamp <script> tags
 * 3. Passes x-pathname header (used by admin layout to detect login page)
 * 4. Skips locale routing for /admin/*, /api/*, and static assets
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  function applyHeaders(response: NextResponse): NextResponse {
    response.headers.set("x-nonce", nonce);
    response.headers.set("x-pathname", pathname);
    response.headers.set("Content-Security-Policy", csp);
    return response;
  }

  // For admin and API routes — just forward with headers injected
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(ico|png|svg|txt|xml|webp|jpg|jpeg|woff2?)$/)
  ) {
    return applyHeaders(NextResponse.next());
  }

  // For all other routes — apply next-intl locale middleware, then inject headers
  const response = intlMiddleware(request);
  if (response) {
    return applyHeaders(response);
  }
  return applyHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};
