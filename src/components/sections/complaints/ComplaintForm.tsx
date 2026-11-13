"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { submitComplaint } from "@/actions/submit-complaint";

// ── Zod schema (mirrors server action) ───────────────────────────────────────

const schema = z.object({
  submitter_type: z.enum(["tenant", "landlord", "prospective", "public"]),
  full_name:      z.string().min(2, "Enter your full name"),
  email:          z.string().email("Enter a valid email address"),
  phone:          z.string().min(9, "Enter a valid phone number"),
  property_area:  z.string().max(120).optional(),
  category:       z.enum(["maintenance", "billing", "noise_neighbour", "safety", "management", "general"]),
  subcategory:    z.string().optional(),
  description:    z.string().min(20, "Please describe your issue in at least 20 characters").max(3000),
  consent:        z.literal(true, "You must agree to the Privacy Policy"),
  token:          z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// ── Static colour/bg config (no translations) ─────────────────────────────────

const PRIORITY_CONFIG: Record<string, { colour: string; bg: string; labelKey: string; descKey: string }> = {
  maintenance:     { colour: "#ea580c", bg: "#fff7ed", labelKey: "priority_urgent_label",    descKey: "priority_urgent_desc" },
  billing:         { colour: "#7c3aed", bg: "#f5f3ff", labelKey: "priority_enquiry_label",   descKey: "priority_enquiry_desc" },
  noise_neighbour: { colour: "#2563eb", bg: "#eff6ff", labelKey: "priority_routine_label",   descKey: "priority_routine_desc" },
  safety:          { colour: "#dc2626", bg: "#fef2f2", labelKey: "priority_emergency_label", descKey: "priority_emergency_desc" },
  management:      { colour: "#2563eb", bg: "#eff6ff", labelKey: "priority_routine_label",   descKey: "priority_routine_desc" },
  general:         { colour: "#2563eb", bg: "#eff6ff", labelKey: "priority_routine_label",   descKey: "priority_routine_desc" },
};

const SUBCATEGORY_KEYS: Record<string, { value: string; labelKey: string }[]> = {
  maintenance: [
    { value: "plumbing",       labelKey: "sub_plumbing" },
    { value: "electrical",     labelKey: "sub_electrical" },
    { value: "structural",     labelKey: "sub_structural" },
    { value: "pest",           labelKey: "sub_pest" },
    { value: "ac_hvac",        labelKey: "sub_ac_hvac" },
    { value: "locks_doors",    labelKey: "sub_locks_doors" },
    { value: "general_repair", labelKey: "sub_general_repair" },
  ],
  billing: [
    { value: "incorrect_charge",   labelKey: "sub_incorrect_charge" },
    { value: "payment_not_posted", labelKey: "sub_payment_not_posted" },
    { value: "deposit_dispute",    labelKey: "sub_deposit_dispute" },
    { value: "service_charge",     labelKey: "sub_service_charge" },
    { value: "other_billing",      labelKey: "sub_other_billing" },
  ],
  noise_neighbour: [
    { value: "noise_music",        labelKey: "sub_noise_music" },
    { value: "noise_night",        labelKey: "sub_noise_night" },
    { value: "neighbour_conflict", labelKey: "sub_neighbour_conflict" },
    { value: "parking",            labelKey: "sub_parking" },
    { value: "common_areas",       labelKey: "sub_common_areas" },
  ],
  safety: [
    { value: "security_breach",    labelKey: "sub_security_breach" },
    { value: "hazard",             labelKey: "sub_hazard" },
    { value: "lighting",           labelKey: "sub_lighting" },
    { value: "fire_safety",        labelKey: "sub_fire_safety" },
    { value: "unauthorized_entry", labelKey: "sub_unauthorized_entry" },
  ],
  management: [
    { value: "unresponsive",   labelKey: "sub_unresponsive" },
    { value: "unprofessional", labelKey: "sub_unprofessional" },
    { value: "communication",  labelKey: "sub_communication" },
    { value: "privacy",        labelKey: "sub_privacy" },
    { value: "lease_issue",    labelKey: "sub_lease_issue" },
  ],
  general: [
    { value: "suggestion", labelKey: "sub_suggestion" },
    { value: "compliment",  labelKey: "sub_compliment" },
    { value: "other",       labelKey: "sub_other" },
  ],
};

const CATEGORY_VALUES = ["maintenance", "billing", "noise_neighbour", "safety", "management", "general"] as const;

// ── Shared input class ────────────────────────────────────────────────────────

const inp = (err: boolean) =>
  `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
    err
      ? "border-red-300 focus:ring-red-200 bg-red-50"
      : "border-slate-200 focus:border-[#00C9C9] focus:ring-[#00C9C9]/20 bg-white"
  }`;

// ── Label component ───────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-[#0D1B8E] mb-1.5">
      {children}
      {required && <span className="text-[#00C9C9] ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1.5">{message}</p>;
}

// ── Success state ─────────────────────────────────────────────────────────────

function SuccessPanel({ reference, onReset }: { reference: string; onReset: () => void }) {
  const t = useTranslations("complaints");
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5" aria-hidden="true">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
        <span className="text-green-700 text-xs font-bold tracking-widest uppercase">{t("success_badge")}</span>
      </div>
      <h3 className="text-xl font-bold text-[#0D1B8E] mb-3">{t("success_title")}</h3>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{t("success_desc")}</p>

      {/* Reference box */}
      <div className="bg-[#f0f4ff] border-2 border-[#0D1B8E] rounded-2xl p-6 mb-6">
        <p className="text-xs text-indigo-500 font-bold tracking-widest uppercase mb-2">{t("success_ref_label")}</p>
        <p className="text-3xl font-black text-[#0D1B8E] tracking-widest">{reference}</p>
        <p className="text-xs text-slate-400 mt-2">{t("success_ref_hint")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="#status"
          className="px-6 py-2.5 rounded-full bg-[#0D1B8E] text-white font-semibold text-sm
                     hover:bg-[#0a1570] transition-colors text-center"
        >
          {t("success_track_btn")}
        </a>
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-full border-2 border-[#0D1B8E] text-[#0D1B8E]
                     font-semibold text-sm hover:bg-[#0D1B8E] hover:text-white transition-colors"
        >
          {t("success_another_btn")}
        </button>
      </div>
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export default function ComplaintForm() {
  const t      = useTranslations("complaints");
  const locale = useLocale();

  const [status,            setStatus]            = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [reference,         setReference]         = useState("");
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { submitter_type: "tenant", category: "maintenance" },
  });

  const watchedCategory  = watch("category");
  const priorityInfo     = PRIORITY_CONFIG[watchedCategory];
  const subcategoryItems = SUBCATEGORY_KEYS[watchedCategory] ?? [];

  // translated option arrays built inside render so t() is available
  const SUBMITTER_OPTIONS = [
    { value: "tenant",      label: t("submitter_tenant") },
    { value: "landlord",    label: t("submitter_landlord") },
    { value: "prospective", label: t("submitter_prospective") },
    { value: "public",      label: t("submitter_public") },
  ];

  const CATEGORY_OPTIONS = CATEGORY_VALUES.map((v) => ({
    value: v,
    label: t(`cat_${v === "noise_neighbour" ? "noise" : v}_label`),
    description: t(`cat_${v === "noise_neighbour" ? "noise" : v}_desc`),
  }));

  const onSubmit = async (data: FormData) => {
    setStatus("submitting");
    try {
      const token = turnstileRef.current?.getResponse() ?? undefined;
      const result = await submitComplaint({ ...data, token });
      if (result.success) {
        setReference(result.reference);
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return <SuccessPanel reference={reference} onReset={() => setStatus("idle")} />;
  }

  return (
    <div id="submit" className="bg-white rounded-2xl shadow-sm border border-slate-100">
      {/* Form header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-[#0D1B8E]">{t("form_title")}</h2>
        <p className="text-slate-500 text-sm mt-1">
          {t("form_subtitle").split("*")[0]}
          <span className="text-[#00C9C9] font-semibold">*</span>
          {t("form_subtitle").split("*")[1]}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6" noValidate>

        {/* ── Step 1: Who are you? ── */}
        <fieldset>
          <legend className="text-sm font-semibold text-[#0D1B8E] mb-3">
            {t("field_who")} <span className="text-[#00C9C9]">*</span>
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUBMITTER_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`relative flex items-center justify-center px-3 py-2.5 rounded-xl border-2 cursor-pointer
                            text-xs font-semibold transition-all text-center ${
                  watch("submitter_type") === opt.value
                    ? "border-[#0D1B8E] bg-[#0D1B8E] text-white"
                    : "border-slate-200 text-slate-600 hover:border-[#0D1B8E]/40"
                }`}
              >
                <input
                  {...register("submitter_type")}
                  type="radio"
                  value={opt.value}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* ── Step 2: Category ── */}
        <fieldset>
          <legend className="text-sm font-semibold text-[#0D1B8E] mb-3">
            {t("field_category")} <span className="text-[#00C9C9]">*</span>
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CATEGORY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                  watch("category") === opt.value
                    ? "border-[#0D1B8E] bg-[#f0f4ff]"
                    : "border-slate-200 hover:border-[#0D1B8E]/30"
                }`}
              >
                <input
                  {...register("category")}
                  type="radio"
                  value={opt.value}
                  className="mt-0.5 accent-[#0D1B8E]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#0D1B8E] leading-tight">{opt.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{opt.description}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Priority badge - auto-assigned */}
          {priorityInfo && (
            <div
              className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
              style={{ background: priorityInfo.bg, border: `1px solid ${priorityInfo.colour}30` }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: priorityInfo.colour }}
                aria-hidden="true"
              />
              <span style={{ color: priorityInfo.colour }} className="font-bold text-xs uppercase tracking-wide">
                {t(priorityInfo.labelKey)}
              </span>
              <span className="text-slate-500 text-xs">{t(priorityInfo.descKey)}</span>
            </div>
          )}
        </fieldset>

        {/* ── Subcategory ── */}
        {subcategoryItems.length > 0 && (
          <div>
            <Label>{t("field_subcategory")}</Label>
            <div className="relative">
              <select
                {...register("subcategory")}
                className="w-full pl-4 pr-8 py-3 rounded-xl border border-slate-200 text-sm
                           focus:outline-none focus:border-[#00C9C9] focus:ring-2 focus:ring-[#00C9C9]/20
                           bg-white text-[#0D1B8E] appearance-none cursor-pointer"
              >
                <option value="">{t("subcategory_placeholder")}</option>
                {subcategoryItems.map((o) => (
                  <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}

        {/* ── Description ── */}
        <div>
          <Label required>{t("field_description")}</Label>
          <textarea
            {...register("description")}
            rows={5}
            placeholder={t("description_placeholder")}
            className={`${inp(!!errors.description)} resize-none`}
          />
          <FieldError message={errors.description?.message} />
          <p className="text-xs text-slate-400 mt-1">{t("description_hint")}</p>
        </div>

        {/* ── Property area ── */}
        <div>
          <Label>{t("field_area")}</Label>
          <input
            {...register("property_area")}
            type="text"
            placeholder={t("area_placeholder")}
            className={inp(false)}
          />
          <p className="text-xs text-slate-400 mt-1">{t("area_hint")}</p>
        </div>

        {/* ── Contact details ── */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label required>{t("field_name")}</Label>
            <input
              {...register("full_name")}
              type="text"
              placeholder="Jane Wanjiku"
              className={inp(!!errors.full_name)}
            />
            <FieldError message={errors.full_name?.message} />
          </div>
          <div>
            <Label required>{t("field_email")}</Label>
            <input
              {...register("email")}
              type="email"
              placeholder="jane@example.com"
              className={inp(!!errors.email)}
            />
            <FieldError message={errors.email?.message} />
          </div>
        </div>

        <div>
          <Label required>{t("field_phone")}</Label>
          <input
            {...register("phone")}
            type="tel"
            placeholder="+254 7XX XXX XXX"
            className={inp(!!errors.phone)}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        {/* ── Turnstile ── */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
              onSuccess={() => setTurnstileVerified(true)}
              onError={() => { setTurnstileVerified(false); }}
              onExpire={() => setTurnstileVerified(false)}
            />
          </div>
          {turnstileVerified && (
            <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl
                            border border-green-200 bg-green-50">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center" aria-hidden="true">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-xs font-semibold text-green-700">{t("cloudflare_verified")}</span>
            </div>
          )}
        </div>

        {/* ── KDPA consent ── */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register("consent")}
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#0D1B8E]"
            />
            <span className="text-sm text-slate-600 leading-relaxed">
              {t("consent_text")}{" "}
              <Link href={`/${locale}/privacy-policy`} className="text-[#00C9C9] hover:underline font-medium">
                {t("consent_policy")}
              </Link>{" "}
              {t("consent_law")}{" "}
              <span className="text-[#00C9C9]">*</span>
            </span>
          </label>
          <FieldError message={errors.consent?.message} />
        </div>

        {/* ── Error banner ── */}
        {status === "error" && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {t("error_banner")}{" "}
            <a href="https://wa.me/254720854389" className="font-semibold underline">{t("error_whatsapp")}</a>.
          </div>
        )}

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-4 rounded-full bg-[#0D1B8E] text-white font-bold text-sm
                     hover:bg-[#0a1570] disabled:opacity-60 disabled:cursor-not-allowed
                     transition-colors focus:outline-none focus:ring-2 focus:ring-[#0D1B8E]/50"
        >
          {status === "submitting" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("submitting")}
            </span>
          ) : (
            t("submit_btn")
          )}
        </button>

        <p className="text-center text-xs text-slate-400">
          {t("help_text")}{" "}
          <a
            href="https://wa.me/254720854389?text=I+have+an+urgent+complaint"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 font-semibold hover:underline"
          >
            {t("help_whatsapp")}
          </a>
        </p>
      </form>
    </div>
  );
}
