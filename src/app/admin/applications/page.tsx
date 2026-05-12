import Link from "next/link";
import { listAdminApplications, getApplicationSummary } from "@/db/queries/applications";
import { listAllJobs } from "@/db/queries/jobs";

const STAGE_COLOURS: Record<string, string> = {
  applied:              "bg-slate-100 text-slate-600",
  reviewing:            "bg-blue-100 text-blue-700",
  shortlisted:          "bg-green-100 text-green-700",
  interview_scheduled:  "bg-indigo-100 text-indigo-700",
  interviewed:          "bg-purple-100 text-purple-700",
  offer_extended:       "bg-amber-100 text-amber-700",
  offer_accepted:       "bg-teal-100 text-teal-700",
  offer_declined:       "bg-orange-100 text-orange-700",
  hired:                "bg-emerald-100 text-emerald-700",
  rejected:             "bg-rose-100 text-rose-600",
  waiting_list:         "bg-violet-100 text-violet-700",
};

const STAGE_LABELS: Record<string, string> = {
  applied:             "Applied",
  reviewing:           "Reviewing",
  shortlisted:         "Shortlisted",
  interview_scheduled: "Interview Scheduled",
  interviewed:         "Interviewed",
  offer_extended:      "Offer Extended",
  offer_accepted:      "Offer Accepted",
  offer_declined:      "Offer Declined",
  hired:               "Hired",
  rejected:            "Rejected",
  waiting_list:        "Waiting List",
};

interface PageProps {
  searchParams: Promise<{ job_id?: string; stage?: string; search?: string; page?: string }>;
}

export default async function AdminApplicationsPage({ searchParams }: PageProps) {
  const params  = await searchParams;
  const job_slug = params.job_id  || undefined; // param name kept for URL compat
  const stage   = params.stage  || undefined;
  const search  = params.search || undefined;
  const page    = parseInt(params.page ?? "1", 10);

  const [{ applications, total }, summary, jobs] = await Promise.all([
    listAdminApplications({ job_slug, stage, search, page }),
    getApplicationSummary(),
    listAllJobs(),
  ]);

  const totalPages = Math.ceil(total / 30);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Applications", value: summary.total,        colour: "text-brand-navy" },
          { label: "New Today",          value: summary.new_today,    colour: "text-brand-cyan" },
          { label: "Active Pipeline",    value: summary.shortlisted,  colour: "text-indigo-600" },
          { label: "Waiting List",       value: summary.waiting_list, colour: "text-violet-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.colour}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <form method="GET" className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3">
        <select name="job_id" defaultValue={job_slug ?? ""}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20">
          <option value="">All Jobs</option>
          {jobs.map(j => <option key={j.slug} value={j.slug}>{j.title}</option>)}
        </select>

        <select name="stage" defaultValue={stage ?? ""}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20">
          <option value="">All Stages</option>
          {Object.entries(STAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <input name="search" defaultValue={search ?? ""} placeholder="Search name / email / ref…"
          className="flex-1 min-w-40 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 placeholder:text-slate-400" />

        <button type="submit"
          className="px-5 py-2 rounded-xl bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors">
          Filter
        </button>

        <Link href="/admin/applications"
          className="px-5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          Clear
        </Link>
      </form>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">{total} application{total !== 1 ? "s" : ""}</p>
        <Link href="/admin/jobs"
          className="text-sm font-semibold text-brand-cyan hover:text-brand-navy transition-colors">
          Manage Jobs →
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-4 py-3 font-semibold text-slate-600">Reference</th>
                <th className="px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Candidate</th>
                <th className="px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Position</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Stage</th>
                <th className="px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Applied</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{app.reference}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="font-semibold text-brand-navy">{app.full_name}</p>
                    <p className="text-xs text-slate-500">{app.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs hidden md:table-cell">{app.job_title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STAGE_COLOURS[app.stage] ?? "bg-slate-100 text-slate-500"}`}>
                      {STAGE_LABELS[app.stage] ?? app.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell">
                    {new Date(app.submitted_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/applications/${app.reference}`}
                      className="text-xs font-semibold text-brand-cyan hover:text-brand-navy transition-colors">
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-3xl mb-2">📋</p>
            <p className="font-semibold">No applications found</p>
            <p className="text-sm mt-1">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={{ query: { ...params, page: String(p) } }}
              className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-colors
                ${p === page ? "bg-brand-navy text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
