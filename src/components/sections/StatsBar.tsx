const STATS = [
  { value: "500+",  label: "Properties Managed",  suffix: "" },
  { value: "12",    label: "Nairobi Zones Covered", suffix: "" },
  { value: "15+",   label: "Years of Experience",  suffix: "" },
  { value: "98%",   label: "Client Retention",     suffix: "" },
];

export default function StatsBar() {
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-100">
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
