"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error monitoring service (not to console in production)
    if (process.env.NODE_ENV === "development") {
      console.error("App error:", error.digest);
    }
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-navy text-white px-6">
      <div className="text-center max-w-md">
        <p className="text-brand-cyan text-5xl font-bold mb-4">Oops</p>
        <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
        <p className="text-white/60 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full bg-brand-cyan text-brand-navy font-semibold hover:bg-brand-cyan-dark transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/en"
            className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
