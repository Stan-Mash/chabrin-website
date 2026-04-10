import { useTranslations } from "next-intl";

export default function WhyChabrin() {
  const t = useTranslations("why_chabrin");

  const PILLARS = [
    {
      id:        "licensed",
      title:     t("licensed_title"),
      desc:      t("licensed_desc"),
      stat:      t("licensed_stat"),
      statLabel: t("licensed_stat_label"),
    },
    {
      id:        "responsive",
      title:     t("responsive_title"),
      desc:      t("responsive_desc"),
      stat:      t("responsive_stat"),
      statLabel: t("responsive_stat_label"),
    },
    {
      id:        "tech",
      title:     t("tech_title"),
      desc:      t("tech_desc"),
      stat:      t("tech_stat"),
      statLabel: t("tech_stat_label"),
    },
    {
      id:        "local",
      title:     t("local_title"),
      desc:      t("local_desc"),
      stat:      t("local_stat"),
      statLabel: t("local_stat_label"),
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="max-w-2xl mb-14">
          <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy leading-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* ── Pillars grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PILLARS.map(({ id, title, desc, stat, statLabel }) => (
            <div
              key={id}
              className="flex gap-6 p-6 rounded-2xl border border-slate-100
                         hover:border-brand-cyan/30 hover:bg-surface/50
                         transition-all duration-300 group"
            >
              {/* Stat badge */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center
                              w-20 h-20 rounded-2xl bg-brand-navy group-hover:bg-brand-navy-dark
                              transition-colors text-center">
                <span className="text-brand-cyan font-bold text-xl leading-none">
                  {stat}
                </span>
                <span className="text-white/50 text-[10px] font-medium leading-tight mt-1 px-1">
                  {statLabel}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-brand-navy font-bold text-lg mb-2 leading-snug">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
