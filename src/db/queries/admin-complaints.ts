/**
 * admin-complaints.ts — DB queries for the staff admin panel.
 * Server-side only. Never import from client components.
 *
 * Returns full complaint rows including PII fields.
 * These are only ever used inside /admin/* routes which are
 * protected by the admin session cookie.
 */

import { sql } from "@/lib/db";

export interface AdminComplaint {
  id:               string;
  reference:        string;
  submitter_type:   string;
  full_name:        string;
  email:            string;
  phone:            string;
  property_area:    string | null;
  category:         string;
  subcategory:      string | null;
  priority:         string;
  description:      string;
  status:           string;
  internal_notes:   string | null;
  resolution_notes: string | null;
  consent_given:    boolean;
  submitted_at:     Date;
  acknowledged_at:  Date | null;
  resolved_at:      Date | null;
  closed_at:        Date | null;
  updated_at:       Date;
}

export interface AdminComplaintFilters {
  status?:   string;
  priority?: string;
  category?: string;
  search?:   string;
  page?:     number;
}

const PAGE_SIZE = 25;

export async function listAdminComplaints(
  filters: AdminComplaintFilters = {}
): Promise<{ complaints: AdminComplaint[]; total: number }> {
  const { status, priority, category, search, page = 1 } = filters;
  const offset = (page - 1) * PAGE_SIZE;

  // Build conditions dynamically
  const conditions: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (status && status !== "all") {
    conditions.push(`status = $${i++}`);
    params.push(status);
  }
  if (priority && priority !== "all") {
    conditions.push(`priority = $${i++}`);
    params.push(priority);
  }
  if (category && category !== "all") {
    conditions.push(`category = $${i++}`);
    params.push(category);
  }
  if (search) {
    conditions.push(`(reference ILIKE $${i} OR property_area ILIKE $${i} OR full_name ILIKE $${i})`);
    params.push(`%${search}%`);
    i++;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Using tagged template (sql) with raw interpolation is tricky for dynamic
  // queries — use unsafe for the WHERE clause which we construct ourselves
  // with parameterised values. All user-supplied values go through params[].
  const rows = await sql.unsafe<AdminComplaint[]>(
    `SELECT * FROM complaints ${where}
     ORDER BY
       CASE priority
         WHEN 'emergency' THEN 1
         WHEN 'urgent'    THEN 2
         WHEN 'routine'   THEN 3
         WHEN 'enquiry'   THEN 4
         ELSE 5
       END,
       submitted_at DESC
     LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
    params as import("postgres").ParameterOrJSON<never>[]
  );

  const countRows = await sql.unsafe<{ count: string }[]>(
    `SELECT COUNT(*)::text AS count FROM complaints ${where}`,
    params as import("postgres").ParameterOrJSON<never>[]
  );

  return {
    complaints: rows,
    total:      parseInt(countRows[0]?.count ?? "0", 10),
  };
}

export async function getAdminComplaint(
  reference: string
): Promise<AdminComplaint | null> {
  const rows = await sql<AdminComplaint[]>`
    SELECT * FROM complaints
    WHERE reference = ${reference.toUpperCase().trim()}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function updateComplaintStatus(
  reference:        string,
  status:           string,
  resolution_notes: string | null,
  internal_notes:   string | null
): Promise<void> {
  const now = new Date();

  await sql`
    UPDATE complaints SET
      status           = ${status},
      resolution_notes = ${resolution_notes},
      internal_notes   = ${internal_notes},
      acknowledged_at  = CASE
        WHEN ${status} = 'acknowledged' AND acknowledged_at IS NULL THEN ${now}
        ELSE acknowledged_at
      END,
      resolved_at = CASE
        WHEN ${status} IN ('resolved', 'closed') AND resolved_at IS NULL THEN ${now}
        ELSE resolved_at
      END,
      closed_at = CASE
        WHEN ${status} = 'closed' AND closed_at IS NULL THEN ${now}
        ELSE closed_at
      END
    WHERE reference = ${reference.toUpperCase().trim()}
  `;
}

/** Counts for the dashboard summary cards */
export async function getComplaintSummary(): Promise<{
  total: number;
  open: number;
  emergency: number;
  resolved_today: number;
}> {
  const rows = await sql<{ total: string; open: string; emergency: string; resolved_today: string }[]>`
    SELECT
      COUNT(*)::text AS total,
      COUNT(*) FILTER (WHERE status NOT IN ('resolved','closed'))::text AS open,
      COUNT(*) FILTER (WHERE priority = 'emergency' AND status NOT IN ('resolved','closed'))::text AS emergency,
      COUNT(*) FILTER (WHERE status IN ('resolved','closed') AND resolved_at >= CURRENT_DATE)::text AS resolved_today
    FROM complaints
  `;
  const r = rows[0];
  return {
    total:          parseInt(r?.total          ?? "0", 10),
    open:           parseInt(r?.open           ?? "0", 10),
    emergency:      parseInt(r?.emergency      ?? "0", 10),
    resolved_today: parseInt(r?.resolved_today ?? "0", 10),
  };
}
