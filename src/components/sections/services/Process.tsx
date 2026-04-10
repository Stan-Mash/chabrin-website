import { useTranslations } from "next-intl";

export default function Process() {
  const t = useTranslations("services_page");

  const STEPS = [
    { n: "01", title: t("step1_title"), desc: t("step1_desc") },
    { n: "02", title: t("step2_title"), desc: t("step2_desc") },
    { n: "03", title: t("step3_title"), desc: t("step3_desc") },
    { n: "04", title: t("step4_title"), desc: t("step4_desc") },
    { n: "05", title: t("step5_title"), desc: t("step5_desc") },
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-0.5 bg-brand-cyan" />
            <span className="text-brand-cyan text-sm font-semibold tracking-widest uppercase">{t("process_eyebrow")}</span>
            <span className="w-6 h-0.5 bg-brand-cyan" />
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy">{t("process_title")}</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">{t("process_subtitle")}</p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-slate-200 mx-24" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="relative flex flex-col items-center text-center">
                {/* Step circle */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-brand-navy flex items-center justify-center mb-5 shadow-navy">
                  <span className="text-brand-cyan font-extrabold text-xl">{n}</span>
                </div>
                <h3 className="font-bold text-brand-navy mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
