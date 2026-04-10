import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Hero() {
  const t      = useTranslations("hero");
  const tNav   = useTranslations("nav");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-brand-navy min-h-[92vh] flex items-center">

      {/* ── Background geometry ──────────────────────────────────────── */}
      {/* Large circle top-right */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full
                   bg-brand-cyan/10 blur-3xl pointer-events-none"
      />
      {/* Small accent circle bottom-left */}
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-16 w-[400px] h-[400px] rounded-full
                   bg-brand-navy-light/40 blur-2xl pointer-events-none"
      />
      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 md:py-32">
        <div className="max-w-3xl">

          {/* Eyebrow tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          border border-brand-cyan/30 bg-brand-cyan/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse flex-shrink-0" />
            <span className="text-brand-cyan text-sm font-semibold tracking-wide">
              {t("tagline")}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white
                         leading-[1.05] tracking-tight mb-6">
            {t("headline")}
            <span className="block text-brand-cyan mt-1">
              {t("headline_accent")}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/65 text-lg md:text-xl leading-relaxed max-w-xl mb-10">
            {t("subheadline")}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/${locale}/properties`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                         bg-brand-cyan text-brand-navy font-bold text-base
                         hover:bg-brand-cyan-dark transition-all duration-200
                         shadow-cyan hover:shadow-none hover:-translate-y-0.5"
            >
              {t("cta_primary")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                         border-2 border-white/25 text-white font-semibold text-base
                         hover:border-white/60 hover:bg-white/5 transition-all duration-200"
            >
              {tNav("contact")}
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-6 mt-12 pt-10
                          border-t border-white/10">
            {[
              { icon: "✓", label: t("trust_earb") },
              { icon: "✓", label: t("trust_odpc") },
              { icon: "✓", label: t("trust_nairobi") },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-cyan/20 flex items-center
                                 justify-center text-brand-cyan text-xs font-bold flex-shrink-0">
                  {icon}
                </span>
                <span className="text-white/60 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Decorative bottom fade ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-24
                   bg-gradient-to-t from-surface to-transparent pointer-events-none"
      />
    </section>
  );
}
