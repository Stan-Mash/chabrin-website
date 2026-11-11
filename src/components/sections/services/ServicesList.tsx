import React from "react";
import { useTranslations } from "next-intl";
import AnimatedHeadline from "@/components/ui/AnimatedHeadline";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ServicesList() {
  const t = useTranslations("services_page");

  type ServiceItem = { id: string; icon: React.ReactNode; title: string; desc: string; features: string[] };
  const SERVICES: ServiceItem[] = [
    {
      id: "management",
      icon: (
        <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      ),
      title: t("management_title"),
      desc:  t("management_desc"),
      features: [
        t("management_f1"),
        t("management_f2"),
        t("management_f3"),
        t("management_f4"),
      ],
    },
    {
      id: "leasing",
      icon: (
        <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
      ),
      title: t("leasing_title"),
      desc:  t("leasing_desc"),
      features: [
        t("leasing_f1"),
        t("leasing_f2"),
        t("leasing_f3"),
        t("leasing_f4"),
      ],
    },
    {
      id: "valuation",
      icon: (
        <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      title: t("valuation_title"),
      desc:  t("valuation_desc"),
      features: [
        t("valuation_f1"),
        t("valuation_f2"),
        t("valuation_f3"),
        t("valuation_f4"),
      ],
    },
    {
      id: "digital",
      icon: (
        <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      title: t("digital_title"),
      desc:  t("digital_desc"),
      features: [
        t("digital_f1"),
        t("digital_f2"),
        t("digital_f3"),
        t("digital_f4"),
      ],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {SERVICES.map(({ id, icon, title, desc, features }, i) => (
          <ScrollReveal key={id} delay={0.05} direction={i % 2 === 0 ? "left" : "right"}>
            <div
              className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 items-center`}
            >
              {/* Icon block */}
              <div className="flex-shrink-0 w-full lg:w-80">
                <div className={`rounded-3xl p-12 flex items-center justify-center ${i % 2 === 0 ? "bg-surface" : "bg-brand-navy"}`}>
                  <span className={i % 2 === 0 ? "text-brand-navy" : "text-brand-cyan"}>{icon}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <AnimatedHeadline
                  text={title}
                  as="h2"
                  className="text-2xl md:text-3xl font-extrabold text-brand-navy mb-4"
                />
                <p className="text-slate-600 leading-relaxed mb-6">{desc}</p>
                <ul className="space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-cyan/20 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-slate-600 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
