"use client";

/**
 * SearchInterface — Airbnb-style split-screen property browser.
 *
 * Layout:
 *   Desktop (lg+): 60% scrollable card grid (left) | 40% sticky Leaflet map (right)
 *   Mobile:        Card grid only, with a floating "Show Map ↔ Show List" toggle
 *
 * Data security — THE MABATI RULE:
 *   - Only listings where web_visible === true AND status === "vacant" are rendered
 *   - Occupied / invisible listings are filtered before any DOM output
 *   - This filtering is the FIRST operation in this component
 *
 * Strategic Regions (replaces "Zone" language):
 *   The managementZones array from InteractiveMapWrapper maps zone IDs → corridor names.
 *   We add area-level centroid coordinates (KDPA-safe — approximate only).
 *
 * New dependency: framer-motion (AnimatePresence for card transitions)
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";

// ── Lazy-load the map (Leaflet requires window) ───────────────────────────────

const InteractiveSearchMap = dynamic(
  () => import("./InteractiveSearchMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
        <span className="text-slate-400 text-sm">Loading map…</span>
      </div>
    ),
  }
);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SearchListing {
  id:            string;
  reference:     string;
  title:         string;
  property_type: string;
  status:        "vacant" | "occupied";
  web_visible:   boolean;
  strategic_region: string; // replaces "Zone X" language
  area:          string;
  bedrooms:      number | null;
  bathrooms:     number | null;
  size_m2:       number | null;
  rent_kes:      number;
  deposit_kes:   number;
  features:      string[];
  images:        string[];
  lat:           number;
  lng:           number;
  published_at:  string;
}

// ── Area centroid coordinates (KDPA-safe — approximate neighbourhood centres) ─
// Used to place pins on the map. Never exact property GPS.

const AREA_CENTROIDS: Record<string, [number, number]> = {
  // Zone A — Northern Commuter Corridor
  "Thika Town":       [-1.0332, 37.0694],
  "Ruiru":            [-1.1448, 36.9611],
  "Kahawa Sukari":    [-1.1904, 36.9139],
  "Kahawa Wendani":   [-1.1952, 36.9244],
  "Githurai 45":      [-1.2144, 36.9202],
  "Membley":          [-1.1675, 36.9742],
  "Juja":             [-1.1029, 37.0146],
  // Zone B — Kasarani-Ruaraka Belt
  "Githurai 44":      [-1.2244, 36.9100],
  "Zimmerman":        [-1.2306, 36.8990],
  "Roysambu":         [-1.2217, 36.8836],
  "Kasarani":         [-1.2269, 36.8983],
  "Mwiki":            [-1.2115, 36.9215],
  "Lucky Summer":     [-1.2479, 36.8829],
  "Ruaraka":          [-1.2465, 36.8904],
  // Zone C — Inner East Urban Core
  "Eastleigh North":  [-1.2740, 36.8488],
  "Eastleigh South":  [-1.2814, 36.8509],
  "Mathare":          [-1.2566, 36.8575],
  "Huruma":           [-1.2610, 36.8533],
  "Pangani":          [-1.2724, 36.8351],
  // Zone D — Classic Eastlands Hub
  "Buruburu":         [-1.2870, 36.8879],
  "Kariobangi North": [-1.2660, 36.8830],
  "Kariobangi South": [-1.2760, 36.8853],
  "Dandora":          [-1.2563, 36.9030],
  // Zone E — Premium, CBD & Inner Ring
  "CBD":              [-1.2921, 36.8219],
  "Westlands":        [-1.2680, 36.8100],
  "Kilimani":         [-1.2921, 36.7897],
  "Kileleshwa":       [-1.2870, 36.7792],
  "Lavington":        [-1.2962, 36.7731],
  "Upperhill":        [-1.3022, 36.8219],
  "Parklands":        [-1.2610, 36.8119],
  "Muthaiga":         [-1.2488, 36.8289],
  "Ngara":            [-1.2721, 36.8369],
  "Makadara":         [-1.2984, 36.8600],
  "Jericho":          [-1.2917, 36.8741],
  // Zone F — Greater Eastlands
  "Umoja":            [-1.3037, 36.8952],
  "Donholm":          [-1.3017, 36.8799],
  "Savannah":         [-1.3093, 36.8936],
  "Komarock":         [-1.2981, 36.9143],
  "Kayole":           [-1.2867, 36.9192],
  "Tassia":           [-1.3159, 36.8943],
  "Imara Daima":      [-1.3302, 36.8877],
  // Zone G — Southern Metro & Airport Corridor
  "Pipeline":         [-1.3369, 36.8895],
  "Embakasi":         [-1.3203, 36.9104],
  "Syokimau":         [-1.3653, 36.9256],
  "Athi River":       [-1.4555, 36.9894],
  "Kitengela":        [-1.4739, 36.9614],
  "Ongata Rongai":    [-1.3936, 36.7414],
  "Ngong":            [-1.3586, 36.6589],
  "Mlolongo":         [-1.3985, 36.9526],
};

/** Resolve centroid for a listing — falls back to Nairobi centre if area unknown */
function resolveCentroid(area: string): [number, number] {
  // Try exact match first
  if (AREA_CENTROIDS[area]) return AREA_CENTROIDS[area];
  // Try partial match
  const key = Object.keys(AREA_CENTROIDS).find((k) =>
    area.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(area.toLowerCase())
  );
  return key ? AREA_CENTROIDS[key] : [-1.286389, 36.817223];
}

