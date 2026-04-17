"use client";

import { useActionState } from "react";
import { adminCreateJob } from "@/actions/admin-ats";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const DEPARTMENTS = ["Operations", "Administration", "Finance", "IT & Systems", "Marketing", "Management"];
const JOB_TYPES   = ["Full-time", "Part-time", "Contract", "Internship"];
const STATUSES    = ["draft", "open", "closed", "paused"] as const;

export default function NewJobPage() {
  const router = useRouter();
  const [state, action, pending] = useActionState<Record<string, unknown>, FormData>(adminCreateJob, {});

  useEffect(() => {
    if (state.success && state.id) {
      router.push(`/admin/jobs/${state.id}?created=1`);
    }
  }, [state, router]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href="/admin/jobs" className="hover:text-brand-navy transition-colors">Jobs</Link>
        <span>/</span>
        <span className="text-brand-navy">New Job</span>
      </nav>

      <h1 className="text-xl font-bold text-brand-navy mb-6">Create Job Posting</h1>

      <form action={action} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-brand-navy text-sm uppercase tracking-wider">Basic Info</h2>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Title <span className="text-rose-500">*</span></label>
            <input name="title" required placeholder="e.g. Property Manager"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department <span className="text-rose-500">*</span></label>
              <select name="department" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy bg-white">
                <option value="">Select…</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Type</label>
              <select name="job_type" defaultValue="Full-time" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy bg-white">
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
              <input name="location" defaultValue="Nairobi (On-site)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Salary Range</label>
              <input name="salary_range" placeholder="e.g. KES 60,000–80,000/month"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy placeholder:text-slate-400" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
              <select name="status" defaultValue="draft" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy bg-white">
                {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Closing Date</label>
              <input name="closes_at" type="date"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-brand-navy text-sm uppercase tracking-wider">Content</h2>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">One-line Summary <span className="text-rose-500">*</span></label>
            <input name="summary" required placeholder="Brief summary shown on the careers listing page"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy placeholder:text-slate-400" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Description <span className="text-rose-500">*</span></label>
            <p className="text-xs text-slate-500 mb-1.5">Use ## for headings, - for bullet points. Separate sections with blank lines.</p>
            <textarea name="description" required rows={10}
              placeholder={"## About the Role\n\nDescribe the role...\n\n## Responsibilities\n\n- Task one\n- Task two\n\n## What We Offer\n\n- Benefit one"}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy placeholder:text-slate-400 placeholder:font-sans" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Requirements</label>
            <p className="text-xs text-slate-500 mb-1.5">One requirement per line.</p>
            <textarea name="requirements" rows={5}
              placeholder={"Diploma in Real Estate or related field\n2+ years experience\nValid driving licence"}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy placeholder:text-slate-400" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nice to Have</label>
            <p className="text-xs text-slate-500 mb-1.5">One item per line.</p>
            <textarea name="nice_to_have" rows={3}
              placeholder={"EARB or ISK membership\nExperience with property management software"}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy placeholder:text-slate-400" />
          </div>
        </div>

        {typeof state.error === "string" && Boolean(state.error) && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">{String(state.error)}</div>
        )}

        <div className="flex gap-3">
          <Link href="/admin/jobs" className="px-6 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={pending}
            className="flex-1 py-2.5 rounded-full bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors disabled:opacity-60">
            {pending ? "Creating…" : "Create Job Posting"}
          </button>
        </div>
      </form>
    </div>
  );
}
