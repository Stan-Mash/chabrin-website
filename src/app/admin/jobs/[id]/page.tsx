"use client";

import { useActionState, useEffect, useState } from "react";
import { adminUpdateJob } from "@/actions/admin-ats";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

const DEPARTMENTS = ["Operations", "Administration", "Finance", "IT & Systems", "Marketing", "Management"];
const JOB_TYPES   = ["Full-time", "Part-time", "Contract", "Internship"];
const STATUSES    = ["draft", "open", "closed", "paused"] as const;

interface Job {
  id: string; slug: string; title: string; department: string; job_type: string;
  location: string; summary: string; description: string; requirements: string[];
  nice_to_have: string[]; salary_range: string | null; status: string;
  closes_at: string | null; created_at: string;
}

export default function EditJobPage() {
  const { id }        = useParams<{ id: string }>();
  const searchParams  = useSearchParams();
  const justCreated   = searchParams.get("created") === "1";

  const [job, setJob]         = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, action, pending] = useActionState<Record<string, unknown>, FormData>(adminUpdateJob, {});

  useEffect(() => {
    fetch(`/api/admin/job?id=${encodeURIComponent(id)}`)
      .then(r => r.json())
      .then(j => { setJob(j); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-slate-500 text-sm">Loading…</div>;
  if (!job)    return <div className="p-8 text-rose-600 text-sm">Job not found.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href="/admin/jobs" className="hover:text-brand-navy transition-colors">Jobs</Link>
        <span>/</span>
        <span className="text-brand-navy">{job.title}</span>
      </nav>

      {Boolean(justCreated) && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 mb-5">
          ✅ Job created successfully! You can edit the details below.
        </div>
      )}
      {Boolean(state.success) && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 mb-5">
          ✅ Job updated successfully.
        </div>
      )}

      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-brand-navy">Edit: {job.title}</h1>
        <Link
          href={`/admin/applications?job_id=${job.id}`}
          className="text-sm font-semibold text-brand-cyan hover:text-brand-navy transition-colors"
        >
          View Applications →
        </Link>
      </div>

      <form action={action} className="space-y-6">
        <input type="hidden" name="id" value={job.id} />

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-brand-navy text-sm uppercase tracking-wider">Basic Info</h2>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Title</label>
            <input name="title" defaultValue={job.title}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department</label>
              <select name="department" defaultValue={job.department} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy bg-white">
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Type</label>
              <select name="job_type" defaultValue={job.job_type} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy bg-white">
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
              <input name="location" defaultValue={job.location}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Salary Range</label>
              <input name="salary_range" defaultValue={job.salary_range ?? ""}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy placeholder:text-slate-400" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
              <select name="status" defaultValue={job.status} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy bg-white">
                {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Closing Date</label>
              <input name="closes_at" type="date"
                defaultValue={job.closes_at ? new Date(job.closes_at).toISOString().split("T")[0] : ""}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-brand-navy text-sm uppercase tracking-wider">Content</h2>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">One-line Summary</label>
            <input name="summary" defaultValue={job.summary}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Description</label>
            <textarea name="description" rows={12} defaultValue={job.description}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Requirements</label>
            <p className="text-xs text-slate-500 mb-1.5">One per line.</p>
            <textarea name="requirements" rows={5} defaultValue={(job.requirements ?? []).join("\n")}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nice to Have</label>
            <textarea name="nice_to_have" rows={3} defaultValue={(job.nice_to_have ?? []).join("\n")}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
          </div>
        </div>

        {typeof state.error === "string" && Boolean(state.error) && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">{String(state.error)}</div>
        )}

        <div className="flex gap-3">
          <Link href="/admin/jobs" className="px-6 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Back
          </Link>
          <button type="submit" disabled={pending}
            className="flex-1 py-2.5 rounded-full bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors disabled:opacity-60">
            {pending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
