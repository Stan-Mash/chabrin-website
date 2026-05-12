-- Migration 007: expand stage CHECK constraint for waiting list and offer outcomes
-- New stages:
--   waiting_list   – interviewed well; no current vacancy; held for future openings
--   offer_accepted – candidate accepted the extended offer (before formal hire)
--   offer_declined – candidate declined the offer

-- PostgreSQL does not support ALTER CHECK in-place; drop and recreate.
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_stage_check;

ALTER TABLE applications ADD CONSTRAINT applications_stage_check CHECK (stage IN (
  'applied', 'reviewing', 'shortlisted',
  'interview_scheduled', 'interviewed',
  'offer_extended', 'offer_accepted', 'offer_declined',
  'hired', 'rejected', 'waiting_list'
));

-- Partial index for fast waiting-list queries
CREATE INDEX IF NOT EXISTS idx_applications_waiting_list
  ON applications(submitted_at DESC)
  WHERE stage = 'waiting_list';
