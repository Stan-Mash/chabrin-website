import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Accreditations() {
  const t = useTranslations("about");

  const BADGES = [
    {
      icon: (
        <svg className="w-7 h-7 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
      label: t("badge_earb_title"),    desc: t("badge_earb_desc"),
    },
    {
      icon: (
        <svg className="w-7 h-7 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      label: t("badge_odpc_title"),    desc: t("badge_odpc_desc"),
    },
    {
      icon: (
        <svg className="w-7 h-7 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      label: t("badge_company_title"), desc: t("badge_company_desc"),
    },
    {
      icon: (
        <svg className="w-7 h-7 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: t("badge_years_title"),   desc: t("badge_years_desc"),
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-cyan text-sm font-semibold tracking-widest uppercase mb-3">
            {t("accreditations_eyebrow")}
          </p>
          <h2 className="text-3xl font-extrabold text-brand-navy mb-3">
            {t("accreditations_title")}
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            {t("accreditations_subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {BADGES.map(({ icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface
                         border border-slate-100 hover:border-brand-cyan/30 hover:shadow-card transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-3">
                {icon}
              </div>
              <h3 className="font-bold text-brand-navy mb-1">{label}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="rounded-3xl bg-brand-navy px-8 py-12 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            {t("accreditations_cta_title")}
          </h3>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            {t("accreditations_cta_subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/en/contact"
              className="px-8 py-3 rounded-full bg-brand-cyan text-white font-bold
                         hover:bg-brand-cyan-dark transition-colors shadow-cyan"
            >
              {t("cta_contact")}
            </Link>
            <Link
              href="/en/properties"
              className="px-8 py-3 rounded-full border-2 border-white text-white font-bold
                         hover:bg-white/10 transition-colors"
            >
              {t("cta_properties")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
