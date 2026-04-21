import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/request";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: [
    // Exclude: Next.js internals, static files, API routes, Sanity Studio, admin panel
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|icon\\.png|apple-touch-icon\\.png|robots\\.txt|sitemap\\.xml|api/|studio(?:/.*)?$|admin(?:/.*)?$|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)).*)",
  ],
};
