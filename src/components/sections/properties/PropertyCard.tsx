"use client";

/**
 * PropertyCard — Premium property card for the Search Properties page.
 *
 * Features:
 * - Image carousel with dot indicators + smooth slide animation
 * - "NEW LISTING" badge for properties published within 21 days
 * - Prominent rent + deposit display
 * - Strategic region + area tags
 * - Bedroom / bathroom / size specs row
 * - Features pills (first 3 shown)
 * - "CHABRIN MANAGED" badge + property type chip
 * - WhatsApp + Enquire CTAs with slide-in drawer
 * - 3D tilt on hover via Framer Motion
 * - Hover elevation + scale animation via Framer Motion
 * - Image thumbnail zooms on card hover
 */

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useLocale } from "next-intl";
import { siteConfig } from "@/config/site";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { SearchListing } from "./SearchInterface";

const BLUR_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAQAAAAD6+MHAAAAEElEQVR42mNk+M9Qz0AEAANBAQDd/7m4AAAAAElFTkSuQmCC";

const NEW_LISTING_MS = 21 * 24 * 60 * 60 * 1000;

function isNewListing(publishedAt: string): boolean {
  return Date.now() - new Date(publishedAt).getTime() < NEW_LISTING_MS;
}

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

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      className="w-3.5 h-3.5"
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

interface CarouselProps {
  images:       string[];
  title:        string;
  propertyType: string;
  publishedAt:  string;
  isActive?:    boolean;
}

function ImageCarousel({ images, title, propertyType, publishedAt, isActive }: CarouselProps) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const hasImages = images.length > 0;
  const count = hasImages ? images.length : 0;
  const isNew = isNewListing(publishedAt);

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
      className={`relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0 ${
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
                enter:  (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit:   (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[idx]}
                alt={`${title} — image ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 400px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                placeholder="blur"
                blurDataURL={BLUR_URL}
                quality={80}
              />
            </motion.div>
          </AnimatePresence>

          {count > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                           w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow
                           flex items-center justify-center text-slate-700
                           opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                           w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow
                           flex items-center justify-center text-slate-700
                           opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
              >
                <ChevronIcon dir="right" />
              </button>
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDir(i > idx ? 1 : -1);
                      setIdx(i);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      i === idx ? "bg-white w-4" : "bg-white/50 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2" aria-hidden="true">
          <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
          </svg>
          <span className="text-xs text-slate-300 font-medium">Photo coming soon</span>
        </div>
      )}

      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
        {isNew && (
          <span className="px-2.5 py-0.5 rounded-full bg-[#00C9C9] text-white text-[10px] font-extrabold tracking-widest uppercase shadow-sm">
            ✦ New Listing
          </span>
        )}
        <span className={`px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold tracking-wide capitalize ${typeColour(propertyType)}`}>
          {propertyType}
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-0.5 rounded-full bg-[#0D1B8E]/80 text-white text-[9px] font-bold tracking-widest uppercase backdrop-blur-sm">
          CHABRIN MANAGED
        </span>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-12 z-[5]"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }}
        aria-hidden="true"
      />
    </div>
  );
}

function Spec({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-slate-500 text-xs">
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
}

function FeaturePill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-medium">
      {label}
    </span>
  );
}

interface PropertyCardProps {
  listing:   SearchListing;
  isActive?: boolean;
  onHover?:  (id: string | null) => void;
}

