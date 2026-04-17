/**
 * applications.ts — DB query functions for ATS applications.
 * Server-side only.
 */

import { sql } from "@/lib/db";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AppStage =
  | "applied"
  | "reviewing"
  | "shortlisted"
  | "interview_scheduled"
  | "interviewed"
  | "offer_extended"
  | "hired"
  | "rejected";

export interface Application {
  id:               string;
  reference:        string;
  job_id:           string;
  full_name:        string;
  email:            string;
  phone:            string;
  linkedin_url:     string | null;
  cv_url:           string | null;
  cover_letter:     string | null;
  answers:          Record<string, string>;
  stage:            AppStage;
  rejection_reason: string | null;
  internal_notes:   string | null;
  consent_given:    boolean;
  source:           string | null;
  submitted_at:     Date;
  updated_at:       Date;
}

export interface ApplicationWithJob extends Application {
  job_title:      string;
  job_department: string;
  job_slug:       string;
}

export interface PublicAppStatus {
  reference:    string;
  stage:        AppStage;
  job_title:    string;
  submitted_at: Date;
  updated_at:   Date;
}

export interface NewApplication {
  reference:    string;
  job_id:       string;
  full_name:    string;
  email:        string;
  phone:        string;
  linkedin_url?: string | null;
  cv_url?:       string | null;
  cover_letter?: string | null;
  answers:       Record<string, string>;
  consent_given: boolean;
  source?:       string | null;
}

// ── Public queries ────────────────────────────────────────────────────────────

/** Public-safe status check — no PII returned */
export async function getApplicationStatus(
  reference: string
): Promise<PublicAppStatus | null> {
  const rows = await sql<PublicAppStatus[]>`
    SELECT a.reference, a.stage, j.title AS job_title,
           a.submitted_at, a.updated_at
    FROM applications a
    JOIN jobs j ON j.id = a.job_id
    WHERE a.reference = ${reference.toUpperCase().trim()}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

// ── Insert ────────────────────────────────────────────────────────────────────

export async function insertApplication(app: NewApplication): Promise<void> {
  await sql`
    INSERT INTO applications (
      reference, job_id, full_name, email, phone,
      linkedin_url, cv_url, cover_letter, answers, consent_given, source
    ) VALUES (
      ${app.reference}, ${app.job_id}, ${app.full_name}, ${app.email}, ${app.phone},
      ${app.linkedin_url ?? null}, ${app.cv_url ?? null}, ${app.cover_letter ?? null},
      ${JSON.stringify(app.answers)}, ${app.consent_given}, ${app.source ?? null}
    )
  `;
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export interface AdminApplicationFilters {
  job_id?:  string;
  stage?:   string;
  search?:  string;
  page?:    number;
}

const PAGE_SIZE = 30;

export async function listAdminApplications(
  filters: AdminApplicationFilters = {}
): Promise<{ applications: ApplicationWithJob[]; total: number }> {
  const { job_id, stage, search, page = 1 } = filters;
  const offset = (page - 1) * PAGE_SIZE;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (job_id) {
    conditions.push(`a.job_id = $${i++}`);
    params.push(job_id);
  }
  if (stage && stage !== "all") {
    conditions.push(`a.stage = $${i++}`);
    params.push(stage);
  }
  if (search) {
    conditions.push(`(a.reference ILIKE $${i} OR a.full_name ILIKE $${i} OR a.email ILIKE $${i})`);
    params.push(`%${search}%`);
    i++;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = await sql.unsafe<ApplicationWithJob[]>(
    `SELECT a.*, j.title AS job_title, j.department AS job_department, j.slug AS job_slug
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     ${where}
     ORDER BY a.submitted_at DESC
     LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
    params as import("postgres").ParameterOrJSON<never>[]
  );

  const countRows = await sql.unsafe<{ count: string }[]>(
    `SELECT COUNT(*)::text AS count FROM applications a JOIN jobs j ON j.id = a.job_id ${where}`,
    params as import("postgres").ParameterOrJSON<never>[]
  );

  return {
    applications: rows,
    total: parseInt(countRows[0]?.count ?? "0", 10),
  };
}

export async function getAdminApplication(
  reference: string
): Promise<ApplicationWithJob | null> {
  const rows = await sql<ApplicationWithJob[]>`
    SELECT a.*, j.title AS job_title, j.department AS job_department, j.slug AS job_slug
    FROM applications a
    JOIN jobs j ON j.id = a.job_id
    WHERE a.reference = ${reference.toUpperCase().trim()}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function updateApplicationStage(
  reference: string,
  stage:     AppStage,
  rejection_reason?: string | null,
  internal_notes?:   string | null
): Promise<void> {
  await sql`
    UPDATE applications SET
      stage            = ${stage},
      rejection_reason = ${rejection_reason ?? null},
      internal_notes   = COALESCE(${internal_notes ?? null}, internal_notes),
      updated_at       = NOW()
    WHERE reference = ${reference.toUpperCase().trim()}
  `;
}

export async function logAppEvent(
  application_id: string,
  stage_from:     string | null,
  stage_to:       string,
  actor:          string,
  note?:          string | null
): Promise<void> {
  await sql`
    INSERT INTO app_events (application_id, stage_from, stage_to, actor, note)
    VALUES (${application_id}, ${stage_from}, ${stage_to}, ${actor}, ${note ?? null})
  `;
}

/** Summary counts for admin dashboard */
export async function getApplicationSummary(): Promise<{
  total:       number;
  new_today:   number;
  shortlisted: number;
  open_jobs:   number;
}> {
  const rows = await sql<{
    total: string; new_today: string; shortlisted: string; open_jobs: string;
  }[]>`
    SELECT
      (SELECT COUNT(*)::text FROM applications) AS total,
      (SELECT COUNT(*)::text FROM applications WHERE submitted_at >= CURRENT_DATE) AS new_today,
      (SELECT COUNT(*)::text FROM applications WHERE stage IN ('shortlisted','interview_scheduled','interviewed','offer_extended')) AS shortlisted,
      (SELECT COUNT(*)::text FROM jobs WHERE status = 'open') AS open_jobs
  `;
  const r = rows[0];
  return {
    total:       parseInt(r?.total       ?? "0", 10),
    new_today:   parseInt(r?.new_today   ?? "0", 10),
    shortlisted: parseInt(r?.shortlisted ?? "0", 10),
    open_jobs:   parseInt(r?.open_jobs   ?? "0", 10),
  };
}