/** Add a small random jitter (±0.003°, ~300m) so stacked pins don't overlap */
function jitter(coord: [number, number]): [number, number] {
  return [
    coord[0] + (Math.random() - 0.5) * 0.006,
    coord[1] + (Math.random() - 0.5) * 0.006,
  ];
}

// ── Strategic region display name mapping ─────────────────────────────────────

const STRATEGIC_REGIONS: Record<string, string> = {
  A: "Northern Commuter Corridor",
  B: "Kasarani-Ruaraka Belt",
  C: "Inner East Urban Core",
  D: "Classic Eastlands Hub",
  E: "CBD & Inner Ring",
  F: "Greater Eastlands",
  G: "Airport & Southern Metro",
};

// ── Mock dataset (15 listings) ────────────────────────────────────────────────
// In production, replace with getPublishedListings() from @/db/queries/listings
// web_visible=false or status="occupied" listings are NEVER rendered.

const MOCK_LISTINGS_RAW: (Omit<SearchListing, "lat" | "lng" | "strategic_region"> & { zone: string })[] = [
  {
    id: "a1b2c3d4-0001",
    reference: "CAL-NBO-2026-001",
    title: "Spacious 3-Bedroom Apartment — Westlands",
    property_type: "apartment",
    status: "vacant",
    web_visible: true,
    zone: "E",
    area: "Westlands",
    bedrooms: 3,
    bathrooms: 2,
    size_m2: 140,
    rent_kes: 125000,
    deposit_kes: 250000,
    features: ["Ensuite master", "Gym access", "Secure parking", "Backup generator"],
    images: [],
    published_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0002",
    reference: "CAL-NBO-2026-002",
    title: "Modern 2-Bedroom in Kasarani — Near TRM",
    property_type: "apartment",
    status: "vacant",
    web_visible: true,
    zone: "B",
    area: "Kasarani",
    bedrooms: 2,
    bathrooms: 1,
    size_m2: 85,
    rent_kes: 42000,
    deposit_kes: 84000,
    features: ["Tiled throughout", "Balcony", "Borehole water", "Security"],
    images: [],
    published_at: "2026-01-20T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0003",
    reference: "CAL-NBO-2026-003",
    title: "Executive Office Suite — Upperhill Business District",
    property_type: "office",
    status: "vacant",
    web_visible: true,
    zone: "E",
    area: "Upperhill",
    bedrooms: null,
    bathrooms: 2,
    size_m2: 220,
    rent_kes: 320000,
    deposit_kes: 640000,
    features: ["High-speed fibre", "AC throughout", "Reception area", "Parking x4"],
    images: [],
    published_at: "2026-01-22T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0004",
    reference: "CAL-NBO-2026-004",
    title: "3-Bedroom Townhouse — Kahawa Wendani",
    property_type: "townhouse",
    status: "vacant",
    web_visible: true,
    zone: "A",
    area: "Kahawa Wendani",
    bedrooms: 3,
    bathrooms: 3,
    size_m2: 180,
    rent_kes: 68000,
    deposit_kes: 136000,
    features: ["Private garden", "2-car garage", "DSQ", "Borehole water"],
    images: [],
    published_at: "2026-01-25T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0005",
    reference: "CAL-NBO-2026-005",
    title: "Bedsitter — Buruburu Phase 2",
    property_type: "apartment",
    status: "vacant",
    web_visible: true,
    zone: "D",
    area: "Buruburu",
    bedrooms: 1,
    bathrooms: 1,
    size_m2: 30,
    rent_kes: 14500,
    deposit_kes: 29000,
    features: ["Tiled", "Security", "Close to matatu stage"],
    images: [],
    published_at: "2026-01-28T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0006",
    reference: "CAL-NBO-2026-006",
    title: "4-Bedroom Villa — Lavington with Pool",
    property_type: "villa",
    status: "vacant",
    web_visible: true,
    zone: "E",
    area: "Lavington",
    bedrooms: 4,
    bathrooms: 4,
    size_m2: 380,
    rent_kes: 280000,
    deposit_kes: 560000,
    features: ["Swimming pool", "Garden", "2 DSQ", "Solar panels", "Electric gate"],
    images: [],
    published_at: "2026-02-01T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0007",
    reference: "CAL-NBO-2026-007",
    title: "1-Bedroom — Roysambu near Thika Road Mall",
    property_type: "apartment",
    status: "vacant",
    web_visible: true,
    zone: "B",
    area: "Roysambu",
    bedrooms: 1,
    bathrooms: 1,
    size_m2: 55,
    rent_kes: 28000,
    deposit_kes: 56000,
    features: ["Balcony", "Secure parking", "CCTV", "Modern fittings"],
    images: [],
    published_at: "2026-02-03T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0008",
    reference: "CAL-NBO-2026-008",
    title: "Retail Shop — Eastleigh North, Ground Floor",
    property_type: "retail",
    status: "vacant",
    web_visible: true,
    zone: "C",
    area: "Eastleigh North",
    bedrooms: null,
    bathrooms: 1,
    size_m2: 60,
    rent_kes: 55000,
    deposit_kes: 110000,
    features: ["Street frontage", "24h security", "Storage room"],
    images: [],
    published_at: "2026-02-05T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0009",
    reference: "CAL-NBO-2026-009",
    title: "2-Bedroom — Umoja Estate, Phase 1",
    property_type: "apartment",
    status: "vacant",
    web_visible: true,
    zone: "F",
    area: "Umoja",
    bedrooms: 2,
    bathrooms: 1,
    size_m2: 72,
    rent_kes: 32000,
    deposit_kes: 64000,
    features: ["Tiled", "Parking", "Quiet compound"],
    images: [],
    published_at: "2026-02-07T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0010",
    reference: "CAL-NBO-2026-010",
    title: "3-Bedroom — Ruiru Town, Near KEMU",
    property_type: "apartment",
    status: "vacant",
    web_visible: true,
    zone: "A",
    area: "Ruiru",
    bedrooms: 3,
    bathrooms: 2,
    size_m2: 110,
    rent_kes: 38000,
    deposit_kes: 76000,
    features: ["Spacious rooms", "Back-up water", "Good access road"],
    images: [],
    published_at: "2026-02-09T08:00:00Z",
  },
  // These are intentionally excluded (data security check):
  {
    id: "a1b2c3d4-0011",
    reference: "CAL-NBO-2026-011",
    title: "HIDDEN — Occupied Unit (should never render)",
    property_type: "apartment",
    status: "occupied",    // ← excluded by Mabati Rule
    web_visible: true,
    zone: "E",
    area: "Kilimani",
    bedrooms: 2,
    bathrooms: 2,
    size_m2: 90,
    rent_kes: 85000,
    deposit_kes: 170000,
    features: [],
    images: [],
    published_at: "2026-01-01T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0012",
    reference: "CAL-NBO-2026-012",
    title: "HIDDEN — web_visible false (should never render)",
    property_type: "apartment",
    status: "vacant",
    web_visible: false,    // ← excluded by Mabati Rule
    zone: "B",
    area: "Kasarani",
    bedrooms: 1,
    bathrooms: 1,
    size_m2: 45,
    rent_kes: 22000,
    deposit_kes: 44000,
    features: [],
    images: [],
    published_at: "2026-01-01T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0013",
    reference: "CAL-NBO-2026-013",
    title: "2-Bedroom — Zimmerman, Quiet Court",
    property_type: "apartment",
    status: "vacant",
    web_visible: true,
    zone: "B",
    area: "Zimmerman",
    bedrooms: 2,
    bathrooms: 1,
    size_m2: 78,
    rent_kes: 26000,
    deposit_kes: 52000,
    features: ["Compound with parking", "Borehole", "Good road"],
    images: [],
    published_at: "2026-02-12T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0014",
    reference: "CAL-NBO-2026-014",
    title: "Warehouse — Embakasi, 500 m² Industrial Unit",
    property_type: "warehouse",
    status: "vacant",
    web_visible: true,
    zone: "G",
    area: "Embakasi",
    bedrooms: null,
    bathrooms: 2,
    size_m2: 500,
    rent_kes: 275000,
    deposit_kes: 550000,
    features: ["Loading bay", "3-phase power", "Security 24h", "Hardstand"],
    images: [],
    published_at: "2026-02-14T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0015",
    reference: "CAL-NBO-2026-015",
    title: "Studio — Muthaiga, Serviced Compound",
    property_type: "apartment",
    status: "vacant",
    web_visible: true,
    zone: "E",
    area: "Muthaiga",
    bedrooms: 1,
    bathrooms: 1,
    size_m2: 38,
    rent_kes: 35000,
    deposit_kes: 70000,
    features: ["Furnished option", "Swimming pool", "Gym", "24h security"],
    images: [],
    published_at: "2026-02-16T08:00:00Z",
  },
];

