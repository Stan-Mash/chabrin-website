"use client";

import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedHeadline from "@/components/ui/AnimatedHeadline";

export default function Timeline() {
  const t = useTranslations("about");

  const MILESTONES = [
    { year: "1990s", title: t("milestone_1990s_title"), desc: t("milestone_1990s_desc") },
    { year: "2000s", title: t("milestone_2000s_title"), desc: t("milestone_2000s_desc") },
    { year: "2010",  title: t("milestone_2010_title"),  desc: t("milestone_2010_desc") },
    { year: "2015",  title: t("milestone_2015_title"),  desc: t("milestone_2015_desc") },
    { year: "2020",  title: t("milestone_2020_title"),  desc: t("milestone_2020_desc") },
    { year: "2024",  title: t("milestone_2024_title"),  desc: t("milestone_2024_desc") },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-0.5 bg-brand-cyan" />
            <span className="text-brand-cyan text-sm font-semibold tracking-widest uppercase">{t("timeline_eyebrow")}</span>
            <span className="w-6 h-0.5 bg-brand-cyan" />
          </span>
          <AnimatedHeadline
            text={t("timeline_title")}
            as="h2"
            className="text-3xl md:text-4xl font-extrabold text-brand-navy"
          />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MILESTONES.map(({ year, title, desc }, i) => (
            <ScrollReveal key={year} delay={i * 0.07}>
              <div className="bg-surface rounded-2xl p-6 h-full border border-slate-100 hover:border-brand-cyan/30 transition-colors group">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan flex-shrink-0" />
                  <span className="text-brand-cyan text-xs font-bold tracking-widest uppercase">{year}</span>
                </div>
                <h3 className="font-bold text-brand-navy text-base mb-2 leading-snug group-hover:text-brand-cyan transition-colors">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
