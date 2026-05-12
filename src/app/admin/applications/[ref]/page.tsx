"use client";

import { useEffect, useActionState, useState } from "react";
import { useParams } from "next/navigation";
import { adminUpdateApplication, adminResendUploadLink } from "@/actions/admin-ats";
import Link from "next/link";
import type { ApplicationWithJob, AppEvent } from "@/db/queries/applications";

const STAGES = [
  { key: "applied",             label: "Applied" },
  { key: "reviewing",           label: "Reviewing" },
  { key: "shortlisted",         label: "Shortlisted" },
  { key: "interview_scheduled", label: "Interview Scheduled" },
  { key: "interviewed",         label: "Interviewed" },
  { key: "offer_extended",      label: "Offer Extended" },
  { key: "offer_accepted",      label: "Offer Accepted" },
  { key: "offer_declined",      label: "Offer Declined" },
  { key: "hired",               label: "Hired" },
  { key: "rejected",            label: "Rejected" },
  { key: "waiting_list",        label: "Waiting List" },
] as const;

const STAGE_COLOURS: Record<string, string> = {
  applied:             "bg-slate-100 text-slate-600",
  reviewing:           "bg-blue-100 text-blue-700",
  shortlisted:         "bg-green-100 text-green-700",
  interview_scheduled: "bg-indigo-100 text-indigo-700",
  interviewed:         "bg-purple-100 text-purple-700",
  offer_extended:      "bg-amber-100 text-amber-700",
  offer_accepted:      "bg-teal-100 text-teal-700",
  offer_declined:      "bg-orange-100 text-orange-700",
  hired:               "bg-emerald-100 text-emerald-700",
  rejected:            "bg-rose-100 text-rose-600",
  waiting_list:        "bg-violet-100 text-violet-700",
};

const STAGE_LABELS: Record<string, string> = Object.fromEntries(STAGES.map(s => [s.key, s.label]));

// ── Audit trail ───────────────────────────────────────────────────────────────

