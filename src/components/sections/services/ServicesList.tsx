import { useTranslations } from "next-intl";

export default function ServicesList() {
  const t = useTranslations("services_page");

  const SERVICES = [
    {
      id: "management",
      icon: "🏢",
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
      icon: "🔑",
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
      icon: "📊",
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
      icon: "✍️",
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
          <div
            key={id}
            className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 items-center`}
          >
            {/* Icon block */}
            <div className="flex-shrink-0 w-full lg:w-80">
              <div className={`rounded-3xl p-12 flex items-center justify-center ${i % 2 === 0 ? "bg-surface" : "bg-brand-navy"}`}>
                <span className="text-8xl">{icon}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-navy mb-4">{title}</h2>
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
        ))}
      </div>
    </section>
  );
}
