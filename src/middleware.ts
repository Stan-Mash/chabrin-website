import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/request";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Maintenance mode ───────────────────────────────────────────────────────
  // Enable by setting MAINTENANCE_MODE=true in Vercel env vars (production only).
  // Admin panel, API routes, and static assets remain accessible at all times.
  if (process.env.MAINTENANCE_MODE === "true") {
    const isExempt =
      pathname.startsWith("/maintenance") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/studio") ||
      /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|txt|xml)$/.test(pathname);

    if (!isExempt) {
      return NextResponse.rewrite(new URL("/maintenance", request.url));
    }
  }

  // Redirect /en/studio or /sw/studio → /studio (studio has no locale)
  const studioMatch = pathname.match(/^\/(?:en|sw)(\/studio(?:\/.*)?)$/);
  if (studioMatch) {
    return NextResponse.redirect(new URL(studioMatch[1], request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Exclude: Next.js internals, static files, API routes, Sanity Studio, admin panel
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|icon\\.png|apple-touch-icon\\.png|robots\\.txt|sitemap\\.xml|api/|studio(?:/.*)?|admin(?:/.*)?|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)).*)",
  ],
};
