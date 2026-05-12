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
  | "offer_accepted"
  | "offer_declined"
  | "hired"
  | "rejected"
  | "waiting_list";

export interface Application {
  id:                   string;
  reference:            string;
  job_id:               string;
  job_title:            string;
  full_name:            string;
  email:                string;
  phone:                string;
  linkedin_url:         string | null;
  cv_url:               string | null;
  cover_letter:         string | null;
  answers:              Record<string, string>;
  stage:                AppStage;
  rejection_reason:     string | null;
  internal_notes:       string | null;
  consent_given:        boolean;
  source:               string | null;
  interview_at:         Date | null;
  meet_link:            string | null;
  submitted_at:         Date;
  updated_at:           Date;
  cv_upload_token:      string | null;
  cv_upload_expires_at: Date | null;
  ai_summary:           Record<string, unknown> | null;
}

export interface ApplicationWithJob extends Application {
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

export interface AppEvent {
  id:             string;
  application_id: string;
  stage_from:     string | null;
  stage_to:       string;
  actor:          string;
  note:           string | null;
  created_at:     Date;
}

export interface NewApplication {
  reference:    string;
  job_id:       string;
  job_title:    string;
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
    SELECT a.reference, a.stage,
           COALESCE(j.title, a.job_title, a.job_id) AS job_title,
           a.submitted_at, a.updated_at
    FROM applications a
    LEFT JOIN jobs j ON j.slug = a.job_id
    WHERE a.reference = ${reference.toUpperCase().trim()}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

// ── Insert & duplicate check ──────────────────────────────────────────────────

/**
 * Returns true if an active (non-rejected) application already exists for
 * this job + email combination — prevents duplicate submissions.
 */
export async function checkDuplicateApplication(
  job_id: string,
  email:  string
): Promise<boolean> {
  const rows = await sql<{ exists: string }[]>`
    SELECT COUNT(*)::text AS exists
    FROM applications
    WHERE job_id = ${job_id}
      AND email  = ${email.toLowerCase().trim()}
      AND stage NOT IN ('rejected')
    LIMIT 1
  `;
  return parseInt(rows[0]?.exists ?? "0", 10) > 0;
}

export async function insertApplication(app: NewApplication): Promise<void> {
  await sql`
    INSERT INTO applications (
      reference, job_id, job_title, full_name, email, phone,
      linkedin_url, cv_url, cover_letter, answers, consent_given, source
    ) VALUES (
      ${app.reference}, ${app.job_id}, ${app.job_title},
      ${app.full_name}, ${app.email}, ${app.phone},
      ${app.linkedin_url ?? null}, ${app.cv_url ?? null}, ${app.cover_letter ?? null},
      ${JSON.stringify(app.answers)}, ${app.consent_given}, ${app.source ?? null}
    )
  `;
}

// ── Admin queries ─────────────────────────────────────────────────────────────

export interface AdminApplicationFilters {
  job_slug?: string;
  stage?:    string;
  search?:   string;
  page?:     number;
}

const PAGE_SIZE = 30;

export async function listAdminApplications(
  filters: AdminApplicationFilters = {}
): Promise<{ applications: ApplicationWithJob[]; total: number }> {
  const { job_slug, stage, search, page = 1 } = filters;
  const safePage = Math.max(1, isNaN(page) ? 1 : page);
  const offset   = (safePage - 1) * PAGE_SIZE;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (job_slug) {
    conditions.push(`a.job_id = $${i++}`);
    params.push(job_slug);
  }
  if (stage && stage !== "all") {
    conditions.push(`a.stage = $${i++}`);
    params.push(stage);
  }
  if (search) {
    conditions.push(
      `(a.reference ILIKE $${i} OR a.full_name ILIKE $${i} OR a.email ILIKE $${i})`
    );
    params.push(`%${search}%`);
    i++;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = await sql.unsafe<ApplicationWithJob[]>(
    `SELECT a.*,
            COALESCE(j.title,      a.job_title, a.job_id) AS job_title,
            COALESCE(j.department, a.job_id)              AS job_department,
            COALESCE(j.slug,       a.job_id)              AS job_slug
     FROM applications a
     LEFT JOIN jobs j ON j.slug = a.job_id
     ${where}
     ORDER BY a.submitted_at DESC
     LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
    params as import("postgres").ParameterOrJSON<never>[]
  );

  const countRows = await sql.unsafe<{ count: string }[]>(
    `SELECT COUNT(*)::text AS count FROM applications a ${where}`,
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
    SELECT a.*,
           COALESCE(j.title,      a.job_title, a.job_id) AS job_title,
           COALESCE(j.department, a.job_id)              AS job_department,
           COALESCE(j.slug,       a.job_id)              AS job_slug
    FROM applications a
    LEFT JOIN jobs j ON j.slug = a.job_id
    WHERE a.reference = ${reference.toUpperCase().trim()}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function updateApplicationStage(
  reference:        string,
  stage:            AppStage,
  rejection_reason?: string | null,
  internal_notes?:   string | null
): Promise<void> {
  await sql`
    UPDATE applications SET
      stage            = ${stage},
      rejection_reason = COALESCE(${rejection_reason ?? null}, rejection_reason),
      internal_notes   = COALESCE(${internal_notes ?? null}, internal_notes),
      interview_at     = CASE
                           WHEN ${stage} = 'interview_scheduled' AND ${null}::timestamptz IS NOT NULL
                           THEN ${null}::timestamptz
                           ELSE interview_at
                         END,
      updated_at       = NOW()
    WHERE reference = ${reference.toUpperCase().trim()}
  `;
}

export async function setInterviewDetails(
  reference:    string,
  interview_at: Date | null,
  meet_link?:   string | null
): Promise<void> {
  await sql`
    UPDATE applications
    SET interview_at = ${interview_at},
        meet_link    = COALESCE(${meet_link ?? null}, meet_link),
        updated_at   = NOW()
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

/** Fetch the full audit trail for one application (newest first). */
export async function getAppEvents(application_id: string): Promise<AppEvent[]> {
  return sql<AppEvent[]>`
    SELECT id, application_id, stage_from, stage_to, actor, note, created_at
    FROM app_events
    WHERE application_id = ${application_id}
    ORDER BY created_at DESC
  `;
}

// ── CV upload token ───────────────────────────────────────────────────────────

export async function getApplicationByUploadToken(
  token: string
): Promise<Application | null> {
  const rows = await sql<Application[]>`
    SELECT * FROM applications
    WHERE cv_upload_token = ${token}
      AND cv_upload_expires_at > NOW()
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function setUploadToken(
  reference: string,
  token:     string,
  expiresAt: Date
): Promise<void> {
  await sql`
    UPDATE applications
    SET cv_upload_token      = ${token},
        cv_upload_expires_at = ${expiresAt},
        updated_at           = NOW()
    WHERE reference = ${reference.toUpperCase().trim()}
  `;
}

export async function saveUploadedCv(
  reference: string,
  cvUrl:     string
): Promise<void> {
  await sql`
    UPDATE applications
    SET cv_url               = ${cvUrl},
        cv_upload_token      = NULL,
        cv_upload_expires_at = NULL,
        updated_at           = NOW()
    WHERE reference = ${reference.toUpperCase().trim()}
  `;
}

export async function saveAiSummary(
  reference: string,
  summary:   Record<string, unknown>
): Promise<void> {
  await sql`
    UPDATE applications
    SET ai_summary = ${JSON.stringify(summary)},
        updated_at = NOW()
    WHERE reference = ${reference.toUpperCase().trim()}
  `;
}

// ── Dashboard counts ──────────────────────────────────────────────────────────

export async function getApplicationSummary(): Promise<{
  total:        number;
  new_today:    number;
  shortlisted:  number;
  waiting_list: number;
}> {
  const rows = await sql<{
    total: string; new_today: string; shortlisted: string; waiting_list: string;
  }[]>`
    SELECT
      (SELECT COUNT(*)::text FROM applications)                                                                                     AS total,
      (SELECT COUNT(*)::text FROM applications WHERE submitted_at >= CURRENT_DATE)                                                  AS new_today,
      (SELECT COUNT(*)::text FROM applications WHERE stage IN ('shortlisted','interview_scheduled','interviewed','offer_extended'))  AS shortlisted,
      (SELECT COUNT(*)::text FROM applications WHERE stage = 'waiting_list')                                                        AS waiting_list
  `;
  const r = rows[0];
  return {
    total:        parseInt(r?.total        ?? "0", 10),
    new_today:    parseInt(r?.new_today    ?? "0", 10),
    shortlisted:  parseInt(r?.shortlisted  ?? "0", 10),
    waiting_list: parseInt(r?.waiting_list ?? "0", 10),
  };
}

// ── Talent pool ───────────────────────────────────────────────────────────────

export interface TalentPoolEntry extends ApplicationWithJob {
  days_in_pool: number;
}

export interface TalentPoolFilters {
  search?:     string;
  stage?:      string;
  department?: string;
  page?:       number;
}

const POOL_PAGE_SIZE = 40;

export async function listTalentPool(
  filters: TalentPoolFilters = {}
): Promise<{ entries: TalentPoolEntry[]; total: number }> {
  const { search, stage, department, page = 1 } = filters;
  const safePage = Math.max(1, isNaN(page) ? 1 : page);
  const offset   = (safePage - 1) * POOL_PAGE_SIZE;

  const conditions: string[] = [
    `a.stage IN ('waiting_list','interviewed','offer_declined','offer_accepted')`
  ];
  const params: unknown[] = [];
  let i = 1;

  if (stage && stage !== "all") {
    conditions.push(`a.stage = $${i++}`);
    params.push(stage);
  }
  if (department) {
    conditions.push(`COALESCE(j.department, a.job_id) ILIKE $${i++}`);
    params.push(`%${department}%`);
  }
  if (search) {
    conditions.push(`(a.reference ILIKE $${i} OR a.full_name ILIKE $${i} OR a.email ILIKE $${i})`);
    params.push(`%${search}%`);
    i++;
  }

  const where = `WHERE ${conditions.join(" AND ")}`;

  const rows = await sql.unsafe<TalentPoolEntry[]>(
    `SELECT a.*,
            COALESCE(j.title,      a.job_title, a.job_id) AS job_title,
            COALESCE(j.department, a.job_id)              AS job_department,
            COALESCE(j.slug,       a.job_id)              AS job_slug,
            EXTRACT(DAY FROM NOW() - a.updated_at)::int   AS days_in_pool
     FROM applications a
     LEFT JOIN jobs j ON j.slug = a.job_id
     ${where}
     ORDER BY
       CASE a.stage
         WHEN 'waiting_list'   THEN 1
         WHEN 'offer_declined' THEN 2
         WHEN 'interviewed'    THEN 3
         ELSE 4
       END,
       a.updated_at DESC
     LIMIT ${POOL_PAGE_SIZE} OFFSET ${offset}`,
    params as import("postgres").ParameterOrJSON<never>[]
  );

  const countRows = await sql.unsafe<{ count: string }[]>(
    `SELECT COUNT(*)::text AS count FROM applications a LEFT JOIN jobs j ON j.slug = a.job_id ${where}`,
    params as import("postgres").ParameterOrJSON<never>[]
  );

  return {
    entries: rows,
    total:   parseInt(countRows[0]?.count ?? "0", 10),
  };
}

export async function getAdminStats(): Promise<{
  total:              number;
  new_today:          number;
  pending_complaints: number;
  waiting_list:       number;
}> {
  const rows = await sql<{
    total: string; new_today: string; pending_complaints: string; waiting_list: string;
  }[]>`
    SELECT
      (SELECT COUNT(*)::text FROM applications)                                             AS total,
      (SELECT COUNT(*)::text FROM applications WHERE submitted_at >= CURRENT_DATE)         AS new_today,
      (SELECT COUNT(*)::text FROM complaints WHERE status NOT IN ('resolved','closed'))    AS pending_complaints,
      (SELECT COUNT(*)::text FROM applications WHERE stage = 'waiting_list')               AS waiting_list
  `;
  const r = rows[0];
  return {
    total:              parseInt(r?.total              ?? "0", 10),
    new_today:          parseInt(r?.new_today          ?? "0", 10),
    pending_complaints: parseInt(r?.pending_complaints ?? "0", 10),
    waiting_list:       parseInt(r?.waiting_list       ?? "0", 10),
  };
}
