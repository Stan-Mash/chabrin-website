import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getAllPosts, type SanityPost } from "@/sanity/queries/blog";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description: "Property market insights, landlord guides, tenant tips, and real estate news from Chabrin Agencies Limited.",
};

// Revalidate every hour
export const revalidate = 3600;

const CATEGORY_COLORS: Record<string, string> = {
  "Landlord Guide":      "bg-blue-50 text-blue-700",
  "Market Insights":     "bg-purple-50 text-purple-700",
  "Tenant Guide":        "bg-green-50 text-green-700",
  "Valuation":           "bg-amber-50 text-amber-700",
  "Property Management": "bg-cyan-50 text-cyan-700",
  "Legal":               "bg-red-50 text-red-700",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-KE", {
    month: "long",
    year: "numeric",
  });
}

// Fallback hardcoded posts used when Sanity is not yet configured
const FALLBACK_POSTS: SanityPost[] = [
  {
    slug: "understanding-lease-agreements-kenya",
    category: "Landlord Guide",
    title: "Understanding Lease Agreements in Kenya: What Every Landlord Needs to Know",
    excerpt: "A lease agreement is more than a formality — it protects both landlord and tenant. We break down the key clauses every Kenyan landlord should include.",
    publishedAt: "2026-03-01T00:00:00Z",
    readTime: "6 min read",
    featured: true,
    coverImage: null,
  },
  {
    slug: "nairobi-rental-market-2026",
    category: "Market Insights",
    title: "Nairobi Rental Market Update 2026: Zones to Watch",
    excerpt: "From Westlands to Ruaka, demand patterns are shifting. Our analysis covers which zones are seeing the highest occupancy and what's driving tenant movement.",
    publishedAt: "2026-02-01T00:00:00Z",
    readTime: "8 min read",
    featured: false,
    coverImage: null,
  },
  {
    slug: "tenant-rights-kenya",
    category: "Tenant Guide",
    title: "Know Your Rights as a Tenant in Kenya",
    excerpt: "The Landlord and Tenant (Shops, Hotels and Catering Establishments) Act and the Rent Restriction Act both protect tenants. Here's what you need to know.",
    publishedAt: "2026-01-01T00:00:00Z",
    readTime: "5 min read",
    featured: false,
    coverImage: null,
  },
  {
    slug: "property-valuation-guide",
    category: "Valuation",
    title: "How Property Valuations Work in Kenya — and Why They Matter",
    excerpt: "Whether for sale, mortgage, or insurance, a professional valuation is critical. We explain the methodologies our registered valuers use and what to expect.",
    publishedAt: "2025-12-01T00:00:00Z",
    readTime: "7 min read",
    featured: false,
    coverImage: null,
  },
  {
    slug: "kdpa-landlords-tenants",
    category: "Legal",
    title: "What Kenya's Data Protection Act Means for Landlords and Property Managers",
    excerpt: "Collecting tenant IDs and financial data now comes with legal obligations under the KDPA 2019. Here's how to stay compliant.",
    publishedAt: "2025-10-01T00:00:00Z",
    readTime: "6 min read",
    featured: false,
    coverImage: null,
  },
];

export default async function BlogPage() {
  const t = await getTranslations("blog");

  // Fetch from Sanity; fall back to hardcoded posts if not configured
  let posts: SanityPost[] = [];
  try {
    const fetched = await getAllPosts();
    posts = fetched.length > 0 ? fetched : FALLBACK_POSTS;
  } catch {
    posts = FALLBACK_POSTS;
  }

  // Featured = first post marked featured, or just the first post
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p !== featured);

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-brand-navy text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-3">
            {t("eyebrow")}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t("hero_title")}
          </h1>
          <p className="text-slate-300 max-w-xl">
            {t("hero_subtitle")}
          </p>
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto space-y-14">

          {/* Featured post */}
          {featured && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-6">
                {t("featured_label")}
              </p>
              <article className="group rounded-2xl border border-slate-100 overflow-hidden shadow-sm
                                  hover:shadow-md transition-shadow bg-white">
                {/* Cover image or gradient strip */}
                {featured.coverImage?.asset?.url ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={featured.coverImage.asset.url}
                      alt={featured.coverImage.alt ?? featured.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-4 left-6">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full
                        ${CATEGORY_COLORS[featured.category] ?? "bg-slate-100 text-slate-600"}`}>
                        {featured.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-r from-brand-navy to-brand-cyan/80 flex items-end p-6">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full
                      ${CATEGORY_COLORS[featured.category] ?? "bg-slate-100 text-slate-600"}`}>
                      {featured.category}
                    </span>
                  </div>
                )}
                <div className="p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-brand-navy mb-3
                                 group-hover:text-brand-cyan transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-slate-500 mb-5 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {formatDate(featured.publishedAt)}
                      {featured.readTime && ` · ${featured.readTime}`}
                    </span>
                    <span className="text-sm font-semibold text-brand-cyan">
                      {t("coming_soon_arrow")}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                {t("all_label")}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <article
                    key={post.slug}
                    className="group rounded-2xl border border-slate-100 overflow-hidden shadow-sm
                               hover:shadow-md transition-shadow bg-white flex flex-col"
                  >
                    {post.coverImage?.asset?.url ? (
                      <div className="relative h-36 w-full">
                        <Image
                          src={post.coverImage.asset.url}
                          alt={post.coverImage.alt ?? post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-2 bg-gradient-to-r from-brand-navy to-brand-cyan" />
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-3
                        ${CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-600"}`}>
                        {post.category}
                      </span>
                      <h3 className="font-bold text-brand-navy mb-2 leading-snug
                                     group-hover:text-brand-cyan transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-slate-400">
                          {formatDate(post.publishedAt)}
                          {post.readTime && ` · ${post.readTime}`}
                        </span>
                        <span className="text-xs font-semibold text-brand-cyan">{t("soon_short")}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="bg-brand-navy rounded-2xl p-10 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">{t("newsletter_title")}</h2>
            <p className="text-slate-300 mb-6 max-w-lg mx-auto">
              {t("newsletter_subtitle")}
            </p>
            <Link
              href="/en/contact"
              className="inline-block px-8 py-3 rounded-full bg-brand-cyan text-brand-navy
                         font-bold text-sm hover:bg-white transition-colors"
            >
              {t("newsletter_cta")}
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
