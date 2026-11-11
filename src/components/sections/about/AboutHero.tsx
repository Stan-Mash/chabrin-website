import { useTranslations } from "next-intl";
import AnimatedHeadline from "@/components/ui/AnimatedHeadline";

export default function AboutHero() {
  const t = useTranslations("about");

  return (
    <section className="bg-brand-navy py-24 md:py-32">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-0.5 bg-brand-cyan" />
            <span className="text-brand-cyan text-sm font-semibold tracking-widest uppercase">{t("eyebrow")}</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            <AnimatedHeadline text={t("hero_title")} as="span" className="block" />
            <AnimatedHeadline
              text={t("hero_title_accent")}
              as="span"
              className="block text-brand-cyan"
              delay={0.2}
            />
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            {t("hero_subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}
