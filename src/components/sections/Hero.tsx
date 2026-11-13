"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import AnimatedHeadline from "@/components/ui/AnimatedHeadline";
import CursorSpotlight from "@/components/ui/CursorSpotlight";
import HeroParallaxBlobs from "@/components/sections/HeroParallaxBlobs";


export default function Hero() {
  const t      = useTranslations("hero");
  const tNav   = useTranslations("nav");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-brand-navy min-h-[92vh] flex items-center">

      <HeroParallaxBlobs />
      <CursorSpotlight />

      {/* Dot-grid */}
      <div aria-hidden="true"
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ══ LEFT ════════════════════════════════════════════════════════ */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                         border border-brand-cyan/30 bg-brand-cyan/10 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse flex-shrink-0" />
              <span className="text-brand-cyan text-sm font-semibold tracking-wide">
                {t("tagline")}
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.25rem]
                           font-bold text-white leading-[1.05] tracking-tight mb-6">
              <AnimatedHeadline text={t("headline")} as="span" className="block" delay={0.08} />
              <AnimatedHeadline text={t("headline_accent")} as="span"
                className="block text-brand-cyan mt-1" delay={0.22} />
            </h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/65 text-lg md:text-xl leading-relaxed max-w-lg mb-10"
            >
              {t("subheadline")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 mb-6 lg:mb-12"
            >
              <Link
                href={`/${locale}/properties`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                           bg-brand-cyan text-brand-navy font-bold text-base
                           shadow-[0_0_28px_rgba(0,201,201,0.4)]
                           hover:shadow-none hover:-translate-y-0.5 transition-all duration-200"
              >
                {t("cta_primary")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
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
            </motion.div>

            {/* Mobile architectural card (lg: hidden) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden mb-8"
            >
              <div className="border border-white/15 bg-white/[0.03] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-white/35 uppercase">
                    {t("portfolio_mandate")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                    <span className="text-[10px] text-brand-cyan font-bold uppercase">Active</span>
                  </div>
                </div>
                <div className="px-4 py-3 grid grid-cols-3 gap-3 border-b border-white/10">
                  {[
                    { type: "RESIDENTIAL", count: "120+" },
                    { type: "COMMERCIAL",  count: "45+"  },
                    { type: "INDUSTRIAL",  count: "15+"  },
                  ].map(({ type, count }) => (
                    <div key={type} className="text-center">
                      <p className="text-brand-cyan font-bold text-base leading-none">{count}</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-wide mt-0.5">{type}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5">
                  <p className="text-[10px] text-white/30 leading-relaxed">
                    {t("coverage_line")}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.82, duration: 0.6 }}
              className="flex flex-wrap items-center gap-5 pt-8 border-t border-white/10"
            >
              {[t("trust_earb"), t("trust_odpc"), t("trust_nairobi")].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cyan/20 flex items-center
                                   justify-center text-brand-cyan flex-shrink-0">
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="1.5,6 4.5,9 10.5,3" />
                    </svg>
                  </span>
                  <span className="text-white/60 text-sm font-medium">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ══ RIGHT: Property Image ══════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block relative h-[520px] overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80"
              alt="Modern Nairobi apartment building managed by Chabrin Agencies"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/30 to-transparent" />
            {/* Stats overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[9px] tracking-[0.25em] text-brand-cyan/60 uppercase font-bold mb-4">
                {t("portfolio_mandate")}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "180+", label: t("stat_properties") },
                  { value: "7",    label: t("stat_corridors") },
                  { value: "98%",  label: t("stat_retention") },
                ].map(({ value, label }) => (
                  <div key={label} className="border border-white/15 bg-white/[0.08] px-3 py-2.5 backdrop-blur-sm">
                    <p className="text-brand-cyan font-bold text-xl leading-none">{value}</p>
                    <p className="text-white/50 text-[9px] uppercase tracking-wide mt-1.5 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom fade */}
      <div aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-24
                   bg-gradient-to-t from-surface to-transparent pointer-events-none" />
    </section>
  );
}
