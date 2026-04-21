import Link from "next/link";

export default function AdminBlogPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">
        <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-brand-navy mb-2">Blog is managed in Sanity Studio</h1>
        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          Write and publish blog posts with a full rich-text editor, image uploads, and instant preview.
          Set a post as <strong>Featured</strong> to pin it at the top of the blog page.
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

        <div className="mt-8 bg-slate-50 rounded-xl p-5 text-left space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick guide</p>
          {[
            "Click Blog Post in the left sidebar",
            "Click the pencil icon or + to create a new post",
            "Fill in Title, Category, Excerpt, and Body",
            "Upload a Cover Image for best visual impact",
            "Set Featured to pin it at the top of the blog",
            "Click Publish — it goes live within the hour",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="w-5 h-5 rounded-full bg-brand-cyan/20 text-brand-cyan font-bold text-xs
                               flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/admin"
          className="text-sm font-semibold text-brand-cyan hover:text-brand-navy transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
