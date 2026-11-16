"use client";

import { useRef, useState, useActionState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { submitSpaceMandate } from "@/actions/space-mandate";
import Link from "next/link";
import { useLocale } from "next-intl";

const CORRIDORS = [
  { slug: "cbd-kilimani",          name: "CBD & Kilimani" },
  { slug: "thika-road-ruiru",      name: "Thika Road & Ruiru" },
  { slug: "kasarani-ruaraka-belt", name: "Kasarani & Roysambu" },
  { slug: "eastlands-embakasi",    name: "Eastlands & Embakasi" },
  { slug: "westlands-parklands",   name: "Westlands & Parklands" },
  { slug: "south-b-south-c",       name: "South B & South C" },
  { slug: "south-metro-airport",   name: "South Metro & Airport" },
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

const CATEGORIES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    label: "Residential Homes",
    desc: "Apartments, maisonettes, bungalows & townhouses across all Nairobi corridors",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    label: "Commercial Spaces",
    desc: "Office suites, retail units & serviced workspaces in prime business nodes",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
      </svg>
    ),
    label: "Industrial & Logistics",
    desc: "Warehouses, light industrial units & employee housing along key freight corridors",
  },
];

const INITIAL_STATE = { success: false, error: undefined as string | undefined };

export default function SpaceAcquisitionDesk() {
  const formRef  = useRef<HTMLFormElement>(null);
  const [token, setToken] = useState("");
  const locale   = useLocale();
  const [state, formAction, isPending] = useActionState(submitSpaceMandate, INITIAL_STATE);

  if (state.success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-brand-ice-50 px-4">
        <div className="max-w-lg text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-cyan/15 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-brand-navy mb-3">Mandate Received</h2>
          <p className="text-slate-500 leading-relaxed mb-6">
            Your space requirement has been registered with our letting desk. A specialist will contact you within one business day to discuss available options.
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

      {/* ── Hero header ───────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-brand-cyan text-xs font-bold tracking-widest uppercase mb-4">
              LETTING DESK · CHABRIN AGENCIES
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              Find Your Next{" "}
              <span className="text-brand-cyan">Residential or Commercial Space</span>
            </h1>
            <p className="text-white/55 text-base leading-relaxed">
              Register your requirement and a letting specialist will match you to available, inspection-ready spaces across Nairobi&apos;s key corridors — before they reach the public market.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3 category bento cards ─────────────────────────────────────── */}
      <section className="py-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-4">
            {CATEGORIES.map(({ icon, label, desc }) => (
              <div key={label}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm
                           hover:border-brand-cyan/40 hover:shadow-md transition-all duration-200 group">
                <div className="w-11 h-11 rounded-xl bg-brand-cyan/10 flex items-center justify-center
                               text-brand-cyan mb-4 group-hover:bg-brand-cyan/15 transition-colors">
                  {icon}
                </div>
                <h3 className="font-bold text-brand-navy text-sm mb-1.5">{label}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + contact card ─────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-start">

            {/* Left: mandate form */}
            <div className="lg:col-span-7">
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-2">
                  Space Acquisition Mandate
                </p>
                <h2 className="text-2xl font-bold text-brand-navy leading-tight">
                  Register Your Space Requirement
                </h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  All submissions are treated with strict confidentiality in accordance with our{" "}
                  <Link href={`/${locale}/privacy-policy`} className="text-brand-cyan hover:underline">
                    Privacy Policy
                  </Link>.
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
                      <label key={value}
                        className="flex items-center gap-3 border border-slate-200 bg-white p-3 cursor-pointer
                                   hover:border-brand-cyan/60 transition-colors
                                   has-[:checked]:border-brand-cyan has-[:checked]:bg-brand-ice-50">
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
                      { value: "immediate",  label: "Immediate (≤30 days)" },
                      { value: "1_3_months", label: "1–3 Months" },
                      { value: "3_6_months", label: "3–6 Months" },
                    ].map(({ value, label }) => (
                      <label key={value}
                        className="flex items-center gap-3 border border-slate-200 bg-white p-3 cursor-pointer
                                   hover:border-brand-cyan/60 transition-colors
                                   has-[:checked]:border-brand-cyan has-[:checked]:bg-brand-ice-50">
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
                      placeholder="Your full name"
                      className="w-full border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-brand-cyan" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-navy mb-1.5">
                      Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input type="tel" name="phone" required minLength={9} maxLength={20}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-brand-cyan" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-navy mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input type="email" name="email" required
                    placeholder="you@example.com"
                    className="w-full border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-brand-cyan" />
                </div>

                {/* KDPA Consent */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" name="consentGiven" value="true" required
                    className="mt-0.5 w-4 h-4 accent-brand-cyan flex-shrink-0" />
                  <span className="text-xs text-slate-500 leading-relaxed">
                    I consent to Chabrin Agencies Limited processing my personal data to respond to this mandate, in accordance with the{" "}
                    <Link href={`/${locale}/privacy-policy`} className="text-brand-cyan hover:underline">
                      KDPA Privacy Policy
                    </Link>. <span className="text-red-500">*</span>
                  </span>
                </label>

                {/* Turnstile */}
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
                             hover:bg-brand-navy/90 transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Submitting…" : "Submit Space Mandate"}
                </button>
              </form>
            </div>

            {/* Right: Letting desk contact card */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              <div className="bg-brand-navy rounded-2xl p-7 text-white">
                <p className="text-brand-cyan text-[10px] font-bold tracking-widest uppercase mb-3">
                  LETTINGS DESK
                </p>
                <h3 className="font-bold text-lg leading-snug mb-2">
                  Speak Directly with a Letting Specialist
                </h3>
                <p className="text-white/55 text-sm leading-relaxed mb-6">
                  Our letting team handles residential, commercial, and industrial enquiries. Contact us directly for time-sensitive requirements.
                </p>
                <div className="space-y-3">
                  <a href="https://wa.me/254720854389?text=Hi, I'm looking for a space to rent"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-green-500 text-white
                               font-semibold text-sm hover:bg-green-600 transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp the Lettings Desk
                  </a>
                  <a href="tel:+254720854389"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-white/20
                               text-white font-semibold text-sm hover:border-brand-cyan hover:text-brand-cyan transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call +254 720 854 389
                  </a>
                </div>
              </div>

              {/* What happens next */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-navy mb-4">
                  WHAT HAPPENS NEXT
                </p>
                <div className="space-y-4">
                  {[
                    { step: "01", text: "Your mandate is received by our letting desk within minutes." },
                    { step: "02", text: "A specialist contacts you to clarify requirements and shortlist options." },
                    { step: "03", text: "We arrange viewings and guide you through to signing." },
                  ].map(({ step, text }) => (
                    <div key={step} className="flex gap-4">
                      <span className="text-[10px] font-mono font-bold text-brand-cyan/50 tracking-wider flex-shrink-0 mt-0.5">{step}</span>
                      <p className="text-slate-600 text-sm leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
