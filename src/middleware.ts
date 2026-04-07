import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/request";

/**
 * next-intl middleware — handles locale detection and routing.
 *
 * Routing behaviour:
 *  - /              → redirects to /en (or detected browser locale)
 *  - /en/...        → English pages
 *  - /sw/...        → Swahili pages
 *  - Unknown locale → 404
 */
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always", // Always show /en or /sw in URL
});

export const config = {
  // Match all paths except Next.js internals and static files
  matcher: [
    "/((?!_next|_vercel|api|.*\\..*).*)",
  ],
};
