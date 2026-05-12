import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getAllOpenJobs, type SanityJob } from "@/sanity/queries/jobs";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Chabrin Agencies Limited — Kenya's trusted property management company. View open positions across Nairobi, Kiambu, Murang'a, Kajiado, Machakos and beyond.",
};

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

export default async function CareersPage() {
  let jobs: SanityJob[] = [];
  try {
    jobs = await getAllOpenJobs();
  } catch {
    jobs = [];
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 px-4 relative overflow-hidden">
        {/* decorative rings */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full border border-white/5 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-3">
            Careers at Chabrin
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Build a Career in<br />
            <span className="text-brand-cyan">Property Management</span>
          </h1>
          <p className="text-slate-300 max-w-xl text-lg leading-relaxed mb-8">
            Join a team managing properties across Nairobi, Kiambu, Murang&apos;a,
            Kajiado, Machakos and beyond — for over 30 years. Professional growth, stable employment, and real impact.
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-slate-400">
            <span>📍 Nairobi, Kenya</span>
            <span>🏢 EARB Registered</span>
            <span>🗓️ Est. 1990s</span>
            <span>👥 Growing team</span>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-14 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-navy mb-8 text-center">Why Chabrin?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🛡️", title: "Integrity First", desc: "30+ years of trust with landlords and tenants across Kenya's key growth markets." },
              { icon: "📈", title: "Career Growth", desc: "Structured training, mentorship, and clear career progression paths." },
              { icon: "🤝", title: "Strong Team", desc: "Collaborative environment where every team member's input matters." },
              { icon: "🏙️", title: "Real Impact", desc: "Your work directly improves the lives of hundreds of tenants and landlords." },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="text-3xl mb-3">{v.icon}</div>
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
              <h2 className="text-2xl font-bold text-brand-navy mb-1">Open Positions</h2>
              <p className="text-slate-500 text-sm">
                {jobs.length > 0
                  ? `${jobs.length} position${jobs.length === 1 ? "" : "s"} currently open`
                  : "No positions open right now — check back soon"}
              </p>
            </div>
            <Link
              href="#spontaneous"
              className="text-sm font-semibold text-brand-cyan hover:text-brand-navy transition-colors"
            >
              Don&apos;t see your role? →
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-5xl mb-4">💼</p>
              <p className="text-brand-navy font-semibold text-lg mb-2">No open positions right now</p>
              <p className="text-slate-500 text-sm">We&apos;re not actively hiring but always interested in great people.</p>
              <a
                href={`mailto:${siteConfig.contact.careersEmail}?subject=Spontaneous%20Application`}
                className="mt-6 inline-block px-6 py-2.5 rounded-full bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors"
              >
                Send a Spontaneous Application
              </a>
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
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                          📍 {job.location}
                        </span>
                        {job.closesAt && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600">
                            Closes {new Date(job.closesAt).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-cyan transition-colors mb-2">
                        {job.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">{job.summary}</p>
                    </div>
                    <Link
                      href={`/careers/${job.slug}`}
                      className="flex-shrink-0 px-5 py-2.5 rounded-full bg-brand-navy text-white
                                 text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy
                                 transition-colors whitespace-nowrap"
                    >
                      View &amp; Apply →
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
            <p className="font-semibold text-brand-navy mb-1">Already applied?</p>
            <p className="text-slate-500 text-sm">Track the status of your application with your reference number.</p>
          </div>
          <Link
            href="/careers/track"
            className="flex-shrink-0 px-6 py-2.5 rounded-full border-2 border-brand-navy text-brand-navy
                       text-sm font-bold hover:bg-brand-navy hover:text-white transition-colors"
          >
            Track My Application
          </Link>
        </div>
      </section>

      {/* Spontaneous Application */}
      <section id="spontaneous" className="py-16 px-4 bg-brand-navy text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-3">Open Application</p>
          <h2 className="text-2xl font-bold mb-4">Don&apos;t see your role listed?</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            We&apos;re always looking for talented people. Send us your CV and tell us how you can contribute to Chabrin Agencies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${siteConfig.contact.careersEmail}?subject=Spontaneous%20Application`}
              className="px-8 py-3.5 rounded-full bg-brand-cyan text-brand-navy font-bold text-sm hover:bg-white transition-colors"
            >
              Email Your CV
            </a>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-bold text-sm hover:border-brand-cyan hover:text-brand-cyan transition-colors"
            >
              Contact Us
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
