import type { Metadata } from "next";
import Link from "next/link";
import ApplicationTracker from "@/components/sections/careers/ApplicationTracker";

export const metadata: Metadata = {
  title: "Track Application — Careers",
  description: "Check the status of your job application at Chabrin Agencies using your reference number.",
};

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-brand-navy text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <Link href="/careers" className="hover:text-brand-cyan transition-colors">Careers</Link>
            <span>/</span>
            <span className="text-white">Track Application</span>
          </nav>
          <h1 className="text-3xl font-bold mb-3">Track Your Application</h1>
          <p className="text-slate-300">
            Enter the reference number from your confirmation email to see your current application status.
          </p>
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <ApplicationTracker />
        </div>
      </section>
    </main>
  );
}
