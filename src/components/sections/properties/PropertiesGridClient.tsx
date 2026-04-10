"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { siteConfig } from "@/config/site";
import { ListingRow } from "@/db/queries/listings";

interface PropertiesGridClientProps {
  initialListings: ListingRow[];
  availableZones: string[];
}

function PropertyCard({ listing, locale }: { listing: ListingRow; locale: string }) {
  const t = useTranslations("properties");
  const whatsappMsg = encodeURIComponent(
    `Hello, I am interested in property ${listing.reference} - ${listing.title} in ${listing.area}. Please provide more details.`
  );
  const isCommercial = listing.property_type === "office" || listing.property_type === "retail";

  // Format price with commas
  const formattedPrice = listing.rent_kes.toLocaleString("en-US");

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all group flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-6xl opacity-20">🏠</span>
        )}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-navy text-white text-xs font-bold capitalize">
          {listing.property_type}
        </span>
        <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-brand-cyan/90 text-white text-[10px] font-bold tracking-wide">
          {t("managed_badge")}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-brand-navy text-lg mb-2 group-hover:text-brand-cyan transition-colors line-clamp-2">
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
        <div className="flex items-center gap-4 text-slate-500 text-sm mb-4 border-t border-slate-100 pt-3 flex-wrap">
          {!isCommercial && listing.bedrooms !== null && listing.bedrooms > 0 && (
            <span>🛏 {listing.bedrooms} {t("bedrooms")}</span>
          )}
          {listing.bathrooms !== null && (
            <span>🚿 {listing.bathrooms} {isCommercial ? "WCs" : t("bathrooms")}</span>
          )}
          {listing.size_m2 !== null && (
            <span>📐 {listing.size_m2} m²</span>
          )}
        </div>

        {/* Price */}
        <div className="mb-5 mt-auto">
          <span className="text-2xl font-extrabold text-brand-navy">KES {formattedPrice}</span>
          <span className="text-slate-400 text-sm"> / {t("rent_period")}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/${locale}/contact?ref=${listing.reference}`}
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

export default function PropertiesGridClient({
  initialListings,
  availableZones,
}: PropertiesGridClientProps) {
  const t = useTranslations("properties");
  const locale = useLocale();
  const [zone, setZone] = useState("All Zones");
  const [propertyType, setPropertyType] = useState("All Types");

  // Extract unique types from listings
  const uniqueTypes = Array.from(
    new Set(
      initialListings.map((l) => l.property_type)
    )
  ).sort();

  // Filter listings based on selected zone and type
  const filtered = useMemo(() =>
    initialListings.filter((listing) => {
      const zoneMatch = zone === "All Zones" || listing.zone === zone;
      const typeMatch =
        propertyType === "All Types" ||
        listing.property_type === propertyType.toLowerCase();
      return zoneMatch && typeMatch;
    }),
    [initialListings, zone, propertyType]
  );

  const ZONES = [
    { value: "All Zones", label: t("all_zones") },
    ...availableZones.map((z) => ({ value: z, label: z })),
  ];

  const TYPES = [
    { value: "All Types", label: t("all_types") },
    ...uniqueTypes.map((type) => ({ value: type, label: type })),
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
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-brand-navy text-sm
                         font-medium focus:outline-none focus:border-brand-cyan focus:ring-2
                         focus:ring-brand-cyan/20 bg-white"
            >
              {TYPES.map((ty) => <option key={ty.value} value={ty.value}>{ty.label}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setZone("All Zones");
                setPropertyType("All Types");
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm
                         hover:border-brand-navy hover:text-brand-navy transition-colors"
            >
              {t("clear_filters")}
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-6">
          {filtered.length} {filtered.length === 1 ? t("property_found") : t("properties_found")}
        </p>

        {/* ── Property Grid ──────────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg mb-4">🏠</p>
            <p className="text-slate-600 font-medium mb-2">{t("no_properties_found")}</p>
            <p className="text-slate-500 text-sm mb-6">
              {t("no_properties_help")}
            </p>
            <button
              onClick={() => {
                setZone("All Zones");
                setPropertyType("All Types");
              }}
              className="px-6 py-2.5 rounded-full border-2 border-brand-navy text-brand-navy font-semibold
                         hover:bg-brand-navy hover:text-white transition-colors"
            >
              {t("reset_filters")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
