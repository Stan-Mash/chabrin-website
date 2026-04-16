import Link from "next/link";
import Image from "next/image";
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

          {/* ── Right: Property photo showcase ──────────────────────── */}
          <div className="hidden lg:flex flex-col gap-4 relative">

            {/* Main photo card */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                 style={{ height: "340px" }}>
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80"
                alt="Premium residential property managed by Chabrin Agencies, Nairobi"
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 50vw, 500px"
                priority
              />
              {/* Dark gradient overlay — bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Bottom overlay text */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-brand-cyan text-[10px] font-bold uppercase tracking-widest mb-1">
                      Premium Portfolio
                    </p>
                    <p className="text-white font-bold text-lg leading-tight">
                      Nairobi Metropolitan
                    </p>
                    <p className="text-white/60 text-xs mt-0.5">
                      Westlands · Kilimani · Karen · Kasarani & beyond
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-cyan font-extrabold text-2xl leading-none">30+</p>
                    <p className="text-white/50 text-[10px] uppercase tracking-wide mt-0.5">Years</p>
                  </div>
                </div>
              </div>

              {/* Top-left badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40
                              backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                <span className="text-white text-[10px] font-semibold tracking-wide uppercase">
                  EARB Registered Agency
                </span>
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
