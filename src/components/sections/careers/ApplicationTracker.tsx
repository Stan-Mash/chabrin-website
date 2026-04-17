"use client";

import { useState } from "react";
import type { PublicAppStatus } from "@/db/queries/applications";

const STAGES = [
  { key: "applied",              label: "Applied",            icon: "📩" },
  { key: "reviewing",            label: "Under Review",       icon: "👁️" },
  { key: "shortlisted",          label: "Shortlisted",        icon: "✅" },
  { key: "interview_scheduled",  label: "Interview Scheduled", icon: "📅" },
  { key: "interviewed",          label: "Interviewed",        icon: "🎙️" },
  { key: "offer_extended",       label: "Offer Extended",     icon: "🎉" },
  { key: "hired",                label: "Hired",              icon: "🏆" },
] as const;

const STAGE_ORDER = STAGES.map(s => s.key);
const REJECTED_KEY = "rejected";

export default function ApplicationTracker() {
  const [ref, setRef]         = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [status, setStatus]   = useState<PublicAppStatus | null>(null);

  const lookup = async () => {
    const trimmed = ref.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const res = await fetch(`/api/applications/status?ref=${encodeURIComponent(trimmed)}`);
      if (res.status === 404) {
        setError("No application found with that reference. Please check and try again.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      const data = await res.json() as PublicAppStatus;
      setStatus(data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    }
    setLoading(false);
  };

  const currentIdx = status
    ? status.stage === REJECTED_KEY
      ? -1
      : STAGE_ORDER.indexOf(status.stage as typeof STAGE_ORDER[number])
    : -1;

  return (
    <div className="space-y-6">
      {/* Lookup input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Application Reference Number
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder="e.g. APP-OPS-2025-AB3K7"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono uppercase
                       focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy
                       placeholder:text-slate-400 placeholder:normal-case placeholder:font-sans"
          />
          <button
            onClick={lookup}
            disabled={loading || !ref.trim()}
            className="px-6 py-2.5 rounded-xl bg-brand-navy text-white text-sm font-bold
                       hover:bg-brand-cyan hover:text-brand-navy transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "…" : "Check Status"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          Your reference number was emailed to you when you applied. Format: APP-XXX-YYYY-XXXXX
        </p>
      </div>

      {/* Status display */}
      {status && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-brand-navy text-white px-6 py-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Application for</p>
            <h3 className="font-bold text-lg">{status.job_title}</h3>
            <p className="text-sm text-slate-300 mt-0.5">Ref: {status.reference}</p>
          </div>

          <div className="p-6">
            {/* Rejected state */}
            {status.stage === REJECTED_KEY ? (
              <div className="text-center py-6">
                <p className="text-5xl mb-3">📋</p>
                <p className="font-bold text-brand-navy text-lg mb-2">Application Outcome</p>
                <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
                  We have reviewed your application and unfortunately will not be proceeding at this time.
                  We appreciate your interest in Chabrin Agencies and encourage you to apply for future positions.
                </p>
                <a
                  href="/careers"
                  className="mt-4 inline-block px-5 py-2 rounded-full bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors"
                >
                  View Open Positions
                </a>
              </div>
            ) : (
              <>
                {/* Progress pipeline */}
                <div className="mb-8">
                  <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200" />
                    <div
                      className="absolute top-5 left-0 h-0.5 bg-brand-cyan transition-all duration-500"
                      style={{ width: currentIdx >= 0 ? `${(currentIdx / (STAGES.length - 1)) * 100}%` : "0%" }}
                    />

                    <div className="relative flex justify-between">
                      {STAGES.map((stage, idx) => {
                        const isPast    = idx < currentIdx;
                        const isCurrent = idx === currentIdx;
                        const isFuture  = idx > currentIdx;
                        return (
                          <div key={stage.key} className="flex flex-col items-center gap-1.5" style={{ width: `${100 / STAGES.length}%` }}>
                            <div className={`
                              w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm transition-all z-10
                              ${isPast    ? "bg-brand-cyan border-brand-cyan"          : ""}
                              ${isCurrent ? "bg-brand-navy border-brand-navy ring-4 ring-brand-navy/20" : ""}
                              ${isFuture  ? "bg-white border-slate-200"               : ""}
                            `}>
                              {isPast
                                ? <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                : <span className={isFuture ? "text-slate-300" : ""}>{stage.icon}</span>
                              }
                            </div>
                            <span className={`text-xs font-semibold text-center leading-tight hidden sm:block
                              ${isCurrent ? "text-brand-navy" : isPast ? "text-brand-cyan" : "text-slate-400"}
                            `}>
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Current status callout */}
                <div className="bg-brand-navy/5 border border-brand-navy/10 rounded-xl p-4 text-center mb-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Status</p>
                  <p className="text-xl font-black text-brand-navy">
                    {STAGES.find(s => s.key === status.stage)?.label ?? status.stage}
                  </p>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-0.5">Applied</p>
                    <p className="font-semibold text-brand-navy text-xs">
                      {new Date(status.submitted_at).toLocaleDateString("en-KE", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-0.5">Last Updated</p>
                    <p className="font-semibold text-brand-navy text-xs">
                      {new Date(status.updated_at).toLocaleDateString("en-KE", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 pt-1">
            <p className="text-xs text-slate-500">
              Questions? Email{" "}
              <a href="mailto:careers@chabrinagencies.co.ke" className="text-brand-navy font-semibold hover:underline">
                careers@chabrinagencies.co.ke
              </a>
              {" "}with your reference number.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
