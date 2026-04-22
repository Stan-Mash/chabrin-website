import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { adminLogout } from "@/actions/admin-users";
import Link from "next/link";

const NAV = [
  { href: "/admin",              label: "Dashboard"    },
  { href: "/admin/complaints",   label: "Complaints"   },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/jobs",         label: "Job Postings" },
  { href: "/admin/blog",         label: "Blog"         },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminSession();
  if (!user) redirect("/admin-login");

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
              {user.role === "superadmin" && (
                <Link
                  href="/admin/users"
                  className="text-white/60 hover:text-white text-xs font-medium px-3 py-1.5
                             rounded hover:bg-white/10 transition-colors"
                >
                  Users
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/settings"
              className="hidden sm:flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-xs font-medium">{user.name}</span>
            </Link>
            <form action={adminLogout}>
              <button
                type="submit"
                className="text-white/50 hover:text-white text-xs font-medium transition-colors
                           px-3 py-1 rounded border border-white/10 hover:border-white/30"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
