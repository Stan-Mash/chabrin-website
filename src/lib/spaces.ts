import { put, del } from "@vercel/blob";
import sharp from "sharp";

/**
 * Vercel Blob storage — replaces DigitalOcean Spaces.
 *
 * ⚠️  SECURITY RULES:
 *  1. ALWAYS call uploadToBlob() — never put() directly.
 *     uploadToBlob() strips EXIF/GPS metadata before upload (KDPA compliance).
 *  2. Never upload user-provided content without type validation first.
 *  3. Never import this in client components — server-side only.
 *  4. Never log the buffer, key, or credentials to console.
 */

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

/**
 * Strips EXIF/GPS metadata from an image buffer using sharp,
 * then uploads to Vercel Blob storage.
 *
 * @param buffer   - Raw image buffer from file upload
 * @param pathname - Storage path e.g. "properties/listing-uuid/photo-1.webp"
 * @param mimeType - Must be jpeg, png, or webp
 * @returns        - Public CDN URL of uploaded file
 */
export async function uploadToBlob(
  buffer: Buffer,
  pathname: string,
  mimeType: AllowedImageType
): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported image type: ${mimeType}`);
  }

  // Strip ALL metadata including EXIF, GPS, ICC profile, XMP
  // withMetadata() is intentionally NOT called — this is the strip step
  const strippedBuffer = await sharp(buffer)
    .rotate() // Auto-rotate based on EXIF orientation, THEN strip
    .toFormat(mimeType === "image/jpeg" ? "jpeg" : mimeType === "image/png" ? "png" : "webp", {
      quality: 85,
    })
    .toBuffer();

  const blob = await put(pathname, strippedBuffer, {
    access: "public",
    contentType: mimeType,
    cacheControlMaxAge: 31536000, // 1 year
  });

  return blob.url;
}

/**
 * Deletes a file from Vercel Blob storage by its URL.
 *
 * @param url - Full Vercel Blob URL of the file to delete
 */
export async function deleteFromBlob(url: string): Promise<void> {
  await del(url);
}

/** @deprecated Use uploadToBlob() instead */
export const uploadToSpaces = uploadToBlob;

// ── Document upload (PDF / DOC / DOCX / images) ───────────────────────────────

const ALLOWED_DOC_TYPES: Record<string, string> = {
  "application/pdf":                                                          "pdf",
  "application/msword":                                                       "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "image/jpeg": "jpg",
  "image/png":  "png",
};

/**
 * Upload any CV or academic document to Vercel Blob.
 * Images have EXIF stripped; PDFs/DOCs are uploaded as-is.
 */
export async function uploadDocument(
  buffer:   Buffer,
  pathname: string,
  mimeType: string
): Promise<string> {
  const ext = ALLOWED_DOC_TYPES[mimeType];
  if (!ext) throw new Error(`Unsupported document type: ${mimeType}`);

  let finalBuffer = buffer;

  if (mimeType === "image/jpeg" || mimeType === "image/png") {
    finalBuffer = await sharp(buffer)
      .rotate()
      .toFormat(mimeType === "image/jpeg" ? "jpeg" : "png", { quality: 85 })
      .toBuffer();
  }

  const blob = await put(pathname, finalBuffer, {
    access:      "public",
    contentType: mimeType,
  });

  return blob.url;
}
