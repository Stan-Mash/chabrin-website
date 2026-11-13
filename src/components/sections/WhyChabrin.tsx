import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import AnimatedHeadline from "@/components/ui/AnimatedHeadline";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function WhyChabrin() {
  const t      = useTranslations("why_chabrin");
  const locale = useLocale();

  const PILLARS = [
    {
      num:   "01",
      title: t("licensed_title"),
      desc:  t("licensed_desc"),
      stat:  t("licensed_stat"),
    },
    {
      num:   "02",
      title: t("responsive_title"),
      desc:  t("responsive_desc"),
      stat:  t("responsive_stat"),
    },
    {
      num:   "03",
      title: t("tech_title"),
      desc:  t("tech_desc"),
      stat:  t("tech_stat"),
    },
    {
      num:   "04",
      title: t("local_title"),
      desc:  t("local_desc"),
      stat:  t("local_stat"),
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-brand-navy overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <ScrollReveal className="max-w-2xl mb-14">
          <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-3">
            {t("report_eyebrow")}
          </p>
          <AnimatedHeadline
            text={t("report_title")}
            as="h2"
            className="text-3xl md:text-4xl font-bold text-white leading-tight"
          />
          <AnimatedHeadline
            text={t("report_accent")}
            as="span"
            className="text-3xl md:text-4xl font-bold text-brand-cyan leading-tight block mb-4"
            delay={0.1}
          />
          <p className="text-white/55 text-lg leading-relaxed">
            {t("report_subtitle")}
          </p>
        </ScrollReveal>

        {/* Split-screen: pillars + statement card */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── LEFT: 4 numbered pillars ─────────────────────────────── */}
          <ScrollReveal className="space-y-0">
            {PILLARS.map(({ num, title, desc, stat }, i) => (
              <div
                key={num}
                className={`flex gap-5 py-6 ${
                  i < PILLARS.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                {/* Index numeral */}
                <div className="flex-shrink-0 w-10 text-right">
                  <span className="text-[11px] font-mono font-bold text-brand-cyan/40 tracking-wider">
                    {num}
                  </span>
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="text-white font-bold text-base leading-snug">{title}</h3>
                    <span className="ml-auto flex-shrink-0 text-brand-cyan font-extrabold text-sm">
                      {stat}
                    </span>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="pt-6">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan
                           text-brand-navy font-bold text-sm rounded-full
                           hover:-translate-y-0.5 transition-all duration-200
                           shadow-[0_0_20px_rgba(0,201,201,0.3)]"
              >
                {t("cta_label")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>

          {/* ── RIGHT: Management Services Panel ─────────────────────── */}
          <ScrollReveal delay={0.15}>
            <div className="border border-white/15 bg-white/[0.03]">

              {/* Panel header */}
              <div className="border-b border-white/15 px-5 py-4">
                <p className="text-[9px] tracking-[0.25em] text-brand-cyan/60 uppercase font-bold mb-1">
                  {t("services_panel_label")}
                </p>
                <p className="text-white font-bold text-sm">{t("services_panel_title")}</p>
              </div>

              {/* Services checklist */}
              <div className="px-5 py-5 space-y-3">
                {([
                  t("service_1"),
                  t("service_2"),
                  t("service_3"),
                  t("service_4"),
                  t("service_5"),
                  t("service_6"),
                  t("service_7"),
                  t("service_8"),
                ] as string[]).map((service) => (
                  <div key={service} className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/70 text-sm leading-snug">{service}</span>
                  </div>
                ))}
              </div>

              {/* SLA note */}
              <div className="border-t border-white/10 px-5 py-4 bg-brand-cyan/5">
                <p className="text-[9px] tracking-[0.2em] text-brand-cyan/70 uppercase font-bold mb-1.5">
                  {t("services_sla_label")}
                </p>
                <p className="text-white/55 text-xs leading-relaxed">
                  {t("services_sla_note")}
                </p>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
