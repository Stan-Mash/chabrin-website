"use client";

import { useState, useRef } from "react";
import Link from "next/link";
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

// ── Category → subcategory map ────────────────────────────────────────────────

const SUBCATEGORIES: Record<string, { value: string; label: string }[]> = {
  maintenance: [
    { value: "plumbing",    label: "Plumbing — Leak / Burst Pipe / No Water" },
    { value: "electrical",  label: "Electrical — Power / Wiring / Sockets" },
    { value: "structural",  label: "Structural — Roof / Walls / Ceiling" },
    { value: "pest",        label: "Pest Control — Rodents / Insects" },
    { value: "ac_hvac",     label: "AC / Ventilation" },
    { value: "locks_doors", label: "Locks / Doors / Windows" },
    { value: "general_repair", label: "General Repair" },
  ],
  billing: [
    { value: "incorrect_charge", label: "Incorrect Charge on Statement" },
    { value: "payment_not_posted", label: "Payment Made But Not Posted" },
    { value: "deposit_dispute",  label: "Security Deposit Dispute" },
    { value: "service_charge",   label: "Service Charge Query" },
    { value: "other_billing",    label: "Other Billing Issue" },
  ],
  noise_neighbour: [
    { value: "noise_music",    label: "Loud Music / Noise" },
    { value: "noise_night",    label: "Late-Night Disturbance" },
    { value: "neighbour_conflict", label: "Neighbour Conflict" },
    { value: "parking",        label: "Parking Dispute" },
    { value: "common_areas",   label: "Common Area Misuse" },
  ],
  safety: [
    { value: "security_breach", label: "Security Breach / Break-in" },
    { value: "hazard",          label: "Physical Hazard / Injury Risk" },
    { value: "lighting",        label: "Inadequate Lighting" },
    { value: "fire_safety",     label: "Fire Safety Concern" },
    { value: "unauthorized_entry", label: "Unauthorized Entry by Staff" },
  ],
  management: [
    { value: "unresponsive",   label: "Unresponsive Management" },
    { value: "unprofessional", label: "Unprofessional Conduct" },
    { value: "communication",  label: "Poor Communication" },
    { value: "privacy",        label: "Privacy / Lack of Notice" },
    { value: "lease_issue",    label: "Lease / Contract Issue" },
  ],
  general: [
    { value: "suggestion", label: "Suggestion / Improvement Idea" },
    { value: "compliment",  label: "Compliment / Positive Feedback" },
    { value: "other",       label: "Other" },
  ],
};

const CATEGORY_OPTIONS = [
  { value: "maintenance",     label: "🔧 Maintenance & Repairs",   description: "Plumbing, electrical, structural, pests" },
  { value: "billing",         label: "💳 Billing Dispute",         description: "Charges, payments, deposit" },
  { value: "noise_neighbour", label: "🔊 Noise / Neighbour",       description: "Noise, parking, common areas" },
  { value: "safety",          label: "🛡 Safety & Security",       description: "Hazards, breach, unauthorized entry" },
  { value: "management",      label: "👤 Management Quality",      description: "Response, conduct, communication" },
  { value: "general",         label: "💬 General Feedback",        description: "Suggestions, compliments, other" },
];

const SUBMITTER_OPTIONS = [
  { value: "tenant",      label: "Tenant" },
  { value: "landlord",    label: "Landlord / Property Owner" },
  { value: "prospective", label: "Prospective Tenant" },
  { value: "public",      label: "General Public" },
];

