import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Hero() {
  const t      = useTranslations("hero");
  const tNav   = useTranslations("nav");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-brand-navy min-h-[92vh] flex items-center">

      {/* ── Background elements ───────────────────────────────────────── */}
      <div aria-hidden="true"
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full
                   bg-brand-cyan/10 blur-3xl pointer-events-none" />
      <div aria-hidden="true"
        className="absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full
                   bg-brand-navy-light/30 blur-2xl pointer-events-none" />
      {/* Subtle dot-grid overlay */}
      <div aria-hidden="true"
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Content grid ──────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── Left: Text ──────────────────────────────────────────── */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            border border-brand-cyan/30 bg-brand-cyan/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse flex-shrink-0" />
              <span className="text-brand-cyan text-sm font-semibold tracking-wide">
                {t("tagline")}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem]
                           font-bold text-white leading-[1.05] tracking-tight mb-6">
              {t("headline")}
              <span className="block text-brand-cyan mt-1">
                {t("headline_accent")}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-white/65 text-lg md:text-xl leading-relaxed max-w-lg mb-10">
              {t("subheadline")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
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
            <div className="flex flex-wrap items-center gap-5 pt-8 border-t border-white/10">
              {[
                t("trust_earb"),
                t("trust_odpc"),
                t("trust_nairobi"),
              ].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cyan/20 flex items-center
                                   justify-center text-brand-cyan text-xs font-bold flex-shrink-0">
                    ✓
                  </span>
                  <span className="text-white/60 text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Visual showcase ───────────────────────────────── */}
          <div className="hidden lg:flex flex-col gap-4 relative">

            {/* Main property card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl
                            p-6 shadow-2xl">
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-cyan">
                  Featured Listing
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold
                                 bg-emerald-400/20 text-emerald-300 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Available
                </span>
              </div>

              {/* Property visual placeholder */}
              <div className="w-full h-36 rounded-xl bg-gradient-to-br from-brand-navy-light/60
                              to-brand-cyan/20 border border-white/10 mb-5 flex items-center
                              justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <svg className="w-14 h-14 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>

              {/* Property details */}
              <h3 className="text-white font-bold text-lg mb-1">3-Bedroom Apartment</h3>
              <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Westlands, Nairobi · Zone B
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Monthly Rent</p>
                  <p className="text-white font-bold text-2xl">
                    KES 85,000
                    <span className="text-white/40 text-sm font-normal"> /mo</span>
                  </p>
                </div>
                <div className="flex gap-3 text-white/50 text-xs">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
                    </svg>
                    3 bed
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    2 bath
                  </span>
                </div>
              </div>

              {/* Managed badge */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-brand-cyan/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/45 text-xs">Professionally managed by Chabrin Agencies</span>
              </div>
            </div>

            {/* Bottom row: two credential cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-cyan/15 border border-brand-cyan/25 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-brand-cyan flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <p className="text-brand-cyan font-extrabold text-sm leading-none">EARB Licensed</p>
                </div>
                <p className="text-white/55 text-xs leading-snug">Registered with Kenya's Estate Agents Board</p>
              </div>
              <div className="bg-white/8 border border-white/12 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-white/70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-white font-extrabold text-sm leading-none">24h Response</p>
                </div>
                <p className="text-white/55 text-xs leading-snug">Guaranteed landlord & tenant response SLA</p>
              </div>
            </div>

            {/* Floating lease-signed toast */}
            <div className="absolute -top-5 -right-4 bg-white rounded-xl px-4 py-3
                            shadow-2xl flex items-center gap-3 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="text-brand-navy font-bold text-xs leading-none mb-0.5">Lease Signed</p>
                <p className="text-slate-400 text-[10px]">Karen, Zone A · Just now</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom fade ───────────────────────────────────────────────── */}
      <div aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-20
                   bg-gradient-to-t from-surface to-transparent pointer-events-none" />
    </section>
  );
}