export default function PropertyCard({ listing, isActive, onHover }: PropertyCardProps) {
  const locale = useLocale();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const isCommercial = listing.property_type === "office" ||
                       listing.property_type === "retail" ||
                       listing.property_type === "warehouse";
  const formattedRent    = listing.rent_kes.toLocaleString("en-KE");
  const formattedDeposit = listing.deposit_kes.toLocaleString("en-KE");
  const whatsappMsg = encodeURIComponent(
    `Hello, I am interested in property ${listing.reference} — ${listing.title} in ${listing.area}. Please send details.`
  );

  const visibleFeatures = listing.features.slice(0, 3);
  const extraFeatures   = listing.features.length - 3;

  // 3D tilt
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 300, damping: 30 });
  const springRotY = useSpring(rotY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotY.set(((e.clientX - cx) / (rect.width / 2)) * 5);
    rotX.set(-((e.clientY - cy) / (rect.height / 2)) * 5);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    onHover?.(null);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.22 }}
        style={{
          rotateX: springRotX,
          rotateY: springRotY,
          transformPerspective: 800,
        }}
        className={`group bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-200 flex flex-col ${
          isActive
            ? "border-[#00C9C9] shadow-[0_0_0_3px_rgba(0,201,201,0.2)]"
            : "border-slate-100 hover:shadow-lg hover:border-slate-200"
        }`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => onHover?.(listing.id)}
        onMouseLeave={handleMouseLeave}
        role="article"
        aria-label={`${listing.title} — KES ${formattedRent} per month`}
      >
        <ImageCarousel
          images={listing.images}
          title={listing.title}
          propertyType={listing.property_type}
          publishedAt={listing.published_at}
          isActive={isActive}
        />

        <div className="p-4 flex flex-col flex-1 gap-2.5">

          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-[#00C9C9] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-slate-500 truncate">
              {listing.area}
              <span className="text-slate-300 mx-1">·</span>
              <span className="text-slate-400">{listing.strategic_region}</span>
            </span>
          </div>

          <h3 className="font-bold text-[#0D1B8E] text-[15px] leading-snug line-clamp-2 group-hover:text-[#00C9C9] transition-colors">
            {listing.title}
          </h3>

          {(!isCommercial || listing.size_m2) && (
            <div className="flex items-center gap-3 flex-wrap">
              {!isCommercial && listing.bedrooms !== null && listing.bedrooms > 0 && (
                <Spec icon="🛏" label={`${listing.bedrooms} ${listing.bedrooms === 1 ? "bed" : "beds"}`} />
              )}
              {listing.bathrooms !== null && (
                <Spec icon="🚿" label={`${listing.bathrooms} ${listing.bathrooms === 1 ? "bath" : "baths"}`} />
              )}
              {listing.size_m2 !== null && (
                <Spec icon="📐" label={`${listing.size_m2} m²`} />
              )}
            </div>
          )}

          {visibleFeatures.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5">
              {visibleFeatures.map((f) => (
                <FeaturePill key={f} label={f} />
              ))}
              {extraFeatures > 0 && (
                <span className="text-[10px] text-slate-400 font-medium">+{extraFeatures} more</span>
              )}
            </div>
          )}

          <div className="flex items-end justify-between mt-auto pt-2.5 border-t border-slate-100">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-[#0D1B8E] tracking-tight">
                  KES {formattedRent}
                </span>
                <span className="text-slate-400 text-xs font-medium">/ mo</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Deposit: <span className="font-semibold text-slate-500">KES {formattedDeposit}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setEnquiryOpen(true)}
              className="flex-1 py-2.5 rounded-xl bg-[#0D1B8E] text-white text-xs font-bold
                         text-center hover:bg-[#0a1570] transition-colors focus:outline-none
                         focus:ring-2 focus:ring-[#0D1B8E]/50"
              aria-label={`Enquire about ${listing.title}`}
            >
              Enquire
            </button>
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

      {/* ── Enquiry drawer ── */}
      <Sheet open={enquiryOpen} onOpenChange={setEnquiryOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
            <SheetTitle className="text-brand-navy text-lg font-bold leading-snug">
              {listing.title}
            </SheetTitle>
            <p className="text-slate-500 text-sm mt-1">
              {listing.area} · {listing.strategic_region}
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Price summary */}
            <div className="bg-surface rounded-2xl p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Monthly Rent</p>
              <p className="text-2xl font-extrabold text-brand-navy">KES {formattedRent}</p>
              <p className="text-sm text-slate-500 mt-1">
                Security deposit: <span className="font-semibold text-brand-navy">KES {formattedDeposit}</span>
              </p>
            </div>

            {/* Ref */}
            <p className="text-xs text-slate-400 font-mono">
              Ref: <span className="text-brand-navy font-bold">{listing.reference}</span>
            </p>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm font-semibold text-brand-navy mb-3">How would you like to enquire?</p>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl bg-green-500
                           text-white font-bold text-sm hover:bg-green-600 transition-colors mb-3"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>

              {/* Full form link */}
              <Link
                href={`/${locale}/contact?ref=${listing.reference}`}
                onClick={() => setEnquiryOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl
                           border-2 border-brand-navy text-brand-navy font-bold text-sm
                           hover:bg-brand-navy hover:text-white transition-all duration-200"
              >
                Send a Detailed Enquiry
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
