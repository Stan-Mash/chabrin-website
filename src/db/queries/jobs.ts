/**
 * jobs.ts — DB query functions for the jobs/ATS tables.
 * Server-side only.
 */

import { sql } from "@/lib/db";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Job {
  id:                  string;
  slug:                string;
  title:               string;
  department:          string;
  job_type:            string;
  location:            string;
  summary:             string;
  description:         string;
  requirements:        string[];
  nice_to_have:        string[];
  salary_range:        string | null;
  screening_questions: ScreeningQuestion[];
  status:              "draft" | "open" | "closed" | "paused";
  closes_at:           Date | null;
  created_at:          Date;
  updated_at:          Date;
}

export interface ScreeningQuestion {
  question: string;
  required: boolean;
}

export interface JobSummary {
  id:         string;
  slug:       string;
  title:      string;
  department: string;
  job_type:   string;
  location:   string;
  summary:    string;
  status:     string;
  closes_at:  Date | null;
  created_at: Date;
  application_count?: number;
}

export interface NewJob {
  slug:                string;
  title:               string;
  department:          string;
  job_type:            string;
  location:            string;
  summary:             string;
  description:         string;
  requirements:        string[];
  nice_to_have:        string[];
  salary_range?:       string | null;
  screening_questions: ScreeningQuestion[];
  status:              "draft" | "open" | "closed" | "paused";
  closes_at?:          Date | null;
}

// ── Public queries ────────────────────────────────────────────────────────────

/** All open jobs for the public careers page */
export async function listOpenJobs(): Promise<JobSummary[]> {
  return sql<JobSummary[]>`
    SELECT id, slug, title, department, job_type, location, summary,
           status, closes_at, created_at
    FROM jobs
    WHERE status = 'open'
      AND (closes_at IS NULL OR closes_at > NOW())
    ORDER BY created_at DESC
  `;
}

/** Single job by slug — public */
export async function getJobBySlug(slug: string): Promise<Job | null> {
  const rows = await sql<Job[]>`
    SELECT * FROM jobs
    WHERE slug = ${slug.toLowerCase().trim()}
      AND status = 'open'
      AND (closes_at IS NULL OR closes_at > NOW())
    LIMIT 1
  `;
  return rows[0] ?? null;
}

// ── Admin queries ─────────────────────────────────────────────────────────────

/** All jobs for admin — all statuses */
export async function listAllJobs(): Promise<(JobSummary & { application_count: number })[]> {
  return sql<(JobSummary & { application_count: number })[]>`
    SELECT j.id, j.slug, j.title, j.department, j.job_type, j.location,
           j.summary, j.status, j.closes_at, j.created_at,
           COUNT(a.id)::int AS application_count
    FROM jobs j
    LEFT JOIN applications a ON a.job_id = j.id
    GROUP BY j.id
    ORDER BY j.created_at DESC
  `;
}

/** Full job row for admin edit */
export async function getJobById(id: string): Promise<Job | null> {
  const rows = await sql<Job[]>`
    SELECT * FROM jobs WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ?? null;
}

/** Insert a new job */
export async function insertJob(j: NewJob): Promise<string> {
  const rows = await sql<{ id: string }[]>`
    INSERT INTO jobs (
      slug, title, department, job_type, location, summary, description,
      requirements, nice_to_have, salary_range, screening_questions, status, closes_at
    ) VALUES (
      ${j.slug}, ${j.title}, ${j.department}, ${j.job_type}, ${j.location},
      ${j.summary}, ${j.description}, ${j.requirements}, ${j.nice_to_have},
      ${j.salary_range ?? null}, ${JSON.stringify(j.screening_questions)},
      ${j.status}, ${j.closes_at ?? null}
    )
    RETURNING id
  `;
  return rows[0].id;
}

/** Update a job */
export async function updateJob(id: string, j: Partial<NewJob>): Promise<void> {
  await sql`
    UPDATE jobs SET
      title               = COALESCE(${j.title ?? null}, title),
      department          = COALESCE(${j.department ?? null}, department),
      job_type            = COALESCE(${j.job_type ?? null}, job_type),
      location            = COALESCE(${j.location ?? null}, location),
      summary             = COALESCE(${j.summary ?? null}, summary),
      description         = COALESCE(${j.description ?? null}, description),
      requirements        = COALESCE(${j.requirements ?? null}, requirements),
      nice_to_have        = COALESCE(${j.nice_to_have ?? null}, nice_to_have),
      salary_range        = COALESCE(${j.salary_range ?? null}, salary_range),
      screening_questions = COALESCE(${j.screening_questions ? JSON.stringify(j.screening_questions) : null}, screening_questions),
      status              = COALESCE(${j.status ?? null}, status),
      closes_at           = COALESCE(${j.closes_at ?? null}, closes_at),
      updated_at          = NOW()
    WHERE id = ${id}
  `;
}
