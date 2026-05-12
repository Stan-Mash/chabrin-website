-- ============================================================
-- Migration: 005_ats_schema_fixes
-- Fixes: FK mismatch (job_id → TEXT slug), adds job_title,
--        interview_at, and removes the broken UUID FK so that
--        applications submitted from Sanity-managed jobs persist.
-- ============================================================

-- 1. Drop the UUID foreign-key — jobs now live in Sanity, not Neon
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_job_id_fkey;

-- 2. Change job_id from UUID to TEXT (stores Sanity slug, e.g. "property-manager")
ALTER TABLE applications ALTER COLUMN job_id TYPE TEXT USING job_id::text;

-- 3. Store the human-readable job title at insert time (denormalised from Sanity)
ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS job_title TEXT NOT NULL DEFAULT '';

-- 4. Timestamp for when an interview is scheduled (set by HR when moving to that stage)
ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS interview_at TIMESTAMPTZ;

-- 5. Fix the listAllJobs application count — JOIN now uses slug not UUID
--    (no DDL needed; handled in application code)

-- 6. Re-index job_id (now text slug)
DROP INDEX IF EXISTS idx_applications_job_id;
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);

-- Backfill job_title from the jobs table for existing records that had a UUID FK
UPDATE applications a
SET job_title = j.title
FROM jobs j
WHERE a.job_id = j.id::text
  AND a.job_title = '';
