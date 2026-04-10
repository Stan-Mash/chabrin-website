import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ServicesCTA() {
  const t = useTranslations("services_page");

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-brand-navy mb-3">{t("landlord_eyebrow")}</h2>
          <p className="text-slate-500">{t("tenant_eyebrow")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Landlord card */}
          <div className="rounded-3xl bg-brand-navy p-10 flex flex-col">
            <span className="text-5xl mb-6">🏠</span>
            <h3 className="text-2xl font-extrabold text-white mb-3">{t("landlord_title")}</h3>
            <p className="text-slate-300 leading-relaxed mb-8 flex-1">
              {t("landlord_desc")}
            </p>
            <Link
              href="/en/contact"
              className="self-start px-8 py-3 rounded-full bg-brand-cyan text-white font-bold hover:bg-brand-cyan-dark transition-colors shadow-cyan"
            >
              {t("landlord_cta")}
            </Link>
          </div>

          {/* Tenant card */}
          <div className="rounded-3xl bg-brand-cyan p-10 flex flex-col">
            <span className="text-5xl mb-6">🔍</span>
            <h3 className="text-2xl font-extrabold text-white mb-3">{t("tenant_title")}</h3>
            <p className="text-white/80 leading-relaxed mb-8 flex-1">
              {t("tenant_desc")}
            </p>
            <Link
              href="/en/properties"
              className="self-start px-8 py-3 rounded-full bg-white text-brand-cyan font-bold hover:bg-white/90 transition-colors shadow-md"
            >
              {t("tenant_cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
