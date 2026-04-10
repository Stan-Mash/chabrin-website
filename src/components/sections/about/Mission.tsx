import { useTranslations } from "next-intl";

export default function Mission() {
  const t = useTranslations("about");

  const VALUES = [
    { icon: "🤝", title: t("value_integrity_title"),       desc: t("value_integrity_desc") },
    { icon: "🏆", title: t("value_professionalism_title"), desc: t("value_professionalism_desc") },
    { icon: "⭐", title: t("value_excellence_title"),      desc: t("value_excellence_desc") },
    { icon: "💡", title: t("value_innovation_title"),      desc: t("value_innovation_desc") },
  ];

  const MV = [
    { label: t("mission_label"), text: t("mission_text") },
    { label: t("vision_label"),  text: t("vision_text") },
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission + Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {MV.map(({ label, text }) => (
            <div key={label} className="bg-white rounded-2xl p-8 border-l-4 border-brand-cyan shadow-card">
              <h2 className="text-xl font-bold text-brand-navy mb-4">{label}</h2>
              <p className="text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-brand-navy mb-3">{t("values_title")}</h2>
          <p className="text-slate-500 max-w-xl mx-auto">{t("values_subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-shadow">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-bold text-brand-navy text-lg mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
