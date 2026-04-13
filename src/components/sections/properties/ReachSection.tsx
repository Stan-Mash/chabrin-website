"use client";

import dynamic from "next/dynamic";

// ── Lazy-load ZoneMap client-side only (Leaflet requires window) ───────────────

const ZoneMap = dynamic(() => import("./ZoneMap"), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full animate-pulse bg-slate-100 rounded-2xl"
      role="status"
      aria-label="Loading map..."
    />
  ),
});

// ── Zone legend data ────────────────────────────────────────────────────────────

const LEGEND = [
  { name: "Zone A", area: "Westlands",  units: "340+" },
  { name: "Zone B", area: "Kilimani",   units: "280+" },
  { name: "Zone C", area: "Lavington",  units: "190+" },
  { name: "Zone D", area: "Kileleshwa", units: "210+" },
  { name: "Zone E", area: "Upper Hill", units: "150+" },
  { name: "Zone F", area: "Karen",      units: "85+"  },
  { name: "Zone G", area: "Parklands",  units: "110+" },
];

// ── Component ───────────────────────────────────────────────────────────────────

export default function ReachSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-white"
      aria-labelledby="reach-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4"
               style={{ borderColor: "rgba(0,229,204,0.4)", background: "rgba(0,229,204,0.07)" }}>
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
            Our Management Reach
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            1,200+ properties managed across 7 zones in Nairobi.
            Click any marker to see yield and unit data for that zone.
          </p>
        </div>

        {/* ── Map + Legend grid ── */}
        <div className="grid lg:grid-cols-[1fr_260px] gap-6 items-start">

          {/* Map */}
          <div
            className="h-[480px] rounded-2xl overflow-hidden shadow-lg border border-slate-200"
            aria-label="Interactive map of Chabrin management zones in Nairobi"
          >
            <ZoneMap />
          </div>

          {/* Legend sidebar */}
          <div className="flex flex-col gap-3">
            {/* Marker key */}
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                style={{ background: "#001a70", borderColor: "#00e5cc", opacity: 0.75 }}
                aria-hidden="true"
              />
              <span className="text-xs text-slate-500">
                Marker size reflects unit density
              </span>
            </div>

            {LEGEND.map((z) => (
              <div
                key={z.name}
                className="flex items-center gap-3 bg-white rounded-xl border border-slate-100
                           px-4 py-3 shadow-sm hover:border-cyan-200 hover:shadow-md transition-all"
              >
                {/* Colour dot */}
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: "#001a70", outline: "2px solid #00e5cc", outlineOffset: 1 }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm leading-none" style={{ color: "#001a70" }}>
                    {z.area}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{z.name}</p>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: "rgba(0,229,204,0.12)", color: "#001a70" }}
                >
                  {z.units}
                </span>
              </div>
            ))}

            {/* OSM attribution note */}
            <p className="text-[10px] text-slate-300 text-center mt-1 leading-tight">
              Map data © OpenStreetMap contributors
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
