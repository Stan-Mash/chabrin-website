import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { listAdminUsers } from "@/db/queries/admin-users";
import { adminSetUserActive, adminResetUserPassword } from "@/actions/admin-users";
import Link from "next/link";

export default async function AdminUsersPage() {
  const me = await getAdminSession();
  if (!me || me.role !== "superadmin") redirect("/admin");

  const users = await listAdminUsers();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Staff Users</h1>
          <p className="text-slate-500 text-sm mt-1">{users.length} account{users.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/users/new"
          className="px-5 py-2.5 rounded-full bg-brand-navy text-white text-sm font-bold
                     hover:bg-brand-cyan hover:text-brand-navy transition-colors"
        >
          + Add User
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left">
              <th className="px-5 py-3 font-semibold text-slate-600">Name</th>
              <th className="px-5 py-3 font-semibold text-slate-600 hidden sm:table-cell">Email</th>
              <th className="px-5 py-3 font-semibold text-slate-600">Role</th>
              <th className="px-5 py-3 font-semibold text-slate-600 hidden md:table-cell">Last Login</th>
              <th className="px-5 py-3 font-semibold text-slate-600">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${!u.is_active ? "opacity-50" : ""}`}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-brand-navy/10 flex items-center justify-center text-xs font-bold text-brand-navy flex-shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-semibold text-brand-navy">{u.name}</span>
                    {u.id === me.id && (
                      <span className="text-xs text-brand-cyan font-semibold">(you)</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600 hidden sm:table-cell">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    u.role === "superadmin"
                      ? "bg-brand-navy/10 text-brand-navy"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {u.role === "superadmin" ? "Super Admin" : "Staff"}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-slate-500 hidden md:table-cell">
                  {u.last_login_at
                    ? new Date(u.last_login_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
                    : "Never"}
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    u.is_active ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-600"
                  }`}>
                    {u.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  {u.id !== me.id && (
                    <div className="flex items-center justify-end gap-2">
                      {/* Reset password inline form */}
                      <ResetPasswordForm userId={u.id} userName={u.name} />
                      {/* Toggle active */}
                      <form action={adminSetUserActive}>
                        <input type="hidden" name="id" value={u.id} />
                        <input type="hidden" name="is_active" value={String(!u.is_active)} />
                        <button type="submit"
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                            u.is_active
                              ? "text-rose-600 hover:bg-rose-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}>
                          {u.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Inline reset password — server action form
function ResetPasswordForm({ userId, userName }: { userId: string; userName: string }) {
  return (
    <form action={adminResetUserPassword} className="flex items-center gap-1">
      <input type="hidden" name="id" value={userId} />
      <input
        name="new_password"
        type="text"
        placeholder={`New password for ${userName.split(" ")[0]}`}
        minLength={8}
        required
        className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-navy/20 w-40"
      />
      <button type="submit"
        className="text-xs font-semibold text-brand-cyan hover:text-brand-navy transition-colors px-2 py-1.5">
        Set
      </button>
    </form>
  );
}
