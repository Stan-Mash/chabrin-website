import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-navy text-white px-6">
      <div className="text-center max-w-md">
        <p className="text-brand-cyan text-7xl font-bold mb-4">404</p>
        <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-white/60 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/en"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-cyan text-brand-navy font-semibold hover:bg-brand-cyan-dark transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
