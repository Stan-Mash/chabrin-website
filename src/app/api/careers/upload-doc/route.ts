import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { uploadDocument } from "@/lib/spaces";

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf":                                                          "pdf",
  "application/msword":                                                       "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "image/jpeg": "jpg",
  "image/png":  "png",
};

// Fallback MIME map for browsers that report empty/octet-stream for known extensions
const EXT_TO_MIME: Record<string, string> = {
  pdf:  "application/pdf",
  doc:  "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg:  "image/jpeg",
  jpeg: "image/jpeg",
  png:  "image/png",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  // Fail fast if blob storage is not configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[upload-doc] BLOB_READ_WRITE_TOKEN is not set in this environment");
    return NextResponse.json(
      { error: "Storage not configured. Please contact support." },
      { status: 503 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Some browsers (especially mobile) report empty or application/octet-stream
    // for PDFs and Word docs — fall back to extension-based detection.
    const fileExt = file.name.split(".").pop()?.toLowerCase() ?? "";
    const mimeType = (file.type && file.type !== "application/octet-stream")
      ? file.type
      : (EXT_TO_MIME[fileExt] ?? file.type);

    const ext = ALLOWED_TYPES[mimeType];
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF, Word document, JPG, or PNG." },
        { status: 415 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 5 MB." },
        { status: 413 }
      );
    }

    const id       = randomBytes(10).toString("hex");
    const safe     = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
    const pathname = `applications/docs/${id}-${safe}`;
    const buffer   = Buffer.from(await file.arrayBuffer());

    const url = await uploadDocument(buffer, pathname, mimeType);

    return NextResponse.json({ url, name: file.name, size: file.size });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Log without PII — just the error message to diagnose blob token issues etc.
    console.error("[upload-doc] failed:", msg);
    // Surface a more specific message for missing blob token
    if (msg.includes("BLOB_READ_WRITE_TOKEN") || msg.includes("token") || msg.includes("unauthorized")) {
      return NextResponse.json({ error: "Storage not configured. Please contact support." }, { status: 503 });
    }
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

export const config = { api: { bodyParser: false } };
