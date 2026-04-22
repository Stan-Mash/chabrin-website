"use client";

/**
 * /en/careers/upload?ref=APP-OPS-2025-XXXXX&tok=<hmac>&exp=<unix>
 *
 * Candidate-facing CV upload page.
 * The link is sent by email when an admin shortlists an applicant.
 * The HMAC token is verified server-side before accepting the file.
 */

import { useSearchParams } from "next/navigation";
import { useState, useRef } from "react";

const MAX_MB = 5;
const ALLOWED_EXTS = [".pdf", ".doc", ".docx"];

export default function CvUploadPage() {
  const params    = useSearchParams();
  const ref       = params.get("ref") ?? "";
  const tok       = params.get("tok") ?? "";
  const exp       = params.get("exp") ?? "";

  const [file, setFile]         = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus]     = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [error, setError]       = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Token expiry display
  const expiryDate = exp ? new Date(parseInt(exp, 10) * 1000) : null;
  const expired    = expiryDate ? expiryDate < new Date() : false;

  const isValidLink = ref && tok && exp && !expired;

  function handleFileSelect(f: File | null) {
    if (!f) return;
    const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      setError("Only PDF and Word documents (.pdf, .doc, .docx) are accepted.");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_MB}MB.`);
      return;
    }
    setError("");
    setFile(f);
  }

  async function handleUpload() {
    if (!file || !isValidLink) return;
    setStatus("uploading");
    setError("");

    const form = new FormData();
    form.append("cv", file);

    try {
      const res = await fetch(
        `/api/cv-upload?ref=${encodeURIComponent(ref)}&tok=${encodeURIComponent(tok)}&exp=${encodeURIComponent(exp)}`,
        { method: "POST", body: form }
      );
      const json = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !json.success) {
        setError(json.error ?? "Upload failed. Please try again.");
        setStatus("error");
      } else {
        setStatus("done");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  // ── Invalid / expired link ─────────────────────────────────────────────────
  if (!ref || !tok || !exp) {
    return (
      <PageShell>
        <ErrorCard title="Invalid Link">
          This upload link is incomplete or has been tampered with. Please use the link from your shortlisting email.
        </ErrorCard>
      </PageShell>
    );
  }

  if (expired) {
    return (
      <PageShell>
        <ErrorCard title="Link Expired">
          This upload link expired on {expiryDate?.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}.
          Please contact <a href="mailto:careers@chabrinagencies.co.ke" className="text-brand-navy font-semibold underline">careers@chabrinagencies.co.ke</a> to request a new link.
        </ErrorCard>
      </PageShell>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (status === "done") {
    return (
      <PageShell>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-3xl">
            ✅
          </div>
          <h2 className="text-xl font-bold text-brand-navy mb-2">CV Uploaded Successfully</h2>
          <p className="text-slate-500 text-sm mb-4">
            Your CV for reference <strong className="font-mono">{ref}</strong> has been received.
            Our HR team will review it and be in touch.
          </p>
          <p className="text-xs text-slate-400">You may now close this page.</p>
        </div>
      </PageShell>
    );
  }

  // ── Upload form ───────────────────────────────────────────────────────────
  return (
    <PageShell>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-mono text-slate-400 mb-1">Reference {ref}</p>
          <h1 className="text-2xl font-bold text-brand-navy mb-2">Upload Your CV</h1>
          <p className="text-slate-500 text-sm">
            You&apos;ve been shortlisted! Please upload your CV below. PDF or Word format, max {MAX_MB}MB.
          </p>
          {expiryDate && (
            <p className="text-xs text-slate-400 mt-2">
              Link expires {expiryDate.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>

        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer
            ${dragging ? "border-brand-cyan bg-brand-cyan/5" : file ? "border-green-400 bg-green-50" : "border-slate-200 hover:border-brand-navy/40"}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFileSelect(e.dataTransfer.files[0] ?? null);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />

          {file ? (
            <div>
              <p className="text-2xl mb-2">📄</p>
              <p className="font-semibold text-brand-navy text-sm">{file.name}</p>
              <p className="text-xs text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setError(""); }}
                className="mt-3 text-xs text-rose-500 hover:text-rose-700 transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <p className="text-3xl mb-3">📎</p>
              <p className="text-sm font-semibold text-brand-navy">Drag & drop your CV here</p>
              <p className="text-xs text-slate-400 mt-1">or click to browse</p>
              <p className="text-xs text-slate-400 mt-3">PDF, DOC, DOCX — max {MAX_MB}MB</p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!file || status === "uploading"}
          className="mt-6 w-full py-3 rounded-full bg-brand-navy text-white text-sm font-bold
                     hover:bg-brand-cyan hover:text-brand-navy transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "uploading" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Uploading…
            </span>
          ) : "Upload CV"}
        </button>

        <p className="text-xs text-slate-400 text-center mt-4">
          Your data is handled in accordance with the Kenya Data Protection Act 2019.{" "}
          <a href="/en/privacy-policy" className="underline">Privacy Policy</a>
        </p>
      </div>
    </PageShell>
  );
}

// ── Shared layout helpers ─────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Logo bar */}
      <div className="bg-brand-navy px-6 py-4 flex items-center gap-3">
        <img src="/logo-icon.png" alt="Chabrin Agencies" className="h-8 w-8 object-contain" />
        <span className="text-white font-bold text-sm">Chabrin Agencies Limited</span>
      </div>
      <div className="px-4 py-12">
        {children}
      </div>
    </main>
  );
}

function ErrorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-sm max-w-md mx-auto">
      <p className="text-3xl mb-3">⚠️</p>
      <h2 className="text-xl font-bold text-rose-700 mb-3">{title}</h2>
      <p className="text-slate-600 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
