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

  const CORRIDOR_SLUGS = [
    "cbd-kilimani",
    "thika-road-ruiru",
    "kasarani-roysambu",
    "eastlands-embakasi",
    "westlands-parklands",
    "south-b-south-c",
    "south-metro-airport",
  ];

  // Static routes - same in both English and Swahili
  const staticRoutes = [
    "",
    "/properties",
    "/services",
    "/about",
    "/blog",
    "/careers",
    "/contact",
    "/privacy-policy",
    "/diaspora",
    ...CORRIDOR_SLUGS.map((s) => `/corridors/${s}`),
  ];

  // Generate sitemap entries for both locales with hreflang alternates
  const staticSitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}/en${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
    alternates: {
      languages: {
        "en-KE":    `${baseUrl}/en${route}`,
        "sw-KE":    `${baseUrl}/sw${route}`,
        "x-default": `${baseUrl}/en${route}`,
      },
    },
  }));

  // Dynamic routes: property detail pages with hreflang alternates
  const propertyRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${baseUrl}/en/properties/${listing.reference}`,
    lastModified: listing.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        "en-KE":    `${baseUrl}/en/properties/${listing.reference}`,
        "sw-KE":    `${baseUrl}/sw/properties/${listing.reference}`,
        "x-default": `${baseUrl}/en/properties/${listing.reference}`,
      },
    },
  }));

  return [...staticSitemapEntries, ...propertyRoutes];
}
