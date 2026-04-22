"use client";

import { useActionState } from "react";
import { changeOwnPassword } from "@/actions/admin-users";

export default function AdminSettingsPage() {
  const [state, action, pending] = useActionState<Record<string, unknown>, FormData>(changeOwnPassword, {});

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-brand-navy mb-2">Account Settings</h1>
      <p className="text-slate-500 text-sm mb-8">Change your login password.</p>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-brand-navy text-sm uppercase tracking-wider mb-5">Change Password</h2>

        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Password</label>
            <input name="current_password" type="password" required autoComplete="current-password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
            <input name="new_password" type="password" required minLength={8} autoComplete="new-password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
            <p className="text-xs text-slate-400 mt-1">Minimum 8 characters.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
            <input name="confirm_password" type="password" required minLength={8} autoComplete="new-password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy" />
          </div>

          {typeof state.error === "string" && Boolean(state.error) && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">
              {String(state.error)}
            </div>
          )}

          {Boolean(state.success) && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
              ✅ Password updated successfully.
            </div>
          )}

          <button type="submit" disabled={pending}
            className="w-full py-2.5 rounded-full bg-brand-navy text-white text-sm font-bold
                       hover:bg-brand-cyan hover:text-brand-navy transition-colors disabled:opacity-60">
            {pending ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
