"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/* ─── Zone data ──────────────────────────────────────────────────────────── */

interface ZoneData {
  id: string;
  name: string;
  areas: string;
  properties: number;
  /** 1–10 management density score */
  density: number;
  /** Approximate SVG polygon path (700×560 viewBox, CBD ≈ 335, 270) */
  path: string;
  /** Label anchor inside the polygon */
  labelX: number;
  labelY: number;
}

const ZONES: ZoneData[] = [
  {
    id: "A",
    name: "Westlands & Parklands",
    areas: "Westlands, Parklands, Highridge, Spring Valley",
    properties: 320,
    density: 9,
    path: "M 88,68 L 335,62 L 342,184 L 298,224 L 192,208 L 94,178 Z",
    labelX: 210,
    labelY: 130,
  },
  {
    id: "B",
    name: "Kilimani & Kileleshwa",
    areas: "Kilimani, Kileleshwa, Lavington, Woodlands",
    properties: 275,
    density: 9,
    path: "M 94,178 L 298,224 L 308,314 L 202,344 L 106,300 Z",
    labelX: 192,
    labelY: 258,
  },
  {
    id: "C",
    name: "South B, C & Langata",
    areas: "South B, South C, Langata, Nairobi West",
    properties: 148,
    density: 5,
    path: "M 106,300 L 202,344 L 218,440 L 104,464 L 58,378 Z",
    labelX: 140,
    labelY: 385,
  },
  {
    id: "D",
    name: "Eastlands",
    areas: "Umoja, Buruburu, Donholm, Savannah, Embakasi",
    properties: 215,
    density: 7,
    path: "M 368,184 L 614,178 L 618,354 L 428,374 L 364,314 Z",
    labelX: 486,
    labelY: 268,
  },
  {
    id: "E",
    name: "Karen & Rongai",
    areas: "Karen, Langata, Rongai, Kiserian",
    properties: 178,
    density: 7,
    path: "M 218,440 L 338,430 L 346,504 L 194,528 L 90,490 Z",
    labelX: 228,
    labelY: 474,
  },
  {
    id: "F",
    name: "Upper Hill",
    areas: "Upper Hill, Kilimani South, Elgeyo Marakwet Rd",
    properties: 192,
    density: 8,
    path: "M 298,224 L 368,224 L 374,334 L 308,334 Z",
    labelX: 336,
    labelY: 278,
  },
  {
    id: "G",
    name: "Kiambu & Ruaka",
    areas: "Ruaka, Kiambu Town, Githunguri, Thika Road",
    properties: 118,
    density: 6,
    path: "M 335,62 L 614,68 L 614,178 L 368,184 L 342,122 Z",
    labelX: 476,
    labelY: 118,
  },
];

/* ─── Helpers ───────────────────────────────────────────────────────────── */

/** Returns RGBA string: low density = navy-tinted, high density = full cyan */
function densityFill(density: number, active: boolean): string {
  const alpha = active ? 1 : 0.18 + (density / 10) * 0.62;
  return active
    ? `rgba(0, 201, 201, ${alpha})`
    : `rgba(0, 201, 201, ${alpha})`;
}

function densityStroke(density: number, active: boolean): string {
  if (active) return "#00C9C9";
  return density >= 8 ? "rgba(0,201,201,0.5)" : "rgba(255,255,255,0.15)";
}

