const TEAM = [
  { initials: "CC", name: "Charles Chabrin", title: "Managing Director", bio: "A chartered property manager with over 20 years in Kenya's real estate sector. Leads Chabrin's strategic direction and client relationships." },
  { initials: "AM", name: "Amina Mwangi", title: "Head of Operations", bio: "Oversees day-to-day property management across all zones, ensuring service standards and tenant satisfaction." },
  { initials: "JK", name: "James Kariuki", title: "Chief Valuation Officer", bio: "Registered valuer with expertise in residential and commercial property valuation across greater Nairobi." },
];

export default function Leadership() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">Our Leadership</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Experienced professionals dedicated to delivering exceptional property management services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TEAM.map(({ initials, name, title, bio }) => (
            <div key={name} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow">
              {/* Top navy bar */}
              <div className="h-3 bg-brand-navy" />
              <div className="p-8 text-center">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-brand-navy flex items-center justify-center mx-auto mb-5 shadow-navy">
                  <span className="text-brand-cyan font-extrabold text-xl tracking-wide">{initials}</span>
                </div>
                <h3 className="font-bold text-brand-navy text-xl mb-1">{name}</h3>
                <p className="text-brand-cyan text-sm font-semibold mb-4 tracking-wide">{title}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
