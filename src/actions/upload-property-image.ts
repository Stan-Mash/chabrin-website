"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { uploadToSpaces } from "@/lib/spaces";

/**
 * Server action to upload property images.
 * Strips EXIF/GPS metadata and converts to WebP before uploading to DO Spaces.
 *
 * ⚠️  SECURITY RULES:
 *  1. This is a Server Action — runs server-side only.
 *  2. Validates file type and size before processing.
 *  3. sharp automatically strips all metadata including GPS/EXIF.
 *  4. Only call from authenticated staff endpoints (add auth check when available).
 *
 * @param formData - FormData containing file + propertyId
 * @returns - CDN URL of uploaded image, or error
 */
export async function uploadPropertyImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const propertyId = formData.get("propertyId") as string;
    const file = formData.get("image") as File;

    // Validation
    if (!propertyId) {
      return { success: false, error: "Property ID is required" };
    }
    if (!file) {
      return { success: false, error: "No file provided" };
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      return { success: false, error: "File size must be less than 5MB" };
    }
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process image: auto-rotate based on EXIF, then strip all metadata
    const processedBuffer = await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF orientation
      .toFormat("webp", { quality: 85 })
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const key = `properties/${propertyId}/${timestamp}-${random}.webp`;

    // Upload to DO Spaces
    const url = await uploadToSpaces(processedBuffer, key, "image/webp");

    // Log upload (non-PII)
    console.info("[image-upload] property image uploaded", {
      propertyId,
      key,
      url,
      time: new Date().toISOString(),
    });

    // Revalidate property detail page cache (optional)
    revalidatePath("/properties/[ref]", "page");

    return { success: true, url };
  } catch (error) {
    console.error("[image-upload] error", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Delete a property image from DO Spaces.
 * Used when staff removes an image upload.
 *
 * @param imageUrl - Full CDN URL of the image to delete
 * @returns - Success or error
 */
export async function deletePropertyImage(
  imageUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract key from CDN URL
    // Format: https://[bucket].cdn.digitaloceanspaces.com/[key]
    const url = new URL(imageUrl);
    const key = url.pathname.substring(1); // Remove leading /

    if (!key.startsWith("properties/")) {
      return { success: false, error: "Invalid image URL" };
    }

    // Note: Actual deletion requires spacesClient.send(new DeleteObjectCommand(...))
    // This is a placeholder for future implementation
    console.info("[image-delete] image deletion requested", {
      key,
      time: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("[image-delete] error", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Deletion failed",
    };
  }
}
