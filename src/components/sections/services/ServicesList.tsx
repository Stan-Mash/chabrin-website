const SERVICES = [
  {
    id: "management",
    icon: "🏢",
    title: "Property Management",
    desc: "End-to-end management of your investment property — from rent collection to maintenance coordination. We act as your professional representative, handling every aspect of your property on your behalf.",
    features: [
      "Monthly rent collection & remittance",
      "Tenant screening & vetting",
      "Maintenance coordination & supplier management",
      "Monthly financial reporting & statements",
    ],
  },
  {
    id: "leasing",
    icon: "🔑",
    title: "Leasing & Tenant Placement",
    desc: "Reduce vacancy periods with our targeted leasing service. We market your property, qualify applicants, conduct due diligence, and execute legally sound lease agreements.",
    features: [
      "Professional property marketing & photography",
      "Applicant screening (ID, credit, employer verification)",
      "Lease drafting & digital signing",
      "Move-in inspection & handover documentation",
    ],
  },
  {
    id: "valuation",
    icon: "📊",
    title: "Property Valuation",
    desc: "Accurate, EARB-compliant property valuations for sale, purchase, insurance, and bank financing purposes. Our registered valuers deliver defensible reports accepted by major financial institutions.",
    features: [
      "Residential & commercial valuations",
      "Insurance replacement cost reports",
      "Bank/mortgage valuation reports",
      "Rental assessment & market analysis",
    ],
  },
  {
    id: "facilities",
    icon: "🔧",
    title: "Facilities Management",
    desc: "Proactive care for your property's physical infrastructure — ensuring buildings remain safe, functional, and compliant with Kenya's building codes.",
    features: [
      "Preventive maintenance scheduling",
      "Emergency repair coordination (24/7 response)",
      "Service contractor procurement & oversight",
      "Annual compliance inspections",
    ],
  },
];

export default function ServicesList() {
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
