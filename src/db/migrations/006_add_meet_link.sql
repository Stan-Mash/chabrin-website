-- Migration 006: add meet_link to applications
-- Stores the Google Meet (or any video call) URL set by HR when scheduling an interview.

ALTER TABLE applications ADD COLUMN IF NOT EXISTS meet_link TEXT;
