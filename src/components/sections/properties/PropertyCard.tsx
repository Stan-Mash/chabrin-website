"use client";

/**
 * PropertyCard — Airbnb-style premium property card for the Search Properties page.
 *
 * Features:
 * - Image carousel with dot indicators (keyboard accessible)
 * - Prominent rent display (KES bold, large)
 * - Strategic Region + area tags (NO "Zone" terminology)
 * - Bedroom / bathroom / size specs row
 * - "CHABRIN MANAGED" badge + property type chip
 * - WhatsApp + Enquire CTAs
 * - Hover elevation + scale animation via Framer Motion
 * - Data security: web_visible + status filtering is done UPSTREAM in SearchInterface
 *   so this component only ever receives safe-to-display listings
 */

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { siteConfig } from "@/config/site";
import type { SearchListing } from "./SearchInterface";

// Tiny 4×4 navy pixel blurDataURL — identical to PropertiesGridClient
const BLUR_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAQAAAAD6+MHAAAAEElEQVR42mNk+M9Qz0AEAANBAQDd/7m4AAAAAElFTkSuQmCC";

// ── Type badge colour map ─────────────────────────────────────────────────────

const TYPE_COLOURS: Record<string, string> = {
  apartment:  "bg-blue-600",
  townhouse:  "bg-indigo-600",
  villa:      "bg-violet-600",
  office:     "bg-slate-600",
  retail:     "bg-amber-600",
  warehouse:  "bg-stone-600",
  land:       "bg-green-700",
};

function typeColour(type: string): string {
  return TYPE_COLOURS[type] ?? "bg-slate-600";
}

// ── Chevron icon ──────────────────────────────────────────────────────────────

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={dir === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );
}

// ── Image Carousel ────────────────────────────────────────────────────────────

interface CarouselProps {
  images: string[];
  title: string;
  propertyType: string;
  isActive?: boolean; // highlighted from map hover
}

function ImageCarousel({ images, title, propertyType, isActive }: CarouselProps) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const hasImages = images.length > 0;
  const count = hasImages ? images.length : 0;

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDir(-1);
      setIdx((i) => (i - 1 + count) % count);
    },
    [count]
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDir(1);
      setIdx((i) => (i + 1) % count);
    },
    [count]
  );

  return (
    <div
      className={`relative h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0 ${
        isActive ? "ring-2 ring-[#00C9C9]" : ""
      }`}
      aria-label={`Property images for ${title}`}
    >
      {hasImages ? (
        <>
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              variants={{
                enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit:  (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[idx]}
                alt={`${title} — image ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 400px"
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_URL}
                quality={80}
              />
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next — only shown when multiple images */}
          {count > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                           w-7 h-7 rounded-full bg-white/80 hover:bg-white
                           shadow flex items-center justify-center text-slate-700
                           transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                           w-7 h-7 rounded-full bg-white/80 hover:bg-white
                           shadow flex items-center justify-center text-slate-700
                           transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <ChevronIcon dir="right" />
              </button>

              {/* Dot indicators */}
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10"
                role="tablist"
                aria-label="Image navigation"
              >
                {images.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === idx}
                    aria-label={`Image ${i + 1}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDir(i > idx ? 1 : -1); setIdx(i); }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === idx ? "bg-white w-3" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        /* No-image placeholder */
        <div className="w-full h-full flex flex-col items-center justify-center gap-2" aria-hidden="true">
          <svg
            className="w-12 h-12 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
          </svg>
          <span className="text-xs text-slate-300 font-medium">No photo yet</span>
        </div>
      )}

      {/* Badges overlay */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
        <span
          className={`px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold tracking-wide capitalize ${typeColour(propertyType)}`}
        >
          {propertyType}
        </span>
      </div>
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-0.5 rounded-full bg-[#00C9C9] text-white text-[9px] font-bold tracking-widest uppercase">
          CHABRIN MANAGED
        </span>
      </div>
    </div>
  );
}

// ── Spec pill ─────────────────────────────────────────────────────────────────

function Spec({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-slate-500 text-xs">
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
}

// ── PropertyCard ──────────────────────────────────────────────────────────────

interface PropertyCardProps {
  listing: SearchListing;
  isActive?: boolean;   // set true when map pin is hovered/selected
  onHover?: (id: string | null) => void;
}

export default function PropertyCard({ listing, isActive, onHover }: PropertyCardProps) {
  const locale = useLocale();
  const isCommercial = listing.property_type === "office" || listing.property_type === "retail";
  const formattedRent = listing.rent_kes.toLocaleString("en-KE");
  const whatsappMsg = encodeURIComponent(
    `Hello, I am interested in property ${listing.reference} — ${listing.title} in ${listing.area}. Please send details.`
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22 }}
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-200 flex flex-col ${
        isActive
          ? "border-[#00C9C9] shadow-[0_0_0_2px_rgba(0,201,201,0.25)]"
          : "border-slate-100 hover:shadow-md hover:border-slate-200"
      }`}
      onMouseEnter={() => onHover?.(listing.id)}
      onMouseLeave={() => onHover?.(null)}
      role="article"
      aria-label={`${listing.title} — KES ${formattedRent} per month`}
    >
      {/* ── Image carousel ── */}
      <ImageCarousel
        images={listing.images}
        title={listing.title}
        propertyType={listing.property_type}
        isActive={isActive}
      />

      {/* ── Card body ── */}
      <div className="p-4 flex flex-col flex-1 gap-3">

        {/* Region + area */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D1B8E] bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
            <svg className="w-2.5 h-2.5 text-[#00C9C9]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            {listing.strategic_region}
          </span>
          <span className="text-xs text-slate-400 truncate">{listing.area}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[#0D1B8E] text-base leading-snug line-clamp-2 group-hover:text-[#00C9C9] transition-colors">
          {listing.title}
        </h3>

        {/* Specs row */}
        <div className="flex items-center gap-3 flex-wrap border-t border-slate-100 pt-2.5">
          {!isCommercial && listing.bedrooms !== null && listing.bedrooms > 0 && (
            <Spec icon="🛏" label={`${listing.bedrooms} bd`} />
          )}
          {listing.bathrooms !== null && (
            <Spec icon="🚿" label={`${listing.bathrooms} ba`} />
          )}
          {listing.size_m2 !== null && (
            <Spec icon="📐" label={`${listing.size_m2} m²`} />
          )}
        </div>

        {/* Rent — prominent display */}
        <div className="flex items-baseline gap-1 mt-auto">
          <span className="text-2xl font-extrabold text-[#0D1B8E] tracking-tight">
            KES {formattedRent}
          </span>
          <span className="text-slate-400 text-sm font-medium">/ mo</span>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2 pt-1">
          <Link
            href={`/${locale}/contact?ref=${listing.reference}`}
            className="flex-1 py-2.5 rounded-xl bg-[#0D1B8E] text-white text-xs font-bold
                       text-center hover:bg-[#0a1570] transition-colors focus:outline-none
                       focus:ring-2 focus:ring-[#0D1B8E]/50"
            aria-label={`Enquire about ${listing.title}`}
          >
            Enquire
          </Link>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp enquiry for ${listing.title}`}
            className="flex-1 py-2.5 rounded-xl bg-green-500 text-white text-xs font-bold
                       text-center hover:bg-green-600 transition-colors focus:outline-none
                       focus:ring-2 focus:ring-green-500/50"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}
