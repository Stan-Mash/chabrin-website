"use client";

import { useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { saveNewsletterSignup } from "@/actions/save-enquiry";

// ── Stat Pills ────────────────────────────────────────────────────────────────

const REPORT_STATS = [
  { value: "18%", label: { en: "Avg. yield — Westlands", sw: "Mavuno ya wastani — Westlands" } },
  { value: "KES 95K", label: { en: "Median 3BR rent — Zone B", sw: "Kodi ya wastani 3BR — Eneo B" } },
  { value: "+12%", label: { en: "Rental growth YoY 2025", sw: "Ukuaji wa kodi mwaka hadi mwaka 2025" } },
  { value: "7.2wk", label: { en: "Avg. time to let — Nairobi", sw: "Wastani wa wakati wa kupangisha — Nairobi" } },
];

// ── What's Inside ─────────────────────────────────────────────────────────────

const REPORT_CONTENTS = {
  en: [
    "Zone-by-zone rental price benchmarks (A–G)",
    "Yield analysis for residential & commercial stock",
    "Tenant demand drivers: employment, infrastructure, migration",
    "2026 outlook: interest rates, supply pipeline, and policy shifts",
    "Investor opportunity matrix — top 5 sub-markets by ROI",
    "Chabrin proprietary data: 1,200+ managed units",
  ],
  sw: [
    "Vigezo vya bei ya kodi kwa kila eneo (A–G)",
    "Uchambuzi wa mavuno kwa hisa za makazi na biashara",
    "Vichocheo vya mahitaji ya wapangaji: ajira, miundombinu",
    "Matarajio ya 2026: viwango vya riba, usambazaji wa mali",
    "Matrix ya fursa za wawekezaji — masoko 5 bora kwa ROI",
    "Data ya Chabrin: vitengo 1,200+ vinavyosimamiwa",
  ],
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function MarketReportSection() {
  const locale = useLocale();
  const t = useTranslations("market_report");
  const isEn = locale !== "sw";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const downloadRef = useRef<HTMLAnchorElement>(null);

  function validate() {
    const errs: { name?: string; email?: string } = {};
    if (name.trim().length < 2) errs.name = isEn ? "Please enter your name" : "Tafadhali ingiza jina lako";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = isEn ? "Please enter a valid email" : "Tafadhali ingiza barua pepe sahihi";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("submitting");

    const result = await saveNewsletterSignup({ name: name.trim(), email: email.trim(), locale });

    if (result.success) {
      setStatus("success");
      // Trigger PDF download
      setTimeout(() => downloadRef.current?.click(), 200);
    } else {
      setStatus("error");
    }
  }

  return (
    <section
      aria-labelledby="market-report-heading"
      className="relative overflow-hidden bg-brand-navy py-20 lg:py-28"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-cyan/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-brand-cyan/5 blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#00C9C9 1px, transparent 1px), linear-gradient(to right, #00C9C9 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── Left — Copy ── */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" aria-hidden="true" />
              <span className="text-brand-cyan text-xs font-bold tracking-widest uppercase">
                {t("eyebrow")}
              </span>
            </div>

            <h2
              id="market-report-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4"
            >
              {t("title_line1")}{" "}
              <span className="text-brand-cyan">{t("title_line2")}</span>
            </h2>

            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-lg">
              {t("subtitle")}
            </p>

            {/* Stat pills */}
            <div
              className="grid grid-cols-2 gap-3 mb-8"
              aria-label={isEn ? "Key report statistics" : "Takwimu kuu za ripoti"}
            >
              {REPORT_STATS.map(({ value, label }) => (
                <div
                  key={value}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                >
                  <p className="text-brand-cyan font-extrabold text-xl leading-none">{value}</p>
                  <p className="text-slate-400 text-xs mt-1 leading-tight">
                    {isEn ? label.en : label.sw}
                  </p>
                </div>
              ))}
            </div>

            {/* What's inside */}
            <div>
              <p className="text-white font-semibold text-sm mb-3 uppercase tracking-widest">
                {t("contents_label")}
              </p>
              <ul className="space-y-2" aria-label={isEn ? "Report contents" : "Yaliyomo kwenye ripoti"}>
                {(isEn ? REPORT_CONTENTS.en : REPORT_CONTENTS.sw).map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-slate-300 text-sm">
                    <svg
                      className="w-4 h-4 text-brand-cyan mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right — Form Card ── */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              {status === "success" ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">
                    {t("success_title")}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {t("success_desc")}
                  </p>
                  {/* Hidden real download link — triggered programmatically */}
                  <a
                    ref={downloadRef}
                    href="/reports/2026-nairobi-rental-market-report.pdf"
                    download="2026-Nairobi-Rental-Market-Report-Chabrin.pdf"
                    className="sr-only"
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    download
                  </a>
                  <a
                    href="/reports/2026-nairobi-rental-market-report.pdf"
                    download="2026-Nairobi-Rental-Market-Report-Chabrin.pdf"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-navy
                               text-white font-semibold text-sm hover:bg-brand-navy-dark transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t("download_again")}
                  </a>
                </div>
              ) : (
                <>
                  {/* Form heading */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" aria-hidden="true" />
                      <span className="text-brand-cyan text-xs font-bold tracking-widest uppercase">
                        {t("form_eyebrow")}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-brand-navy leading-tight">
                      {t("form_title")}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">{t("form_subtitle")}</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label={isEn ? "Download report form" : "Fomu ya kupakua ripoti"}>
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="report-name"
                        className="block text-sm font-semibold text-brand-navy mb-1.5"
                      >
                        {t("name_label")} <span className="text-brand-cyan" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="report-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isEn ? "James Kariuki" : "James Kariuki"}
                        autoComplete="name"
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "report-name-error" : undefined}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                          errors.name
                            ? "border-red-300 focus:ring-red-200"
                            : "border-slate-200 focus:border-brand-cyan focus:ring-brand-cyan/20"
                        }`}
                      />
                      {errors.name && (
                        <p id="report-name-error" role="alert" className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="report-email"
                        className="block text-sm font-semibold text-brand-navy mb-1.5"
                      >
                        {t("email_label")} <span className="text-brand-cyan" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="report-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="james@company.com"
                        autoComplete="email"
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "report-email-error" : undefined}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                          errors.email
                            ? "border-red-300 focus:ring-red-200"
                            : "border-slate-200 focus:border-brand-cyan focus:ring-brand-cyan/20"
                        }`}
                      />
                      {errors.email && (
                        <p id="report-email-error" role="alert" className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Trust note */}
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {t("privacy_note")}
                    </p>

                    {/* Error banner */}
                    {status === "error" && (
                      <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                        {t("error_msg")}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full py-3.5 rounded-full bg-brand-cyan text-white font-bold text-sm
                                 hover:bg-brand-cyan-dark disabled:opacity-60 disabled:cursor-not-allowed
                                 transition-colors flex items-center justify-center gap-2"
                    >
                      {status === "submitting" ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {t("submitting")}
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {t("cta")}
                        </>
                      )}
                    </button>
                  </form>

                  {/* Social proof */}
                  <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-3">
                    <div className="flex -space-x-2" aria-hidden="true">
                      {["JK", "AM", "PW"].map((initials) => (
                        <div
                          key={initials}
                          className="w-7 h-7 rounded-full bg-brand-navy text-brand-cyan text-[9px]
                                     font-bold flex items-center justify-center border-2 border-white"
                        >
                          {initials}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">{t("social_proof")}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
