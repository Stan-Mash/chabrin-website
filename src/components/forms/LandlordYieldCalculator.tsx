"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

interface Inputs {
  grossRent:       string;
  mgmtFeePct:      string;
  maintenance:     string;
  annualInsurance: string;
}

interface Result {
  mgmtFeeMonthly:    number;
  maintenanceMonthly: number;
  insuranceMonthly:  number;
  totalDeductions:   number;
  netMonthly:        number;
  netAnnual:         number;
}

function parseKES(raw: string): number {
  return parseInt(raw.replace(/[^0-9]/g, ""), 10) || 0;
}

function calculate(inputs: Inputs): Result | null {
  const grossRent   = parseKES(inputs.grossRent);
  const mgmtFeePct  = parseFloat(inputs.mgmtFeePct) || 10;
  const maintenance = parseKES(inputs.maintenance);
  const annualIns   = parseKES(inputs.annualInsurance);

  if (grossRent <= 0) return null;

  // Work in integer KES (no float arithmetic per CLAUDE.md)
  const mgmtFee        = Math.round(grossRent * mgmtFeePct) / 100;
  const insuranceMonthly = Math.round(annualIns / 12);
  const totalDeductions = mgmtFee + maintenance + insuranceMonthly;
  const netMonthly      = grossRent - totalDeductions;

  return {
    mgmtFeeMonthly:     mgmtFee,
    maintenanceMonthly: maintenance,
    insuranceMonthly,
    totalDeductions,
    netMonthly,
    netAnnual: netMonthly * 12,
  };
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-KE").format(Math.round(n));
}

export default function LandlordYieldCalculator() {
  const t      = useTranslations("yield_calc");
  const locale = useLocale();

  const [inputs, setInputs] = useState<Inputs>({
    grossRent:       "",
    mgmtFeePct:      "10",
    maintenance:     "",
    annualInsurance: "",
  });
  const [result, setResult] = useState<Result | null>(null);

  function handleChange(field: keyof Inputs, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
    setResult(null);
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setResult(calculate(inputs));
  }

  return (
    <section className="py-20 md:py-28 bg-brand-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-white/55 text-lg leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Input form */}
          <form onSubmit={handleCalculate} className="space-y-5">

            {/* Gross monthly rent */}
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                {t("gross_rent_label")}
              </label>
              <div className="flex border border-white/15 bg-white/5">
                <span className="flex items-center px-3 text-white/30 text-sm font-mono border-r border-white/10">
                  KES
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={t("gross_rent_placeholder")}
                  value={inputs.grossRent}
                  onChange={(e) => handleChange("grossRent", e.target.value)}
                  className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-white/20
                             text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Management fee % */}
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                {t("mgmt_fee_label")}
              </label>
              <div className="flex border border-white/15 bg-white/5">
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  value={inputs.mgmtFeePct}
                  onChange={(e) => handleChange("mgmtFeePct", e.target.value)}
                  className="flex-1 bg-transparent px-4 py-3 text-white text-sm
                             focus:outline-none appearance-none"
                />
                <span className="flex items-center px-3 text-white/30 text-sm font-mono border-l border-white/10">
                  %
                </span>
              </div>
            </div>

            {/* Monthly maintenance */}
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                {t("maintenance_label")}
              </label>
              <div className="flex border border-white/15 bg-white/5">
                <span className="flex items-center px-3 text-white/30 text-sm font-mono border-r border-white/10">
                  KES
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={t("maintenance_placeholder")}
                  value={inputs.maintenance}
                  onChange={(e) => handleChange("maintenance", e.target.value)}
                  className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-white/20
                             text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Annual insurance */}
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                {t("insurance_label")}
              </label>
              <div className="flex border border-white/15 bg-white/5">
                <span className="flex items-center px-3 text-white/30 text-sm font-mono border-r border-white/10">
                  KES
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={t("insurance_placeholder")}
                  value={inputs.annualInsurance}
                  onChange={(e) => handleChange("annualInsurance", e.target.value)}
                  className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-white/20
                             text-sm focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-cyan text-brand-navy font-bold text-sm
                         uppercase tracking-widest hover:brightness-105 transition-all"
            >
              {t("calculate_btn")}
            </button>
          </form>

          {/* Results */}
          <div className="border border-white/15 bg-white/[0.03] flex flex-col">
            {result ? (
              <>
                <div className="border-b border-white/10 px-6 py-4">
                  <p className="text-[9px] tracking-[0.25em] text-brand-cyan/60 uppercase font-bold mb-0.5">
                    {t("result_title")}
                  </p>
                </div>

                <div className="px-6 py-4 space-y-3 border-b border-white/8">
                  <p className="text-[9px] tracking-[0.2em] text-white/25 uppercase font-bold mb-2">
                    {t("deductions_label")}
                  </p>
                  {[
                    [`Management Fee`, result.mgmtFeeMonthly],
                    [`Maintenance`,    result.maintenanceMonthly],
                    [`Insurance (monthly)`, result.insuranceMonthly],
                  ].map(([label, val]) => (
                    <div key={label as string} className="flex justify-between">
                      <span className="text-[11px] text-white/40">{label}</span>
                      <span className="text-[11px] font-mono text-white/40">
                        KES {fmt(val as number)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-white/8">
                    <span className="text-[11px] text-white/50 font-semibold">Total Deductions</span>
                    <span className="text-[11px] font-mono text-white/50 font-bold">
                      (KES {fmt(result.totalDeductions)})
                    </span>
                  </div>
                </div>

                {/* Net disbursement highlight */}
                <div className="px-6 py-5 bg-brand-cyan/8 border-b border-brand-cyan/20">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs text-brand-cyan font-bold uppercase tracking-widest">
                      {t("net_monthly_label")}
                    </span>
                    <span className="text-brand-cyan font-extrabold text-2xl font-mono">
                      KES {fmt(result.netMonthly)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-white/35 uppercase tracking-widest">
                      {t("net_annual_label")}
                    </span>
                    <span className="text-white/60 font-bold text-sm font-mono">
                      KES {fmt(result.netAnnual)}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <p className="text-[9px] text-white/20 italic leading-relaxed mb-4">
                    {t("disclaimer")}
                  </p>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-2 text-brand-cyan text-xs font-bold
                               uppercase tracking-widest hover:brightness-110 transition-all"
                  >
                    {t("cta_consult")}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-brand-cyan/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 4.5h.008v.008h-.008v-.008zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                  </svg>
                </div>
                <p className="text-white/25 text-sm">
                  Enter your property details to see estimated returns.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
