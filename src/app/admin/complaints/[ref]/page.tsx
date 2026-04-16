"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { adminUpdateComplaint } from "@/actions/admin-complaints";

// This page fetches the complaint via a client-side API call so it can
// re-render after a successful update without a full page reload.

interface Complaint {
  reference:        string;
  submitter_type:   string;
  full_name:        string;
  email:            string;
  phone:            string;
  property_area:    string | null;
  category:         string;
  subcategory:      string | null;
  priority:         string;
  description:      string;
  status:           string;
  internal_notes:   string | null;
  resolution_notes: string | null;
  submitted_at:     string;
  acknowledged_at:  string | null;
  resolved_at:      string | null;
}

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

const STATUS_OPTIONS = [
  "submitted", "acknowledged", "assigned", "in_progress", "resolved", "closed",
];

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-KE", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-3 border-b border-slate-100 last:border-0">
      <dt className="w-36 flex-shrink-0 text-xs font-semibold text-slate-400 uppercase tracking-wide pt-0.5">
        {label}
      </dt>
      <dd className="text-sm text-slate-700 leading-relaxed flex-1">{value}</dd>
    </div>
  );
}

export default function AdminComplaintDetailPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const [ref, setRef]             = useState<string>("");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);

  // Resolve async params
  useEffect(() => {
    params.then((p) => setRef(p.ref.toUpperCase()));
  }, [params]);

  // Fetch complaint from admin API
  useEffect(() => {
    if (!ref) return;
    setLoading(true);
    fetch(`/api/admin/complaint?ref=${encodeURIComponent(ref)}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setComplaint(data as Complaint);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ref]);

  const [state, action, pending] = useActionState(adminUpdateComplaint, {});

  // Re-fetch after successful update
  useEffect(() => {
    if (state?.success && ref) {
      fetch(`/api/admin/complaint?ref=${encodeURIComponent(ref)}`)
        .then((r) => r.json())
        .then((data) => setComplaint(data as Complaint));
    }
  }, [state, ref]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading complaint…
        </div>
      </div>
    );
  }

  if (notFound || !complaint) {
    return (
      <div className="text-center py-32">
        <p className="text-slate-500 mb-4">Complaint not found: <strong>{ref}</strong></p>
        <Link href="/admin/complaints" className="text-[#0D1B8E] text-sm font-semibold hover:underline">
          ← Back to complaints
        </Link>
      </div>
    );
  }

  const priorityColour = PRIORITY_COLOURS[complaint.priority] ?? "#64748b";

  return (
    <div className="space-y-6 max-w-4xl">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/complaints" className="text-slate-400 hover:text-[#0D1B8E] transition-colors">
          Complaints
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-mono font-bold text-[#0D1B8E]">{complaint.reference}</span>
      </div>

      {/* ── Header card ── */}
      <div className="bg-[#0D1B8E] rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-1">Reference</p>
          <p className="text-white text-2xl font-black tracking-widest">{complaint.reference}</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest"
            style={{ background: `${priorityColour}25`, color: priorityColour, border: `1px solid ${priorityColour}50` }}
          >
            {complaint.priority}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wide">
            {complaint.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

        {/* ── Left: complaint details ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-[#0D1B8E] mb-4">Complaint Details</h2>
          <dl>
            <Row label="Category"   value={CATEGORY_LABELS[complaint.category] ?? complaint.category} />
            {complaint.subcategory && (
              <Row label="Subcategory" value={complaint.subcategory.replace(/_/g, " ")} />
            )}
            <Row label="Submitted"   value={fmt(complaint.submitted_at)} />
            <Row label="Acknowledged" value={fmt(complaint.acknowledged_at)} />
            <Row label="Resolved"    value={fmt(complaint.resolved_at)} />
          </dl>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-4 border border-slate-100">
              {complaint.description}
            </p>
          </div>

          {complaint.resolution_notes && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-2">Resolution Notes (visible to submitter)</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-green-50 rounded-xl p-4 border border-green-200">
                {complaint.resolution_notes}
              </p>
            </div>
          )}

          {complaint.internal_notes && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-2">Internal Notes (staff only)</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-amber-50 rounded-xl p-4 border border-amber-200">
                {complaint.internal_notes}
              </p>
            </div>
          )}
        </div>

        {/* ── Right: submitter + update form ── */}
        <div className="space-y-4">

          {/* Submitter card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-[#0D1B8E] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0D1B8E]/10 flex items-center justify-center text-[10px]" aria-hidden="true">👤</span>
              Submitter
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400 text-xs font-semibold uppercase">Name</dt>
                <dd className="font-semibold text-slate-700">{complaint.full_name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400 text-xs font-semibold uppercase">Type</dt>
                <dd className="text-slate-600 capitalize">{complaint.submitter_type}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400 text-xs font-semibold uppercase flex-shrink-0">Email</dt>
                <dd>
                  <a href={`mailto:${complaint.email}`}
                    className="text-[#0D1B8E] text-xs hover:underline break-all">
                    {complaint.email}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400 text-xs font-semibold uppercase">Phone</dt>
                <dd>
                  <a href={`tel:${complaint.phone}`}
                    className="text-[#0D1B8E] text-xs hover:underline">
                    {complaint.phone}
                  </a>
                </dd>
              </div>
              {complaint.property_area && (
                <div className="flex justify-between">
                  <dt className="text-slate-400 text-xs font-semibold uppercase">Area</dt>
                  <dd className="text-slate-600 text-xs">{complaint.property_area}</dd>
                </div>
              )}
            </dl>

            {/* Quick contact */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <a href={`https://wa.me/${complaint.phone.replace(/\D/g, "")}?text=Hi+${encodeURIComponent(complaint.full_name)}%2C+regarding+your+complaint+${complaint.reference}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 py-2 rounded-lg bg-green-500 text-white text-xs font-bold text-center hover:bg-green-600 transition-colors">
                WhatsApp
              </a>
              <a href={`mailto:${complaint.email}?subject=Re: Complaint ${complaint.reference}`}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold text-center hover:border-[#0D1B8E] hover:text-[#0D1B8E] transition-colors">
                Email
              </a>
            </div>
          </div>

          {/* Update form */}
          <form action={action} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0D1B8E]">Update Complaint</h3>
            <input type="hidden" name="reference" value={complaint.reference} />

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Status</label>
              <select
                name="status"
                defaultValue={complaint.status}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white
                           text-[#0D1B8E] font-semibold focus:outline-none focus:border-[#00C9C9]
                           focus:ring-2 focus:ring-[#00C9C9]/20"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                An email will be sent to the submitter when status changes.
              </p>
            </div>

            {/* Resolution notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Resolution Notes{" "}
                <span className="text-slate-400 font-normal">(shown to submitter)</span>
              </label>
              <textarea
                name="resolution_notes"
                rows={4}
                defaultValue={complaint.resolution_notes ?? ""}
                placeholder="Describe what was done to resolve the complaint…"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none
                           focus:outline-none focus:border-[#00C9C9] focus:ring-2 focus:ring-[#00C9C9]/20"
              />
            </div>

            {/* Internal notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Internal Notes{" "}
                <span className="text-slate-400 font-normal">(staff only, never shown publicly)</span>
              </label>
              <textarea
                name="internal_notes"
                rows={3}
                defaultValue={complaint.internal_notes ?? ""}
                placeholder="Internal observations, assigned to, follow-up actions…"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none
                           bg-amber-50 border-amber-200 focus:outline-none focus:border-amber-400
                           focus:ring-2 focus:ring-amber-200/50"
              />
            </div>

            {state?.error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {state.error}
              </div>
            )}
            {state?.success && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
                ✓ Updated successfully. Email sent to submitter.
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 rounded-xl bg-[#0D1B8E] text-white font-bold text-sm
                         hover:bg-[#0a1570] disabled:opacity-60 transition-colors"
            >
              {pending ? "Saving…" : "Save Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
