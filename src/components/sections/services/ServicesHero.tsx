export default function ServicesHero() {
  return (
    <section className="relative bg-brand-navy overflow-hidden py-24 md:py-32">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-0.5 bg-brand-cyan" />
            <span className="text-brand-cyan text-sm font-semibold tracking-widest uppercase">What We Offer</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Comprehensive<br />
            <span className="text-brand-cyan">Property Services</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            From leasing to valuation — Chabrin Agencies delivers the full spectrum of professional
            property services in Nairobi, backed by 15+ years of expertise and a registered team of professionals.
          </p>
        </div>
      </div>
    </section>
  );
}
