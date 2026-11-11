const CREDENTIALS = [
  {
    label: "EARB Registered",
    detail: "Estate Agents Registration Board",
  },
  {
    label: "ODPC Compliant",
    detail: "Office of the Data Protection Commissioner",
  },
  {
    label: "5-County Coverage",
    detail: "Nairobi · Kiambu · Murang'a · Kajiado · Machakos",
  },
  {
    label: "30+ Years",
    detail: "Premier Property Management in Nairobi",
  },
];

export default function TrustTicker() {
  return (
    <div className="bg-brand-navy-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {CREDENTIALS.map(({ label, detail }) => (
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
