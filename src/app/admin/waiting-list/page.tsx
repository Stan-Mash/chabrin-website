"use client";

import { useEffect, useActionState, useState } from "react";
import Link from "next/link";
import { adminInviteFromPool } from "@/actions/admin-ats";
import type { TalentPoolEntry } from "@/db/queries/applications";

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
              <span className="font-normal text-slate-400 ml-1">(optional — shown in the email)</span>
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

export default function WaitingListPage() {
  const [entries, setEntries] = useState<TalentPoolEntry[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [inviting, setInviting] = useState<TalentPoolEntry | null>(null);

  const fetchData = (q = "") => {
    setLoading(true);
    const params = new URLSearchParams({ stage: "waiting_list" });
    if (q) params.set("search", q);
    fetch(`/api/admin/talent-pool?${params}`)
      .then(r => r.json())
      .then(d => { setEntries(d.entries ?? []); setTotal(d.total ?? 0); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData(search);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {inviting && (
        <InviteModal entry={inviting} onClose={() => { setInviting(null); fetchData(search); }} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-brand-navy">Waiting List</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Strong candidates held for future openings &mdash; {total} on file
          </p>
        </div>
        <Link
          href="/admin/talent-pool"
          className="text-sm font-semibold text-brand-cyan hover:text-brand-navy transition-colors"
        >
          Full Talent Pool &rarr;
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email, or reference&hellip;"
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); fetchData(); }}
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
            <p className="text-4xl mb-3">&#127775;</p>
            <p className="font-semibold text-slate-600">No candidates on the waiting list yet</p>
            <p className="text-sm mt-1">
              Move strong candidates here from their application page after interview.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-slate-600">Candidate</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Last Role Applied</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Days on List</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">AI Rec.</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {entries.map((e) => {
                  const aiRec = (e.ai_summary as Record<string, unknown> | null)?.hire_recommendation as string | undefined;
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
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`text-xs font-semibold ${e.days_in_pool > 30 ? "text-amber-600" : "text-slate-600"}`}>
                          {e.days_in_pool}d
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {aiRec ? (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            aiRec === "strong_yes" ? "bg-emerald-100 text-emerald-700" :
                            aiRec === "yes"        ? "bg-green-100 text-green-700"     :
                            aiRec === "maybe"      ? "bg-amber-100 text-amber-700"     :
                                                     "bg-rose-100 text-rose-700"
                          }`}>
                            {aiRec === "strong_yes" ? "Strong Yes" : aiRec.charAt(0).toUpperCase() + aiRec.slice(1)}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
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
