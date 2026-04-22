"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminCreateUser } from "@/actions/admin-users";
import Link from "next/link";

export default function NewUserPage() {
  const router = useRouter();
  const [state, action, pending] = useActionState<Record<string, unknown>, FormData>(adminCreateUser, {});

  useEffect(() => {
    if (state.success) router.push("/admin/users");
  }, [state, router]);

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href="/admin/users" className="hover:text-brand-navy transition-colors">Users</Link>
        <span>/</span>
        <span className="text-brand-navy">New User</span>
      </nav>

      <h1 className="text-xl font-bold text-brand-navy mb-6">Add Staff User</h1>

      <form action={action} className="space-y-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input name="name" required placeholder="e.g. Cosmas Mwangi"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input name="email" type="email" required placeholder="cosmas@chabrinagencies.co.ke"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Role <span className="text-rose-500">*</span>
            </label>
            <select name="role" required defaultValue="staff"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy">
              <option value="staff">Staff — Complaints &amp; Applications</option>
              <option value="superadmin">Super Admin — Full access + User management</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Temporary Password <span className="text-rose-500">*</span>
            </label>
            <input name="password" type="text" required minLength={8}
              placeholder="Min. 8 characters — user should change this after first login"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy placeholder:text-slate-400" />
            <p className="text-xs text-slate-400 mt-1.5">Share this securely. The user can change it from Settings after logging in.</p>
          </div>
        </div>

        {typeof state.error === "string" && Boolean(state.error) && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">
            {String(state.error)}
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/admin/users"
            className="px-6 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={pending}
            className="flex-1 py-2.5 rounded-full bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors disabled:opacity-60">
            {pending ? "Creating…" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
