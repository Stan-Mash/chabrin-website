const VALUES = [
  { icon: "🤝", title: "Integrity", desc: "We operate with complete transparency and honesty in every transaction." },
  { icon: "🏆", title: "Professionalism", desc: "Our team holds the highest standards of conduct and service delivery." },
  { icon: "⭐", title: "Excellence", desc: "We continuously improve to exceed client expectations." },
  { icon: "💡", title: "Innovation", desc: "We embrace technology and data to stay ahead of the market." },
];

export default function Mission() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission + Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            { label: "Our Mission", text: "To provide Nairobi's property owners and tenants with a trustworthy, efficient, and professional management service that protects asset value and enhances the living and working experience." },
            { label: "Our Vision", text: "To be East Africa's most respected property management firm — recognised for integrity, innovation, and the enduring relationships we build with every client." },
          ].map(({ label, text }) => (
            <div key={label} className="bg-white rounded-2xl p-8 border-l-4 border-brand-cyan shadow-card">
              <h2 className="text-xl font-bold text-brand-navy mb-4">{label}</h2>
              <p className="text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-brand-navy mb-3">Our Core Values</h2>
          <p className="text-slate-500 max-w-xl mx-auto">The principles that guide everything we do at Chabrin Agencies.</p>
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