// ── Resolve lat/lng and strategic_region for each listing ────────────────────

// We keep jitter stable across renders using a module-level cache
const jitterCache = new Map<string, [number, number]>();

function resolveListings(): SearchListing[] {
  return MOCK_LISTINGS_RAW
    // THE MABATI RULE — filter before any render
    .filter((l) => l.web_visible && l.status === "vacant")
    .map((l) => {
      if (!jitterCache.has(l.id)) {
        jitterCache.set(l.id, jitter(resolveCentroid(l.area)));
      }
      const [lat, lng] = jitterCache.get(l.id)!;
      return {
        ...l,
        lat,
        lng,
        strategic_region: STRATEGIC_REGIONS[l.zone] ?? l.zone,
      };
    });
}

const ALL_LISTINGS = resolveListings();

// ── Filter helpers ────────────────────────────────────────────────────────────

const REGION_OPTIONS = [
  { value: "", label: "All Regions" },
  ...Object.entries(STRATEGIC_REGIONS).map(([, name]) => ({ value: name, label: name })),
];

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "apartment",  label: "Apartment" },
  { value: "townhouse",  label: "Townhouse" },
  { value: "villa",      label: "Villa" },
  { value: "office",     label: "Office" },
  { value: "retail",     label: "Retail" },
  { value: "warehouse",  label: "Warehouse" },
  { value: "land",       label: "Land" },
];

