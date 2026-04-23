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

      {/* ── Parallax blobs ──────────────────────────────────────────────── */}
      <HeroParallaxBlobs />

      {/* ── Cursor spotlight ────────────────────────────────────────────── */}
      <CursorSpotlight />

      {/* Dot-grid overlay */}
      <div aria-hidden="true"
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Content grid ────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ══ LEFT: Copy ══════════════════════════════════════════════════ */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
              <AnimatedHeadline text={t("headline")} as="span" className="block" delay={0.1} />
              <AnimatedHeadline text={t("headline_accent")} as="span"
                className="block text-brand-cyan mt-1" delay={0.24} />
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/65 text-lg md:text-xl leading-relaxed max-w-lg mb-10"
            >
              {t("subheadline")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 mb-6 lg:mb-12"
            >
              <Link
                href={`/${locale}/properties`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                           bg-brand-cyan text-brand-navy font-bold text-base
                           hover:bg-brand-cyan-dark transition-all duration-200
                           shadow-[0_0_24px_rgba(0,201,201,0.35)] hover:shadow-none hover:-translate-y-0.5"
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

            {/* ── Mobile-only photo mosaic ────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden grid grid-cols-2 gap-3 mb-8"
            >
              <div className="relative col-span-1 h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
                  alt="Premium property managed by Chabrin Agencies"
                  fill className="object-cover" sizes="45vw" priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                  <p className="text-brand-cyan text-[9px] font-bold uppercase tracking-widest mb-0.5">Portfolio</p>
                  <p className="text-white font-bold text-xs leading-tight">Nairobi Metro</p>
                  <p className="text-white/50 text-[9px]">Westlands · Karen · Kasarani</p>
                </div>
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/50
                                backdrop-blur-sm border border-white/15 rounded-full px-2 py-1">
                  <span className="w-1 h-1 rounded-full bg-brand-cyan animate-pulse" />
                  <span className="text-white text-[9px] font-semibold">EARB</span>
                </div>
              </div>
              <div className="col-span-1 flex flex-col gap-3">
                <div className="flex-1 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-3">
                  <span className="text-brand-navy font-extrabold text-2xl leading-none">30+</span>
                  <span className="text-slate-400 text-[10px] font-medium mt-0.5">Years</span>
                </div>
                <div className="relative flex-[1.6] rounded-2xl overflow-hidden border border-brand-cyan/25 shadow-lg min-h-[80px]">
                  <Image
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80"
                    alt="Interior of a Chabrin managed property"
                    fill className="object-cover" sizes="45vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                    <p className="text-white font-bold text-[10px]">Kilimani</p>
                    <span className="bg-brand-cyan text-brand-navy text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                      Available
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.88, duration: 0.6 }}
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

          {/* ══ RIGHT: Premium photo mosaic ═════════════════════════════════ */}
          <div className="hidden lg:block relative h-[540px]">

            {/* ── Glow halo behind the entire stack ─────────────────────── */}
            <div aria-hidden="true"
              className="absolute inset-6 rounded-3xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 60% 40%, rgba(0,201,201,0.18) 0%, transparent 70%)",
                filter: "blur(32px)",
              }}
            />

            {/* ── Main photo ─────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.025, transition: { duration: 0.35 } }}
              className="absolute top-0 left-0 right-0 h-[308px] rounded-2xl overflow-hidden
                         shadow-[0_20px_60px_rgba(0,0,0,0.55)] border border-white/12 cursor-pointer"
            >
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=960&q=80"
                alt="Premium residential property managed by Chabrin Agencies, Nairobi"
                fill className="object-cover"
                sizes="(max-width: 1280px) 44vw, 480px"
                priority
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              {/* EARB badge — top left */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5
                              bg-black/45 backdrop-blur-md border border-white/20
                              rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                <span className="text-white text-[10px] font-bold tracking-wide uppercase">
                  EARB Registered Agency
                </span>
              </div>

              {/* Active listings — top right */}
              <div className="absolute top-4 right-4 bg-white/12 backdrop-blur-md
                              border border-white/20 rounded-xl px-3 py-2 text-center">
                <p className="text-white font-extrabold text-lg leading-none">180+</p>
                <p className="text-white/60 text-[9px] font-semibold uppercase tracking-wide mt-0.5">Listings</p>
              </div>

              {/* Bottom labels */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                <p className="text-brand-cyan text-[10px] font-bold uppercase tracking-widest mb-1">
                  Premium Portfolio
                </p>
                <p className="text-white font-bold text-base leading-tight">Nairobi Metropolitan</p>
                <p className="text-white/55 text-xs mt-0.5">
                  Westlands · Kilimani · Karen · Kasarani & beyond
                </p>
              </div>
            </motion.div>

            {/* ── Floating "30+ Years" badge — junction of both photos ────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.52, type: "spring", stiffness: 280, damping: 18 }}
              className="absolute z-20"
              style={{ top: 284, left: -20 }}
            >
              {/* continuous levitate loop */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="w-[84px] h-[84px] bg-white rounded-2xl
                           shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                           ring-4 ring-white/30
                           flex flex-col items-center justify-center text-center"
              >
                <span className="text-brand-navy font-extrabold text-2xl leading-none">30+</span>
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wide mt-1">Years</span>
              </motion.div>
            </motion.div>

            {/* ── Second photo — overlapping below-right ────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 36, x: 12 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.42, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.025, transition: { duration: 0.35 } }}
              className="absolute bottom-[64px] left-14 right-0 h-[220px] rounded-2xl overflow-hidden
                         shadow-[0_12px_40px_rgba(0,0,0,0.45)] border border-white/15 cursor-pointer"
            >
              <Image
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=720&q=80"
                alt="Interior of a Chabrin managed property in Nairobi"
                fill className="object-cover"
                sizes="(max-width: 1280px) 33vw, 360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/55 text-[10px] uppercase tracking-wide font-bold">Featured Unit</p>
                    <p className="text-white font-bold text-sm">Kilimani · Nairobi</p>
                  </div>
                  {/* Solid cyan pill — much more visible */}
                  <span className="bg-brand-cyan text-brand-navy text-[10px] font-extrabold
                                   px-3 py-1.5 rounded-full shadow-[0_0_12px_rgba(0,201,201,0.5)]">
                    Available
                  </span>
                </div>
              </div>

              {/* Floating happy-landlord stat on second photo */}
              <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md
                              border border-white/15 rounded-xl px-3 py-2 text-center">
                <p className="text-brand-cyan font-extrabold text-base leading-none">98%</p>
                <p className="text-white/55 text-[9px] font-semibold mt-0.5">Satisfied</p>
              </div>
            </motion.div>

            {/* ── Bottom credential row ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 right-0 flex gap-3"
            >
              <div className="flex-1 bg-brand-cyan/15 border border-brand-cyan/30 rounded-xl
                              p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-brand-cyan flex-shrink-0" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6
                         11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623
                         5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152
                         c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <p className="text-brand-cyan font-extrabold text-sm">EARB Licensed</p>
                </div>
                <p className="text-white/55 text-xs leading-snug">Kenya's Estate Agents Board</p>
              </div>
              <div className="flex-1 bg-white/8 border border-white/15 rounded-xl
                              p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-white/70 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-white font-extrabold text-sm">24 h Response</p>
                </div>
                <p className="text-white/55 text-xs leading-snug">Guaranteed landlord SLA</p>
              </div>
            </motion.div>

          </div>{/* end right mosaic */}

        </div>
      </div>

      {/* ── Bottom fade ─────────────────────────────────────────────────── */}
      <div aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-24
                   bg-gradient-to-t from-surface to-transparent pointer-events-none" />
    </section>
  );
}
