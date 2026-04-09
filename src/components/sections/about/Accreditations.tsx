import Link from "next/link";

const BADGES = [
  { icon: "🏛️", label: "EARB Registered",    desc: "Estate Agents Registration Board of Kenya" },
  { icon: "🔒", label: "ODPC Compliant",      desc: "Office of the Data Protection Commissioner" },
  { icon: "📋", label: "Registered Company",  desc: "Incorporated under the Companies Act of Kenya" },
  { icon: "⏱️", label: "15+ Years",           desc: "Over a decade and a half of trusted service" },
];

export default function Accreditations() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-brand-navy mb-3">
            Accreditations &amp; Trust
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            We operate within Kenya&apos;s full regulatory framework — giving you complete confidence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {BADGES.map(({ icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface
                         border border-slate-100 hover:border-brand-cyan/30 hover:shadow-card transition-all"
            >
              <span className="text-4xl mb-3">{icon}</span>
              <h3 className="font-bold text-brand-navy mb-1">{label}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="rounded-3xl bg-brand-navy px-8 py-12 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Ready to work with Nairobi&apos;s trusted property managers?
          </h3>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Whether you&apos;re a landlord looking for professional management or a tenant
            seeking your next home — we&apos;re here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/en/contact"
              className="px-8 py-3 rounded-full bg-brand-cyan text-white font-bold
                         hover:bg-brand-cyan-dark transition-colors shadow-cyan"
            >
              Get in Touch
            </Link>
            <Link
              href="/en/properties"
              className="px-8 py-3 rounded-full border-2 border-white text-white font-bold
                         hover:bg-white/10 transition-colors"
            >
              View Properties
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
