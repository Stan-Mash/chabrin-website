import { MetadataRoute } from "next";

/**
 * Robot exclusion rules for search engines.
 * Provides directives for crawlers and indexing behavior.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
          "/studio/",
        ],
      },
    ],
    sitemap: "https://chabrinagencies.com/sitemap.xml",
    host: "https://chabrinagencies.com",
  };
}
