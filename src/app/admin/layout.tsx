import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import Link from "next/link";

const NAV = [
  { href: "/admin/complaints",   label: "Complaints" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/jobs",         label: "Job Postings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin-login");

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-[#0D1B8E] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00C9C9]" aria-hidden="true" />
              <span className="text-white font-bold text-sm tracking-wide">Chabrin Admin</span>
            </div>
            <nav className="hidden sm:flex items-center gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-white/60 hover:text-white text-xs font-medium px-3 py-1.5
                             rounded hover:bg-white/10 transition-colors"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="text-white/50 hover:text-white text-xs font-medium transition-colors
                         px-3 py-1 rounded border border-white/10 hover:border-white/30"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
