"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

// ── Zone data ──────────────────────────────────────────────────────────────────

interface Zone {
  name: string;
  area: string;
  coords: [number, number];
  yield: string;
  units: string;
  /** radius proportional to unit count for density feel */
  radius: number;
}

const ZONES: Zone[] = [
  { name: "Zone A", area: "Westlands",  coords: [-1.2625, 36.8045], yield: "18%", units: "340+", radius: 28 },
  { name: "Zone B", area: "Kilimani",   coords: [-1.2882, 36.7844], yield: "15%", units: "280+", radius: 26 },
  { name: "Zone C", area: "Lavington",  coords: [-1.2770, 36.7663], yield: "14%", units: "190+", radius: 22 },
  { name: "Zone D", area: "Kileleshwa", coords: [-1.2745, 36.7900], yield: "16%", units: "210+", radius: 23 },
  { name: "Zone E", area: "Upper Hill", coords: [-1.2985, 36.8146], yield: "19%", units: "150+", radius: 20 },
  { name: "Zone F", area: "Karen",      coords: [-1.3305, 36.7082], yield: "12%", units: "85+",  radius: 16 },
  { name: "Zone G", area: "Parklands",  coords: [-1.2638, 36.8188], yield: "17%", units: "110+", radius: 18 },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function ZoneMap() {
  return (
    <MapContainer
      center={[-1.2921, 36.8219]}
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      aria-label="Chabrin Agencies management zones across Nairobi"
    >
      {/* OpenStreetMap tiles — 100% free, no API key */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {ZONES.map((zone) => (
        <CircleMarker
          key={zone.name}
          center={zone.coords}
          radius={zone.radius}
          pathOptions={{
            color: "#00e5cc",
            fillColor: "#001a70",
            fillOpacity: 0.65,
            weight: 2.5,
          }}
        >
          <Popup
            className="chabrin-popup"
            maxWidth={220}
          >
            <div className="font-century-gothic" style={{ minWidth: 170 }}>
              {/* Header */}
              <div
                style={{
                  background: "#001a70",
                  margin: "-12px -12px 10px -12px",
                  padding: "10px 14px",
                  borderRadius: "6px 6px 0 0",
                }}
              >
                <p style={{ color: "#00e5cc", fontWeight: 700, fontSize: 11, margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {zone.name}
                </p>
                <p style={{ color: "#ffffff", fontWeight: 700, fontSize: 15, margin: "2px 0 0" }}>
                  {zone.area}
                </p>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 12, padding: "0 2px" }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <p style={{ color: "#001a70", fontWeight: 800, fontSize: 20, margin: 0, lineHeight: 1.1 }}>
                    {zone.yield}
                  </p>
                  <p style={{ color: "#64748b", fontSize: 9, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Avg. Yield
                  </p>
                </div>
                <div style={{ width: 1, background: "#e2e8f0", flexShrink: 0 }} />
                <div style={{ flex: 1, textAlign: "center" }}>
                  <p style={{ color: "#001a70", fontWeight: 800, fontSize: 20, margin: 0, lineHeight: 1.1 }}>
                    {zone.units}
                  </p>
                  <p style={{ color: "#64748b", fontSize: 9, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Units Managed
                  </p>
                </div>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