function densityBarWidth(density: number): string {
  return `${(density / 10) * 100}%`;
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function ZoneDensityMap() {
  const t = useTranslations("zone_map");
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const active = activeZone ? ZONES.find((z) => z.id === activeZone) : null;

  return (
    <section
      className="py-20 md:py-28"
      style={{ background: "linear-gradient(160deg, #0a1258 0%, #0D1B8E 100%)" }}
      aria-label={t("section_label")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="max-w-2xl mb-12">
          <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* ── Map + Panel layout ──────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* SVG Map */}
          <div
            className="lg:col-span-3 rounded-2xl overflow-hidden border border-white/10"
            style={{ background: "rgba(0,0,0,0.25)" }}
            role="img"
            aria-label={t("map_aria")}
          >
            <div className="p-3 border-b border-white/10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse" />
              <span className="text-xs text-slate-400 font-mono uppercase tracking-widest">
                {t("map_label")}
              </span>
            </div>

            <svg
              viewBox="0 0 700 560"
              className="w-full"
              style={{ display: "block" }}
            >
              {/* Subtle grid lines */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="700" height="560" fill="url(#grid)" />

              {/* Zone polygons */}
              {ZONES.map((zone) => {
                const isActive = activeZone === zone.id;
                return (
                  <g
                    key={zone.id}
                    onMouseEnter={() => setActiveZone(zone.id)}
                    onMouseLeave={() => setActiveZone(null)}
                    onFocus={() => setActiveZone(zone.id)}
                    onBlur={() => setActiveZone(null)}
                    style={{ cursor: "pointer" }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${t("zone_aria_prefix")} ${zone.id}: ${zone.name}`}
                    aria-pressed={isActive}
                  >
                    <path
                      d={zone.path}
                      fill={densityFill(zone.density, isActive)}
                      stroke={densityStroke(zone.density, isActive)}
                      strokeWidth={isActive ? 2 : 1}
                      style={{
                        transition: "fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease",
                        filter: isActive ? "drop-shadow(0 0 12px rgba(0,201,201,0.5))" : "none",
                      }}
                    />

                    {/* Zone letter badge */}
                    <circle
                      cx={zone.labelX}
                      cy={zone.labelY}
                      r={14}
                      fill={isActive ? "#00C9C9" : "rgba(13,27,142,0.8)"}
                      stroke={isActive ? "#fff" : "rgba(0,201,201,0.6)"}
                      strokeWidth={1.5}
                      style={{ transition: "fill 0.2s ease" }}
                    />
                    <text
                      x={zone.labelX}
                      y={zone.labelY + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={11}
                      fontWeight="700"
                      fontFamily="sans-serif"
                      fill={isActive ? "#0D1B8E" : "#fff"}
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      {zone.id}
                    </text>
                  </g>
                );
              })}

              {/* CBD label */}
              <text
                x={336}
                y={252}
                textAnchor="middle"
                fontSize={8}
                fontWeight="600"
                fontFamily="sans-serif"
                fill="rgba(255,255,255,0.4)"
                style={{ pointerEvents: "none", userSelect: "none", letterSpacing: "0.1em" }}
              >
                CBD
              </text>

              {/* Compass rose */}
              <g transform="translate(648, 36)">
                <text x={0} y={0} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.3)" fontFamily="sans-serif">N</text>
                <line x1={0} y1={4} x2={0} y2={14} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                <polygon points="0,-2 -3,4 0,2 3,4" fill="rgba(255,255,255,0.3)" />
              </g>
            </svg>

            {/* Density legend */}
            <div className="px-4 pb-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">{t("legend_low")}</span>
              <div
                className="flex-1 mx-3 h-2 rounded-full"
                style={{ background: "linear-gradient(to right, rgba(0,201,201,0.15), rgba(0,201,201,1))" }}
                aria-hidden="true"
              />
              <span className="text-xs text-slate-400">{t("legend_high")}</span>
            </div>
          </div>

          {/* Zone List Panel */}
          <div className="lg:col-span-2 space-y-3">

            {/* Info card for active zone */}
            {active && (
              <div
                className="rounded-2xl border border-brand-cyan/40 p-5 mb-1"
                style={{ background: "rgba(0,201,201,0.08)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-9 h-9 rounded-xl bg-brand-cyan flex items-center justify-center text-brand-navy font-extrabold text-sm">
                    {active.id}
                  </span>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">{active.name}</p>
                    <p className="text-brand-cyan text-xs">{t("zone_selected")}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-xs mb-3">{active.areas}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl p-2.5" style={{ background: "rgba(0,0,0,0.3)" }}>
                    <p className="text-brand-cyan font-extrabold text-lg">{active.properties}+</p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wide">{t("stat_properties")}</p>
                  </div>
                  <div className="rounded-xl p-2.5" style={{ background: "rgba(0,0,0,0.3)" }}>
                    <p className="text-brand-cyan font-extrabold text-lg">{active.density}/10</p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wide">{t("stat_density")}</p>
                  </div>
                </div>
              </div>
            )}

            {/* All zones list */}
            {ZONES.map((zone) => {
              const isActive = activeZone === zone.id;
              return (
                <button
                  key={zone.id}
                  className={`w-full text-left rounded-xl px-4 py-3 border transition-all duration-150
                    ${isActive
                      ? "border-brand-cyan/50 bg-brand-cyan/10"
                      : "border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/8"
                    }`}
                  onMouseEnter={() => setActiveZone(zone.id)}
                  onMouseLeave={() => setActiveZone(null)}
                  onFocus={() => setActiveZone(zone.id)}
                  onBlur={() => setActiveZone(null)}
                  aria-label={`${t("zone_aria_prefix")} ${zone.id}: ${zone.name}, ${zone.properties} ${t("stat_properties")}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                          text-xs font-extrabold transition-colors
                          ${isActive ? "bg-brand-cyan text-brand-navy" : "bg-brand-navy text-white border border-white/20"}`}
                      >
                        {zone.id}
                      </span>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold leading-tight truncate ${isActive ? "text-white" : "text-slate-300"}`}>
                          {zone.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{zone.properties}+ {t("stat_properties_short")}</p>
                      </div>
                    </div>

                    {/* Density bar */}
                    <div className="flex-shrink-0 w-20">
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: densityBarWidth(zone.density),
                            background: isActive ? "#00C9C9" : `rgba(0,201,201,${0.3 + zone.density * 0.07})`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Total count */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-center text-xs text-slate-500">
                {t("total_prefix")}{" "}
                <span className="text-brand-cyan font-bold">
                  {ZONES.reduce((s, z) => s + z.properties, 0).toLocaleString()}+
                </span>{" "}
                {t("total_suffix")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
