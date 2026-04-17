import Link from "next/link";
import { listAllJobs } from "@/db/queries/jobs";

const STATUS_COLOURS: Record<string, string> = {
  open:   "bg-green-100 text-green-700",
  closed: "bg-slate-100 text-slate-500",
  draft:  "bg-amber-100 text-amber-700",
  paused: "bg-orange-100 text-orange-600",
};

export default async function AdminJobsPage() {
  const jobs = await listAllJobs().catch(() => []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-brand-navy">Job Postings</h1>
          <p className="text-sm text-slate-500">{jobs.length} total</p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="px-5 py-2.5 rounded-full bg-brand-navy text-white text-sm font-bold
                     hover:bg-brand-cyan hover:text-brand-navy transition-colors"
        >
          + New Job
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left">
              <th className="px-4 py-3 font-semibold text-slate-600">Job Title</th>
              <th className="px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Department</th>
              <th className="px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Apps</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
              <th className="px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Posted</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-brand-navy">{job.title}</td>
                <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{job.department}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <Link
                    href={`/admin/applications?job_id=${job.id}`}
                    className="font-bold text-brand-navy hover:text-brand-cyan transition-colors"
                  >
                    {job.application_count}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOURS[job.status] ?? "bg-slate-100 text-slate-500"}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                  {new Date(job.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="text-xs font-semibold text-brand-cyan hover:text-brand-navy transition-colors"
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-3xl mb-2">💼</p>
            <p className="font-semibold">No jobs yet</p>
            <p className="text-sm mt-1">Create your first job posting above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
