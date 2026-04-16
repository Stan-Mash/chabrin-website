"use client";

import { useState } from "react";

// ── Status pipeline display ───────────────────────────────────────────────────

const STATUS_STEPS = [
  { key: "submitted",    label: "Submitted",    description: "Your complaint has been logged." },
  { key: "acknowledged", label: "Acknowledged", description: "A team member has reviewed your complaint." },
  { key: "assigned",     label: "Assigned",     description: "Your complaint has been assigned to a staff member." },
  { key: "in_progress",  label: "In Progress",  description: "Work is underway to resolve your complaint." },
  { key: "resolved",     label: "Resolved",     description: "Your complaint has been resolved." },
  { key: "closed",       label: "Closed",       description: "Your complaint has been closed." },
];

const STATUS_ORDER = STATUS_STEPS.map((s) => s.key);

const PRIORITY_COLOURS: Record<string, string> = {
  emergency: "#dc2626",
  urgent:    "#ea580c",
  routine:   "#2563eb",
  enquiry:   "#7c3aed",
};

const CATEGORY_LABELS: Record<string, string> = {
  maintenance:     "Maintenance & Repairs",
  billing:         "Billing Dispute",
  noise_neighbour: "Noise / Neighbour Issue",
  safety:          "Safety & Security",
  management:      "Management Quality",
  general:         "General Feedback",
};

// ── Type ─────────────────────────────────────────────────────────────────────

interface StatusResult {
  reference:        string;
  category:         string;
  priority:         string;
  status:           string;
  submitted_at:     string;
  acknowledged_at:  string | null;
  resolved_at:      string | null;
  resolution_notes: string | null;
}

// ── Helper ────────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-KE", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Result panel ─────────────────────────────────────────────────────────────

function StatusPanel({ data }: { data: StatusResult }) {
  const currentStep = STATUS_ORDER.indexOf(data.status);
  const priorityColour = PRIORITY_COLOURS[data.priority] ?? "#64748b";
  const categoryLabel  = CATEGORY_LABELS[data.category] ?? data.category;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-[#0D1B8E] px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-white/50 text-xs font-bold tracking-widest uppercase mb-1">Reference</p>
          <p className="text-white text-2xl font-black tracking-widest">{data.reference}</p>
        </div>
        <div className="text-right">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest"
            style={{ background: `${priorityColour}25`, color: priorityColour, border: `1px solid ${priorityColour}40` }}
          >
            {data.priority}
          </span>
          <p className="text-white/40 text-xs mt-1.5">{categoryLabel}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* ── Progress pipeline ── */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Progress</p>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100" aria-hidden="true" />
            <div
              className="absolute top-4 left-4 h-0.5 bg-[#00C9C9] transition-all duration-700"
              style={{
                width: currentStep >= 0
                  ? `calc(${(currentStep / (STATUS_STEPS.length - 1)) * 100}% * ((100% - 2rem) / 100%))`
                  : "0%",
              }}
              aria-hidden="true"
            />

            <div className="relative flex justify-between">
              {STATUS_STEPS.map((step, i) => {
                const done    = i < currentStep;
                const current = i === currentStep;
                const future  = i > currentStep;
                return (
                  <div key={step.key} className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    {/* Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-all ${
                        done    ? "bg-[#00C9C9] border-[#00C9C9]" :
                        current ? "bg-[#0D1B8E] border-[#0D1B8E] ring-4 ring-[#0D1B8E]/20" :
                                  "bg-white border-slate-200"
                      }`}
                      aria-label={`${step.label}: ${done ? "completed" : current ? "current" : "pending"}`}
                    >
                      {done ? (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={`text-[10px] font-bold ${current ? "text-white" : future ? "text-slate-300" : ""}`}>
                          {i + 1}
                        </span>
                      )}
                    </div>
                    {/* Label */}
                    <span className={`text-[10px] font-semibold text-center leading-tight hidden sm:block ${
                      done || current ? "text-[#0D1B8E]" : "text-slate-300"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current step description */}
          <div className="mt-4 p-3 rounded-xl bg-[#f0f4ff] border border-[#c7d2fe]">
            <p className="text-[#0D1B8E] text-sm font-semibold">
              {STATUS_STEPS[currentStep]?.label ?? data.status}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              {STATUS_STEPS[currentStep]?.description}
            </p>
          </div>
        </div>

        {/* ── Timestamps ── */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Submitted</p>
            <p className="text-sm font-semibold text-slate-700">{formatDate(data.submitted_at)}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Acknowledged</p>
            <p className="text-sm font-semibold text-slate-700">
              {data.acknowledged_at ? formatDate(data.acknowledged_at) : "—"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Resolved</p>
            <p className="text-sm font-semibold text-slate-700">
              {data.resolved_at ? formatDate(data.resolved_at) : "—"}
            </p>
          </div>
        </div>

        {/* ── Resolution notes (shown if available) ── */}
        {data.resolution_notes && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <p className="text-xs text-green-700 font-bold uppercase tracking-wide mb-2">Resolution Notes</p>
            <p className="text-sm text-green-800 leading-relaxed whitespace-pre-wrap">
              {data.resolution_notes}
            </p>
          </div>
        )}

        {/* ── Contact prompt ── */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-400 w-full">Need an update or have additional information?</p>
          <a
            href={`https://wa.me/254720854389?text=Hi, I am following up on complaint reference ${data.reference}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white text-xs font-bold
                       hover:bg-green-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Follow-up
          </a>
          <a
            href="mailto:info@chabrinagencies.co.ke"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600
                       text-xs font-semibold hover:border-[#0D1B8E] hover:text-[#0D1B8E] transition-colors"
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ComplaintStatus() {
  const [refInput, setRefInput] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<StatusResult | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const ref = refInput.trim().toUpperCase();
    if (!ref) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/complaints/status?ref=${encodeURIComponent(ref)}`);
      if (res.status === 404) {
        setError("Reference not found. Please check the reference number and try again.");
      } else if (!res.ok) {
        setError("Unable to check status right now. Please try again shortly.");
      } else {
        const data = await res.json() as StatusResult;
        setResult(data);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="status" className="space-y-6">
      {/* Search box */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-[#0D1B8E] mb-1">Track Your Complaint</h2>
        <p className="text-slate-500 text-sm mb-5">
          Enter the reference number from your confirmation email — e.g. <span className="font-mono font-semibold text-[#0D1B8E]">CMP-2026-A7K2M</span>
        </p>
        <form onSubmit={handleCheck} className="flex gap-2">
          <input
            type="text"
            value={refInput}
            onChange={(e) => setRefInput(e.target.value.toUpperCase())}
            placeholder="CMP-2026-XXXXX"
            aria-label="Complaint reference number"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono
                       text-[#0D1B8E] uppercase placeholder:normal-case placeholder:text-slate-400
                       focus:outline-none focus:border-[#00C9C9] focus:ring-2 focus:ring-[#00C9C9]/20"
          />
          <button
            type="submit"
            disabled={loading || !refInput.trim()}
            className="px-6 py-3 rounded-xl bg-[#0D1B8E] text-white text-sm font-bold
                       hover:bg-[#0a1570] disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors flex-shrink-0 focus:outline-none"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "Check Status"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Result */}
      {result && <StatusPanel data={result} />}
    </div>
  );
}
