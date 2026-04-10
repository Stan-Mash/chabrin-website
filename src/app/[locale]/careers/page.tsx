import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Chabrin Agencies Limited. We're looking for talented property professionals to grow with us in Nairobi.",
};

const OPENINGS = [
  {
    title: "Property Manager",
    type: "Full-time",
    location: "Nairobi (On-site)",
    department: "Operations",
    summary:
      "Oversee a portfolio of residential and commercial properties. Manage tenant relationships, coordinate maintenance, and ensure client satisfaction.",
    requirements: [
      "Diploma or Degree in Real Estate, Property Management, or related field",
      "2+ years experience in property management",
      "Strong communication and negotiation skills",
      "Proficiency in Microsoft Office",
    ],
  },
  {
    title: "Leasing Officer",
    type: "Full-time",
    location: "Nairobi (On-site)",
    department: "Leasing",
    summary:
      "Handle tenant placement, lease negotiations, and property viewings. Build relationships with both landlords and prospective tenants.",
    requirements: [
      "Diploma or Degree in Real Estate, Business, or related field",
      "1+ years experience in leasing or sales",
      "Excellent interpersonal and presentation skills",
      "Valid driving licence is an advantage",
    ],
  },
  {
    title: "Property Valuer (Graduate Trainee)",
    type: "Full-time",
    location: "Nairobi (On-site)",
    department: "Valuation",
    summary:
      "Support senior valuers in conducting property inspections, market research, and preparing valuation reports under mentorship.",
    requirements: [
      "Degree in Land Economics, Real Estate, or Geospatial Engineering",
      "Registered with ISK (or eligible to register)",
      "Strong analytical and report-writing skills",
      "0–2 years experience (recent graduates welcome)",
    ],
  },
  {
    title: "Administrative Assistant",
    type: "Full-time",
    location: "Nairobi (On-site)",
    department: "Administration",
    summary:
      "Provide front-office and administrative support — managing correspondence, filing, scheduling, and client reception.",
    requirements: [
      "Diploma in Business Administration, Secretarial Studies, or related field",
      "1+ years office experience",
      "Excellent written and verbal communication in English and Swahili",
      "Organised, detail-oriented, and professional",
    ],
  },
];

export default function CareersPage() {
  const t = useTranslations("careers");

  const VALUES = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t("value_integrity_title"),
      desc:  t("value_integrity_desc"),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: t("value_growth_title"),
      desc:  t("value_growth_desc"),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      title: t("value_team_title"),
      desc:  t("value_team_desc"),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      ),
      title: t("value_impact_title"),
      desc:  t("value_impact_desc"),
    },
  ];

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

      {/* Why Join Us */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-navy mb-10 text-center">
            {t("why_title")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-brand-navy/10 text-brand-navy
                                flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-bold text-brand-navy mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-navy mb-2">{t("openings_title")}</h2>
          <p className="text-slate-500 mb-10">
            {t("openings_subtitle")}
          </p>

          <div className="space-y-6">
            {OPENINGS.map((job) => (
              <article
                key={job.title}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7
                           hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full
                                       bg-brand-navy/10 text-brand-navy">
                        {job.department}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full
                                       bg-brand-cyan/10 text-brand-cyan">
                        {t("fulltime")}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full
                                       bg-slate-100 text-slate-600">
                        📍 {t("location")}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/en/contact?ref=careers-${job.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex-shrink-0 px-5 py-2.5 rounded-full bg-brand-navy text-white
                               text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy
                               transition-colors"
                  >
                    {t("apply_btn")}
                  </Link>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-4">{job.summary}</p>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {t("requirements_label")}
                  </p>
                  <ul className="space-y-1.5">
                    {job.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-sm text-slate-600">
                        <svg className="w-4 h-4 text-brand-cyan mt-0.5 flex-shrink-0"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Spontaneous Application */}
      <section className="py-16 px-4 bg-brand-navy text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">{t("spontaneous_title")}</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            {t("spontaneous_desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${siteConfig.contact.email}?subject=Spontaneous%20Application`}
              className="px-8 py-3.5 rounded-full bg-brand-cyan text-brand-navy font-bold
                         text-sm hover:bg-white transition-colors"
            >
              {t("spontaneous_cta")}
            </a>
            <Link
              href="/en/contact"
              className="px-8 py-3.5 rounded-full border-2 border-white/30 text-white
                         font-bold text-sm hover:border-brand-cyan hover:text-brand-cyan
                         transition-colors"
            >
              {t("spontaneous_contact")}
            </Link>
          </div>
          <p className="text-slate-400 text-sm mt-6">
            Email: <a href={`mailto:${siteConfig.contact.email}`}
              className="text-brand-cyan hover:underline">{siteConfig.contact.email}</a>
          </p>
        </div>
      </section>

    </main>
  );
}
