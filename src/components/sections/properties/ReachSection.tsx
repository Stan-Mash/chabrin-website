"use client";

import dynamic from "next/dynamic";

const CORRIDORS = [
  { id: "A", name: "Northern Commuter Corridor", desc: "Murang'a to Githurai 45", areas: ["Murang'a", "Thika Town", "Juja", "Ruiru", "Kahawa Sukari", "Kahawa Wendani", "Githurai 45"] },
  { id: "B", name: "Kasarani-Ruaraka Belt",        desc: "Githurai 44 to Lucky Summer", areas: ["Githurai 44", "Zimmerman", "Roysambu", "Kasarani", "Mwiki", "Ruaraka", "Lucky Summer"] },
  { id: "C", name: "Inner East Urban Core",         desc: "Huruma, Mathare, Eastleigh",  areas: ["Eastleigh North", "Eastleigh South", "Mathare", "Huruma", "Mlango Kubwa", "Pumwani", "Majengo"] },
  { id: "D", name: "Classic Eastlands Hub",         desc: "Dandora, Kariobangi, Buruburu", areas: ["Buruburu", "Kariobangi North", "Kariobangi South", "Dandora", "Uhuru Estate", "Harambee Estate"] },
  { id: "E", name: "Premium CBD & Inner Ring",      desc: "CBD, Kilimani, Ngara, Makadara", areas: ["CBD", "Upperhill", "Westlands", "Kilimani", "Kileleshwa", "Lavington", "Parklands", "Ngara", "Makadara"] },
  { id: "F", name: "Greater Eastlands",             desc: "Umoja, Kayole, Imara Daima",  areas: ["Umoja", "Donholm", "Fedha", "Komarock", "Kayole", "Tassia", "Imara Daima"] },
  { id: "G", name: "Southern Metro & Airport Corridor", desc: "Embakasi, Athi River, Kitengela", areas: ["Pipeline", "Embakasi", "Syokimau", "Mlolongo", "Athi River", "Kitengela", "Ongata Rongai", "Ngong"] },
];

const InteractiveMapWrapper = dynamic(() => import("./InteractiveMapWrapper"), {
  ssr: false,
  loading: () => (
    <div
      className="h-[600px] w-full animate-pulse bg-slate-100 rounded-2xl"
      role="status"
      aria-label="Loading map..."
    />
  ),
});

export default function ReachSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-white"
      aria-labelledby="reach-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4"
            style={{ borderColor: "rgba(0,229,204,0.4)", background: "rgba(0,229,204,0.07)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#00e5cc" }} aria-hidden="true" />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#00e5cc" }}>
              Management Coverage
            </span>
          </div>

          <h2
            id="reach-heading"
            className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3"
            style={{ color: "#001a70" }}
          >
            Our Metropolitan Footprint
          </h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
            Properties managed across 7 coverage corridors spanning Nairobi and its
            expanding commuter counties. Click a corridor to view localized yields and covered neighbourhoods.
          </p>
        </div>

        {/* SSR-rendered corridor index - visible to crawlers, hidden visually once JS loads */}
        <noscript>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {CORRIDORS.map((c) => (
              <li key={c.id} className="rounded-xl border border-slate-200 p-4">
                <strong className="block text-brand-navy font-bold mb-1">{c.name}</strong>
                <p className="text-slate-500 text-sm mb-2">{c.desc}</p>
                <p className="text-slate-400 text-xs">{c.areas.join(", ")}</p>
              </li>
            ))}
          </ul>
        </noscript>

        {/* Crawlable corridor list - sr-only so it doesn't double-render visually */}
        <ul className="sr-only" aria-hidden="false">
          {CORRIDORS.map((c) => (
            <li key={c.id}>
              <span>{c.name}: </span>
              <span>{c.areas.join(", ")}</span>
            </li>
          ))}
        </ul>

        <InteractiveMapWrapper />
      </div>
    </section>
  );
}
