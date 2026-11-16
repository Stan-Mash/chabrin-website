import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { getAllOpenJobs, type SanityJob } from "@/sanity/queries/jobs";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Careers",
    description: "Join Chabrin Agencies Limited - Kenya's trusted property management company. View open positions across Nairobi, Kiambu, Murang'a, Kajiado, Machakos and beyond.",
    alternates: { canonical: `https://www.chabrinagencies.com/${locale}/careers` },
  };
}

const DEPT_COLOURS: Record<string, string> = {
  Operations:     "bg-blue-50 text-blue-700",
  Administration: "bg-purple-50 text-purple-700",
  Finance:        "bg-amber-50 text-amber-700",
  "IT & Systems": "bg-cyan-50 text-cyan-700",
  Marketing:      "bg-rose-50 text-rose-700",
};

function deptColour(dept: string) {
  return DEPT_COLOURS[dept] ?? "bg-slate-100 text-slate-600";
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");

  let jobs: SanityJob[] = [];
  try {
    jobs = await getAllOpenJobs();
  } catch {
    jobs = [];
  }

  const VALUES = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
        </svg>
      ),
      title: t("value_integrity_title"),
      desc:  t("value_integrity_desc"),
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/>
        </svg>
      ),
      title: t("value_growth_title"),
      desc:  t("value_growth_desc"),
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
        </svg>
      ),
      title: t("value_team_title"),
      desc:  t("value_team_desc"),
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21"/>
        </svg>
      ),
      title: t("value_impact_title"),
      desc:  t("value_impact_desc"),
    },
  ];

  const jobCountText =
    jobs.length === 1
      ? t("open_positions_one")
      : jobs.length > 1
        ? t("open_positions_other", { count: jobs.length })
        : t("no_positions_soon");

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 px-4 relative overflow-hidden">
        {/* decorative rings */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full border border-white/5 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-3">
            {t("hero_eyebrow")}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            {t("hero_title")}<br />
            <span className="text-brand-cyan">{t("hero_title_accent")}</span>
          </h1>
          <p className="text-slate-300 max-w-xl text-lg leading-relaxed mb-8">
            {t("hero_desc")}
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
              {t("badge_location")}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/></svg>
              {t("badge_earb")}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
              {t("badge_est")}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
              {t("badge_team")}
            </span>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-14 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-navy mb-8 text-center">{t("why_header")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="text-brand-cyan mb-3">{v.icon}</div>
                <h3 className="font-bold text-brand-navy mb-2 text-sm">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy mb-1">{t("openings_title")}</h2>
              <p className="text-slate-500 text-sm">{jobCountText}</p>
            </div>
            <Link
              href="#spontaneous"
              className="text-sm font-semibold text-brand-cyan hover:text-brand-navy transition-colors"
            >
              <span className="inline-flex items-center gap-1">
                {t("no_role_link")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
              </span>
            </Link>
          </div>

          {jobs.length === 0 ? (
            /* ── Divisions + Talent Registry (zero-state) ──────────────────── */
            <div className="space-y-10" id="spontaneous">
              {/* Divisions grid */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
                  Operational Divisions
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: "01",
                      title: "Property Management",
                      dept: "Operations",
                      colour: "border-brand-cyan/40 bg-brand-cyan/5",
                      desc: "Portfolio management, tenant relations, rent collection, maintenance coordination across residential and commercial properties in 7 Nairobi corridors.",
                      roles: ["Property Manager", "Field Officer", "Maintenance Coordinator"],
                    },
                    {
                      id: "02",
                      title: "Letting & Leasing",
                      dept: "Operations",
                      colour: "border-blue-200 bg-blue-50/40",
                      desc: "New tenant acquisition, unit marketing, lease negotiations, void period management and landlord onboarding for the growing Chabrin portfolio.",
                      roles: ["Letting Agent", "Lease Executive", "Client Relations Officer"],
                    },
                    {
                      id: "03",
                      title: "Finance & Accounts",
                      dept: "Finance",
                      colour: "border-amber-200 bg-amber-50/40",
                      desc: "Landlord disbursements, KRA compliance, service charge reconciliation, audit preparation, and financial reporting for the full managed portfolio.",
                      roles: ["Accounts Officer", "Bookkeeper", "Finance Analyst"],
                    },
                    {
                      id: "04",
                      title: "Administration & IT",
                      dept: "Administration",
                      colour: "border-purple-200 bg-purple-50/40",
                      desc: "Front-office operations, records management, CHIPS system support, digital marketing, and infrastructure for Chabrin's Nacico Plaza headquarters.",
                      roles: ["Admin Assistant", "IT Support Officer", "Digital Marketer"],
                    },
                  ].map((div) => (
                    <div key={div.id} className={`border ${div.colour} p-6`}>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-[9px] font-mono font-bold text-slate-300">{div.id}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 ${deptColour(div.dept)}`}>
                          {div.dept}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-brand-navy mb-2">{div.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">{div.desc}</p>
                      <div className="space-y-1">
                        {div.roles.map((r) => (
                          <p key={r} className="text-xs text-slate-400 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-brand-cyan inline-block" />
                            {r}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Talent Registry CTA */}
              <div className="border border-brand-navy/15 bg-brand-navy/[0.03] p-8">
                <div className="max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-3">
                    Talent Registry
                  </p>
                  <h3 className="text-xl font-bold text-brand-navy mb-3 leading-snug">
                    No Current Openings — Express Interest for Future Roles
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Chabrin Agencies is a growing company. We review our talent registry when new roles open. Submit your CV and preferred division below and we will reach out when a matching position arises.
                  </p>
                  <a
                    href={`mailto:${siteConfig.contact.careersEmail}?subject=Talent%20Registry%20–%20Spontaneous%20Application`}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-brand-navy text-white font-bold text-sm uppercase tracking-widest hover:bg-brand-navy-dark transition-colors"
                  >
                    Submit CV to Talent Registry
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                  <p className="text-xs text-slate-400 mt-4">
                    Email your CV + a one-paragraph cover note to{" "}
                    <span className="text-brand-navy font-medium">{siteConfig.contact.careersEmail}</span>.
                    KDPA: your data is held only for recruitment purposes and deleted after 12 months if no position arises.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <article
                  key={job.slug}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6
                             hover:shadow-md hover:border-brand-cyan/30 transition-all group"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deptColour(job.department)}`}>
                          {job.department}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-cyan/10 text-brand-cyan">
                          {job.jobType}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                          {job.location}
                        </span>
                        {job.closesAt && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600">
                            {t("closes_prefix")} {new Date(job.closesAt).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-cyan transition-colors mb-2">
                        {job.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">{job.summary.replace(/\s*—\s*/g, ", ")}</p>
                    </div>
                    <Link
                      href={`/${locale}/careers/${job.slug}`}
                      className="flex-shrink-0 px-5 py-2.5 rounded-full bg-brand-navy text-white
                                 text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy
                                 transition-colors whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {t("view_apply")}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Track application */}
      <section className="py-10 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-brand-navy mb-1">{t("track_title")}</p>
            <p className="text-slate-500 text-sm">{t("track_desc")}</p>
          </div>
          <Link
            href={`/${locale}/careers/track`}
            className="flex-shrink-0 px-6 py-2.5 rounded-full border-2 border-brand-navy text-brand-navy
                       text-sm font-bold hover:bg-brand-navy hover:text-white transition-colors"
          >
            {t("track_btn")}
          </Link>
        </div>
      </section>

      {/* Spontaneous Application */}
      <section id="spontaneous" className="py-16 px-4 bg-brand-navy text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-3">{t("open_eyebrow")}</p>
          <h2 className="text-2xl font-bold mb-4">{t("no_role_title")}</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">{t("no_role_desc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${siteConfig.contact.careersEmail}?subject=Spontaneous%20Application`}
              className="px-8 py-3.5 rounded-full bg-brand-cyan text-brand-navy font-bold text-sm hover:bg-white transition-colors"
            >
              {t("email_cv")}
            </a>
            <Link
              href={`/${locale}/contact`}
              className="px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-bold text-sm hover:border-brand-cyan hover:text-brand-cyan transition-colors"
            >
              {t("spontaneous_contact")}
            </Link>
          </div>
          <p className="text-slate-400 text-sm mt-6">
            {siteConfig.contact.careersEmail}
          </p>
        </div>
      </section>

    </main>
  );
}
