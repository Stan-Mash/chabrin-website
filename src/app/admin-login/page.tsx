"use client";

import { useActionState } from "react";
import { adminLogin } from "@/actions/admin-users";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(adminLogin, {});

  return (
    <div className="min-h-screen bg-[#0D1B8E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00C9C9]/20 mb-4">
            <svg className="w-7 h-7 text-[#00C9C9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-white text-xl font-extrabold">Chabrin Admin</h1>
          <p className="text-white/40 text-sm mt-1">Staff Portal</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-[#0D1B8E] font-bold text-lg mb-6">Sign In</h2>

          <form action={action} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-600 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm
                           focus:outline-none focus:border-[#00C9C9] focus:ring-2
                           focus:ring-[#00C9C9]/20 text-slate-800"
                placeholder="you@chabrinagencies.co.ke"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-600 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm
                           focus:outline-none focus:border-[#00C9C9] focus:ring-2
                           focus:ring-[#00C9C9]/20 text-slate-800"
                placeholder="Your password"
              />
            </div>

            {state?.error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 rounded-full bg-[#0D1B8E] text-white font-bold text-sm
                         hover:bg-[#0a1570] disabled:opacity-60 disabled:cursor-not-allowed
                         transition-colors"
            >
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/25 text-xs mt-6">
          Chabrin Agencies Limited — Internal Use Only
        </p>
      </div>
    </div>
  );
}
