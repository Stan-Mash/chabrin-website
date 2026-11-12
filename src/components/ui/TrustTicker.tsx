import { useTranslations } from "next-intl";

export default function TrustTicker() {
  const t = useTranslations("footer");

  const items = [
    { label: t("ticker_earb_label"),     detail: t("ticker_earb_detail") },
    { label: t("ticker_odpc_label"),     detail: t("ticker_odpc_detail") },
    { label: t("ticker_coverage_label"), detail: t("ticker_coverage_detail") },
    { label: t("ticker_years_label"),    detail: t("ticker_years_detail") },
  ];

  return (
    <div className="bg-brand-navy-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {items.map(({ label, detail }) => (
            <div key={label} className="px-6 py-4 first:pl-0 last:pr-0">
              <p className="text-[11px] font-bold tracking-widest text-brand-cyan uppercase">
                {label}
              </p>
              <p className="text-[11px] text-white/40 mt-0.5 leading-snug">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
