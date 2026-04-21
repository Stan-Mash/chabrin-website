import Link from "next/link";
import { getAdminStats } from "@/db/queries/applications";

const SECTIONS = [
  {
    href:    "/admin/complaints",
    label:   "Complaints",
    desc:    "Review and triage customer complaints submitted via the website.",
    icon:    "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
    colour:  "bg-rose-50 text-rose-600",
    internal: true,
  },
  {
    href:    "/admin/applications",
    label:   "Applications",
    desc:    "Track job applications, move candidates through stages, send updates.",
    icon:    "M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z",
    colour:  "bg-blue-50 text-blue-600",
    internal: true,
  },
  {
    href:    "/admin/jobs",
    label:   "Job Postings",
    desc:    "Manage open positions. Opens Sanity Studio to publish or close roles.",
    icon:    "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
    colour:  "bg-amber-50 text-amber-600",
    internal: true,
  },
  {
    href:    "/admin/blog",
    label:   "Blog Posts",
    desc:    "Write and publish market insights, landlord guides, and news articles.",
    icon:    "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
    colour:  "bg-cyan-50 text-cyan-600",
    internal: true,
  },
];

export default async function AdminDashboard() {
  let stats = { total: 0, new_today: 0, pending_complaints: 0 };
  try {
    stats = await getAdminStats();
  } catch { /* DB not available */ }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-navy">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Chabrin Agencies — Staff Portal</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Applications</p>
          <p className="text-3xl font-extrabold text-brand-navy">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">New Today</p>
          <p className="text-3xl font-extrabold text-brand-cyan">{stats.new_today}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Open Complaints</p>
          <p className="text-3xl font-extrabold text-rose-500">{stats.pending_complaints}</p>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm
                       hover:shadow-md hover:border-brand-cyan/40 transition-all group"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${s.colour}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
            </div>
            <h2 className="font-bold text-brand-navy group-hover:text-brand-cyan transition-colors mb-1">
              {s.label}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
