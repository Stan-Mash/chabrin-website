"use client";

import Image from "next/image";
import { useState } from "react";

// Quick-filter pills dispatch window events picked up by SearchInterface
const TYPE_PILLS = [
  { label: "Apartments", emoji: "🏠", type: "apartment" },
  { label: "Townhouses", emoji: "🏘", type: "townhouse" },
  { label: "Villas",     emoji: "🏡", type: "villa" },
  { label: "Offices",    emoji: "🏢", type: "office" },
  { label: "Retail",     emoji: "🏪", type: "retail" },
];

export default function PropertiesHero() {
  const [query, setQuery] = useState("");

  const scrollToListings = () => {
    setTimeout(() => {
      document.getElementById("search-listings")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.dispatchEvent(
        new CustomEvent("chabrin:search", { detail: { q: query.trim() } })
      );
    }
    scrollToListings();
  };

  const handleTypePill = (type: string) => {
    window.dispatchEvent(
      new CustomEvent("chabrin:type", { detail: { type } })
    );
    scrollToListings();
  };

  return (
    <section className="relative overflow-hidden" style={{ minHeight: 440 }} aria-label="Property search hero">
      {/* ── Background image ── */}
      <Image
        src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=75"
        alt="Modern apartment building in the greater Nairobi metropolitan region"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(13,27,142,0.92) 0%, rgba(13,27,142,0.75) 60%, rgba(0,26,112,0.85) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center">

        {/* Available badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
          style={{ background: "rgba(0,201,201,0.15)", border: "1px solid rgba(0,201,201,0.4)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C9C9] animate-pulse" aria-hidden="true" />
          <span className="text-[#00C9C9] text-xs font-bold tracking-widest uppercase">
            Vacant Units — Available Now
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-tight mb-3">
          Find Your Perfect Space<br />
          <span style={{ color: "#00C9C9" }}>Nairobi, Kiambu, Murang&apos;a &amp; Kajiado</span>
        </h1>
        <p className="text-white/65 text-sm sm:text-base max-w-xl mx-auto mb-7 leading-relaxed">
          Professionally managed properties across 7 corridors — from Murang&apos;a and
          Thika in the north to Kitengela, Athi River and Ongata Rongai in the south.
        </p>

        {/* ── Search box ── */}
        <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-6" role="search" aria-label="Search properties by area">
          <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-2xl">
            <div className="flex-1 flex items-center gap-2 px-3 min-w-0">
              <svg
                className="w-4 h-4 text-slate-400 flex-shrink-0"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Area or type — e.g. Kasarani, Kitengela, Thika, Villa..."
                className="w-full py-2 text-sm text-slate-700 placeholder:text-slate-400 bg-transparent outline-none"
                aria-label="Search area or property type"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-colors hover:opacity-90 flex-shrink-0"
              style={{ background: "#0D1B8E" }}
            >
              Search
            </button>
          </div>
        </form>

        {/* ── Quick-type pills ── */}
        <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filter by property type">
          {TYPE_PILLS.map((p) => (
            <button
              key={p.type}
              onClick={() => handleTypePill(p.type)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-white/75
                         hover:text-white hover:bg-white/20 transition-all duration-150
                         border border-white/20 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-[#00C9C9]/50"
              aria-label={`Browse ${p.label}`}
            >
              <span aria-hidden="true">{p.emoji}</span> {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div
        className="relative z-10 border-t"
        style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)" }}
        aria-label="Chabrin portfolio statistics"
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          {[
            { stat: "7",      label: "Metro Corridors" },
            { stat: "30+",    label: "Years Experience" },
            { stat: "100%",   label: "Professional Mgmt" },
          ].map((s) => (
            <div key={s.stat} className="text-center">
              <p className="text-white font-extrabold text-lg leading-none">{s.stat}</p>
              <p className="text-white/45 text-[11px] mt-0.5 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
