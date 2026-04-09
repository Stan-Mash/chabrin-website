const STEPS = [
  { n: "01", title: "Initial Consultation", desc: "We discuss your property, goals, and management requirements — completely free of charge." },
  { n: "02", title: "Property Assessment", desc: "Our team conducts an on-site inspection and provides a comprehensive management proposal." },
  { n: "03", title: "Agreement & Onboarding", desc: "We sign a management agreement, set up your owner account, and onboard your property into our system." },
  { n: "04", title: "Active Management", desc: "We handle everything — tenant communication, maintenance, rent collection — keeping you informed at every step." },
  { n: "05", title: "Monthly Reporting", desc: "Receive detailed financial statements and property reports every month, directly to your inbox." },
];

export default function Process() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-0.5 bg-brand-cyan" />
            <span className="text-brand-cyan text-sm font-semibold tracking-widest uppercase">How It Works</span>
            <span className="w-6 h-0.5 bg-brand-cyan" />
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy">Your Journey with Chabrin</h2>
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
