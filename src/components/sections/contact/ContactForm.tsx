"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";

// Schema kept in sync with src/app/api/contact/route.ts — max lengths must match
const schema = z.object({
  name:    z.string().min(2, "Please enter your full name").max(100),
  email:   z.string().email("Please enter a valid email address").max(200),
  phone:   z.string().min(9, "Please enter a valid phone number").max(20),
  subject: z.enum(["general", "management", "tenant", "valuation", "other"]),
  message: z.string().min(20, "Message must be at least 20 characters").max(3000),
  consent: z.literal(true, { message: "You must agree to the Privacy Policy to proceed" }),
  token:   z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const SUBJECTS = [
  { value: "general",    label: "General Enquiry"      },
  { value: "management", label: "Property Management"  },
  { value: "tenant",     label: "Tenant Enquiry"       },
  { value: "valuation",  label: "Valuation Request"    },
  { value: "other",      label: "Other"                },
];

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
    hasError
      ? "border-red-300 focus:ring-red-200"
      : "border-slate-200 focus:border-brand-cyan focus:ring-brand-cyan/20"
  }`;

export default function ContactForm() {
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const turnstileRef = useRef<{ getResponse: () => string | null }>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { subject: "general" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setStatus("submitting");
    try {
      // Get Turnstile token
      const token = turnstileRef.current?.getResponse();
      
      const payload = { ...data, token };

      // Send to API for server-side validation & bot verification
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(errorData.error || "Request failed");
      }

      // Email is sent server-side inside /api/contact — nothing more needed here
      setStatus("success");
      reset();
      // Reset Turnstile widget
      if (turnstileRef.current) {
        turnstileRef.current = null;
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-card text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-navy mb-2">Message Sent!</h3>
        <p className="text-slate-500 mb-6">
          Thank you for reaching out. Our team will respond within one business day.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-2.5 rounded-full bg-brand-navy text-white text-sm font-semibold
                     hover:bg-brand-navy-dark transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-card">
      <h2 className="text-2xl font-bold text-brand-navy mb-6">Send Us a Message</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

        {/* Name + Email */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1.5">
              Full Name <span className="text-brand-cyan">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Jane Wanjiku"
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1.5">
              Email Address <span className="text-brand-cyan">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="jane@example.com"
              className={inputClass(!!errors.email)}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Phone + Subject */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1.5">
              Phone Number <span className="text-brand-cyan">*</span>
            </label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="+254 7XX XXX XXX"
              className={inputClass(!!errors.phone)}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1.5">
              Subject <span className="text-brand-cyan">*</span>
            </label>
            <select
              {...register("subject")}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm
                         focus:outline-none focus:border-brand-cyan focus:ring-2
                         focus:ring-brand-cyan/20 bg-white text-brand-navy"
            >
              {SUBJECTS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1.5">
            Message <span className="text-brand-cyan">*</span>
          </label>
          <textarea
            {...register("message")}
            rows={5}
            placeholder="Tell us how we can help you..."
            className={`${inputClass(!!errors.message)} resize-none`}
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
          )}
        </div>

        {/* Turnstile Bot Protection */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <Turnstile
              ref={turnstileRef as any}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
              onSuccess={() => setTurnstileVerified(true)}
              onError={() => {
                setTurnstileVerified(false);
                setStatus("error");
              }}
              onExpire={() => setTurnstileVerified(false)}
            />
          </div>

          {/* Animated "Secured by Cloudflare" badge — appears once verified */}
          <div
            aria-live="polite"
            aria-label={turnstileVerified ? "Bot protection verified" : undefined}
            className={`
              flex items-center justify-center gap-2 py-2 px-4 rounded-xl
              border transition-all duration-500 ease-out
              ${turnstileVerified
                ? "opacity-100 translate-y-0 border-green-200 bg-green-50"
                : "opacity-0 translate-y-1 border-transparent bg-transparent pointer-events-none"
              }
            `}
          >
            {/* Animated checkmark */}
            <span
              className={`
                flex items-center justify-center w-5 h-5 rounded-full
                transition-all duration-300 delay-100
                ${turnstileVerified ? "bg-green-500 scale-100" : "bg-transparent scale-0"}
              `}
              aria-hidden="true"
            >
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>

            {/* Cloudflare logo + text */}
            <div className="flex items-center gap-1.5">
              {/* Cloudflare cloud icon */}
              <svg
                className="w-4 h-4 text-orange-500"
                viewBox="0 0 120 60"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M81.5 32.3c.4-1.3.6-2.7.6-4.1 0-9.3-7.6-16.9-16.9-16.9-6 0-11.3 3.1-14.3 7.8-1.3-.6-2.8-1-4.4-1-5.9 0-10.7 4.8-10.7 10.7 0 .9.1 1.7.3 2.5H35c-4.4 0-8 3.6-8 8s3.6 8 8 8h46.1c4.4 0 8-3.6 8-8 0-3.8-2.6-6.9-6.2-7.7l-1.4.7z" />
              </svg>
              <span className="text-xs font-semibold text-slate-600">
                Secured by{" "}
                <span className="text-orange-500 font-bold">Cloudflare</span>
              </span>
            </div>

            <span className="text-xs text-green-600 font-semibold">
              ✓ Verified
            </span>
          </div>
        </div>

        {/* KDPA Consent */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register("consent")}
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-cyan focus:ring-brand-cyan"
            />
            <span className="text-sm text-slate-600 leading-relaxed">
              I agree to the processing of my personal data in accordance with the{" "}
              <Link href={`/${locale}/privacy-policy`} className="text-brand-cyan hover:underline font-medium">
                Privacy Policy
              </Link>
              {" "}in compliance with the Kenya Data Protection Act 2019.{" "}
              <span className="text-brand-cyan">*</span>
            </span>
          </label>
          {errors.consent && (
            <p className="text-red-500 text-xs mt-1 ml-7">{errors.consent.message}</p>
          )}
        </div>

        {/* Error banner */}
        {status === "error" && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            Something went wrong. Please try again or reach us directly on WhatsApp.
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-3.5 rounded-full bg-brand-navy text-white font-bold text-sm
                     hover:bg-brand-navy-dark disabled:opacity-60 disabled:cursor-not-allowed
                     transition-colors"
        >
          {status === "submitting" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </span>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}
