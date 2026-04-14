import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { env } from "@/env";

/**
 * DigitalOcean Spaces client — S3-compatible object storage.
 *
 * ⚠️  SECURITY RULES:
 *  1. ALWAYS call uploadToSpaces() — never PutObjectCommand directly.
 *     uploadToSpaces() strips EXIF/GPS metadata before upload (KDPA compliance).
 *  2. Never upload user-provided content without type validation first.
 *  3. Never import this in client components — server-side only.
 *  4. Never log the buffer, key, or credentials to console.
 */

// Lazily initialised — only constructed when Spaces vars are present
function getSpacesClient(): S3Client {
  if (!env.SPACES_ENDPOINT || !env.SPACES_KEY || !env.SPACES_SECRET) {
    throw new Error("DigitalOcean Spaces is not configured. Set SPACES_* env vars.");
  }
  return new S3Client({
    endpoint: env.SPACES_ENDPOINT,
    region: "us-east-1", // DO Spaces requires this value regardless of region
    credentials: {
      accessKeyId: env.SPACES_KEY,
      secretAccessKey: env.SPACES_SECRET,
    },
    forcePathStyle: false,
  });
}

/** @deprecated Use uploadToSpaces() instead of accessing the client directly */
const spacesClient = new Proxy({} as S3Client, {
  get: (_t, prop) => getSpacesClient()[prop as keyof S3Client],
});

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

/**
 * Strips EXIF/GPS metadata from an image buffer using sharp,
 * then uploads to DigitalOcean Spaces.
 *
 * @param buffer   - Raw image buffer from file upload
 * @param key      - Storage path e.g. "properties/listing-uuid/photo-1.webp"
 * @param mimeType - Must be jpeg, png, or webp
 * @returns        - Public CDN URL of uploaded file
 */
export async function uploadToSpaces(
  buffer: Buffer,
  key: string,
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

  await getSpacesClient().send(
    new PutObjectCommand({
      Bucket: env.SPACES_BUCKET ?? "",
      Key: key,
      Body: strippedBuffer,
      ContentType: mimeType,
      ACL: "public-read",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return `${env.SPACES_CDN_URL ?? ""}/${key}`;
}

export { spacesClient };
