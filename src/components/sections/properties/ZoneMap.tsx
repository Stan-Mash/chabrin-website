"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { ManagementZone } from "./InteractiveMapWrapper";
import { managementZones } from "./InteractiveMapWrapper";

interface ZoneMapProps {
  activeZone: ManagementZone;
  setActiveZone: (zone: ManagementZone) => void;
}

export default function ZoneMap({ activeZone, setActiveZone }: ZoneMapProps) {
  return (
    <MapContainer
      center={[-1.3000, 36.8500]}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      aria-label="Chabrin Agencies management corridors across Kenya's major growth markets"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {managementZones.map((zone) => {
        const isActive = zone.id === activeZone.id;
        return (
          <CircleMarker
            key={zone.id}
            center={zone.coords}
            radius={isActive ? 22 : 16}
            pathOptions={{
              color: "#00e5cc",
              fillColor: "#001a70",
              fillOpacity: isActive ? 0.9 : 0.65,
              weight: isActive ? 3.5 : 2,
            }}
            eventHandlers={{ click: () => setActiveZone(zone) }}
          >
            <Popup maxWidth={220}>
              <div style={{ fontFamily: "system-ui, sans-serif", padding: "2px 4px" }}>
                <p style={{ fontWeight: 700, color: "#001a70", margin: "0 0 4px", fontSize: 13 }}>
                  {zone.name}
                </p>
                <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>
                  {zone.desc}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
