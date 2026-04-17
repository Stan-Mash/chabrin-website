"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { submitApplication } from "@/actions/submit-application";
import type { ScreeningQuestion } from "@/db/queries/jobs";

// ── Schema (mirrors server action, client-side validation) ───────────────────

const schema = z.object({
  full_name:    z.string().min(2, "Full name is required").max(120),
  email:        z.string().email("Enter a valid email address"),
  phone:        z.string().min(9, "Phone number is required").max(25),
  linkedin_url: z.string().url("Enter a valid URL").max(500).optional().or(z.literal("")),
  cover_letter: z.string().max(5000).optional(),
  consent:      z.literal(true, "You must agree to the Privacy Policy"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  jobSlug:            string;
  jobId:              string;
  jobTitle:           string;
  screeningQuestions: ScreeningQuestion[];
}

export default function ApplicationForm({ jobSlug, jobId, jobTitle, screeningQuestions }: Props) {
  const [token, setToken]               = useState<string | null>(null);
  const [answers, setAnswers]           = useState<Record<string, string>>({});
  const [result, setResult]             = useState<{ success: true; reference: string } | { success: false; error: string } | null>(null);
  const [submitting, setSubmitting]     = useState(false);
  const turnstileRef                    = useRef<TurnstileInstance>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setResult(null);

    const payload = {
      job_slug:     jobSlug,
      job_id:       jobId,
      full_name:    values.full_name,
      email:        values.email,
      phone:        values.phone,
      linkedin_url: values.linkedin_url || "",
      cover_letter: values.cover_letter || "",
      answers,
      consent:      true as const,
      token:        token ?? undefined,
    };

    const res = await submitApplication(payload);
    setResult(res);
    setSubmitting(false);

    if (!res.success) {
      turnstileRef.current?.reset();
      setToken(null);
    }
  };

  if (result?.success) {
    return (
      <div className="bg-white rounded-2xl border-2 border-brand-cyan p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-navy mb-2">Application Submitted!</h3>
        <p className="text-slate-600 text-sm mb-6">
          Thank you for applying for <strong>{jobTitle}</strong>. We&apos;ve sent a confirmation to your email.
        </p>
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Your Reference Number</p>
          <p className="text-2xl font-black text-brand-navy tracking-wider">{result.reference}</p>
          <p className="text-xs text-slate-500 mt-1">Save this to track your application</p>
        </div>
        <a
          href="/careers/track"
          className="inline-block px-6 py-2.5 rounded-full bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors"
        >
          Track My Application
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Personal details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-brand-navy mb-5 text-sm uppercase tracking-wider">Personal Details</h3>
        <div className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("full_name")}
              placeholder="John Kamau"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy
                         placeholder:text-slate-400"
            />
            {errors.full_name && <p className="mt-1 text-xs text-rose-600">{errors.full_name.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy
                           placeholder:text-slate-400"
              />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="+254 700 000 000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy
                           placeholder:text-slate-400"
              />
              {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              LinkedIn Profile URL <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              {...register("linkedin_url")}
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy
                         placeholder:text-slate-400"
            />
            {errors.linkedin_url && <p className="mt-1 text-xs text-rose-600">{errors.linkedin_url.message}</p>}
          </div>

        </div>
      </div>

      {/* Screening questions */}
      {screeningQuestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-brand-navy mb-5 text-sm uppercase tracking-wider">Screening Questions</h3>
          <div className="space-y-4">
            {screeningQuestions.map((sq, idx) => (
              <div key={idx}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {sq.question}
                  {sq.required && <span className="text-rose-500 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  value={answers[sq.question] ?? ""}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [sq.question]: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy
                             placeholder:text-slate-400"
                  placeholder="Your answer..."
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cover letter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-brand-navy mb-1 text-sm uppercase tracking-wider">Cover Letter</h3>
        <p className="text-xs text-slate-500 mb-4">Optional but recommended. Tell us why you&apos;re a great fit.</p>
        <textarea
          {...register("cover_letter")}
          rows={5}
          placeholder="Dear Chabrin team, I am interested in this role because..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none
                     focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy
                     placeholder:text-slate-400"
        />
        {errors.cover_letter && <p className="mt-1 text-xs text-rose-600">{errors.cover_letter.message}</p>}
      </div>

      {/* Turnstile + Consent */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <input
            {...register("consent")}
            type="checkbox"
            id="consent"
            className="mt-0.5 w-4 h-4 accent-brand-navy flex-shrink-0"
          />
          <label htmlFor="consent" className="text-sm text-slate-600 leading-relaxed">
            I consent to Chabrin Agencies Limited collecting and processing my personal data for recruitment purposes,
            in accordance with the{" "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer"
               className="text-brand-navy font-semibold hover:underline">
              Privacy Policy
            </a>{" "}
            and the Kenya Data Protection Act 2019.
            <span className="text-rose-500 ml-1">*</span>
          </label>
        </div>
        {errors.consent && <p className="text-xs text-rose-600">{errors.consent.message}</p>}

        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA"}
          onSuccess={setToken}
          onExpire={() => setToken(null)}
        />
      </div>

      {/* Error */}
      {result && !result.success && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">
          {result.error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-full bg-brand-navy text-white font-bold text-sm
                   hover:bg-brand-cyan hover:text-brand-navy transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting…" : "Submit Application"}
      </button>

      <p className="text-xs text-slate-500 text-center">
        Your CV will be requested by email if you are shortlisted. No file upload required at this stage.
      </p>
    </form>
  );
}
