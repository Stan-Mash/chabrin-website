import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Accreditations() {
  const t = useTranslations("about");

  const BADGES = [
    { icon: "🏛️", label: t("badge_earb_title"),    desc: t("badge_earb_desc") },
    { icon: "🔒", label: t("badge_odpc_title"),    desc: t("badge_odpc_desc") },
    { icon: "📋", label: t("badge_company_title"), desc: t("badge_company_desc") },
    { icon: "⏱️", label: t("badge_years_title"),   desc: t("badge_years_desc") },
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
              <span className="text-4xl mb-3">{icon}</span>
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
