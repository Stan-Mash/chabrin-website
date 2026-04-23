"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import AnimatedHeadline from "@/components/ui/AnimatedHeadline";
import CursorSpotlight from "@/components/ui/CursorSpotlight";
import HeroParallaxBlobs from "@/components/sections/HeroParallaxBlobs";

const STATS = [
  { value: "30+",  label: "Years",     cyan: false },
  { value: "180+", label: "Listings",  cyan: true  },
  { value: "98%",  label: "Satisfied", cyan: false },
  { value: "EARB", label: "Licensed",  cyan: true  },
];

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
            </motion.div>

            {/* Mobile photo (lg: hidden) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden relative h-52 rounded-2xl overflow-hidden mb-8
                         shadow-2xl border border-white/10"
            >
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
                alt="Premium property managed by Chabrin Agencies"
                fill className="object-cover" sizes="100vw" priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="text-brand-cyan text-[10px] font-bold uppercase tracking-widest mb-0.5">
                    Premium Portfolio
                  </p>
                  <p className="text-white font-bold text-sm">Nairobi Metropolitan</p>
                </div>
                <span className="bg-brand-cyan text-brand-navy text-[10px] font-extrabold px-3 py-1.5 rounded-full">
                  Available
                </span>
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50
                              backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                <span className="text-white text-[10px] font-semibold">EARB Registered Agency</span>
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
                                   justify-center text-brand-cyan text-xs font-bold flex-shrink-0">
                    ✓
                  </span>
                  <span className="text-white/60 text-sm font-medium">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ══ RIGHT: clean two-column photo panel ════════════════════════ */}
          <div className="hidden lg:grid grid-cols-5 gap-3 h-[500px]">

            {/* ── Main photo  (3 / 5 columns) ───────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.18, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-3 relative rounded-2xl overflow-hidden
                         shadow-[0_24px_64px_rgba(0,0,0,0.5)] border border-white/10"
            >
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=960&q=80"
                alt="Premium residential property managed by Chabrin Agencies, Nairobi"
                fill className="object-cover"
                sizes="(max-width: 1280px) 30vw, 340px"
                priority
              />
              {/* Gradient — darker at top and bottom for badge legibility */}
              <div className="absolute inset-0 bg-gradient-to-t
                              from-black/80 via-transparent to-black/40" />

              {/* EARB badge — top left */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5
                              bg-black/50 backdrop-blur-md border border-white/20
                              rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                <span className="text-white text-[10px] font-bold tracking-wide uppercase">
                  EARB Registered Agency
                </span>
              </div>

              {/* Bottom label */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                <p className="text-brand-cyan text-[10px] font-bold uppercase tracking-widest mb-1">
                  Premium Portfolio
                </p>
                <p className="text-white font-bold text-base leading-tight">
                  Nairobi Metropolitan
                </p>
                <p className="text-white/55 text-xs mt-0.5">
                  Westlands · Kilimani · Karen · Kasarani & beyond
                </p>
              </div>
            </motion.div>

            {/* ── Right panel  (2 / 5 columns) ──────────────────────────── */}
            <div className="col-span-2 flex flex-col gap-3">

              {/* Second photo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-2xl overflow-hidden flex-[1.15]
                           shadow-[0_12px_36px_rgba(0,0,0,0.45)] border border-white/10 min-h-0"
              >
                <Image
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"
                  alt="Interior of a Chabrin managed property in Nairobi"
                  fill className="object-cover"
                  sizes="(max-width: 1280px) 18vw, 220px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="bg-brand-cyan text-brand-navy text-[10px] font-extrabold
                                   px-2.5 py-1 rounded-full">
                    Available
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-white/55 text-[9px] uppercase tracking-wide font-bold">Featured</p>
                  <p className="text-white font-bold text-xs">Kilimani · Nairobi</p>
                </div>
              </motion.div>

              {/* Stats grid card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 rounded-2xl border border-white/12 bg-white/5
                           backdrop-blur-sm p-4 grid grid-cols-2 gap-x-3 gap-y-4
                           content-center min-h-0"
              >
                {STATS.map(({ value, label, cyan }) => (
                  <div key={label}>
                    <p className={`font-extrabold text-xl leading-none ${
                      cyan ? "text-brand-cyan" : "text-white"
                    }`}>
                      {value}
                    </p>
                    <p className="text-white/45 text-[10px] font-medium mt-1 uppercase tracking-wide">
                      {label}
                    </p>
                  </div>
                ))}
              </motion.div>

              {/* Credential pill row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 bg-brand-cyan/10 border border-brand-cyan/25
                                rounded-xl px-3 py-2.5">
                  <svg className="w-3.5 h-3.5 text-brand-cyan flex-shrink-0" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-brand-cyan font-bold text-xs leading-none">EARB Licensed</p>
                    <p className="text-white/45 text-[10px] mt-0.5">Kenya Estate Agents Board</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/12
                                rounded-xl px-3 py-2.5">
                  <svg className="w-3.5 h-3.5 text-white/60 flex-shrink-0" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-xs leading-none">24 h Response</p>
                    <p className="text-white/45 text-[10px] mt-0.5">Guaranteed landlord SLA</p>
                  </div>
                </div>
              </motion.div>

            </div>{/* end right panel */}
          </div>{/* end grid */}

        </div>
      </div>

      {/* Bottom fade */}
      <div aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-24
                   bg-gradient-to-t from-surface to-transparent pointer-events-none" />
    </section>
  );
}
