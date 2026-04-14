import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { siteConfig } from "@/config/site";

export default function CTABanner() {
  const t      = useTranslations("cta_banner");
  const locale = useLocale();

  return (
    <section className="py-20 md:py-28 bg-brand-navy relative overflow-hidden">

      {/* ── Background accents ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 rounded-full
                   bg-brand-cyan/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full
                   bg-brand-navy-light/50 blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* ── Left — text ────────────────────────────────────────── */}
          <div className="max-w-xl text-center lg:text-left">
            <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-4">
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              {t("title")}
            </h2>
            <p className="text-white/65 text-lg leading-relaxed">
              {t("subtitle")}
            </p>

            {/* ── Office hours strip ── */}
            <div className="mt-6 inline-flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-brand-cyan flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Mon – Fri <strong className="text-white/80 font-semibold">8:00 AM – 5:00 PM</strong></span>
              </span>
              <span className="text-white/20 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-brand-cyan flex-shrink-0 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Saturday <strong className="text-white/80 font-semibold">8:30 AM – 12:00 PM</strong></span>
              </span>
            </div>
          </div>

          {/* ── Right — action cards ───────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

            {/* Primary — get in touch */}
            <Link
              href={`/${locale}/contact`}
              className="flex flex-col items-center justify-center gap-2 px-8 py-5
                         rounded-2xl bg-brand-cyan text-brand-navy font-bold
                         hover:bg-brand-cyan-dark transition-all duration-200
                         shadow-cyan hover:shadow-none hover:-translate-y-0.5
                         min-w-[180px] text-center"
            >
              <span className="text-2xl">📩</span>
              <span className="text-base font-bold">{t("cta_contact")}</span>
              <span className="text-xs font-normal opacity-70">{t("cta_contact_sub")}</span>
            </Link>

            {/* Secondary — WhatsApp */}
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hello%20Chabrin%2C%20I%20would%20like%20to%20discuss%20property%20management%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 px-8 py-5
                         rounded-2xl border-2 border-white/20 text-white font-bold
                         hover:border-white/50 hover:bg-white/5 transition-all duration-200
                         min-w-[180px] text-center"
            >
              <span className="text-2xl">💬</span>
              <span className="text-base font-bold">{t("cta_whatsapp")}</span>
              <span className="text-xs font-normal opacity-50">{t("cta_whatsapp_sub")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
