"use client";

import dynamic from "next/dynamic";

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
            1,200+ properties managed across 7 strategic zones spanning Nairobi and its
            expanding commuter counties. Click a zone to view localized yields and covered neighborhoods.
          </p>
        </div>

        <InteractiveMapWrapper />
      </div>
    </section>
  );
}
