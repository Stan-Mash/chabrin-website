import { useTranslations } from "next-intl";

export default function StatsBar() {
  const t = useTranslations("stats");

  const STATS = [
    { value: t("zones_value"),      label: t("zones_label") },
    { value: t("years_value"),      label: t("years_label") },
    { value: t("retention_value"),  label: t("retention_label") },
  ];

  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-y sm:divide-y-0 divide-slate-100">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center py-8 px-6 text-center
                         group hover:bg-surface transition-colors duration-200"
            >
              <span className="text-3xl md:text-4xl font-bold text-brand-navy
                               group-hover:text-brand-cyan transition-colors duration-200 leading-none mb-2">
                {value}
              </span>
              <span className="text-sm text-slate-500 font-medium leading-snug">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
