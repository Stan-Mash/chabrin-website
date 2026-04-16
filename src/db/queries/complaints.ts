/**
 * complaints.ts — DB query functions for the complaints table.
 *
 * ARCHITECTURE NOTE:
 *   The website WRITES complaints (it is the source of truth for them).
 *   CHIPS READS complaints via a scheduled poll (synced_to_chips = false).
 *   CHIPS WRITES status updates back (status, resolution_notes, *_at timestamps).
 *   This is the reverse of the listings flow but uses the same chabrin_public DB.
 *
 * SECURITY:
 *   - Never return internal_notes to any public-facing query.
 *   - Never log PII fields.
 *   - status-check API returns only non-PII fields (status, category, submitted_at).
 */

import { sql } from "@/lib/db";

// ── Types ────────────────────────────────────────────────────────────────────

export interface NewComplaint {
  reference:      string;
  submitter_type: "tenant" | "landlord" | "prospective" | "public";
  full_name:      string;
  email:          string;
  phone:          string;
  property_area?: string;
  category:       string;
  subcategory?:   string;
  priority:       "emergency" | "urgent" | "routine" | "enquiry";
  description:    string;
  consent_given:  boolean;
}

/** Safe public-facing status — no PII, no internal notes */
export interface ComplaintStatus {
  reference:     string;
  category:      string;
  priority:      string;
  status:        string;
  submitted_at:  Date;
  acknowledged_at: Date | null;
  resolved_at:   Date | null;
  resolution_notes: string | null;
}

// ── Insert ────────────────────────────────────────────────────────────────────

export async function insertComplaint(c: NewComplaint): Promise<string> {
  await sql`
    INSERT INTO complaints (
      reference, submitter_type, full_name, email, phone,
      property_area, category, subcategory, priority,
      description, consent_given
    ) VALUES (
      ${c.reference}, ${c.submitter_type}, ${c.full_name}, ${c.email}, ${c.phone},
      ${c.property_area ?? null}, ${c.category}, ${c.subcategory ?? null}, ${c.priority},
      ${c.description}, ${c.consent_given}
    )
  `;
  return c.reference;
}

// ── Status check ──────────────────────────────────────────────────────────────

export async function getComplaintStatus(
  reference: string
): Promise<ComplaintStatus | null> {
  const rows = await sql<ComplaintStatus[]>`
    SELECT
      reference,
      category,
      priority,
      status,
      submitted_at,
      acknowledged_at,
      resolved_at,
      resolution_notes
    FROM complaints
    WHERE reference = ${reference.toUpperCase().trim()}
    LIMIT 1
  `;
  return rows[0] ?? null;
}
