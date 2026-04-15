"use client";

/**
 * InteractiveSearchMap — Leaflet map with CircleMarker pins for the Search Properties page.
 *
 * Features:
 * - react-leaflet v5 MapContainer + TileLayer (OpenStreetMap)
 * - CircleMarker for each listing (no external cluster dep needed)
 * - Brand Deep Navy / Cyan colours
 * - Active pin highlight when card is hovered
 * - Popup on click: shows title, price, WhatsApp link
 * - Smooth fly-to animation when activeId changes
 * - "No properties in view" overlay when listings array is empty
 *
 * KDPA NOTE: Coordinates used here are AREA-LEVEL CENTROIDS only.
 * Individual property GPS is never stored or exposed.
 */

import { useEffect, useCallback } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { siteConfig } from "@/config/site";
import type { SearchListing } from "./SearchInterface";

// ── Suppress Leaflet's broken default icon path (Next.js asset pipeline issue) ─

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// Suppress unused import warning — L is used for type reference in MapController
void L;

// ── FlyTo controller (inner component that can useMap) ────────────────────────

function MapController({ activeId, listings }: { activeId: string | null; listings: SearchListing[] }) {
  const map = useMap();

  useEffect(() => {
    if (!activeId) return;
    const listing = listings.find((l) => l.id === activeId);
    if (!listing) return;
    map.flyTo([listing.lat, listing.lng], Math.max(map.getZoom(), 14), { duration: 0.7 });
  }, [activeId, listings, map]);

  return null;
}

// ── Main component ────────────────────────────────────────────────────────────

interface InteractiveSearchMapProps {
  listings: SearchListing[];
  activeId: string | null;
  onPinHover: (id: string | null) => void;
}

export default function InteractiveSearchMap({
  listings,
  activeId,
  onPinHover,
}: InteractiveSearchMapProps) {
  const centre: [number, number] = [-1.286389, 36.817223];

  const handlePinClick = useCallback(
    (listing: SearchListing) => { onPinHover(listing.id); },
    [onPinHover]
  );

  return (
    <div className="relative w-full h-full min-h-[400px]" aria-label="Property location map">
      <MapContainer
        center={centre}
        zoom={11}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <MapController activeId={activeId} listings={listings} />

        {listings.map((listing) => {
          const isActive = listing.id === activeId;
          const formattedRent = listing.rent_kes.toLocaleString("en-KE");
          const whatsappMsg = encodeURIComponent(
            `Hello, I am interested in property ${listing.reference} — ${listing.title}. Please send details.`
          );

          return (
            <CircleMarker
              key={listing.id}
              center={[listing.lat, listing.lng]}
              radius={isActive ? 14 : 10}
              pathOptions={{
                color: "#00C9C9",
                fillColor: "#0D1B8E",
                fillOpacity: isActive ? 0.95 : 0.75,
                weight: isActive ? 3 : 2,
              }}
              eventHandlers={{
                click: () => handlePinClick(listing),
                mouseover: () => onPinHover(listing.id),
                mouseout: () => onPinHover(null),
              }}
            >
              <Popup maxWidth={240} className="chabrin-map-popup">
                <div style={{ fontFamily: "system-ui,sans-serif", padding: "2px 4px", minWidth: 200 }}>
                  {/* Type badge */}
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 20,
                    background: "#0D1B8E",
                    color: "white",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "capitalize",
                    marginBottom: 6,
                  }}>
                    {listing.property_type}
                  </span>

                  {/* Title */}
                  <p style={{ fontWeight: 700, color: "#0D1B8E", margin: "0 0 2px", fontSize: 13, lineHeight: 1.35 }}>
                    {listing.title}
                  </p>

                  {/* Region + area */}
                  <p style={{ color: "#64748b", fontSize: 11, margin: "0 0 6px" }}>
                    📍 {listing.strategic_region} — {listing.area}
                  </p>

                  {/* Price */}
                  <p style={{ fontWeight: 800, color: "#0D1B8E", fontSize: 16, margin: "0 0 8px" }}>
                    KES {formattedRent}
                    <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}> / mo</span>
                  </p>

                  {/* Specs */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 11, color: "#475569" }}>
                    {listing.bedrooms !== null && listing.bedrooms > 0 && (
                      <span>🛏 {listing.bedrooms} bd</span>
                    )}
                    {listing.bathrooms !== null && (
                      <span>🚿 {listing.bathrooms} ba</span>
                    )}
                    {listing.size_m2 !== null && (
                      <span>📐 {listing.size_m2} m²</span>
                    )}
                  </div>

                  {/* WhatsApp CTA */}
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "7px 0",
                      borderRadius: 8,
                      background: "#22c55e",
                      color: "white",
                      fontWeight: 700,
                      fontSize: 12,
                      textDecoration: "none",
                    }}
                  >
                    WhatsApp
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Empty overlay */}
      {listings.length === 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm pointer-events-none">
          <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-slate-400 text-sm font-medium">No properties in this view</p>
        </div>
      )}

      {/* KDPA notice */}
      <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
        <span className="text-[9px] text-slate-400 bg-white/80 px-1.5 py-0.5 rounded">
          Approximate locations only · KDPA compliant
        </span>
      </div>
    </div>
  );
}
