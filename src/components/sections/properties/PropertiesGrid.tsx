"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

// Zone A & B are merged; 7 zones total: AB, C, D, E, F, G
const ZONE_KEYS = ["All Zones", "Zone AB", "Zone C", "Zone D", "Zone E", "Zone F", "Zone G"];
const TYPE_KEYS = ["All Types", "Apartment", "House", "Commercial", "Office"];

// Placeholder listings updated to use correct Chabrin zones (A–G)
// Zone AB: Central Nairobi / Westlands / Parklands
// Zone C: Kilimani / Kileleshwa / Lavington
// Zone D: Karen / Langata / Ngong Road
// Zone E: Eastlands / Kasarani / Roysambu
// Zone F: Thika Road / Ruiru / Juja
// Zone G: Kenol / Murang'a / Athi River corridor
const PLACEHOLDER_LISTINGS = [
  { id: "1", title: "3 Bed Apartment",    type: "Apartment",   zone: "Zone AB", area: "Westlands / Parklands",  beds: 3, baths: 2, size: "120 sqm", price: "85,000",  ref: "CAL-2024-001" },
  { id: "2", title: "2 Bed Apartment",    type: "Apartment",   zone: "Zone C",  area: "Kilimani / Kileleshwa",  beds: 2, baths: 1, size: "85 sqm",  price: "65,000",  ref: "CAL-2024-002" },
  { id: "3", title: "4 Bed Townhouse",    type: "House",       zone: "Zone D",  area: "Karen / Ngong Road",     beds: 4, baths: 3, size: "280 sqm", price: "180,000", ref: "CAL-2024-003" },
  { id: "4", title: "Office Space",       type: "Office",      zone: "Zone AB", area: "Upper Hill / CBD",       beds: 0, baths: 2, size: "200 sqm", price: "150,000", ref: "CAL-2024-004" },
  { id: "5", title: "1 Bed Studio",       type: "Apartment",   zone: "Zone E",  area: "Kasarani / Roysambu",    beds: 1, baths: 1, size: "45 sqm",  price: "28,000",  ref: "CAL-2024-005" },
  { id: "6", title: "3 Bed Bungalow",     type: "House",       zone: "Zone G",  area: "Kenol / Athi River",     beds: 3, baths: 2, size: "160 sqm", price: "55,000",  ref: "CAL-2024-006" },
];

type Listing = typeof PLACEHOLDER_LISTINGS[0];

function PropertyCard({ listing }: { listing: Listing }) {
  const t = useTranslations("properties");
  const whatsappMsg = encodeURIComponent(
    `Hello, I am interested in property ${listing.ref} - ${listing.title} in ${listing.area}. Please provide more details.`
  );
  const isCommercial = listing.type === "Office" || listing.type === "Commercial";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all group flex flex-col">
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
        <span className="text-6xl opacity-20">🏠</span>
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-navy text-white text-xs font-bold">
          {listing.type}
        </span>
        <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-brand-cyan/90 text-white text-[10px] font-bold tracking-wide">
          {t("managed_badge")}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-brand-navy text-lg mb-2 group-hover:text-brand-cyan transition-colors">
          {listing.title}
        </h3>

        {/* Zone + Area */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-brand-navy font-semibold border border-slate-200">
            📍 {listing.zone}
          </span>
          <span className="text-xs text-slate-400">{listing.area}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-slate-500 text-sm mb-4 border-t border-slate-100 pt-3">
          {!isCommercial && listing.beds > 0 && (
            <span>🛏 {listing.beds} {t("bedrooms")}</span>
          )}
          <span>🚿 {listing.baths} {isCommercial ? "WCs" : t("bathrooms")}</span>
          <span>📐 {listing.size}</span>
        </div>

        {/* Price */}
        <div className="mb-5 mt-auto">
          <span className="text-2xl font-extrabold text-brand-navy">KES {listing.price}</span>
          <span className="text-slate-400 text-sm"> {t("rent").startsWith("K") ? "/ month" : t("rent")}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/en/contact?ref=${listing.ref}`}
            className="flex-1 text-center py-2.5 rounded-full bg-brand-navy text-white text-sm
                       font-semibold hover:bg-brand-navy-dark transition-colors"
          >
            {t("enquire")}
          </Link>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2.5 rounded-full bg-green-500 text-white text-sm
                       font-semibold hover:bg-green-600 transition-colors"
          >
            {t("whatsapp")}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesGrid() {
  const t = useTranslations("properties");
  const [zone, setZone] = useState("All Zones");
  const [type, setType] = useState("All Types");

  const filtered = useMemo(() =>
    PLACEHOLDER_LISTINGS.filter((p) =>
      (zone === "All Zones" || p.zone === zone) &&
      (type === "All Types" || p.type === type)
    ),
    [zone, type]
  );

  // Build localised zone/type labels while keeping filter values as stable keys
  const ZONES = [
    { value: "All Zones", label: t("all_zones") },
    { value: "Zone AB", label: "Zone AB" },
    { value: "Zone C",  label: "Zone C" },
    { value: "Zone D",  label: "Zone D" },
    { value: "Zone E",  label: "Zone E" },
    { value: "Zone F",  label: "Zone F" },
    { value: "Zone G",  label: "Zone G" },
  ];

  const TYPES = [
    { value: "All Types",   label: t("all_types") },
    { value: "Apartment",   label: "Apartment" },
    { value: "House",       label: "House" },
    { value: "Commercial",  label: "Commercial" },
    { value: "Office",      label: "Office" },
  ];

  return (
    <section className="py-14 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Filters ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-white p-4 rounded-2xl shadow-card">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
              {t("filter_zone")}
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-brand-navy text-sm
                         font-medium focus:outline-none focus:border-brand-cyan focus:ring-2
                         focus:ring-brand-cyan/20 bg-white"
            >
              {ZONES.map((z) => <option key={z.value} value={z.value}>{z.label}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
              {t("filter_type")}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-brand-navy text-sm
                         font-medium focus:outline-none focus:border-brand-cyan focus:ring-2
                         focus:ring-brand-cyan/20 bg-white"
            >
              {TYPES.map((ty) => <option key={ty.value} value={ty.value}>{ty.label}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setZone("All Zones"); setType("All Types"); }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm
                         hover:border-brand-navy hover:text-brand-navy transition-colors"
            >
              {t("clear_filters")}
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-6">
          {filtered.length}{" "}
          propert{filtered.length === 1 ? "y" : "ies"}
        </p>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-brand-navy mb-2">{t("no_results")}</h3>
            <p className="text-slate-500 mb-6">
              {t("coming_soon")}
            </p>
            <button
              onClick={() => { setZone("All Zones"); setType("All Types"); }}
              className="px-6 py-2.5 rounded-full bg-brand-navy text-white text-sm font-semibold
                         hover:bg-brand-navy-dark transition-colors"
            >
              {t("no_results_action")}
            </button>
          </div>
        )}

        {/* ── Coming soon notice ────────────────────────────────────────── */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-brand-navy/5 border border-brand-navy/10">
          <p className="text-slate-600 text-sm">
            🏗️{" "}
            <strong>{t("coming_soon").split(".")[0]}.</strong>{" "}
            <Link href="/en/contact" className="text-brand-cyan font-semibold hover:underline">
              {t("enquire")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
