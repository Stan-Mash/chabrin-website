import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

const FEATURED = [
  {
    id:        "res-01",
    type:      "RESIDENTIAL",
    zone:      "Kasarani & Roysambu",
    area:      "Kasarani",
    rooms:     "3-Bed Apartment",
    rent:      "KES 45,000",
    badge:     "Available",
    highlight: "bg-brand-cyan",
  },
  {
    id:        "com-01",
    type:      "COMMERCIAL",
    zone:      "CBD & Kilimani",
    area:      "Upper Hill",
    rooms:     "Open-Plan Office, 1,200 sq ft",
    rent:      "KES 120,000",
    badge:     "Available",
    highlight: "bg-white/20",
  },
  {
    id:        "ind-01",
    type:      "INDUSTRIAL",
    zone:      "Eastlands & Embakasi",
    area:      "Industrial Area",
    rooms:     "Light Industrial Unit, 4,000 sq ft",
    rent:      "KES 95,000",
    badge:     "Available",
    highlight: "bg-white/20",
  },
] as const;

export default async function FeaturedProperties() {
  const locale = await getLocale();
  const t      = await getTranslations("featured_properties");

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="max-w-2xl mb-12">
          <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy leading-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Property cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {FEATURED.map(({ id, type, zone, area, rooms, rent, badge }) => (
            <div key={id} className="bg-white border border-slate-100 flex flex-col">

              {/* Top colour band */}
              <div className={`h-1 ${id === "res-01" ? "bg-brand-cyan" : "bg-brand-navy/30"}`} />

              <div className="p-6 flex flex-col flex-1">
                {/* Type badge + available */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[9px] tracking-[0.2em] text-brand-navy/40 uppercase font-bold border border-brand-navy/15 px-2 py-0.5">
                    {type}
                  </span>
                  <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-wide">
                    {badge}
                  </span>
                </div>

                {/* Zone / Area */}
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">{zone}</p>
                <p className="text-brand-navy font-bold text-lg leading-tight mb-2">{area}</p>
                <p className="text-slate-500 text-sm mb-5">{rooms}</p>

                {/* Rent */}
                <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wide">Monthly Rent</p>
                    <p className="text-brand-navy font-extrabold text-base mt-0.5">{rent}</p>
                  </div>
                  <Link
                    href={`/${locale}/properties`}
                    className="text-[11px] font-bold text-brand-cyan uppercase tracking-wide
                               flex items-center gap-1 hover:gap-2 transition-all duration-150"
                    aria-label={`Enquire about ${area} property`}
                  >
                    {t("enquire")}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center">
          <Link
            href={`/${locale}/properties`}
            className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-brand-navy
                       text-brand-navy font-bold text-sm rounded-full
                       hover:bg-brand-navy hover:text-white transition-all duration-200"
          >
            {t("view_all")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
