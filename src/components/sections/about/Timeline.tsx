"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
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
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" />

          <div className="space-y-10">
            {MILESTONES.map(({ year, title, desc }, i) => (
              <TimelineMilestone
                key={year}
                year={year}
                title={title}
                desc={desc}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineMilestone({
  year,
  title,
  desc,
  index,
}: {
  year: string;
  title: string;
  desc: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className={`relative flex gap-6 md:gap-0 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      {/* Content */}
      <div className={`flex-1 pb-2 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12"} pl-16 md:pl-0`}>
        <div className="bg-surface rounded-2xl p-6 shadow-card inline-block w-full">
          <span className="text-brand-cyan text-xs font-bold tracking-widest uppercase">{year}</span>
          <h3 className="font-bold text-brand-navy text-lg mt-1 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
        </div>
      </div>

      {/* Dot */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-cyan border-4 border-white shadow-cyan top-6" />

      {/* Spacer */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
}
