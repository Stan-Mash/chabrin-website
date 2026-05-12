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

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const mimeType = file.type;
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
    console.error("[upload-doc] failed", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

export const config = { api: { bodyParser: false } };