const BED_OPTIONS = [
  { value: "", label: "Any Beds" },
  { value: "1", label: "1 Bed" },
  { value: "2", label: "2 Beds" },
  { value: "3", label: "3 Beds" },
  { value: "4", label: "4+ Beds" },
];

const PRICE_OPTIONS = [
  { value: "",       label: "Any Price" },
  { value: "30000",  label: "Up to KES 30k" },
  { value: "60000",  label: "Up to KES 60k" },
  { value: "100000", label: "Up to KES 100k" },
  { value: "200000", label: "Up to KES 200k" },
];

// ── Filter bar ────────────────────────────────────────────────────────────────

interface FilterBarProps {
  region: string;
  type: string;
  beds: string;
  maxPrice: string;
  total: number;
  onChange: (key: "region" | "type" | "beds" | "maxPrice", val: string) => void;
  onClear: () => void;
}

function FilterBar({ region, type, beds, maxPrice, total, onChange, onClear }: FilterBarProps) {
  const isFiltered = region || type || beds || maxPrice;
  const selectCls = "w-full px-3 py-2 rounded-xl border border-slate-200 text-[#0D1B8E] text-sm font-medium bg-white focus:outline-none focus:border-[#00C9C9] focus:ring-2 focus:ring-[#00C9C9]/20 appearance-none cursor-pointer";

  return (
    <div
      className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm"
      role="search"
      aria-label="Filter properties"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {/* Region */}
          <div className="relative flex-1 min-w-[160px]">
            <label htmlFor="sr-filter" className="sr-only">Strategic Region</label>
            <select id="sr-filter" value={region} onChange={(e) => onChange("region", e.target.value)} className={selectCls}>
              {REGION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevDown />
          </div>

          {/* Type */}
          <div className="relative flex-1 min-w-[140px]">
            <label htmlFor="type-filter" className="sr-only">Property Type</label>
            <select id="type-filter" value={type} onChange={(e) => onChange("type", e.target.value)} className={selectCls}>
              {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevDown />
          </div>

          {/* Beds */}
          <div className="relative flex-1 min-w-[120px]">
            <label htmlFor="beds-filter" className="sr-only">Bedrooms</label>
            <select id="beds-filter" value={beds} onChange={(e) => onChange("beds", e.target.value)} className={selectCls}>
              {BED_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevDown />
          </div>

          {/* Max price */}
          <div className="relative flex-1 min-w-[160px]">
            <label htmlFor="price-filter" className="sr-only">Maximum Rent</label>
            <select id="price-filter" value={maxPrice} onChange={(e) => onChange("maxPrice", e.target.value)} className={selectCls}>
              {PRICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevDown />
          </div>

          {/* Result count + clear */}
          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
            <span className="text-sm text-slate-500 whitespace-nowrap" aria-live="polite" aria-atomic="true">
              <span className="font-bold text-[#0D1B8E]">{total}</span>
              {" "}{total === 1 ? "property" : "properties"}
            </span>
            {isFiltered && (
              <button
                onClick={onClear}
                className="text-xs font-semibold text-slate-500 hover:text-[#0D1B8E] border border-slate-200 hover:border-[#0D1B8E] px-3 py-1.5 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevDown() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ── Mobile map toggle ─────────────────────────────────────────────────────────

function MobileMapToggle({ showMap, onToggle }: { showMap: boolean; onToggle: () => void }) {
  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#0D1B8E] text-white
                   font-bold text-sm shadow-xl hover:bg-[#0a1570] transition-colors
                   focus:outline-none focus:ring-2 focus:ring-[#00C9C9]/50"
        aria-label={showMap ? "Show property list" : "Show map"}
      >
        {showMap ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Show List
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Show Map
          </>
        )}
      </button>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-5" aria-hidden="true">
        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C9C9]/10 border border-[#00C9C9]/20 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00C9C9]" aria-hidden="true" />
        <span className="text-[#00C9C9] text-xs font-bold tracking-widest uppercase">Concierge Search</span>
      </div>
      <h3 className="text-xl font-bold text-[#0D1B8E] mb-2">No Matches Found</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
        No properties match your current filters. Try broadening your search or let our concierge team find one for you.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onClear}
          className="px-6 py-2.5 rounded-full border-2 border-[#0D1B8E] text-[#0D1B8E] font-semibold text-sm hover:bg-[#0D1B8E] hover:text-white transition-colors"
        >
          Reset Filters
        </button>
        <a
          href="https://wa.me/254720854389?text=Hello%2C+I+am+looking+for+a+property+and+cannot+find+a+match+on+your+website."
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 rounded-full bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors text-center"
        >
          WhatsApp Concierge
        </a>
      </div>
    </div>
  );
}

// ── Main SearchInterface ──────────────────────────────────────────────────────

export default function SearchInterface() {
  const [region,   setRegion]   = useState("");
  const [type,     setType]     = useState("");
  const [beds,     setBeds]     = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileMap, setMobileMap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial load skeleton (removes on next tick after mount)
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const handleFilter = useCallback(
    (key: "region" | "type" | "beds" | "maxPrice", val: string) => {
      if (key === "region")   setRegion(val);
      if (key === "type")     setType(val);
      if (key === "beds")     setBeds(val);
      if (key === "maxPrice") setMaxPrice(val);
    },
    []
  );

  const clearFilters = useCallback(() => {
    setRegion("");
    setType("");
    setBeds("");
    setMaxPrice("");
  }, []);

  // Apply filters
  const filtered = useMemo(() => {
    return ALL_LISTINGS.filter((l) => {
      if (region   && l.strategic_region !== region) return false;
      if (type     && l.property_type !== type)      return false;
      if (beds) {
        const n = parseInt(beds, 10);
        if (beds === "4") {
          if ((l.bedrooms ?? 0) < 4) return false;
        } else {
          if (l.bedrooms !== n) return false;
        }
      }
      if (maxPrice && l.rent_kes > parseInt(maxPrice, 10)) return false;
      return true;
    });
  }, [region, type, beds, maxPrice]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Sticky filter bar ── */}
      <FilterBar
        region={region}
        type={type}
        beds={beds}
        maxPrice={maxPrice}
        total={filtered.length}
        onChange={handleFilter}
        onClear={clearFilters}
      />

      {/* ── Split-screen body ── */}
      <div className="flex max-w-screen-2xl mx-auto" style={{ minHeight: "calc(100vh - 57px)" }}>

        {/* ═══ LEFT — Card grid (60%) ═══ */}
        <div
          className={`w-full lg:w-[60%] overflow-y-auto ${mobileMap ? "hidden lg:block" : "block"}`}
          style={{ maxHeight: "calc(100vh - 57px)" }}
          role="feed"
          aria-label="Property listings"
          aria-busy={isLoading}
        >
          <div className="p-4 sm:p-6">
            {isLoading ? (
              /* Loading skeletons */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {filtered.map((listing) => (
                    <PropertyCard
                      key={listing.id}
                      listing={listing}
                      isActive={activeId === listing.id}
                      onHover={setActiveId}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* ═══ RIGHT — Sticky map (40%) ═══ */}
        <div
          className={`lg:block lg:w-[40%] lg:sticky lg:top-[57px] ${
            mobileMap ? "fixed inset-0 z-20 w-full h-full" : "hidden"
          }`}
          style={{ height: "calc(100vh - 57px)" }}
          aria-label="Interactive property map"
        >
          <InteractiveSearchMap
            listings={filtered}
            activeId={activeId}
            onPinHover={setActiveId}
          />

          {/* Mobile close button */}
          {mobileMap && (
            <button
              onClick={() => setMobileMap(false)}
              className="lg:hidden absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-50"
              aria-label="Close map"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile floating toggle */}
      <MobileMapToggle showMap={mobileMap} onToggle={() => setMobileMap((v) => !v)} />
    </div>
  );
}
