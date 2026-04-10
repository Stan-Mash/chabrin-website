import { useTranslations } from "next-intl";

export default function AboutHero() {
  const t = useTranslations("about");

  return (
    <section className="relative bg-brand-navy overflow-hidden py-24 md:py-32">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-cyan/5 rounded-full blur-2xl -translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-0.5 bg-brand-cyan" />
            <span className="text-brand-cyan text-sm font-semibold tracking-widest uppercase">{t("eyebrow")}</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            {t("hero_title")}<br />
            <span className="text-brand-cyan">{t("hero_title_accent")}</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            {t("hero_subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}
