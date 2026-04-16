import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isAdminAuthenticated } from "@/lib/admin-auth";

/**
 * Admin layout — guards every /admin/* route except /admin/login.
 * The login page is inside this layout but excluded from the auth check
 * by inspecting the request pathname via next/headers.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? hdrs.get("x-invoke-path") ?? "";
  const isLoginPage = pathname === "/admin/login" || pathname.endsWith("/admin/login");

  if (!isLoginPage) {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) redirect("/admin/login");
  }

  // Login page: render children directly with no chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* ── Top bar ── */}
      <header className="bg-[#0D1B8E] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00C9C9]" aria-hidden="true" />
            <span className="text-white font-bold text-sm tracking-wide">
              Chabrin Admin
            </span>
            <span className="text-white/30 text-xs">— Complaint Management</span>
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

      {/* ── Page content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
