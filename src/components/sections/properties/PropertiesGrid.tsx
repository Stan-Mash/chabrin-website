"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const ZONES = [
  "All Zones", "Westlands", "Karen", "Kilimani", "Lavington",
  "Kasarani", "Thika Road", "Upper Hill", "CBD",
  "Ngong Road", "Ruaka", "Kiambu Road", "Rongai",
];
const TYPES = ["All Types", "Apartment", "House", "Commercial", "Office"];

// Placeholder listings — will be replaced when chabrin_public DB is populated via CHIPS sync
const PLACEHOLDER_LISTINGS = [
  { id: "1", title: "3 Bed Apartment",    type: "Apartment",   zone: "Westlands",  area: "Parklands",  beds: 3, baths: 2, size: "120 sqm",  price: "85,000",  ref: "CAL-2024-001" },
  { id: "2", title: "2 Bed Apartment",    type: "Apartment",   zone: "Kilimani",   area: "Kileleshwa", beds: 2, baths: 1, size: "85 sqm",   price: "65,000",  ref: "CAL-2024-002" },
  { id: "3", title: "4 Bed Townhouse",    type: "House",       zone: "Karen",      area: "Karen Estate", beds: 4, baths: 3, size: "280 sqm", price: "180,000", ref: "CAL-2024-003" },
  { id: "4", title: "Office Space",       type: "Office",      zone: "Upper Hill", area: "Upperhill",  beds: 0, baths: 2, size: "200 sqm",  price: "150,000", ref: "CAL-2024-004" },
  { id: "5", title: "1 Bed Studio",       type: "Apartment",   zone: "Kasarani",   area: "Roysambu",   beds: 1, baths: 1, size: "45 sqm",   price: "28,000",  ref: "CAL-2024-005" },
  { id: "6", title: "3 Bed Bungalow",     type: "House",       zone: "Ngong Road", area: "Dagoretti",  beds: 3, baths: 2, size: "160 sqm",  price: "75,000",  ref: "CAL-2024-006" },
];

type Listing = typeof PLACEHOLDER_LISTINGS[0];

function PropertyCard({ listing }: { listing: Listing }) {
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
          CHABRIN MANAGED
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
          {!isCommercial && listing.beds > 0 && <span>🛏 {listing.beds} Beds</span>}
          <span>🚿 {listing.baths} {isCommercial ? "WCs" : "Baths"}</span>
          <span>📐 {listing.size}</span>
        </div>

        {/* Price */}
        <div className="mb-5 mt-auto">
          <span className="text-2xl font-extrabold text-brand-navy">KES {listing.price}</span>
          <span className="text-slate-400 text-sm"> / month</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/en/contact?ref=${listing.ref}`}
            className="flex-1 text-center py-2.5 rounded-full bg-brand-navy text-white text-sm
                       font-semibold hover:bg-brand-navy-dark transition-colors"
          >
            Enquire
          </Link>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2.5 rounded-full bg-green-500 text-white text-sm
                       font-semibold hover:bg-green-600 transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesGrid() {
  const [zone, setZone] = useState("All Zones");
  const [type, setType] = useState("All Types");

  const filtered = useMemo(() =>
    PLACEHOLDER_LISTINGS.filter((p) =>
      (zone === "All Zones" || p.zone === zone) &&
      (type === "All Types" || p.type === type)
    ),
    [zone, type]
  );

  return (
    <section className="py-14 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Filters ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-white p-4 rounded-2xl shadow-card">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
              Zone
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-brand-navy text-sm
                         font-medium focus:outline-none focus:border-brand-cyan focus:ring-2
                         focus:ring-brand-cyan/20 bg-white"
            >
              {ZONES.map((z) => <option key={z}>{z}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
              Property Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-brand-navy text-sm
                         font-medium focus:outline-none focus:border-brand-cyan focus:ring-2
                         focus:ring-brand-cyan/20 bg-white"
            >
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setZone("All Zones"); setType("All Types"); }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm
                         hover:border-brand-navy hover:text-brand-navy transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-6">
          Showing{" "}
          <span className="font-semibold text-brand-navy">{filtered.length}</span>{" "}
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
            <h3 className="text-xl font-bold text-brand-navy mb-2">No properties found</h3>
            <p className="text-slate-500 mb-6">
              Try adjusting your filters or check back soon for new listings.
            </p>
            <button
              onClick={() => { setZone("All Zones"); setType("All Types"); }}
              className="px-6 py-2.5 rounded-full bg-brand-navy text-white text-sm font-semibold
                         hover:bg-brand-navy-dark transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ── Coming soon notice ────────────────────────────────────────── */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-brand-navy/5 border border-brand-navy/10">
          <p className="text-slate-600 text-sm">
            🏗️{" "}
            <strong>More properties coming soon.</strong> Our full listing database is being
            loaded.{" "}
            <Link href="/en/contact" className="text-brand-cyan font-semibold hover:underline">
              Contact us
            </Link>{" "}
            if you&apos;re looking for something specific.
          </p>
        </div>
      </div>
    </section>
  );
}
