/**
 * POST /api/cv-upload
 *
 * Handles the signed CV upload from candidates.
 * Steps:
 *  1. Verify HMAC token from query params (ref, tok, exp)
 *  2. Validate file (PDF/DOCX, max 5MB)
 *  3. Upload to Vercel Blob
 *  4. Save cv_url + clear upload token in DB
 *  5. Trigger Gemini AI parsing (non-blocking)
 *  6. Return JSON { success: true, cvUrl }
 */

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyUploadToken } from "@/lib/cv-upload-token";
import {
  getApplicationByUploadToken,
  saveUploadedCv,
  saveAiSummary,
} from "@/db/queries/applications";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES  = ["application/pdf", "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

// ── Gemini AI parsing ─────────────────────────────────────────────────────────

async function parseWithGemini(
  cvUrl: string,
  reference: string
): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return;

  try {
    // Fetch the CV file bytes for Gemini inline data
    const fileRes = await fetch(cvUrl);
    if (!fileRes.ok) return;
    const fileBytes = await fileRes.arrayBuffer();
    const base64    = Buffer.from(fileBytes).toString("base64");
    const mimeType  = fileRes.headers.get("content-type") ?? "application/pdf";

    const prompt = `You are an HR assistant at Chabrin Agencies Limited, a property management company in Nairobi, Kenya.

Analyse this CV and return a JSON object (no markdown, no extra text) with these fields:
{
  "summary": "2–3 sentence professional summary",
  "years_experience": number or null,
  "education": ["highest qualification — institution"],
  "key_skills": ["up to 8 most relevant skills"],
  "previous_employers": ["Company (Role)"],
  "kenya_experience": true or false,
  "property_experience": true or false,
  "driving_licence": true or false or null,
  "languages": ["English", "Swahili", ...],
  "red_flags": ["any concerns — gaps, unrelated experience, etc."] or [],
  "hire_recommendation": "strong_yes" | "yes" | "maybe" | "no",
  "hire_notes": "1–2 sentence reasoning"
}`;

    const body = {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: base64 } },
        ],
      }],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 1024,
        temperature: 0.1,
      },
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      console.error("[cv-upload] gemini-api-error", { status: res.status, reference });
      return;
    }

    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return;

    const parsed = JSON.parse(text) as Record<string, unknown>;
    await saveAiSummary(reference, parsed);

    console.info("[cv-upload] ai-parsed", { reference, recommendation: parsed.hire_recommendation });
  } catch (err) {
    console.error("[cv-upload] gemini-failed", {
      reference,
      error: err instanceof Error ? err.message : "unknown",
    });
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const ref = searchParams.get("ref") ?? "";
  const tok = searchParams.get("tok") ?? "";
  const exp = searchParams.get("exp") ?? "";

  // Validate token
  if (!ref || !tok || !exp || !verifyUploadToken(ref, tok, exp)) {
    return NextResponse.json({ error: "Invalid or expired upload link." }, { status: 401 });
  }

  // Check application exists and token matches DB
  const app = await getApplicationByUploadToken(tok);
  if (!app || app.reference !== ref.toUpperCase()) {
    return NextResponse.json({ error: "Upload link has already been used or does not exist." }, { status: 410 });
  }

  // Parse multipart form
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("cv") as File | null;
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 413 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only PDF and Word documents are accepted." }, { status: 415 });
  }

  // Sanitise filename
  const ext      = file.name.split(".").pop()?.replace(/[^a-z]/gi, "").toLowerCase() ?? "pdf";
  const safeName = `cvs/${ref.toUpperCase()}.${ext}`;

  // Upload to Vercel Blob
  let blob: { url: string };
  try {
    blob = await put(safeName, file.stream(), {
      access:      "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
  } catch (err) {
    console.error("[cv-upload] blob-upload-failed", {
      reference: ref,
      error: err instanceof Error ? err.message : "unknown",
    });
    return NextResponse.json({ error: "File upload failed. Please try again." }, { status: 500 });
  }

  // Save cv_url + clear token (single-use)
  await saveUploadedCv(ref.toUpperCase(), blob.url);

  console.info("[cv-upload] uploaded", { reference: ref, size: file.size });

  // Gemini parsing — non-blocking (don't await)
  void parseWithGemini(blob.url, ref.toUpperCase());

  return NextResponse.json({ success: true, cvUrl: blob.url });
}
