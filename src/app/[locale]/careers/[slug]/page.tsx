import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getJobBySlug, getAllOpenJobSlugs } from "@/sanity/queries/jobs";
import ApplicationForm from "@/components/sections/careers/ApplicationForm";
import { siteConfig } from "@/config/site";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllOpenJobSlugs().catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug).catch(() => null);
  if (!job) return { title: "Job Not Found" };
  return {
    title:       `${job.title} — Careers`,
    description: job.summary,
    openGraph: {
      title:       `${job.title} at Chabrin Agencies`,
      description: job.summary,
      type:        "website",
    },
  };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug).catch(() => null);
  if (!job) notFound();

  // Google for Jobs structured data
  const jobSchema = {
    "@context":   "https://schema.org",
    "@type":      "JobPosting",
    title:        job.title,
    description:  job.description,
    identifier: {
      "@type": "PropertyValue",
      name:    siteConfig.name,
    },
    datePosted:       job.publishedAt.split("T")[0],
    validThrough:     job.closesAt ?? undefined,
    employmentType:   job.jobType.toUpperCase().replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name:    siteConfig.name,
      sameAs:  siteConfig.url,
      logo:    `${siteConfig.url}/logo-wordmark.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type":           "PostalAddress",
        addressLocality:   "Nairobi",
        addressCountry:    "KE",
      },
    },
    baseSalary: job.salaryRange ? {
      "@type":   "MonetaryAmount",
      currency:  "KES",
      value: {
        "@type":     "QuantitativeValue",
        description: job.salaryRange,
      },
    } : undefined,
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />

      {/* Breadcrumb + header */}
      <section className="bg-brand-navy text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-slate-400 mb-5 flex items-center gap-2">
            <Link href="/careers" className="hover:text-brand-cyan transition-colors">Careers</Link>
            <span>/</span>
            <span className="text-white">{job.title}</span>
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white">
                  {job.department}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan">
                  {job.jobType}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white">
                  📍 {job.location}
                </span>
                {job.salaryRange && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-green-300">
                    {job.salaryRange}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{job.title}</h1>
              <p className="text-slate-300 max-w-xl leading-relaxed">{job.summary}</p>
            </div>
            <a
              href="#apply"
              className="flex-shrink-0 px-6 py-3 rounded-full bg-brand-cyan text-brand-navy
                         font-bold text-sm hover:bg-white transition-colors"
            >
              Apply Now →
            </a>
          </div>
        </div>
      </section>

      {/* Two-column layout */}
      <div className="max-w-5xl mx-auto px-4 py-12 lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">

        {/* Left — Job details */}
        <div>
          {/* Description — Portable Text rendered as simple blocks */}
          <div className="prose prose-slate prose-headings:text-brand-navy prose-headings:font-bold
                          prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
                          prose-p:text-slate-600 prose-p:leading-relaxed
                          prose-li:text-slate-600 prose-li:leading-relaxed
                          prose-strong:text-brand-navy max-w-none mb-10">
            {(job.description as Array<{ _type: string; _key: string; style?: string; children?: Array<{ text: string; marks?: string[] }> }>).map((block) => {
              if (block._type !== "block") return null;
              const text = block.children?.map((c) => c.text).join("") ?? "";
              if (block.style === "h2") return <h2 key={block._key}>{text}</h2>;
              if (block.style === "h3") return <h3 key={block._key}>{text}</h3>;
              if (!text.trim()) return null;
              return <p key={block._key}>{text}</p>;
            })}
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-brand-navy mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-brand-cyan mt-0.5 flex-shrink-0" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nice to have */}
          {job.niceToHave && job.niceToHave.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-brand-navy mb-4">Nice to Have</h2>
              <ul className="space-y-2">
                {job.niceToHave.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Share / back */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
            <Link href="/careers" className="text-sm text-slate-500 hover:text-brand-navy transition-colors flex items-center gap-1">
              ← Back to all positions
            </Link>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${job.title} opportunity at Chabrin Agencies — ${siteConfig.url}/careers/${job.slug}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-green-600 transition-colors flex items-center gap-1"
            >
              Share on WhatsApp
            </a>
          </div>
        </div>

        {/* Right — Sidebar + Apply form */}
        <div>
          {/* Job summary card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6 sticky top-6">
            <h3 className="font-bold text-brand-navy mb-4 text-sm uppercase tracking-wider">Job Summary</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Department</dt>
                <dd className="font-semibold text-brand-navy text-right">{job.department}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Type</dt>
                <dd className="font-semibold text-brand-navy text-right">{job.jobType}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Location</dt>
                <dd className="font-semibold text-brand-navy text-right">{job.location}</dd>
              </div>
              {job.salaryRange && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Salary</dt>
                  <dd className="font-semibold text-green-600 text-right">{job.salaryRange}</dd>
                </div>
              )}
              {job.closesAt && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Closes</dt>
                  <dd className="font-semibold text-rose-600 text-right">
                    {new Date(job.closesAt).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Posted</dt>
                <dd className="font-semibold text-brand-navy text-right">
                  {new Date(job.publishedAt).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
                </dd>
              </div>
            </dl>
            <a
              href="#apply"
              className="mt-5 block w-full text-center px-5 py-3 rounded-full bg-brand-navy text-white
                         font-bold text-sm hover:bg-brand-cyan hover:text-brand-navy transition-colors"
            >
              Apply for this role
            </a>
          </div>
        </div>
      </div>

      {/* Application form */}
      <div id="apply" className="bg-slate-50 border-t border-slate-100 py-14 px-4 scroll-mt-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-navy mb-2">Apply — {job.title}</h2>
          <p className="text-slate-500 text-sm mb-8">
            Complete the form below. You&apos;ll receive a reference number and confirmation email immediately.
          </p>
          <ApplicationForm
            jobSlug={job.slug}
            jobTitle={job.title}
            screeningQuestions={job.screeningQuestions ?? []}
          />
        </div>
      </div>

    </main>
  );
}
