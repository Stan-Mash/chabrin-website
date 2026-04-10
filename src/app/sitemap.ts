import { MetadataRoute } from "next";
import { getPublishedListings } from "@/db/queries/listings";
import { siteConfig } from "@/config/site";

/**
 * Dynamic sitemap generation for Next.js.
 * Includes all static routes + dynamic property detail pages.
 * Helps search engines discover and index all content.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Fetch all published listings for dynamic routes
  const listings = await getPublishedListings(undefined, undefined, 1000, 0).catch(() => []);

  // Static routes — same in both English and Swahili
  const staticRoutes = [
    "",
    "/properties",
    "/services",
    "/about",
    "/blog",
    "/careers",
    "/contact",
    "/privacy-policy",
  ];

  // Generate sitemap entries for both locales
  const staticSitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of siteConfig.locale.supported) {
    for (const route of staticRoutes) {
      staticSitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date().toISOString().split("T")[0],
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic routes: property detail pages (English only for now)
  const propertyRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${baseUrl}/en/properties/${listing.reference}`,
    lastModified: listing.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticSitemapEntries, ...propertyRoutes];
}
