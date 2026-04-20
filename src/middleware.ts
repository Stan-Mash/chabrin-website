import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/request";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|icon\\.png|apple-touch-icon\\.png|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)).*)",
  ],
};
