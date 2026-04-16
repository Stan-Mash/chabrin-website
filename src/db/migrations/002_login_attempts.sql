-- ============================================================
-- Migration: 002_login_attempts
-- Table: admin_login_attempts
-- Purpose: Tracks failed admin login attempts per IP address
--          for brute-force protection. Replaces the in-process
--          Map store in admin-auth.ts so that rate limits are
--          shared across PM2 instances and survive restarts.
-- Run on: chabrin_public database (165.227.138.108)
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  ip            VARCHAR(45)  PRIMARY KEY,  -- IPv4 or IPv6
  count         INTEGER      NOT NULL DEFAULT 0,
  first_fail_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  locked_at     TIMESTAMPTZ
);

-- Allow quick cleanup of expired windows
CREATE INDEX IF NOT EXISTS idx_login_attempts_first_fail
  ON admin_login_attempts(first_fail_at);
