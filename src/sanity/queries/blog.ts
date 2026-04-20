import { sanityClient } from "@/lib/sanity";

export interface SanityPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string | null;
  featured: boolean;
  coverImage: { asset: { url: string }; alt?: string } | null;
}

/** Fetch all published posts ordered newest first */
export async function getAllPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      "slug": slug.current,
      category,
      title,
      excerpt,
      publishedAt,
      readTime,
      featured,
      coverImage { asset->{ url }, alt }
    }`
  );
}

/** Fetch the single featured post (most recently marked featured) */
export async function getFeaturedPost(): Promise<SanityPost | null> {
  const results = await sanityClient.fetch<SanityPost[]>(
    `*[_type == "post" && featured == true] | order(publishedAt desc)[0..0] {
      "slug": slug.current,
      category,
      title,
      excerpt,
      publishedAt,
      readTime,
      featured,
      coverImage { asset->{ url }, alt }
    }`
  );
  return results[0] ?? null;
}

/** Fetch a single post by slug (for detail page) */
export async function getPostBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      "slug": slug.current,
      category,
      title,
      excerpt,
      publishedAt,
      readTime,
      featured,
      coverImage { asset->{ url }, alt },
      body
    }`,
    { slug }
  );
}
