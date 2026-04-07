const PILLARS = [
  {
    id:    "licensed",
    title: "Fully Licensed & Regulated",
    desc:  "Registered with the Estate Agents Registration Board (EARB) and compliant with the Kenya Data Protection Act. Your property is in safe, accountable hands.",
    stat:  "EARB",
    statLabel: "Registered",
  },
  {
    id:    "responsive",
    title: "Dedicated Client Teams",
    desc:  "Every property is assigned a dedicated manager — not a call centre. Direct communication, fast response times, and real accountability.",
    stat:  "24h",
    statLabel: "Response SLA",
  },
  {
    id:    "tech",
    title: "Technology-Enabled",
    desc:  "Powered by our proprietary CHIPS platform for real-time reporting, digital lease signing, and transparent financial tracking for every landlord.",
    stat:  "100%",
    statLabel: "Digital Reporting",
  },
  {
    id:    "local",
    title: "Deep Nairobi Knowledge",
    desc:  "15+ years of on-the-ground experience across all major Nairobi zones. We know the market, the regulations, and the right price.",
    stat:  "15+",
    statLabel: "Years in Nairobi",
  },
];

export default function WhyChabrin() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="max-w-2xl mb-14">
          <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-3">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy leading-tight mb-4">
            The Chabrin Standard
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            We measure ourselves against what matters to landlords and tenants —
            transparency, responsiveness, and results.
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
