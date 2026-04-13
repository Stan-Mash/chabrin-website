"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { siteConfig } from "@/config/site";
import { savePropertyRequest } from "@/actions/save-enquiry";
import { ListingRow } from "@/db/queries/listings";

// Tiny navy blurDataURL (4×4 px) used as placeholder for all remote images
const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAQAAAAD6+MHAAAAEElEQVR42mNk+M9Qz0AEAANBAQDd/7m4AAAAAElFTkSuQmCC";

// ── Property Card ─────────────────────────────────────────────────────────────

function PropertyCard({ listing, locale }: { listing: ListingRow; locale: string }) {
  const t = useTranslations("properties");
  const whatsappMsg = encodeURIComponent(
    `Hello, I am interested in property ${listing.reference} - ${listing.title} in ${listing.area}. Please provide more details.`
  );
  const isCommercial = listing.property_type === "office" || listing.property_type === "retail";
  const formattedPrice = listing.rent_kes.toLocaleString("en-US");
  const hasImage = listing.images && listing.images.length > 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all group flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0 overflow-hidden">
        {hasImage ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            quality={80}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="w-16 h-16 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9.75L12 3l9 6.75V21H3V9.75z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
            </svg>
          </div>
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
            aria-label={`${t("enquire")} — ${listing.title}`}
          >
            {t("enquire")}
          </Link>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp enquiry for ${listing.title}`}
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

// ── Property Request Modal ────────────────────────────────────────────────────

interface PropertyRequestModalProps {
  initialZone: string;
  onClose: () => void;
}

function PropertyRequestModal({ initialZone, onClose }: PropertyRequestModalProps) {
  const locale = useLocale();
  const t = useTranslations("properties");
  const isEn = locale !== "sw";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    zone: initialZone !== "All Zones" && initialZone !== "Maeneo Yote" ? initialZone : "",
    propertyType: "",
    budget: "",
    notes: "",
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [reqStatus, setReqStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function validate() {
    const errs: { name?: string; phone?: string } = {};
    if (form.name.trim().length < 2)
      errs.name = isEn ? "Please enter your name" : "Tafadhali ingiza jina lako";
    if (form.phone.trim().length < 9)
      errs.phone = isEn ? "Please enter a valid phone number" : "Tafadhali ingiza nambari sahihi ya simu";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setReqStatus("submitting");
    const result = await savePropertyRequest({
      name: form.name.trim(),
      phone: form.phone.trim(),
      zone: form.zone || undefined,
      propertyType: form.propertyType || undefined,
      budget: form.budget || undefined,
      notes: form.notes || undefined,
      locale,
    });
    setReqStatus(result.success ? "success" : "error");
  }

  const inputCls = (hasErr?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
      hasErr
        ? "border-red-300 focus:ring-red-200"
        : "border-slate-200 focus:border-brand-cyan focus:ring-brand-cyan/20"
    }`;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-request-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-brand-navy px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="property-request-title" className="text-white font-bold text-lg leading-tight">
              {t("concierge_modal_title")}
            </h2>
            <p className="text-brand-cyan text-sm mt-1">{t("concierge_modal_subtitle")}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={isEn ? "Close property request form" : "Funga fomu ya ombi la mali"}
            className="text-slate-400 hover:text-white transition-colors flex-shrink-0 mt-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {reqStatus === "success" ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-brand-navy text-lg mb-2">{t("concierge_success_title")}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">{t("concierge_success_desc")}</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-brand-navy text-white text-sm font-semibold hover:bg-brand-navy-dark transition-colors"
              >
                {isEn ? "Close" : "Funga"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label={isEn ? "Property request form" : "Fomu ya ombi la mali"}>
              {/* Name + Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="req-name" className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wide">
                    {t("concierge_name")} <span className="text-brand-cyan" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="req-name"
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    placeholder={isEn ? "Jane Wanjiku" : "Jane Wanjiku"}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    className={inputCls(!!errors.name)}
                  />
                  {errors.name && <p role="alert" className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="req-phone" className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wide">
                    {t("concierge_phone")} <span className="text-brand-cyan" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="req-phone"
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+254 7XX XXX XXX"
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                    className={inputCls(!!errors.phone)}
                  />
                  {errors.phone && <p role="alert" className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Zone + Type */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="req-zone" className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wide">
                    {t("filter_zone")}
                  </label>
                  <input
                    id="req-zone"
                    type="text"
                    value={form.zone}
                    onChange={set("zone")}
                    placeholder={isEn ? "e.g. Westlands" : "k.m. Westlands"}
                    className={inputCls()}
                  />
                </div>
                <div>
                  <label htmlFor="req-type" className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wide">
                    {t("filter_type")}
                  </label>
                  <select
                    id="req-type"
                    value={form.propertyType}
                    onChange={set("propertyType")}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-brand-navy focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
                  >
                    <option value="">{t("all_types")}</option>
                    {["apartment", "townhouse", "villa", "office", "retail", "warehouse", "land"].map((type) => (
                      <option key={type} value={type} className="capitalize">{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="req-budget" className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wide">
                  {t("concierge_budget")}
                </label>
                <input
                  id="req-budget"
                  type="text"
                  value={form.budget}
                  onChange={set("budget")}
                  placeholder={isEn ? "e.g. 80,000" : "k.m. 80,000"}
                  className={inputCls()}
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="req-notes" className="block text-xs font-semibold text-brand-navy mb-1.5 uppercase tracking-wide">
                  {t("concierge_notes")}
                </label>
                <textarea
                  id="req-notes"
                  value={form.notes}
                  onChange={set("notes")}
                  rows={3}
                  placeholder={isEn ? "Any specific requirements (pet-friendly, parking, school proximity...)" : "Mahitaji yoyote maalum (rafiki kwa wanyama, maegesho, karibu na shule...)"}
                  className={`${inputCls()} resize-none`}
                />
              </div>

              {reqStatus === "error" && (
                <p role="alert" className="text-red-600 text-sm">
                  {isEn ? "Something went wrong. Please try again or call us directly." : "Kuna tatizo. Tafadhali jaribu tena au piga simu moja kwa moja."}
                </p>
              )}

              <button
                type="submit"
                disabled={reqStatus === "submitting"}
                className="w-full py-3 rounded-full bg-brand-navy text-white font-bold text-sm
                           hover:bg-brand-navy-dark disabled:opacity-60 disabled:cursor-not-allowed
                           transition-colors flex items-center justify-center gap-2"
              >
                {reqStatus === "submitting" ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isEn ? "Sending request..." : "Inatuma ombi..."}
                  </>
                ) : (
                  t("concierge_submit")
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Grid Component ───────────────────────────────────────────────────────

interface PropertiesGridClientProps {
  initialListings: ListingRow[];
  availableZones: string[];
}

export default function PropertiesGridClient({
  initialListings,
  availableZones,
}: PropertiesGridClientProps) {
  const t = useTranslations("properties");
  const locale = useLocale();
  const [zone, setZone] = useState("All Zones");
  const [propertyType, setPropertyType] = useState("All Types");
  const [showRequestModal, setShowRequestModal] = useState(false);

  const openModal = useCallback(() => setShowRequestModal(true), []);
  const closeModal = useCallback(() => setShowRequestModal(false), []);

  // Extract unique types from listings
  const uniqueTypes = Array.from(
    new Set(initialListings.map((l) => l.property_type))
  ).sort();

  // Filter listings
  const filtered = useMemo(
    () =>
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

  const isFiltered = zone !== "All Zones" || propertyType !== "All Types";

  return (
    <>
      <section className="py-14 bg-surface" aria-label={t("title")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Filters ── */}
          <div
            className="flex flex-col sm:flex-row gap-4 mb-10 bg-white p-4 rounded-2xl shadow-card"
            role="search"
            aria-label={locale !== "sw" ? "Filter properties" : "Chuja mali"}
          >
            <div className="flex-1">
              <label
                htmlFor="zone-filter"
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide"
              >
                {t("filter_zone")}
              </label>
              <select
                id="zone-filter"
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
              <label
                htmlFor="type-filter"
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide"
              >
                {t("filter_type")}
              </label>
              <select
                id="type-filter"
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
                aria-label={locale !== "sw" ? "Clear all filters" : "Futa vichujio vyote"}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm
                           hover:border-brand-navy hover:text-brand-navy transition-colors"
              >
                {t("clear_filters")}
              </button>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-slate-500 mb-6" aria-live="polite" aria-atomic="true">
            {filtered.length}{" "}
            {filtered.length === 1 ? t("property_found") : t("properties_found")}
          </p>

          {/* ── Property Grid or Empty State ── */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} locale={locale} />
              ))}
            </div>
          ) : (
            /* ── Concierge Empty State ── */
            <div
              className="flex flex-col items-center justify-center py-12"
              role="status"
              aria-live="polite"
            >
              <div className="max-w-lg w-full bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
                {/* Card header band */}
                <div className="h-1.5 bg-gradient-to-r from-brand-navy via-brand-cyan to-brand-navy" aria-hidden="true" />

                <div className="px-8 py-8 text-center">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-5"
                    aria-hidden="true"
                  >
                    <svg className="w-8 h-8 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>

                  {/* Concierge badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" aria-hidden="true" />
                    <span className="text-brand-cyan text-xs font-bold tracking-widest uppercase">
                      {t("concierge_badge")}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-navy mb-2">
                    {t("concierge_title")}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                    {t("concierge_desc")}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={openModal}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full
                                 bg-brand-navy text-white font-semibold text-sm hover:bg-brand-navy-dark
                                 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                      {t("concierge_cta")}
                    </button>

                    {isFiltered && (
                      <button
                        onClick={() => { setZone("All Zones"); setPropertyType("All Types"); }}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full
                                   border-2 border-brand-navy text-brand-navy font-semibold text-sm
                                   hover:bg-brand-navy hover:text-white transition-colors"
                      >
                        {t("reset_filters")}
                      </button>
                    )}
                  </div>

                  {/* WhatsApp shortcut */}
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                      locale !== "sw"
                        ? "Hello, I am looking for a property in a specific zone. Can you help me find one?"
                        : "Habari, ninatafuta mali katika eneo maalum. Mnaweza kunisaidia kupata moja?"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-green-600 hover:text-green-700
                               text-sm font-medium transition-colors"
                    aria-label={locale !== "sw" ? "Contact us on WhatsApp to find a property" : "Wasiliana nasi kwenye WhatsApp kupata mali"}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {locale !== "sw" ? "Or message us on WhatsApp" : "Au tutumie ujumbe kwenye WhatsApp"}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Property Request Modal ── */}
      {showRequestModal && (
        <PropertyRequestModal
          initialZone={zone}
          onClose={closeModal}
        />
      )}
    </>
  );
}
