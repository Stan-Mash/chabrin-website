-- ============================================================
-- Migration: 004_cv_upload
-- Adds signed CV upload token + Gemini AI summary to applications.
-- ============================================================

-- Signed upload token (HMAC-SHA256, single-use — expires 7 days)
ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS cv_upload_token TEXT,
  ADD COLUMN IF NOT EXISTS cv_upload_expires_at TIMESTAMPTZ;

-- AI-generated summary (structured JSON from Gemini)
ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS ai_summary JSONB;

CREATE INDEX IF NOT EXISTS idx_applications_cv_upload_token ON applications(cv_upload_token)
  WHERE cv_upload_token IS NOT NULL;
