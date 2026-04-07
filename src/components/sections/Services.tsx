import Link from "next/link";
import { useLocale } from "next-intl";

const SERVICES = [
  {
    id:       "management",
    icon:     "🏢",
    title:    "Property Management",
    desc:     "End-to-end management of residential and commercial properties. Rent collection, maintenance coordination, tenant relations, and monthly reporting.",
    href:     "/services#management",
  },
  {
    id:       "leasing",
    icon:     "📋",
    title:    "Leasing & Letting",
    desc:     "Professional tenant sourcing, vetting, and placement. We handle lease preparation, digital signing, and handover documentation.",
    href:     "/services#leasing",
  },
  {
    id:       "valuation",
    icon:     "📊",
    title:    "Property Valuation",
    desc:     "Accurate market valuations for residential, commercial, and industrial properties across Nairobi — backed by current data and local expertise.",
    href:     "/services#valuation",
  },
  {
    id:       "facilities",
    icon:     "🔧",
    title:    "Facilities Management",
    desc:     "Planned and reactive maintenance, contractor management, and compliance oversight to protect the long-term value of your property.",
    href:     "/services#facilities",
  },
];

export default function Services() {
  const locale = useLocale();

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="max-w-2xl mb-14">
          <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-3">
            What We Do
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy leading-tight mb-4">
            Full-Spectrum Property Services
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            From finding the right tenant to managing your entire portfolio —
            Chabrin delivers professional property services across Nairobi.
          </p>
        </div>

        {/* ── Service cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map(({ id, icon, title, desc, href }) => (
            <Link
              key={id}
              href={`/${locale}${href}`}
              className="group relative bg-white rounded-2xl p-6 border border-slate-100
                         shadow-card hover:shadow-card-hover hover:-translate-y-1
                         transition-all duration-300 flex flex-col"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center
                              text-2xl mb-5 group-hover:bg-brand-cyan/10 transition-colors">
                {icon}
              </div>

              {/* Title */}
              <h3 className="text-brand-navy font-bold text-lg mb-3 leading-snug
                             group-hover:text-brand-navy-dark transition-colors">
                {title}
              </h3>

              {/* Description */}
              <p className="text-slate-500 text-sm leading-relaxed flex-1">
                {desc}
              </p>

              {/* Learn more arrow */}
              <div className="flex items-center gap-1.5 mt-5 text-brand-cyan text-sm font-semibold">
                <span>Learn more</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-brand-cyan
                              scale-x-0 group-hover:scale-x-100 transition-transform
                              duration-300 origin-left rounded-full" />
            </Link>
          ))}
        </div>

        {/* ── View all services CTA ──────────────────────────────────── */}
        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 text-brand-navy font-semibold
                       hover:text-brand-cyan transition-colors text-sm"
          >
            View all services
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