const PRIORITY_BADGE: Record<string, { label: string; colour: string; bg: string; description: string }> = {
  maintenance:     { label: "Urgent",    colour: "#ea580c", bg: "#fff7ed", description: "Response within 8 hours" },
  billing:         { label: "Enquiry",   colour: "#7c3aed", bg: "#f5f3ff", description: "Response within 1 business day" },
  noise_neighbour: { label: "Routine",   colour: "#2563eb", bg: "#eff6ff", description: "Response within 72 hours" },
  safety:          { label: "Emergency", colour: "#dc2626", bg: "#fef2f2", description: "Response within 1 hour" },
  management:      { label: "Routine",   colour: "#2563eb", bg: "#eff6ff", description: "Response within 72 hours" },
  general:         { label: "Routine",   colour: "#2563eb", bg: "#eff6ff", description: "Response within 72 hours" },
};

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
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5" aria-hidden="true">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
        <span className="text-green-700 text-xs font-bold tracking-widest uppercase">Complaint Submitted</span>
      </div>
      <h3 className="text-xl font-bold text-[#0D1B8E] mb-3">We&apos;ve Received Your Complaint</h3>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">
        A confirmation email with your reference number has been sent to you.
        Use it to track your complaint below.
      </p>

      {/* Reference box */}
      <div className="bg-[#f0f4ff] border-2 border-[#0D1B8E] rounded-2xl p-6 mb-6">
        <p className="text-xs text-indigo-500 font-bold tracking-widest uppercase mb-2">Your Reference Number</p>
        <p className="text-3xl font-black text-[#0D1B8E] tracking-widest">{reference}</p>
        <p className="text-xs text-slate-400 mt-2">Keep this safe — you will need it to track your complaint</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="#status"
          className="px-6 py-2.5 rounded-full bg-[#0D1B8E] text-white font-semibold text-sm
                     hover:bg-[#0a1570] transition-colors text-center"
        >
          Track This Complaint
        </a>
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-full border-2 border-[#0D1B8E] text-[#0D1B8E]
                     font-semibold text-sm hover:bg-[#0D1B8E] hover:text-white transition-colors"
        >
          Submit Another
        </button>
      </div>
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export default function ComplaintForm() {
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

  const watchedCategory = watch("category");
  const priorityInfo = PRIORITY_BADGE[watchedCategory];
  const subcategoryOptions = SUBCATEGORIES[watchedCategory] ?? [];

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
        <h2 className="text-xl font-bold text-[#0D1B8E]">Submit a Complaint or Request</h2>
        <p className="text-slate-500 text-sm mt-1">
          All fields marked <span className="text-[#00C9C9] font-semibold">*</span> are required.
          You will receive a reference number by email immediately.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6" noValidate>

        {/* ── Step 1: Who are you? ── */}
        <fieldset>
          <legend className="text-sm font-semibold text-[#0D1B8E] mb-3">
            I am a <span className="text-[#00C9C9]">*</span>
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
            Category <span className="text-[#00C9C9]">*</span>
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

          {/* Priority badge — auto-assigned */}
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
                {priorityInfo.label}
              </span>
              <span className="text-slate-500 text-xs">— {priorityInfo.description}</span>
            </div>
          )}
        </fieldset>

        {/* ── Subcategory ── */}
        {subcategoryOptions.length > 0 && (
          <div>
            <Label>Specific Issue</Label>
            <div className="relative">
              <select
                {...register("subcategory")}
                className="w-full pl-4 pr-8 py-3 rounded-xl border border-slate-200 text-sm
                           focus:outline-none focus:border-[#00C9C9] focus:ring-2 focus:ring-[#00C9C9]/20
                           bg-white text-[#0D1B8E] appearance-none cursor-pointer"
              >
                <option value="">— Select specific issue (optional) —</option>
                {subcategoryOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
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
          <Label required>Describe the Issue</Label>
          <textarea
            {...register("description")}
            rows={5}
            placeholder="Please describe your issue in detail — what happened, when it started, and what you would like done about it..."
            className={`${inp(!!errors.description)} resize-none`}
          />
          <FieldError message={errors.description?.message} />
          <p className="text-xs text-slate-400 mt-1">
            Minimum 20 characters. The more detail you provide, the faster we can help.
          </p>
        </div>

        {/* ── Property area ── */}
        <div>
          <Label>Property Area / Neighbourhood</Label>
          <input
            {...register("property_area")}
            type="text"
            placeholder="e.g. Kasarani, Westlands, Kahawa Wendani — no exact address required"
            className={inp(false)}
          />
          <p className="text-xs text-slate-400 mt-1">
            Approximate area only — we do not require your exact address.
          </p>
        </div>

        {/* ── Contact details ── */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label required>Full Name</Label>
            <input
              {...register("full_name")}
              type="text"
              placeholder="Jane Wanjiku"
              className={inp(!!errors.full_name)}
            />
            <FieldError message={errors.full_name?.message} />
          </div>
          <div>
            <Label required>Email Address</Label>
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
          <Label required>Phone Number</Label>
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
              <span className="text-xs font-semibold text-green-700">Secured by Cloudflare · Verified</span>
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
              I consent to the processing of my personal data for the purpose of handling
              this complaint, in accordance with the{" "}
              <Link href="/en/privacy-policy" className="text-[#00C9C9] hover:underline font-medium">
                Privacy Policy
              </Link>{" "}
              and the Kenya Data Protection Act 2019.{" "}
              <span className="text-[#00C9C9]">*</span>
            </span>
          </label>
          <FieldError message={errors.consent?.message} />
        </div>

        {/* ── Error banner ── */}
        {status === "error" && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            Something went wrong. Please try again or reach us directly on{" "}
            <a href="https://wa.me/254720854389" className="font-semibold underline">WhatsApp</a>.
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
              Submitting…
            </span>
          ) : (
            "Submit Complaint"
          )}
        </button>

        <p className="text-center text-xs text-slate-400">
          Need immediate help?{" "}
          <a
            href="https://wa.me/254720854389?text=I+have+an+urgent+complaint"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 font-semibold hover:underline"
          >
            WhatsApp us directly
          </a>
        </p>
      </form>
    </div>
  );
}
