"use client";

import { useRef, useState, useActionState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { submitSpaceMandate } from "@/actions/space-mandate";
import Link from "next/link";

// ── Corridor yield matrix ─────────────────────────────────────────────────────
const CORRIDORS = [
  { slug: "cbd-kilimani",        name: "CBD & Kilimani",        zone: "Premium CBD & Inner Ring",     yield: "5–7%",   vacancy: "~8%",  inventory: "Grade A, Luxury" },
  { slug: "thika-road-ruiru",    name: "Thika Road & Ruiru",    zone: "Northern Commuter Belt",       yield: "7–10%",  vacancy: "~5%",  inventory: "High-Density Apts" },
  { slug: "kasarani-ruaraka-belt", name: "Kasarani & Roysambu", zone: "Kasarani-Ruaraka Belt",        yield: "8–11%",  vacancy: "~6%",  inventory: "Mid-Market Apts" },
  { slug: "eastlands-embakasi",  name: "Eastlands & Embakasi",  zone: "Inner East & Greater Eastlands", yield: "9–12%", vacancy: "~5%", inventory: "Affordable, Commercial" },
  { slug: "westlands-parklands", name: "Westlands & Parklands", zone: "Westlands Professional District", yield: "5–7%", vacancy: "~9%", inventory: "Luxury, Serviced" },
  { slug: "south-b-south-c",     name: "South B & South C",     zone: "Inner Urban Residential",     yield: "8–10%",  vacancy: "~6%",  inventory: "Flats, Maisonettes" },
  { slug: "south-metro-airport", name: "South Metro & Airport", zone: "Southern Metro Corridor",     yield: "8–12%",  vacancy: "~7%",  inventory: "Industrial, Residential" },
];

const PROPERTY_SPECS = [
  "Bedsitter / Studio",
  "1-Bedroom Apartment",
  "2-Bedroom Apartment",
  "3-Bedroom Apartment",
  "4+ Bedroom Apartment / Penthouse",
  "Maisonette / Townhouse",
  "Office Space (100–500 sq ft)",
  "Office Space (500–2,000 sq ft)",
  "Commercial / Retail Unit",
  "Warehouse / Light Industrial",
  "Employee Housing Block",
];

const BUDGET_BANDS = [
  "Under KES 20,000",
  "KES 20,001 – 40,000",
  "KES 40,001 – 70,000",
  "KES 70,001 – 120,000",
  "KES 120,001 – 200,000",
  "KES 200,001 – 400,000",
  "Over KES 400,000",
];

const INITIAL_STATE = { success: false, error: undefined as string | undefined };

export default function SpaceAcquisitionDesk() {
  const formRef = useRef<HTMLFormElement>(null);
  const [token, setToken] = useState("");
  const [state, formAction, isPending] = useActionState(submitSpaceMandate, INITIAL_STATE);

  if (state.success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-brand-ice-50 px-4">
        <div className="max-w-lg text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-cyan/15 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-brand-navy mb-3">Mandate Received</h2>
          <p className="text-slate-500 leading-relaxed mb-6">
            Your space requirement has been registered with our letting desk. A specialist will contact you within one business day to discuss available off-market options.
          </p>
          <p className="text-xs text-slate-400 uppercase tracking-widest">
            Chabrin Agencies Limited — Letting Desk
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-ice-50">

      {/* ── Part A: Institutional mandate notice ──────────────────────────── */}
      <section className="bg-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                <span className="text-brand-cyan text-xs font-bold tracking-widest uppercase">
                  Verified Vacancy Catalog Updating
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                Priority Off-Market <span className="text-brand-cyan">Allocation Active</span>
              </h1>
              <p className="text-white/55 text-base leading-relaxed">
                Our letting pipeline is refreshing verified vacancies from CHIPS. Register your space requirement below and a specialist will match you to screened, inspection-ready units before they reach the public catalog.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 lg:flex-col lg:items-end text-right">
              <div className="border border-white/15 bg-white/5 px-5 py-3">
                <p className="text-[9px] text-white/30 uppercase tracking-widest">Response SLA</p>
                <p className="text-brand-cyan font-bold text-lg">1 Business Day</p>
              </div>
              <div className="border border-white/15 bg-white/5 px-5 py-3">
                <p className="text-[9px] text-white/30 uppercase tracking-widest">Corridors Covered</p>
                <p className="text-white font-bold text-lg">7 Zones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Part C: Corridor yield matrix ─────────────────────────────────── */}
      <section className="border-b border-slate-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            Active Coverage Matrix
          </p>
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-4 text-xs font-bold uppercase tracking-wider text-brand-navy">Corridor</th>
                <th className="text-left py-2 pr-4 text-xs font-bold uppercase tracking-wider text-brand-navy">Zone</th>
                <th className="text-left py-2 pr-4 text-xs font-bold uppercase tracking-wider text-brand-navy">Avg. Gross Yield</th>
                <th className="text-left py-2 pr-4 text-xs font-bold uppercase tracking-wider text-brand-navy">Vacancy Rate</th>
                <th className="text-left py-2 text-xs font-bold uppercase tracking-wider text-brand-navy">Inventory Type</th>
              </tr>
            </thead>
            <tbody>
              {CORRIDORS.map((c, i) => (
                <tr key={c.slug} className={`border-b border-slate-100 hover:bg-white transition-colors ${i % 2 === 0 ? "" : "bg-white/50"}`}>
                  <td className="py-3 pr-4 font-semibold text-brand-navy">
                    <Link href={`/en/corridors/${c.slug}`} className="hover:text-brand-cyan transition-colors">
                      {c.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-slate-500 text-xs">{c.zone}</td>
                  <td className="py-3 pr-4 font-bold text-brand-cyan">{c.yield}</td>
                  <td className="py-3 pr-4 text-slate-600">{c.vacancy}</td>
                  <td className="py-3 text-slate-500 text-xs">{c.inventory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Part B: Space Mandate Form ────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-2">
              Space Acquisition Mandate
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy leading-tight">
              Register Your Space Requirement
            </h2>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed">
              Complete the mandate below. All submissions are treated with strict confidentiality in accordance with our{" "}
              <Link href="/en/privacy-policy" className="text-brand-cyan hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <form ref={formRef} action={formAction} className="space-y-6">
            {/* Client Category */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-widest text-brand-navy mb-3">
                Client Category <span className="text-red-500">*</span>
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: "residential", label: "Residential Tenant" },
                  { value: "corporate",   label: "Corporate / Commercial Lessee" },
                  { value: "industrial",  label: "Industrial & Logistics Operator" },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-3 border border-slate-200 bg-white p-3 cursor-pointer hover:border-brand-cyan/60 transition-colors has-[:checked]:border-brand-cyan has-[:checked]:bg-brand-ice-50">
                    <input type="radio" name="clientCategory" value={value} required className="accent-brand-cyan" />
                    <span className="text-sm text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Corridor + Neighbourhoods */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-navy mb-1.5">
                  Preferred Corridor <span className="text-red-500">*</span>
                </label>
                <select name="corridor" required
                  className="w-full border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-brand-cyan">
                  <option value="">— Select corridor —</option>
                  {CORRIDORS.map((c) => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-navy mb-1.5">
                  Preferred Estates / Neighbourhoods
                </label>
                <input type="text" name="neighbourhoods" maxLength={200}
                  placeholder="e.g. Kasarani, Clay City"
                  className="w-full border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-brand-cyan" />
              </div>
            </div>

            {/* Property Spec + Budget */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-navy mb-1.5">
                  Property Specification <span className="text-red-500">*</span>
                </label>
                <select name="propertySpec" required
                  className="w-full border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-brand-cyan">
                  <option value="">— Select type —</option>
                  {PROPERTY_SPECS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-navy mb-1.5">
                  Monthly Budget (KES) <span className="text-red-500">*</span>
                </label>
                <select name="budget" required
                  className="w-full border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-brand-cyan">
                  <option value="">— Select range —</option>
                  {BUDGET_BANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Timeline */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-widest text-brand-navy mb-3">
                Target Move-In Timeline <span className="text-red-500">*</span>
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: "immediate",    label: "Immediate (≤30 days)" },
                  { value: "1_3_months",   label: "1–3 Months" },
                  { value: "3_6_months",   label: "3–6 Months" },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-3 border border-slate-200 bg-white p-3 cursor-pointer hover:border-brand-cyan/60 transition-colors has-[:checked]:border-brand-cyan has-[:checked]:bg-brand-ice-50">
                    <input type="radio" name="timeline" value={value} required className="accent-brand-cyan" />
                    <span className="text-sm text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Contact */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-navy mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input type="text" name="fullName" required minLength={2} maxLength={120}
                  className="w-full border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-brand-cyan"
                  placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-navy mb-1.5">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input type="tel" name="phone" required minLength={9} maxLength={20}
                  className="w-full border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-brand-cyan"
                  placeholder="+254 7XX XXX XXX" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-navy mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input type="email" name="email" required
                className="w-full border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-brand-cyan"
                placeholder="you@example.com" />
            </div>

            {/* KDPA Consent */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="consentGiven" value="true" required
                className="mt-0.5 w-4 h-4 accent-brand-cyan flex-shrink-0" />
              <span className="text-xs text-slate-500 leading-relaxed">
                I consent to Chabrin Agencies Limited processing my personal data to respond to this mandate, in accordance with the{" "}
                <Link href="/en/privacy-policy" className="text-brand-cyan hover:underline">
                  KDPA Privacy Policy
                </Link>
                . <span className="text-red-500">*</span>
              </span>
            </label>

            {/* Turnstile + hidden token */}
            <input type="hidden" name="turnstileToken" value={token} />
            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                onSuccess={setToken}
                options={{ theme: "light" }}
              />
            )}

            {state.error && (
              <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-3">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || !token}
              className="w-full py-4 bg-brand-navy text-white font-bold text-sm uppercase tracking-widest
                         hover:bg-brand-navy-dark transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Submitting…" : "Submit Space Mandate"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
