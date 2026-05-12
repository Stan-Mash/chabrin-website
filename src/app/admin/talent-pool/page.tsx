"use client";

import { useEffect, useActionState, useState } from "react";
import Link from "next/link";
import { adminInviteFromPool } from "@/actions/admin-ats";
import type { TalentPoolEntry } from "@/db/queries/applications";

const POOL_STAGES: Record<string, { label: string; colour: string }> = {
  waiting_list:  { label: "Waiting List",  colour: "bg-violet-100 text-violet-700" },
  interviewed:   { label: "Interviewed",   colour: "bg-purple-100 text-purple-700" },
  offer_declined:{ label: "Offer Declined",colour: "bg-orange-100 text-orange-700" },
  offer_accepted:{ label: "Offer Accepted",colour: "bg-teal-100 text-teal-700"    },
};

const AI_REC_STYLES: Record<string, string> = {
  strong_yes: "bg-emerald-100 text-emerald-700",
  yes:        "bg-green-100 text-green-700",
  maybe:      "bg-amber-100 text-amber-700",
  no:         "bg-rose-100 text-rose-700",
};
const AI_REC_LABELS: Record<string, string> = {
  strong_yes: "Strong Yes",
  yes:        "Yes",
  maybe:      "Maybe",
  no:         "No",
};

// ── Invite modal ──────────────────────────────────────────────────────────────

function InviteModal({
  entry,
  onClose,
}: {
  entry: TalentPoolEntry;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState<Record<string, unknown>, FormData>(
    adminInviteFromPool,
    {}
  );

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-bold text-brand-navy text-base">Notify of New Opportunity</h2>
            <p className="text-xs text-slate-500 mt-0.5">{entry.full_name} &mdash; {entry.reference}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>
        <form action={action} className="space-y-3">
          <input type="hidden" name="reference" value={entry.reference} />
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Position / Opportunity</label>
            <input
              name="new_job"
              type="text"
              defaultValue={entry.job_title}
              placeholder="e.g. Senior Property Manager"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Personal Message
              <span className="font-normal text-slate-400 ml-1">(optional)</span>
            </label>
            <textarea
              name="message"
              rows={3}
              placeholder="e.g. We thought of you immediately when this role opened — we'd love to hear from you."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-navy/20 placeholder:text-slate-400"
            />
          </div>
          {typeof state.error === "string" && state.error && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{state.error}</p>
          )}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={pending}
              className="flex-1 py-2.5 rounded-full bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send Notification"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TalentPoolPage() {
  const [entries,  setEntries]  = useState<TalentPoolEntry[]>([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [stage,    setStage]    = useState("");
  const [inviting, setInviting] = useState<TalentPoolEntry | null>(null);

  const fetchData = (q = "", s = "") => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (s) params.set("stage",  s);
    fetch(`/api/admin/talent-pool?${params}`)
      .then(r => r.json())
      .then(d => { setEntries(d.entries ?? []); setTotal(d.total ?? 0); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData(search, stage);
  };

  const handleClear = () => {
    setSearch("");
    setStage("");
    fetchData("", "");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {inviting && (
        <InviteModal entry={inviting} onClose={() => { setInviting(null); fetchData(search, stage); }} />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-brand-navy">Talent Pool</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {total} candidate{total !== 1 ? "s" : ""} &mdash; interviewed, waiting list &amp; offer-declined
          </p>
        </div>
        <Link
          href="/admin/waiting-list"
          className="text-sm font-semibold text-violet-600 hover:text-brand-navy transition-colors"
        >
          Waiting List only &rarr;
        </Link>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3"
      >
        <select
          value={stage}
          onChange={e => setStage(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
        >
          <option value="">All Pool Stages</option>
          {Object.entries(POOL_STAGES).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email, or reference&hellip;"
          className="flex-1 min-w-40 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 placeholder:text-slate-400"
        />

        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors"
        >
          Filter
        </button>
        {(search || stage) && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <p className="text-center py-12 text-slate-400 text-sm">Loading&hellip;</p>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">&#128101;</p>
            <p className="font-semibold text-slate-600">No candidates in the talent pool</p>
            <p className="text-sm mt-1">
              After interviews, move strong candidates to &ldquo;Waiting List&rdquo; from their application page.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-slate-600">Candidate</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Last Role</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Pool Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">AI Rec.</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Skills</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {entries.map((e) => {
                  const ai     = e.ai_summary as Record<string, unknown> | null;
                  const aiRec  = ai?.hire_recommendation as string | undefined;
                  const skills = (ai?.key_skills as string[] | undefined)?.slice(0, 3) ?? [];
                  const stageInfo = POOL_STAGES[e.stage];
                  return (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-brand-navy">{e.full_name}</p>
                        <p className="text-xs text-slate-500">{e.phone}</p>
                        <p className="font-mono text-xs text-slate-400 mt-0.5">{e.reference}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs hidden md:table-cell">
                        <span>{e.job_title}</span>
                        {e.job_department && (
                          <span className="ml-1.5 text-slate-400">&middot; {e.job_department}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stageInfo?.colour ?? "bg-slate-100 text-slate-500"}`}>
                          {stageInfo?.label ?? e.stage}
                        </span>
                        {e.days_in_pool > 0 && (
                          <p className={`text-xs mt-1 ${e.days_in_pool > 60 ? "text-amber-600 font-semibold" : "text-slate-400"}`}>
                            {e.days_in_pool}d in pool
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {aiRec ? (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${AI_REC_STYLES[aiRec] ?? "bg-slate-100 text-slate-600"}`}>
                            {AI_REC_LABELS[aiRec] ?? aiRec}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {skills.map(sk => (
                            <span key={sk} className="text-xs bg-brand-navy/10 text-brand-navy px-1.5 py-0.5 rounded-full">
                              {sk}
                            </span>
                          ))}
                          {skills.length === 0 && <span className="text-xs text-slate-400">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setInviting(e)}
                            className="text-xs font-semibold text-violet-600 hover:text-brand-navy transition-colors whitespace-nowrap"
                          >
                            Notify &rarr;
                          </button>
                          <Link
                            href={`/admin/applications/${e.reference}`}
                            className="text-xs font-semibold text-brand-cyan hover:text-brand-navy transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
