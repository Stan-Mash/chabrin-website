/**
 * Core type definitions for the Chabrin website.
 *
 * SECURITY NOTE:
 *  - PublicListing deliberately excludes: landlord name, exact address,
 *    GPS coordinates, LR number, CHIPS internal IDs.
 *  - Only zone and area are exposed (KRA eRITS + KDPA compliance).
 */

// ── Property Listings ──────────────────────────────────────────────────────────

export type PropertyType =
  | "apartment"
  | "townhouse"
  | "villa"
  | "office"
  | "retail"
  | "warehouse"
  | "land";

export type PropertyStatus = "available" | "let" | "under_offer";

/**
 * Safe public representation of a property listing.
 * This is what the website renders — no sensitive fields.
 */
export interface PublicListing {
  id: string;              // UUID — not CHIPS internal ID
  reference: string;       // e.g. "CAL-NBO-2024-001" — safe to display
  title: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  zone: string;            // e.g. "Westlands", "Karen", "Kilimani"
  area: string;            // e.g. "Lavington", "Spring Valley"
  bedrooms: number | null;
  bathrooms: number | null;
  sizeM2: number | null;
  rentKes: number;
  depositKes: number;
  features: string[];
  images: string[];        // CDN URLs from DO Spaces (EXIF-stripped)
  publishedAt: string;     // ISO date string
  updatedAt: string;
}

// ── Lead / Contact Form ────────────────────────────────────────────────────────

export interface LeadSubmission {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyRef?: string;
  turnstileToken: string;
  locale: "en" | "sw";
  consentGiven: boolean;   // KDPA consent — must be true to submit
}

export interface LeadResponse {
  success: boolean;
  message: string;
}

// ── Locale ─────────────────────────────────────────────────────────────────────

export type Locale = "en" | "sw";

// ── Navigation ─────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

// ── API Response Wrapper ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}
