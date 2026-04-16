import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/request";

/**
 * next-intl locale routing middleware.
 *
 * Excluded from locale handling:
 *   - /admin/*        — staff complaint management panel
 *   - /api/*          — API routes
 *   - /_next/*        — Next.js internals
 *   - /icon*, /robots.txt, /sitemap.xml, /favicon.ico — static assets
 */
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: [
    // Match all paths EXCEPT:
    "/((?!admin|api|_next/static|_next/image|icon|favicon|robots|sitemap|.*\\..*).*)",
  ],
};
