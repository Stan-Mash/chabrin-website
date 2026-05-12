"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { submitApplication } from "@/actions/submit-application";

type ScreeningQuestion = { question: string; required: boolean; fieldType?: "text" | "yesno" };

interface UploadedDoc { name: string; url: string; size: number }

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  full_name:    z.string().min(2, "Full name is required").max(120),
  email:        z.string().email("Enter a valid email address"),
  phone:        z.string().min(9, "Phone number is required").max(25),
  linkedin_url: z.string().url("Enter a valid URL").max(500).optional().or(z.literal("")),
  cover_letter: z.string().max(5000).optional(),
  consent:      z.literal(true, "You must agree to the Privacy Policy"),
});

type FormValues = z.infer<typeof schema>;

const ALLOWED_CV_TYPES   = ".pdf,.doc,.docx";
const ALLOWED_DOC_TYPES  = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
const MAX_SIZE_MB         = 5;
const MAX_SIZE_BYTES      = MAX_SIZE_MB * 1024 * 1024;

// ── File upload helper ────────────────────────────────────────────────────────

async function uploadFile(file: File): Promise<UploadedDoc> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/careers/upload-doc", { method: "POST", body: fd });
  const json = await res.json() as { url?: string; name?: string; size?: number; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed");
  return { url: json.url, name: json.name ?? file.name, size: json.size ?? file.size };
}

// ── File row ──────────────────────────────────────────────────────────────────

