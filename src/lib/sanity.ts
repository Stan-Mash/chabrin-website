import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * Sanity CMS client — manages blog, careers, team, and page content.
 *
 * Content types managed in Sanity:
 *  - Blog posts (English + Swahili)
 *  - Career listings
 *  - Team member profiles
 *  - Service descriptions
 *  - Homepage hero/stats content
 *
 * ⚠️  Use sanityServerClient for server-side queries requiring the API token.
 *     Use sanityClient (no token) for public read queries from server components.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

/** Public read client — use in Server Components for published content */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN for fast reads of published content
});

/** Authenticated client — use in Server Actions and draft preview */
export const sanityServerClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/** Image URL builder — resolves Sanity asset references to CDN URLs */
const builder = imageUrlBuilder(sanityClient);

export function sanityImage(source: SanityImageSource) {
  return builder.image(source);
}
