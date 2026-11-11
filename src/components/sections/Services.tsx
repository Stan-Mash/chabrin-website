import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import AnimatedHeadline from "@/components/ui/AnimatedHeadline";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Services() {
  const t      = useTranslations("services_section");
  const locale = useLocale();

  const SERVICES = [
    {
      id:   "management",
      icon: (
        <svg className="w-6 h-6 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      ),
      title: t("management_title"),
      desc:  t("management_desc"),
      href:  "/services#management",
    },
    {
      id:   "leasing",
      icon: (
        <svg className="w-6 h-6 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
      ),
      title: t("leasing_title"),
      desc:  t("leasing_desc"),
      href:  "/services#leasing",
    },
    {
      id:   "valuation",
      icon: (
        <svg className="w-6 h-6 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      title: t("valuation_title"),
      desc:  t("valuation_desc"),
      href:  "/services#valuation",
    },
    {
      id:   "digital",
      icon: (
        <svg className="w-6 h-6 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      ),
      title: t("digital_title"),
      desc:  t("digital_desc"),
      href:  "/services#digital",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ─────────────────────────────────────────── */}
        <ScrollReveal className="max-w-2xl mb-14">
          <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-3">
            {t("eyebrow")}
          </p>
          <AnimatedHeadline
            text={t("title")}
            as="h2"
            className="text-3xl md:text-4xl font-bold text-brand-navy leading-tight mb-4"
          />
          <p className="text-slate-500 text-lg leading-relaxed">
            {t("subtitle")}
          </p>
        </ScrollReveal>

        {/* ── Service cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map(({ id, icon, title, desc, href }, i) => (
            <ScrollReveal key={id} delay={i * 0.1}>
              <Link
                href={`/${locale}${href}`}
                className="group relative bg-white rounded-2xl p-6 border border-slate-100
                           shadow-card hover:shadow-card-hover hover:-translate-y-1
                           transition-all duration-300 flex flex-col h-full"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center
                                mb-5 group-hover:bg-brand-cyan/10 transition-colors">
                  {icon}
                </div>

                {/* Title */}
                <h3 className="text-brand-navy font-bold text-lg mb-3 leading-snug
                               group-hover:text-brand-navy-dark transition-colors">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed flex-1">
                  {desc}
                </p>

                {/* Learn more arrow */}
                <div className="flex items-center gap-1.5 mt-5 text-brand-cyan text-sm font-semibold">
                  <span>{t("learn_more")}</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-brand-cyan
                                scale-x-0 group-hover:scale-x-100 transition-transform
                                duration-300 origin-left rounded-full" />
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* ── View all services CTA ──────────────────────────────────── */}
        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 text-brand-navy font-semibold
                       hover:text-brand-cyan transition-colors text-sm"
          >
            {t("view_all")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