function FileRow({ file, status, error, onRemove }: {
  file:    File;
  status:  "pending" | "uploading" | "done" | "error";
  error?:  string;
  onRemove: () => void;
}) {
  const kb = (file.size / 1024).toFixed(0);
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-xl border text-sm ${
      status === "done"  ? "bg-green-50 border-green-200" :
      status === "error" ? "bg-rose-50 border-rose-200"   :
                           "bg-slate-50 border-slate-200"
    }`}>
      <span className="text-lg">
        {status === "done" ? "✅" : status === "error" ? "❌" : status === "uploading" ? "⏳" : "📄"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-700 truncate">{file.name}</p>
        {error
          ? <p className="text-xs text-rose-600">{error}</p>
          : <p className="text-xs text-slate-400">{kb} KB</p>
        }
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-slate-400 hover:text-rose-500 transition-colors text-lg leading-none"
      >
        &times;
      </button>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  jobSlug:            string;
  jobTitle:           string;
  screeningQuestions: ScreeningQuestion[];
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ApplicationForm({ jobSlug, jobTitle, screeningQuestions }: Props) {
  const [token, setToken]           = useState<string | null>(null);
  const [answers, setAnswers]       = useState<Record<string, string>>({});
  const [result, setResult]         = useState<{ success: true; reference: string } | { success: false; error: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const turnstileRef                = useRef<TurnstileInstance>(null);

  // CV state
  const [cvFile,   setCvFile]   = useState<File | null>(null);
  const [cvStatus, setCvStatus] = useState<"pending" | "uploading" | "done" | "error">("pending");
  const [cvError,  setCvError]  = useState<string>("");
  const [cvDoc,    setCvDoc]    = useState<UploadedDoc | null>(null);

  // Supporting docs state
  const [docFiles,    setDocFiles]    = useState<File[]>([]);
  const [docStatuses, setDocStatuses] = useState<("pending" | "uploading" | "done" | "error")[]>([]);
  const [docErrors,   setDocErrors]   = useState<string[]>([]);
  const [docUploaded, setDocUploaded] = useState<(UploadedDoc | null)[]>([]);

  const cvInputRef  = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // ── CV upload ───────────────────────────────────────────────────────────────

  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SIZE_BYTES) {
      setCvFile(file); setCvStatus("error"); setCvError(`File exceeds ${MAX_SIZE_MB} MB.`); return;
    }
    setCvFile(file); setCvStatus("uploading"); setCvError(""); setCvDoc(null);
    try {
      const doc = await uploadFile(file);
      setCvDoc(doc); setCvStatus("done");
    } catch (err) {
      setCvStatus("error");
      setCvError(err instanceof Error ? err.message : "Upload failed");
    }
    e.target.value = "";
  };

  const removeCV = () => { setCvFile(null); setCvStatus("pending"); setCvDoc(null); setCvError(""); };

  // ── Supporting docs upload ──────────────────────────────────────────────────

  const handleDocsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);
    if (!newFiles.length) return;

    const available = 4 - docFiles.length;
    const toAdd = newFiles.slice(0, available);

    const idx = docFiles.length;
    setDocFiles(prev => [...prev, ...toAdd]);
    setDocStatuses(prev => [...prev, ...toAdd.map(() => "pending" as const)]);
    setDocErrors(prev => [...prev, ...toAdd.map(() => "")]);
    setDocUploaded(prev => [...prev, ...toAdd.map(() => null)]);

    for (let i = 0; i < toAdd.length; i++) {
      const file = toAdd[i];
      const pos  = idx + i;
      if (file.size > MAX_SIZE_BYTES) {
        setDocStatuses(prev => { const a = [...prev]; a[pos] = "error"; return a; });
        setDocErrors(prev => { const a = [...prev]; a[pos] = `Exceeds ${MAX_SIZE_MB} MB`; return a; });
        continue;
      }
      setDocStatuses(prev => { const a = [...prev]; a[pos] = "uploading"; return a; });
      try {
        const doc = await uploadFile(file);
        setDocUploaded(prev => { const a = [...prev]; a[pos] = doc; return a; });
        setDocStatuses(prev => { const a = [...prev]; a[pos] = "done"; return a; });
      } catch (err) {
        setDocStatuses(prev => { const a = [...prev]; a[pos] = "error"; return a; });
        setDocErrors(prev => { const a = [...prev]; a[pos] = err instanceof Error ? err.message : "Upload failed"; return a; });
      }
    }
    e.target.value = "";
  };

  const removeDoc = (i: number) => {
    setDocFiles(prev   => prev.filter((_,   j) => j !== i));
    setDocStatuses(prev=> prev.filter((_,   j) => j !== i));
    setDocErrors(prev  => prev.filter((_,   j) => j !== i));
    setDocUploaded(prev=> prev.filter((_,   j) => j !== i));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: FormValues) => {
    if (cvFile && cvStatus !== "done") {
      return; // CV upload still pending or failed
    }
    const allDocsReady = docStatuses.every(s => s === "done" || s === "error");
    if (!allDocsReady) return;

    setSubmitting(true);
    setResult(null);

    const documents = docUploaded.filter((d): d is UploadedDoc => d !== null);

    const res = await submitApplication({
      job_slug:     jobSlug,
      full_name:    values.full_name,
      email:        values.email,
      phone:        values.phone,
      linkedin_url: values.linkedin_url || "",
      cover_letter: values.cover_letter || "",
      answers,
      consent:      true as const,
      token:        token ?? undefined,
      cv_url:       cvDoc?.url || "",
      documents,
    });

    setResult(res);
    setSubmitting(false);

    if (!res.success) {
      turnstileRef.current?.reset();
      setToken(null);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────

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
          href="/en/careers/track"
          className="inline-block px-6 py-2.5 rounded-full bg-brand-navy text-white text-sm font-bold hover:bg-brand-cyan hover:text-brand-navy transition-colors"
        >
          Track My Application
        </a>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────

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

      {/* Documents */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-brand-navy mb-1 text-sm uppercase tracking-wider">CV &amp; Documents</h3>
        <p className="text-xs text-slate-500 mb-5">PDF, Word or image — max 5 MB each. Files are uploaded securely to our servers.</p>

        {/* CV */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            CV / Resume <span className="text-rose-500">*</span>
          </label>
          {cvFile ? (
            <FileRow file={cvFile} status={cvStatus} error={cvError} onRemove={removeCV} />
          ) : (
            <button
              type="button"
              onClick={() => cvInputRef.current?.click()}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-200
                         text-sm text-slate-500 hover:border-brand-navy/30 hover:bg-slate-50 transition-colors"
            >
              <span className="text-xl">📎</span>
              <span>Click to attach your CV</span>
              <span className="ml-auto text-xs text-slate-400">PDF · DOC · DOCX</span>
            </button>
          )}
          <input
            ref={cvInputRef}
            type="file"
            accept={ALLOWED_CV_TYPES}
            onChange={handleCvChange}
            className="hidden"
          />
          {cvFile && cvStatus === "error" && (
            <p className="mt-1.5 text-xs text-rose-600">Please remove this file and attach a valid CV before submitting.</p>
          )}
        </div>

        {/* Academic / supporting documents */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Academic Certificates &amp; Supporting Documents
            <span className="font-normal text-slate-400 ml-1">(optional — up to 4 files)</span>
          </label>
          <p className="text-xs text-slate-400 mb-3">
            e.g. degree certificate, diplomas, KCSE certificate, professional licences
          </p>

          <div className="space-y-2 mb-3">
            {docFiles.map((f, i) => (
              <FileRow
                key={i}
                file={f}
                status={docStatuses[i] ?? "pending"}
                error={docErrors[i]}
                onRemove={() => removeDoc(i)}
              />
            ))}
          </div>

          {docFiles.length < 4 && (
            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-200
                         text-sm text-slate-500 hover:border-brand-navy/30 hover:bg-slate-50 transition-colors"
            >
              <span className="text-xl">📂</span>
              <span>Add certificate or document</span>
              <span className="ml-auto text-xs text-slate-400">PDF · DOC · JPG · PNG</span>
            </button>
          )}
          <input
            ref={docInputRef}
            type="file"
            accept={ALLOWED_DOC_TYPES}
            multiple
            onChange={handleDocsChange}
            className="hidden"
          />
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
                {sq.fieldType === "yesno" ? (
                  <select
                    value={answers[sq.question] ?? ""}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [sq.question]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white
                               focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy"
                  >
                    <option value="">Select an answer…</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={answers[sq.question] ?? ""}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [sq.question]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                               focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy
                               placeholder:text-slate-400"
                    placeholder="Your answer..."
                  />
                )}
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

      {/* Consent + Turnstile */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <input
            {...register("consent")}
            type="checkbox"
            id="consent"
            className="mt-0.5 w-4 h-4 accent-brand-navy flex-shrink-0"
          />
          <label htmlFor="consent" className="text-sm text-slate-600 leading-relaxed">
            I consent to Chabrin Agencies Limited collecting and processing my personal data
            (including uploaded documents) for recruitment purposes, in accordance with the{" "}
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

      {/* Upload warnings */}
      {cvFile && cvStatus === "uploading" && (
        <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          ⏳ Uploading your CV — please wait before submitting…
        </p>
      )}
      {!cvFile && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ No CV attached. A CV is strongly recommended — please attach one above.
        </p>
      )}

      {/* Error */}
      {result && !result.success && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">
          {result.error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || cvStatus === "uploading" || docStatuses.some(s => s === "uploading")}
        className="w-full py-3.5 rounded-full bg-brand-navy text-white font-bold text-sm
                   hover:bg-brand-cyan hover:text-brand-navy transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting…" :
         cvStatus === "uploading" ? "Uploading CV…" :
         docStatuses.some(s => s === "uploading") ? "Uploading documents…" :
         "Submit Application"}
      </button>
    </form>
  );
}
