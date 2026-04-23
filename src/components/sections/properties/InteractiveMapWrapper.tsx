"use client";

import { useState } from "react";
import ZoneMap from "./ZoneMap";

export interface ManagementZone {
  id: string;
  name: string;
  desc: string;
  coords: [number, number];
  yield: string;
  properties: string;
  coveredAreas: string[];
}

export const managementZones: ManagementZone[] = [
  { id: 'A', name: 'Northern Commuter Corridor', desc: "Murang'a to Githurai 45", coords: [-1.1500, 36.9800], yield: '14%', properties: '250+', coveredAreas: ["Murang'a", "Kenol", "Kabati", "Thika Town", "Makongeni", "Juja", "Gwa Kairu", "Ruiru", "Membley", "Kamakis", "Kihunguro", "Clayworks", "Kahawa Sukari", "Kahawa Wendani", "Githurai 45"] },
  { id: 'B', name: 'Kasarani-Ruaraka Belt', desc: "Githurai 44 to Lucky Summer", coords: [-1.2250, 36.8950], yield: '18%', properties: '250+', coveredAreas: ["Githurai 44", "Zimmerman", "Kamiti Road", "Roysambu", "Lumumba Drive", "Kasarani", "Mwiki", "Santon", "Hunters", "Baba Dogo", "Lucky Summer", "Ruaraka"] },
  { id: 'C', name: 'Inner East Urban Core', desc: "Huruma, Mathare, Eastleigh", coords: [-1.2650, 36.8550], yield: '20%', properties: '250+', coveredAreas: ["Eastleigh North", "Eastleigh South", "Juja Road", "Mathare", "Huruma", "Mlango Kubwa", "Pumwani", "Majengo", "Kiamaiko"] },
  { id: 'D', name: 'Classic Eastlands Hub', desc: "Dandora, Kariobangi, Buruburu", coords: [-1.2780, 36.8850], yield: '16%', properties: '250+', coveredAreas: ["Buruburu Phases 1-5", "Kariobangi North", "Kariobangi South", "Dandora Phases 1-5", "Pioneer", "Uhuru Estate", "Harambee Estate", "Mutindwa"] },
  { id: 'E', name: 'Premium, CBD & Inner Ring', desc: "CBD, Kilimani, Ngara, Makadara", coords: [-1.2900, 36.8000], yield: '12%', properties: '250+', coveredAreas: ["CBD", "Upperhill", "Westlands", "Parklands", "Kilimani", "Kileleshwa", "Lavington", "Riverside", "Ruaka", "Kiambu Road", "Muthaiga", "Pangani", "Ngara", "Makadara", "Jericho", "Maringo"] },
  { id: 'F', name: 'Greater Eastlands', desc: "Umoja, Kayole, Imara Daima", coords: [-1.3100, 36.9000], yield: '17%', properties: '250+', coveredAreas: ["Umoja 1 & 2", "Umoja Innercore", "Donholm", "Savannah", "Greenfields", "Fedha", "Nyayo Estate", "Komarock", "Kayole", "Spine Road", "Tassia", "Imara Daima"] },
  { id: 'G', name: 'Southern Metro & Airport Corridor', desc: "Embakasi, Athi River, Kitengela", coords: [-1.4300, 36.9600], yield: '15%', properties: '250+', coveredAreas: ["Pipeline", "Embakasi", "Aviation", "Syokimau", "Katani", "Mlolongo", "Athi River", "Kinanie", "Kitengela", "Ongata Rongai", "Kiserian", "Ngong"] },
];

export default function InteractiveMapWrapper() {
  const [activeZone, setActiveZone] = useState<ManagementZone>(managementZones[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      {/* ── Map ── */}
      <div
        className="lg:col-span-2 h-[520px] rounded-2xl overflow-hidden shadow-lg border border-slate-200"
        aria-label="Interactive map of Chabrin management corridors across Kenya's major growth markets"
      >
        <ZoneMap activeZone={activeZone} setActiveZone={setActiveZone} />
      </div>

      {/* ── Details panel ── */}
      <div
        className="lg:col-span-1 rounded-2xl shadow-lg overflow-hidden"
        style={{ background: "#001a70" }}
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Corridor header */}
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: "rgba(0,229,204,0.2)" }}>
          <div className="flex items-center gap-3 mb-3">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0"
              style={{ background: "#00e5cc", color: "#001a70" }}
              aria-hidden="true"
            >
              {activeZone.id}
            </span>
            <div className="min-w-0">
              <p className="text-white font-extrabold text-base leading-tight truncate">
                {activeZone.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(0,229,204,0.8)" }}>
                {activeZone.desc}
              </p>
            </div>
          </div>

          {/* Yield + properties stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div
              className="rounded-xl px-4 py-3 text-center"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <p className="font-extrabold text-2xl leading-none" style={{ color: "#00e5cc" }}>
                {activeZone.yield}
              </p>
              <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
                Avg. Yield
              </p>
            </div>
            <div
              className="rounded-xl px-4 py-3 text-center"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <p className="font-extrabold text-2xl leading-none text-white">
                {activeZone.properties}
              </p>
              <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
                Properties
              </p>
            </div>
          </div>
        </div>

        {/* Covered areas */}
        <div className="px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,229,204,0.7)" }}>
            Covered Neighborhoods
          </p>
          <div className="flex flex-wrap gap-2">
            {activeZone.coveredAreas.map((area) => (
              <span
                key={area}
                className="text-xs px-2.5 py-1 rounded-full text-white border"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  borderColor: "#00e5cc",
                }}
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* OSM attribution */}
        <p className="text-center pb-4 text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          Map data © OpenStreetMap contributors
        </p>
      </div>
    </div>
  );
}
