"use client";

import { useEffect, useActionState, useState } from "react";
import { useParams } from "next/navigation";
import { adminUpdateApplication } from "@/actions/admin-ats";
import Link from "next/link";
import type { ApplicationWithJob } from "@/db/queries/applications";

const STAGES = [
  { key: "applied",             label: "Applied" },
  { key: "reviewing",           label: "Reviewing" },
  { key: "shortlisted",         label: "Shortlisted" },
  { key: "interview_scheduled", label: "Interview Scheduled" },
  { key: "interviewed",         label: "Interviewed" },
  { key: "offer_extended",      label: "Offer Extended" },
  { key: "hired",               label: "Hired" },
  { key: "rejected",            label: "Rejected" },
] as const;

const STAGE_COLOURS: Record<string, string> = {
  applied:             "bg-slate-100 text-slate-600",
  reviewing:           "bg-blue-100 text-blue-700",
  shortlisted:         "bg-green-100 text-green-700",
  interview_scheduled: "bg-indigo-100 text-indigo-700",
  interviewed:         "bg-purple-100 text-purple-700",
  offer_extended:      "bg-amber-100 text-amber-700",
  hired:               "bg-emerald-100 text-emerald-700",
  rejected:            "bg-rose-100 text-rose-600",
};

export default function ApplicationDetailPage() {
  const { ref }  = useParams<{ ref: string }>();
  const [app, setApp] = useState<ApplicationWithJob | null>(null);
  const [loading, setLoading] = useState(true);

  const [state, action, pending] = useActionState<Record<string, unknown>, FormData>(adminUpdateApplication, {});

  const fetchApp = () => {
    setLoading(true);
    fetch(`/api/admin/application?ref=${encodeURIComponent(ref)}`)
      .then(r => r.json())
      .then(d => { setApp(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchApp(); }, [ref]);

  useEffect(() => {
    if (state.success) fetchApp();
  }, [state]);

  if (loading) return <div className="p-8 text-slate-500 text-sm">Loading…</div>;
  if (!app)    return <div className="p-8 text-rose-600 text-sm">Application not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href="/admin/applications" className="hover:text-brand-navy transition-colors">Applications</Link>
        <span>/</span>
        <span className="text-brand-navy font-mono">{app.reference}</span>
      </nav>

      {Boolean(state.success) && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 mb-5">
          ✅ Application updated. Candidate has been notified by email if the stage changed.
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">

        {/* Left — details */}
        <div className="space-y-6">

          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-mono text-xs text-slate-500 mb-1">{app.reference}</p>
                <h1 className="text-xl font-bold text-brand-navy">{app.full_name}</h1>
                <p className="text-sm text-slate-600 mt-0.5">{app.job_title} · {app.job_department}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STAGE_COLOURS[app.stage] ?? "bg-slate-100 text-slate-500"}`}>
                {STAGES.find(s => s.key === app.stage)?.label ?? app.stage}
              </span>
            </div>

            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex justify-between sm:flex-col gap-1">
                <dt className="text-slate-500 text-xs">Email</dt>
                <dd><a href={`mailto:${app.email}`} className="font-semibold text-brand-navy hover:text-brand-cyan transition-colors">{app.email}</a></dd>
              </div>
              <div className="flex justify-between sm:flex-col gap-1">
                <dt className="text-slate-500 text-xs">Phone</dt>
                <dd><a href={`tel:${app.phone}`} className="font-semibold text-brand-navy hover:text-brand-cyan transition-colors">{app.phone}</a></dd>
              </div>
              {app.linkedin_url && (
                <div className="flex justify-between sm:flex-col gap-1">
                  <dt className="text-slate-500 text-xs">LinkedIn</dt>
                  <dd><a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-cyan hover:underline truncate block max-w-48">View Profile</a></dd>
                </div>
              )}
              <div className="flex justify-between sm:flex-col gap-1">
                <dt className="text-slate-500 text-xs">Applied</dt>
                <dd className="font-semibold text-brand-navy">{new Date(app.submitted_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</dd>
              </div>
              {app.source && (
                <div className="flex justify-between sm:flex-col gap-1">
                  <dt className="text-slate-500 text-xs">Source</dt>
                  <dd className="font-semibold text-brand-navy">{app.source}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* CV + Cover Letter */}
          {(app.cv_url || app.cover_letter) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              {app.cv_url && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">CV / Resume</p>
                  <a href={app.cv_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors">
                    📎 Download CV
                  </a>
                </div>
              )}
              {app.cover_letter && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cover Letter</p>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {app.cover_letter}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Screening answers */}
          {app.answers && Object.keys(app.answers).length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Screening Answers</p>
              <dl className="space-y-3">
                {Object.entries(app.answers).map(([q, a]) => (
                  <div key={q} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <dt className="text-sm text-slate-500 mb-1">{q}</dt>
                    <dd className="text-sm font-semibold text-brand-navy">{a || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* AI summary */}
          {app.ai_summary && (
            <AiSummaryPanel summary={app.ai_summary as AiSummary} />
          )}

          {/* CV upload pending notice */}
          {!app.cv_url && app.cv_upload_token && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">CV Upload Pending</p>
              <p className="text-sm text-blue-700">A signed upload link was sent to the candidate. Waiting for their CV submission.</p>
            </div>
          )}

          {/* Internal notes */}
          {app.internal_notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Internal Notes (staff only)</p>
              <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">{app.internal_notes}</p>
            </div>
          )}

        </div>

        {/* Right — Actions */}
        <div className="mt-6 lg:mt-0 space-y-4">

          {/* Quick contact */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Contact</p>
            <div className="space-y-2">
              <a href={`https://wa.me/${app.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${app.full_name}, this is the HR team at Chabrin Agencies regarding your application reference ${app.reference}.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors">
                💬 WhatsApp
              </a>
              <a href={`mailto:${app.email}?subject=Your application — ${app.job_title} (${app.reference})`}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-brand-navy hover:bg-slate-50 transition-colors">
                ✉️ Email Candidate
              </a>
            </div>
          </div>

          {/* Update stage */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Update Application</p>
            <form action={action} className="space-y-3">
              <input type="hidden" name="reference" value={app.reference} />

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Pipeline Stage</label>
                <select name="stage" defaultValue={app.stage}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20">
                  {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Message to Candidate
                  <span className="font-normal text-slate-400 ml-1">(sent by email on stage change)</span>
                </label>
                <textarea name="stage_note" rows={3}
                  placeholder="e.g. We'd like to schedule an interview. Please expect a call from us shortly."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-navy/20 placeholder:text-slate-400" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Internal Notes
                  <span className="font-normal text-slate-400 ml-1">(staff only, never emailed)</span>
                </label>
                <textarea name="internal_notes" rows={3} defaultValue={app.internal_notes ?? ""}
                  placeholder="e.g. Strong candidate, very articulate. Schedule for Mon/Tue."
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-slate-400" />
              </div>

              {typeof state.error === "string" && Boolean(state.error) && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{String(state.error)}</p>
              )}

              <button type="submit" disabled={pending}
                className="w-full py-2.5 rounded-full bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors disabled:opacity-60">
                {pending ? "Saving…" : "Save Update"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── AI Summary panel ──────────────────────────────────────────────────────────

interface AiSummary {
  summary?:             string;
  years_experience?:    number | null;
  education?:           string[];
  key_skills?:          string[];
  previous_employers?:  string[];
  kenya_experience?:    boolean;
  property_experience?: boolean;
  driving_licence?:     boolean | null;
  languages?:           string[];
  red_flags?:           string[];
  hire_recommendation?: "strong_yes" | "yes" | "maybe" | "no";
  hire_notes?:          string;
}

const RECOMMEND_STYLES: Record<string, string> = {
  strong_yes: "bg-emerald-100 text-emerald-800",
  yes:        "bg-green-100 text-green-700",
  maybe:      "bg-amber-100 text-amber-700",
  no:         "bg-rose-100 text-rose-700",
};
const RECOMMEND_LABELS: Record<string, string> = {
  strong_yes: "Strong Yes",
  yes:        "Yes",
  maybe:      "Maybe",
  no:         "No",
};

function AiSummaryPanel({ summary: s }: { summary: AiSummary }) {
  const rec = s.hire_recommendation ?? "maybe";
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          ✨ AI CV Analysis
        </p>
        {s.hire_recommendation && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${RECOMMEND_STYLES[rec] ?? "bg-slate-100 text-slate-600"}`}>
            Hire: {RECOMMEND_LABELS[rec] ?? rec}
          </span>
        )}
      </div>

      {s.summary && (
        <p className="text-sm text-slate-700 leading-relaxed mb-4">{s.summary}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-3 text-xs mb-4">
        {s.years_experience !== undefined && s.years_experience !== null && (
          <Chip label="Experience" value={`${s.years_experience} yr${s.years_experience !== 1 ? "s" : ""}`} />
        )}
        {s.kenya_experience !== undefined && (
          <Chip label="Kenya exp." value={s.kenya_experience ? "Yes" : "No"} ok={s.kenya_experience} />
        )}
        {s.property_experience !== undefined && (
          <Chip label="Property exp." value={s.property_experience ? "Yes" : "No"} ok={s.property_experience} />
        )}
        {s.driving_licence !== undefined && s.driving_licence !== null && (
          <Chip label="Driving licence" value={s.driving_licence ? "Yes" : "No"} ok={s.driving_licence} />
        )}
      </div>

      {s.key_skills && s.key_skills.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-500 mb-1.5">Key Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {s.key_skills.map((sk) => (
              <span key={sk} className="text-xs bg-brand-navy/10 text-brand-navy px-2 py-0.5 rounded-full">{sk}</span>
            ))}
          </div>
        </div>
      )}

      {s.education && s.education.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-500 mb-1">Education</p>
          {s.education.map((e) => <p key={e} className="text-xs text-slate-700">{e}</p>)}
        </div>
      )}

      {s.previous_employers && s.previous_employers.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-500 mb-1">Previous Employers</p>
          {s.previous_employers.map((e) => <p key={e} className="text-xs text-slate-700">{e}</p>)}
        </div>
      )}

      {s.red_flags && s.red_flags.length > 0 && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 mb-3">
          <p className="text-xs font-semibold text-rose-700 mb-1">Red Flags</p>
          {s.red_flags.map((f) => (
            <p key={f} className="text-xs text-rose-700">• {f}</p>
          ))}
        </div>
      )}

      {s.hire_notes && (
        <p className="text-xs text-slate-500 italic border-t border-slate-100 pt-3">{s.hire_notes}</p>
      )}
    </div>
  );
}

function Chip({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-3 py-1.5 rounded-lg border ${
      ok === true ? "bg-green-50 border-green-200" :
      ok === false ? "bg-rose-50 border-rose-200" :
      "bg-slate-50 border-slate-100"
    }`}>
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold ${ok === true ? "text-green-700" : ok === false ? "text-rose-600" : "text-slate-700"}`}>{value}</span>
    </div>
  );
}