function EventTimeline({ events }: { events: AppEvent[] }) {
  if (events.length === 0) {
    return <p className="text-xs text-slate-400 italic">No events recorded yet.</p>;
  }
  return (
    <ol className="relative border-l border-slate-200 space-y-4 ml-2">
      {events.map((ev) => (
        <li key={ev.id} className="pl-4 relative">
          <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white bg-slate-300" />
          <p className="text-xs text-slate-400 mb-0.5">
            {new Date(ev.created_at).toLocaleString("en-KE", {
              day: "numeric", month: "short", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}{" "}
            &mdash; <span className="font-semibold text-slate-600">{ev.actor}</span>
          </p>
          <p className="text-xs text-slate-700 font-medium">
            {ev.stage_from ? (
              <>
                <span className="text-slate-400">{STAGE_LABELS[ev.stage_from] ?? ev.stage_from}</span>
                {" → "}
                <span className="text-brand-navy">{STAGE_LABELS[ev.stage_to] ?? ev.stage_to}</span>
              </>
            ) : (
              <span className="text-brand-navy">{STAGE_LABELS[ev.stage_to] ?? ev.stage_to}</span>
            )}
          </p>
          {ev.note && (
            <p className="text-xs text-slate-500 mt-0.5 whitespace-pre-wrap">{ev.note}</p>
          )}
        </li>
      ))}
    </ol>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ApplicationDetailPage() {
  const { ref } = useParams<{ ref: string }>();

  const [app,    setApp]    = useState<ApplicationWithJob | null>(null);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState("");

  const [state,  action,  pending]  = useActionState<Record<string, unknown>, FormData>(adminUpdateApplication, {});
  const [rState, rAction, rPending] = useActionState<Record<string, unknown>, FormData>(adminResendUploadLink, {});

  const fetchApp = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/application?ref=${encodeURIComponent(ref)}`).then(r => r.json()),
      fetch(`/api/admin/app-events?ref=${encodeURIComponent(ref)}`).then(r => r.json()),
    ])
      .then(([appData, eventsData]) => {
        setApp(appData);
        setSelectedStage(appData?.stage ?? "");
        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchApp(); }, [ref]);
  useEffect(() => { if (state.success) fetchApp(); }, [state]);
  useEffect(() => { if (rState.success) fetchApp(); }, [rState]);

  if (loading) return <div className="p-8 text-slate-500 text-sm">Loading&hellip;</div>;
  if (!app)    return <div className="p-8 text-rose-600 text-sm">Application not found.</div>;

  const isInterview = selectedStage === "interview_scheduled";
  const isRejected  = selectedStage === "rejected";

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
          &#10003; Application updated. Candidate has been notified by email if the stage changed.
        </div>
      )}
      {Boolean(rState.success) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700 mb-5">
          &#10003; CV upload link sent to candidate.
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
                <p className="text-sm text-slate-600 mt-0.5">{app.job_title} &middot; {app.job_department}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STAGE_COLOURS[app.stage] ?? "bg-slate-100 text-slate-500"}`}>
                {STAGE_LABELS[app.stage] ?? app.stage}
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
                <dd className="font-semibold text-brand-navy">
                  {new Date(app.submitted_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
                </dd>
              </div>
              {app.interview_at && (
                <div className="flex justify-between sm:flex-col gap-1">
                  <dt className="text-slate-500 text-xs">Interview</dt>
                  <dd className="font-semibold text-indigo-600">
                    {new Date(app.interview_at).toLocaleString("en-KE", {
                      day: "numeric", month: "long", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                      timeZone: "Africa/Nairobi",
                    })} EAT
                  </dd>
                </div>
              )}
              {app.meet_link && (
                <div className="flex justify-between sm:flex-col gap-1 sm:col-span-2">
                  <dt className="text-slate-500 text-xs">Google Meet</dt>
                  <dd>
                    <a
                      href={app.meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1a73e8] hover:bg-[#1558b0] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      &#127909; Join Meeting
                    </a>
                  </dd>
                </div>
              )}
              {app.source && (
                <div className="flex justify-between sm:flex-col gap-1">
                  <dt className="text-slate-500 text-xs">Source</dt>
                  <dd className="font-semibold text-brand-navy">{app.source}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* CV + Documents + Cover Letter */}
          {(app.cv_url || (app.documents && app.documents.length > 0) || app.cover_letter) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              {app.cv_url && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">CV / Resume</p>
                  <a href={app.cv_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors">
                    &#128206; Download CV
                  </a>
                </div>
              )}
              {app.documents && app.documents.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Academic &amp; Supporting Documents
                  </p>
                  <ul className="space-y-2">
                    {app.documents.map((doc, i) => {
                      const ext = doc.name.split(".").pop()?.toLowerCase() ?? "";
                      const icon = ext === "pdf" ? "📄" : ["doc", "docx"].includes(ext) ? "📝" : "🖼️";
                      const sizeKb = Math.round(doc.size / 1024);
                      return (
                        <li key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50">
                          <span className="text-lg leading-none">{icon}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-brand-navy truncate">{doc.name}</p>
                            <p className="text-xs text-slate-400">{sizeKb} KB</p>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-xs font-bold text-brand-navy hover:text-brand-cyan transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-cyan"
                          >
                            Open
                          </a>
                        </li>
                      );
                    })}
                  </ul>
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
                    <dd className="text-sm font-semibold text-brand-navy">{String(a) || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* AI summary */}
          {app.ai_summary && (
            <AiSummaryPanel summary={app.ai_summary as AiSummary} />
          )}

          {/* CV upload pending + resend button */}
          {!app.cv_url && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                {app.cv_upload_token ? "CV Upload Pending" : "No CV Uploaded"}
              </p>
              <p className="text-sm text-blue-700 mb-3">
                {app.cv_upload_token
                  ? "A signed upload link was sent to the candidate. Waiting for their CV submission."
                  : "The candidate has not submitted a CV. Send them a secure upload link."}
              </p>
              {typeof rState.error === "string" && rState.error && (
                <p className="text-xs text-rose-600 mb-2">{rState.error}</p>
              )}
              <form action={rAction}>
                <input type="hidden" name="reference" value={app.reference} />
                <button
                  type="submit"
                  disabled={rPending}
                  className="px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold
                             hover:bg-blue-800 transition-colors disabled:opacity-60"
                >
                  {rPending ? "Sending…" : app.cv_upload_token ? "Resend Upload Link" : "Send Upload Link"}
                </button>
              </form>
            </div>
          )}

          {/* Rejection reason (staff-only record) */}
          {app.rejection_reason && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
              <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2">
                Rejection Reason (staff only)
              </p>
              <p className="text-sm text-rose-900 whitespace-pre-wrap leading-relaxed">{app.rejection_reason}</p>
            </div>
          )}

          {/* Internal notes */}
          {app.internal_notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Internal Notes (staff only)</p>
              <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">{app.internal_notes}</p>
            </div>
          )}

          {/* Audit trail */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Activity Log</p>
            <EventTimeline events={events} />
          </div>

        </div>

        {/* Right — Actions */}
        <div className="mt-6 lg:mt-0 space-y-4">

          {/* Quick contact */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Contact</p>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${app.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${app.full_name}, this is the HR team at Chabrin Agencies regarding your application reference ${app.reference}.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors">
                &#128172; WhatsApp
              </a>
              <a
                href={`mailto:${app.email}?subject=Your application — ${app.job_title} (${app.reference})`}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-brand-navy hover:bg-slate-50 transition-colors">
                &#9993; Email Candidate
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
                <select
                  name="stage"
                  defaultValue={app.stage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                >
                  {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>

              {/* Interview scheduling fields — only shown when interview_scheduled is selected */}
              {isInterview && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Interview Date &amp; Time
                      <span className="font-normal text-slate-400 ml-1">(sent to candidate)</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="interview_at"
                      defaultValue={app.interview_at
                        ? new Date(app.interview_at).toISOString().slice(0, 16)
                        : ""}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Google Meet Link
                      <span className="font-normal text-slate-400 ml-1">(paste from Google Calendar)</span>
                    </label>
                    <input
                      type="url"
                      name="meet_link"
                      defaultValue={app.meet_link ?? ""}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Create a meeting in Google Calendar, copy the Meet link, paste it here.
                    </p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Message to Candidate
                  <span className="font-normal text-slate-400 ml-1">(sent by email on stage change)</span>
                </label>
                <textarea
                  name="stage_note"
                  rows={3}
                  placeholder="e.g. We&#39;d like to schedule an interview. Please expect a call from us shortly."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-navy/20 placeholder:text-slate-400"
                />
              </div>

              {/* Rejection reason — only shown for rejected stage */}
              {isRejected && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Rejection Reason
                    <span className="font-normal text-slate-400 ml-1">(internal record only — never sent to candidate)</span>
                  </label>
                  <textarea
                    name="rejection_reason"
                    rows={2}
                    placeholder="e.g. Insufficient experience for the seniority level required."
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-300 placeholder:text-slate-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Add Internal Note
                  <span className="font-normal text-slate-400 ml-1">(staff only, appended to history)</span>
                </label>
                <textarea
                  name="internal_notes"
                  rows={3}
                  placeholder="e.g. Strong candidate, very articulate. Schedule for Mon/Tue."
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-slate-400"
                />
              </div>

              {typeof state.error === "string" && Boolean(state.error) && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{String(state.error)}</p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full py-2.5 rounded-full bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors disabled:opacity-60"
              >
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
          &#10024; AI CV Analysis
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
        {s.years_experience != null && (
          <Chip label="Experience" value={`${s.years_experience} yr${s.years_experience !== 1 ? "s" : ""}`} />
        )}
        {s.kenya_experience !== undefined && (
          <Chip label="Kenya exp." value={s.kenya_experience ? "Yes" : "No"} ok={s.kenya_experience} />
        )}
        {s.property_experience !== undefined && (
          <Chip label="Property exp." value={s.property_experience ? "Yes" : "No"} ok={s.property_experience} />
        )}
        {s.driving_licence != null && (
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
            <p key={f} className="text-xs text-rose-700">&#8226; {f}</p>
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
      ok === true  ? "bg-green-50 border-green-200" :
      ok === false ? "bg-rose-50 border-rose-200"   :
                     "bg-slate-50 border-slate-100"
    }`}>
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold ${ok === true ? "text-green-700" : ok === false ? "text-rose-600" : "text-slate-700"}`}>{value}</span>
    </div>
  );
}
