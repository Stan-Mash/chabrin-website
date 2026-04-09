const MILESTONES = [
  { year: "2009", title: "Founded", desc: "Chabrin Agencies Limited was incorporated in Nairobi, Kenya, beginning with residential property management in Westlands." },
  { year: "2012", title: "EARB Registration", desc: "Attained full registration with the Estate Agents Registration Board of Kenya, cementing our professional standing." },
  { year: "2015", title: "Portfolio Expansion", desc: "Expanded into commercial property management and valuation services, growing to over 200 managed units." },
  { year: "2018", title: "Technology Upgrade", desc: "Launched our internal lease management platform (CHIPS) to digitise workflows and enhance tenant communication." },
  { year: "2022", title: "Zone Coverage", desc: "Reached 12 operational zones across Nairobi, serving over 400 properties and 1,200+ tenants." },
  { year: "2024", title: "Digital Transformation", desc: "Introduced digital lease signing, online rent payment tracking, and this public-facing web portal for landlords and tenants." },
];

export default function Timeline() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-0.5 bg-brand-cyan" />
            <span className="text-brand-cyan text-sm font-semibold tracking-widest uppercase">Our Journey</span>
            <span className="w-6 h-0.5 bg-brand-cyan" />
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy">15+ Years of Growth</h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" />

          <div className="space-y-10">
            {MILESTONES.map(({ year, title, desc }, i) => (
              <div key={year} className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                {/* Content */}
                <div className={`flex-1 pb-2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"} pl-16 md:pl-0`}>
                  <div className="bg-surface rounded-2xl p-6 shadow-card inline-block w-full">
                    <span className="text-brand-cyan text-xs font-bold tracking-widest uppercase">{year}</span>
                    <h3 className="font-bold text-brand-navy text-lg mt-1 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-cyan border-4 border-white shadow-cyan top-6" />

                {/* Spacer for opposite side */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
