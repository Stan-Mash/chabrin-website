-- Migration 008: store academic/supporting documents submitted at application time
-- Array of { name, url, size } objects uploaded to Vercel Blob.
ALTER TABLE applications ADD COLUMN IF NOT EXISTS documents JSONB NOT NULL DEFAULT '[]';
