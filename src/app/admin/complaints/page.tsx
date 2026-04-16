import Link from "next/link";
import { listAdminComplaints, getComplaintSummary } from "@/db/queries/admin-complaints";

// ── Colour helpers ────────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<string, string> = {
  emergency: "bg-red-100 text-red-700 border-red-200",
  urgent:    "bg-orange-100 text-orange-700 border-orange-200",
  routine:   "bg-blue-100 text-blue-700 border-blue-200",
  enquiry:   "bg-purple-100 text-purple-700 border-purple-200",
};

const STATUS_STYLES: Record<string, string> = {
  submitted:    "bg-slate-100 text-slate-600 border-slate-200",
  acknowledged: "bg-yellow-100 text-yellow-700 border-yellow-200",
  assigned:     "bg-indigo-100 text-indigo-700 border-indigo-200",
  in_progress:  "bg-cyan-100 text-cyan-700 border-cyan-200",
  resolved:     "bg-green-100 text-green-700 border-green-200",
  closed:       "bg-slate-100 text-slate-400 border-slate-200",
};

const CATEGORY_LABELS: Record<string, string> = {
  maintenance:     "Maintenance",
  billing:         "Billing",
  noise_neighbour: "Noise / Neighbour",
  safety:          "Safety",
  management:      "Management",
  general:         "General",
};

function Badge({ value, styles }: { value: string; styles: Record<string, string> }) {
  const cls = styles[value] ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${cls}`}>
      {value.replace("_", " ")}
    </span>
  );
}

function formatDate(d: Date) {
  return new Date(d).toLocaleString("en-KE", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  searchParams: Promise<{
    status?:   string;
    priority?: string;
    category?: string;
    search?:   string;
    page?:     string;
  }>;
}

export default async function AdminComplaintsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filters = {
    status:   sp.status   || "all",
    priority: sp.priority || "all",
    category: sp.category || "all",
    search:   sp.search   || "",
    page:     parseInt(sp.page ?? "1", 10),
  };

  const [{ complaints, total }, summary] = await Promise.all([
    listAdminComplaints(filters),
    getComplaintSummary(),
  ]);

  const totalPages = Math.ceil(total / 25);
  const isFiltered = filters.status !== "all" || filters.priority !== "all" ||
                     filters.category !== "all" || filters.search;

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Complaints</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {total} total · {summary.open} open · {summary.emergency} emergency
          </p>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total",          value: summary.total,          colour: "text-slate-700" },
          { label: "Open",           value: summary.open,           colour: "text-blue-600" },
          { label: "Emergency Open", value: summary.emergency,      colour: "text-red-600" },
          { label: "Resolved Today", value: summary.resolved_today, colour: "text-green-600" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className={`text-3xl font-extrabold ${c.colour}`}>{c.value}</p>
            <p className="text-slate-400 text-xs mt-1 font-semibold uppercase tracking-wide">{c.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <form method="GET" className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex flex-wrap gap-3 items-end">

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Search</label>
            <input
              name="search"
              defaultValue={filters.search}
              placeholder="Reference, name, area…"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm
                         focus:outline-none focus:border-[#00C9C9] focus:ring-1 focus:ring-[#00C9C9]/20"
            />
          </div>

          {/* Status */}
          <div className="min-w-[130px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
            <select name="status" defaultValue={filters.status}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white
                         focus:outline-none focus:border-[#00C9C9]">
              {["all","submitted","acknowledged","assigned","in_progress","resolved","closed"].map((v) => (
                <option key={v} value={v}>{v === "all" ? "All Statuses" : v.replace("_"," ")}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="min-w-[130px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Priority</label>
            <select name="priority" defaultValue={filters.priority}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white
                         focus:outline-none focus:border-[#00C9C9]">
              {["all","emergency","urgent","routine","enquiry"].map((v) => (
                <option key={v} value={v}>{v === "all" ? "All Priorities" : v}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="min-w-[150px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
            <select name="category" defaultValue={filters.category}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white
                         focus:outline-none focus:border-[#00C9C9]">
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-[#0D1B8E] text-white text-sm font-semibold
                         hover:bg-[#0a1570] transition-colors">
              Filter
            </button>
            {isFiltered && (
              <Link href="/admin/complaints"
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600
                           text-sm font-semibold hover:border-slate-400 transition-colors">
                Clear
              </Link>
            )}
          </div>
        </div>
      </form>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {complaints.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm">No complaints match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Reference", "Submitted", "Submitter", "Category", "Area", "Priority", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#0D1B8E] text-xs whitespace-nowrap">
                      {c.reference}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(c.submitted_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-700 text-xs whitespace-nowrap">
                      <p className="font-semibold">{c.full_name}</p>
                      <p className="text-slate-400 text-[10px] capitalize">{c.submitter_type}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                      {CATEGORY_LABELS[c.category] ?? c.category}
                      {c.subcategory && (
                        <p className="text-slate-400 text-[10px]">{c.subcategory.replace(/_/g, " ")}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {c.property_area ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge value={c.priority} styles={PRIORITY_STYLES} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge value={c.status} styles={STATUS_STYLES} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link
                        href={`/admin/complaints/${c.reference}`}
                        className="px-3 py-1.5 rounded-lg bg-[#0D1B8E] text-white text-xs
                                   font-semibold hover:bg-[#0a1570] transition-colors"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {filters.page} of {totalPages} · {total} complaints
          </p>
          <div className="flex gap-2">
            {filters.page > 1 && (
              <Link
                href={`/admin/complaints?${new URLSearchParams({ ...sp, page: String(filters.page - 1) }).toString()}`}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:border-slate-400"
              >
                ← Previous
              </Link>
            )}
            {filters.page < totalPages && (
              <Link
                href={`/admin/complaints?${new URLSearchParams({ ...sp, page: String(filters.page + 1) }).toString()}`}
                className="px-4 py-2 rounded-lg bg-[#0D1B8E] text-white text-sm font-semibold hover:bg-[#0a1570]"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
