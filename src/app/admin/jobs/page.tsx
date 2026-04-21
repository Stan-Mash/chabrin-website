import Link from "next/link";

export default function AdminJobsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">
        <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-brand-navy mb-2">Job Listings are managed in Sanity Studio</h1>
        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          Create, edit, and publish job postings directly in the CMS. Set status to <strong>Open</strong> to make a listing public.
        </p>
        <a
          href="/studio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 rounded-full bg-brand-navy text-white text-sm font-bold
                     hover:bg-brand-cyan hover:text-brand-navy transition-colors"
        >
          Open Sanity Studio →
        </a>
        <p className="text-xs text-slate-400 mt-6">
          In the studio, click <strong>Job Listing</strong> in the left sidebar to manage postings.
        </p>
      </div>

      <div className="mt-6">
        <Link
          href="/admin/applications"
          className="text-sm font-semibold text-brand-cyan hover:text-brand-navy transition-colors"
        >
          ← View Applications
        </Link>
      </div>
    </div>
  );
}
