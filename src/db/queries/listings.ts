import { sql } from "@/lib/db";

/**
 * Database queries for property listings.
 * These functions execute on the server only and query the chabrin_public PostgreSQL database.
 *
 * ⚠️  ARCHITECTURE:
 *  - All queries are read-only from the website's perspective
 *  - Listings are pushed by CHIPS sync job, not written by this app
 *  - Results are typed and validated before rendering
 */

export interface ListingRow {
  id: string;
  reference: string;
  title: string;
  property_type: "apartment" | "townhouse" | "villa" | "office" | "retail" | "warehouse" | "land";
  status: "available" | "let" | "under_offer";
  zone: string;
  area: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size_m2: number | null;
  rent_kes: number;
  deposit_kes: number;
  features: string[];
  images: string[];
  published_at: string;
  updated_at: string;
}

/**
 * Fetch all published listings with optional filtering.
 * Supports filtering by zone and property type.
 * Results are ordered by published_at DESC (newest first).
 *
 * @param zone - Optional zone filter (e.g., "Westlands", "Karen")
 * @param propertyType - Optional property type filter (e.g., "apartment")
 * @param limit - Max results to return (default: 50)
 * @param offset - Pagination offset (default: 0)
 * @returns Array of published listings
 */
export async function getPublishedListings(
  zone?: string,
  propertyType?: string,
  limit = 50,
  offset = 0
): Promise<ListingRow[]> {
  let query = `
    SELECT 
      id, reference, title, property_type, status, zone, area,
      bedrooms, bathrooms, size_m2, rent_kes, deposit_kes,
      features, images, published_at, updated_at
    FROM public_listings
    WHERE status = 'available' AND published_at IS NOT NULL
  `;

  const params: (string | number)[] = [];

  if (zone) {
    params.push(zone);
    query += ` AND zone = $${params.length}`;
  }

  if (propertyType) {
    params.push(propertyType);
    query += ` AND property_type = $${params.length}`;
  }

  query += ` ORDER BY published_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  return sql<ListingRow[]>(query, params);
}

/**
 * Fetch a single listing by reference ID.
 * Used for property detail pages.
 *
 * @param reference - Property reference (e.g., "CAL-NBO-2024-001")
 * @returns Single listing or null if not found
 */
export async function getListingByReference(
  reference: string
): Promise<ListingRow | null> {
  const results = await sql<ListingRow[]>(
    `
    SELECT 
      id, reference, title, property_type, status, zone, area,
      bedrooms, bathrooms, size_m2, rent_kes, deposit_kes,
      features, images, published_at, updated_at
    FROM public_listings
    WHERE reference = $1 AND published_at IS NOT NULL
    LIMIT 1
    `,
    [reference]
  );

  return results.length > 0 ? results[0] : null;
}

/**
 * Get unique zones for filtering UI.
 * Returns all zones that have at least one published listing.
 *
 * @returns Array of zone names sorted alphabetically
 */
export async function getAvailableZones(): Promise<string[]> {
  const results = await sql<{ zone: string }[]>(
    `
    SELECT DISTINCT zone 
    FROM public_listings
    WHERE published_at IS NOT NULL
    ORDER BY zone ASC
    `
  );

  return results.map((r) => r.zone);
}

/**
 * Get unique property types for filtering UI.
 * Returns all types that have at least one published listing.
 *
 * @returns Array of property type names
 */
export async function getAvailablePropertyTypes(): Promise<string[]> {
  const results = await sql<{ property_type: string }[]>(
    `
    SELECT DISTINCT property_type
    FROM public_listings
    WHERE published_at IS NOT NULL
    ORDER BY property_type ASC
    `
  );

  return results.map((r) => r.property_type);
}

/**
 * Count total available listings.
 * Used for pagination and stats display.
 *
 * @param zone - Optional zone filter
 * @param propertyType - Optional property type filter
 * @returns Total count of matching published listings
 */
export async function countAvailableListings(
  zone?: string,
  propertyType?: string
): Promise<number> {
  let query = `
    SELECT COUNT(*) as count
    FROM public_listings
    WHERE status = 'available' AND published_at IS NOT NULL
  `;

  const params: (string | number)[] = [];

  if (zone) {
    params.push(zone);
    query += ` AND zone = $${params.length}`;
  }

  if (propertyType) {
    params.push(propertyType);
    query += ` AND property_type = $${params.length}`;
  }

  const results = await sql<{ count: number }[]>(query, params);
  return results[0]?.count ?? 0;
}
