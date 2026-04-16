-- ============================================================
-- Migration: 001_complaints
-- Table: complaints
-- Purpose: Stores public-facing complaints/issues submitted
--          via chabrinagencies.com. CHIPS polls this table
--          (SELECT WHERE synced_to_chips = false) and pushes
--          status updates back.
-- Run on: chabrin_public database (165.227.138.108)
-- ============================================================

CREATE TABLE IF NOT EXISTS complaints (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Human-readable reference shown to submitter (e.g. CMP-2026-A7K2M)
  reference         VARCHAR(20) UNIQUE NOT NULL,

  -- Who submitted
  submitter_type    VARCHAR(20) NOT NULL CHECK (submitter_type IN ('tenant','landlord','prospective','public')),
  full_name         VARCHAR(255) NOT NULL,
  email             VARCHAR(255) NOT NULL,
  phone             VARCHAR(50)  NOT NULL,
  property_area     VARCHAR(255),           -- area/neighbourhood (no exact address — KDPA)

  -- Issue details
  category          VARCHAR(60)  NOT NULL,  -- maintenance | billing | noise_neighbour | safety | management | general
  subcategory       VARCHAR(100),
  priority          VARCHAR(20)  NOT NULL DEFAULT 'routine'
                                CHECK (priority IN ('emergency','urgent','routine','enquiry')),
  description       TEXT         NOT NULL,

  -- Lifecycle
  status            VARCHAR(30)  NOT NULL DEFAULT 'submitted'
                                CHECK (status IN ('submitted','acknowledged','assigned','in_progress','resolved','closed')),
  internal_notes    TEXT,         -- staff only — never returned to public API
  resolution_notes  TEXT,         -- shown to submitter on resolution

  -- Compliance
  consent_given     BOOLEAN      NOT NULL DEFAULT false,

  -- CHIPS sync flag — set true once CHIPS has ingested the record
  synced_to_chips   BOOLEAN      NOT NULL DEFAULT false,

  -- Timestamps
  submitted_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  acknowledged_at   TIMESTAMPTZ,
  resolved_at       TIMESTAMPTZ,
  closed_at         TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index for status-check API (ref lookup)
CREATE INDEX IF NOT EXISTS idx_complaints_reference ON complaints(reference);

-- Index for CHIPS sync job
CREATE INDEX IF NOT EXISTS idx_complaints_unsynced ON complaints(synced_to_chips, submitted_at)
  WHERE synced_to_chips = false;

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_complaints_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_complaints_updated_at ON complaints;
CREATE TRIGGER trg_complaints_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION update_complaints_updated_at();
