import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { siteConfig } from "@/config/site";
import AnimatedHeadline from "@/components/ui/AnimatedHeadline";
import ScrollReveal from "@/components/ui/ScrollReveal";

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

          {/* ── Left - text ────────────────────────────────────────── */}
          <ScrollReveal className="max-w-xl text-center lg:text-left">
            <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-4">
              {t("eyebrow")}
            </p>
            <AnimatedHeadline
              text={t("title")}
              as="h2"
              className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4"
            />
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
          </ScrollReveal>

          {/* ── Right - action cards ───────────────────────────────── */}
          <ScrollReveal delay={0.15} className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

            {/* Primary - get in touch */}
            <Link
              href={`/${locale}/contact`}
              className="flex flex-col items-center justify-center gap-2 px-8 py-5
                         rounded-2xl bg-brand-cyan text-brand-navy font-bold
                         hover:bg-brand-cyan-dark transition-all duration-200
                         shadow-cyan hover:shadow-none hover:-translate-y-0.5
                         min-w-[180px] text-center"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span className="text-base font-bold">{t("cta_contact")}</span>
              <span className="text-xs font-normal opacity-70">{t("cta_contact_sub")}</span>
            </Link>

            {/* Secondary - WhatsApp */}
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hello%20Chabrin%2C%20I%20would%20like%20to%20discuss%20property%20management%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 px-8 py-5
                         rounded-2xl border-2 border-white/20 text-white font-bold
                         hover:border-white/50 hover:bg-white/5 transition-all duration-200
                         min-w-[180px] text-center"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.86L.054 23.447a.75.75 0 00.914.914l5.587-1.479A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.86 0-3.607-.484-5.12-1.333l-.368-.213-3.812 1.008 1.008-3.812-.213-.368A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              <span className="text-base font-bold">{t("cta_whatsapp")}</span>
              <span className="text-xs font-normal opacity-50">{t("cta_whatsapp_sub")}</span>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
