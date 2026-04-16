import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/request";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

/**
 * Unified middleware:
 * 1. Passes x-pathname header to all requests (used by admin layout to detect login page)
 * 2. Skips locale routing for /admin/*, /api/*, and static assets
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For admin and API routes — just forward with pathname header injected
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(ico|png|svg|txt|xml|webp|jpg|jpeg|woff2?)$/)
  ) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  // For all other routes — apply next-intl locale middleware
  const response = intlMiddleware(request);
  // Also inject pathname for completeness
  if (response) {
    response.headers.set("x-pathname", pathname);
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};
