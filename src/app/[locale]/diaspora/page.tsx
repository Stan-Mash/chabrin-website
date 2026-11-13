import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { siteConfig } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSwahili   = locale === "sw";
  const base        = siteConfig.url;
  return {
    title: isSwahili
      ? "Wekeza Kenya Kutoka Nje: Usimamizi wa Mali"
      : "Invest in Kenya From Abroad: Property Management for Diaspora",
    description: isSwahili
      ? "Chabrin Agencies inasimamia mali za Wakenya wanaoishi nje. Upangaji, ukusanyaji wa kodi, na taarifa za kila mwezi. Imesajiliwa EARB."
      : "Chabrin Agencies manages Nairobi properties for Kenyans living abroad. Full management, monthly remittance statements, and EARB-registered accountability.",
    alternates: {
      canonical: `${base}/${locale}/diaspora`,
      languages: {
        en: `${base}/en/diaspora`,
        sw: `${base}/sw/diaspora`,
      },
    },
  };
}

export default async function DiasporaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("diaspora");

  const PILLARS = [
    { num: "01", title: t("pillar_1_title"), desc: t("pillar_1_desc") },
    { num: "02", title: t("pillar_2_title"), desc: t("pillar_2_desc") },
    { num: "03", title: t("pillar_3_title"), desc: t("pillar_3_desc") },
    { num: "04", title: t("pillar_4_title"), desc: t("pillar_4_desc") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-5">
              {t("eyebrow")}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-6">
              {t("hero_title")}{" "}
              <span className="text-brand-cyan">{t("hero_title_accent")}</span>
            </h1>
            <p className="text-white/60 text-xl leading-relaxed max-w-2xl mb-10">
              {t("hero_subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                           bg-brand-cyan text-brand-navy font-bold
                           shadow-[0_0_28px_rgba(0,201,201,0.4)]
                           hover:shadow-none hover:-translate-y-0.5 transition-all duration-200"
              >
                {t("cta_contact")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                           border-2 border-white/25 text-white font-semibold
                           hover:border-white/60 hover:bg-white/5 transition-all duration-200"
              >
                {t("cta_whatsapp")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why trust Chabrin */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy leading-tight mb-4">
              {t("why_title")}
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              {t("why_subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-0 border border-slate-200">
            {PILLARS.map(({ num, title, desc }, i) => (
              <div
                key={num}
                className={`p-8 ${
                  i % 2 === 0 ? "border-r border-slate-200" : ""
                } ${i < 2 ? "border-b border-slate-200" : ""}`}
              >
                <span className="text-[11px] font-mono font-bold text-slate-200 tracking-wider block mb-4">
                  {num}
                </span>
                <h3 className="text-brand-navy font-bold text-lg mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-surface border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            {t("cta_title")}
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-10">
            {t("cta_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                         bg-brand-navy text-white font-bold
                         hover:bg-brand-navy-dark transition-colors"
            >
              {t("cta_contact")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                         border-2 border-brand-navy text-brand-navy font-semibold
                         hover:bg-brand-navy hover:text-white transition-all duration-200"
            >
              {t("cta_whatsapp")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
