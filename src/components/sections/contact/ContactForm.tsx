"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name:    z.string().min(2, "Please enter your full name"),
  email:   z.string().email("Please enter a valid email address"),
  phone:   z.string().min(9, "Please enter a valid phone number"),
  subject: z.enum(["general", "management", "tenant", "valuation", "other"]),
  message: z.string().min(20, "Message must be at least 20 characters"),
  consent: z.literal(true, "You must agree to the Privacy Policy to proceed"),
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
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { subject: "general" },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("submitting");
    try {
      // TODO: wire to /api/contact once Cloudflare Turnstile keys are configured
      await new Promise((r) => setTimeout(r, 1200));
      // Avoid logging PII — only log subject for diagnostics
      console.info("[ContactForm] Submitted:", { subject: data.subject });
      setStatus("success");
      reset();
    } catch {
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

        {/* Turnstile placeholder */}
        <div className="p-4 rounded-xl bg-surface border border-slate-200 text-sm text-slate-500 text-center">
          🔐 Bot protection (Cloudflare Turnstile) will be enabled once configured.
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
              <a href="/en/privacy-policy" className="text-brand-cyan hover:underline font-medium">
                Privacy Policy
              </a>
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
