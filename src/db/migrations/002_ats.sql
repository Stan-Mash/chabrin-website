-- ============================================================
-- 002_ats.sql — Applicant Tracking System tables
-- Run as: sudo -u postgres psql -d chabrin_public -f 002_ats.sql
-- ============================================================

-- ── jobs ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS jobs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT        NOT NULL UNIQUE,
  title        TEXT        NOT NULL,
  department   TEXT        NOT NULL,
  job_type     TEXT        NOT NULL DEFAULT 'Full-time',
  location     TEXT        NOT NULL DEFAULT 'Nairobi (On-site)',
  summary      TEXT        NOT NULL,
  description  TEXT        NOT NULL,           -- rich markdown / plain text
  requirements TEXT[]      NOT NULL DEFAULT '{}',
  nice_to_have TEXT[]      NOT NULL DEFAULT '{}',
  salary_range TEXT,                            -- e.g. "KES 60,000–80,000/month"
  -- screening questions (JSONB array of {question, required: bool})
  screening_questions JSONB NOT NULL DEFAULT '[]',
  status       TEXT        NOT NULL DEFAULT 'draft'
                           CHECK (status IN ('draft','open','closed','paused')),
  closes_at    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_slug   ON jobs(slug);

-- ── applications ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS applications (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  reference     TEXT        NOT NULL UNIQUE,   -- APP-DEPT-YYYY-XXXXX
  job_id        UUID        NOT NULL REFERENCES jobs(id),
  full_name     TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  phone         TEXT        NOT NULL,
  linkedin_url  TEXT,
  cv_url        TEXT,                           -- DO Spaces path
  cover_letter  TEXT,
  answers       JSONB       NOT NULL DEFAULT '{}',  -- {question: answer, ...}
  stage         TEXT        NOT NULL DEFAULT 'applied'
                            CHECK (stage IN (
                              'applied','reviewing','shortlisted',
                              'interview_scheduled','interviewed',
                              'offer_extended','hired','rejected'
                            )),
  rejection_reason TEXT,
  internal_notes   TEXT,
  consent_given    BOOLEAN   NOT NULL DEFAULT false,
  source           TEXT,                        -- utm_source or manual entry
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_reference ON applications(reference);
CREATE INDEX IF NOT EXISTS idx_applications_job_id    ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_stage     ON applications(stage);
CREATE INDEX IF NOT EXISTS idx_applications_email     ON applications(email);

-- ── app_events (full audit trail) ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS app_events (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID        NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  stage_from     TEXT,
  stage_to       TEXT,
  actor          TEXT        NOT NULL DEFAULT 'system',
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_events_application_id ON app_events(application_id);

-- ── Grants ───────────────────────────────────────────────────────────────────

GRANT SELECT, INSERT, UPDATE ON jobs         TO chabrin_web;
GRANT SELECT, INSERT, UPDATE ON applications TO chabrin_web;
GRANT SELECT, INSERT         ON app_events   TO chabrin_web;

-- ── Seed three initial open positions ────────────────────────────────────────

INSERT INTO jobs (slug, title, department, job_type, location, summary, description, requirements, nice_to_have, screening_questions, status)
VALUES
(
  'property-manager',
  'Property Manager',
  'Operations',
  'Full-time',
  'Nairobi (On-site)',
  'Oversee a portfolio of residential and commercial properties. Manage tenant relationships, coordinate maintenance, and ensure client satisfaction across your assigned zones.',
  E'## About the Role\n\nAs a Property Manager at Chabrin Agencies, you will be the primary point of contact between landlords and tenants for your assigned portfolio. You will oversee the day-to-day management of residential and commercial properties across Nairobi, Kiambu, Murang''a, and Kajiado.\n\n## Responsibilities\n\n- Manage a portfolio of 20–40 residential and commercial properties\n- Build and maintain strong relationships with landlords and tenants\n- Coordinate and supervise maintenance and repair works\n- Conduct regular property inspections and prepare reports\n- Handle lease renewals, rent reviews, and tenancy disputes\n- Ensure timely rent collection and reporting to landlords\n- Maintain accurate property records in the CHIPS system\n\n## What We Offer\n\n- Competitive salary + performance-based commission\n- Professional development and training\n- 30+ year industry reputation and career stability\n- Medical cover after probation\n- Transport allowance',
  ARRAY[
    'Diploma or Degree in Real Estate, Property Management, or related field',
    '2+ years experience in property management',
    'Strong communication and negotiation skills',
    'Proficiency in Microsoft Office',
    'Valid driving licence'
  ],
  ARRAY[
    'EARB or ISK membership',
    'Experience with property management software',
    'Knowledge of Landlord & Tenant Act (Kenya)'
  ],
  '[{"question":"Do you hold a valid Kenyan driving licence?","required":true},{"question":"How many properties have you managed simultaneously at your peak?","required":false}]'::jsonb,
  'open'
),
(
  'field-officer',
  'Field Officer',
  'Operations',
  'Full-time',
  'Nairobi (On-site)',
  'Carry out on-site property inspections, coordinate maintenance works, and serve as the primary point of contact for tenants and contractors in the field.',
  E'## About the Role\n\nAs a Field Officer, you will be on the ground ensuring our properties are well-maintained and tenants are well-served. You will work closely with Property Managers to handle day-to-day field operations across assigned zones.\n\n## Responsibilities\n\n- Conduct regular property inspections and document findings with photos\n- Coordinate with contractors and artisans for maintenance and repairs\n- Serve as the first point of contact for urgent tenant issues in the field\n- Verify completed works and approve contractor invoices\n- Assist with tenant move-in and move-out processes\n- Collect and deliver documents between properties and the office\n- Maintain accurate field records and submit daily reports\n\n## What We Offer\n\n- Competitive salary + fuel/transport allowance\n- Company phone and tools\n- Professional development opportunities\n- Stable employment with a 30+ year established company',
  ARRAY[
    'Certificate or Diploma in Real Estate, Building Technology, or related field',
    '1+ years experience in a field-based property or facilities role',
    'Strong interpersonal skills and ability to work independently',
    'Valid driving licence required',
    'Good knowledge of Nairobi and surrounding counties'
  ],
  ARRAY[
    'Basic plumbing or electrical troubleshooting skills',
    'Experience with property inspection reporting',
    'Smartphone proficiency for digital reporting'
  ],
  '[{"question":"Do you hold a valid Kenyan driving licence?","required":true},{"question":"Which areas of Nairobi/Kiambu are you most familiar with?","required":false}]'::jsonb,
  'open'
),
(
  'administrative-assistant',
  'Administrative Assistant',
  'Administration',
  'Full-time',
  'Nairobi (On-site)',
  'Provide front-office and administrative support — managing correspondence, filing, scheduling, and client reception for our Landhies Road head office.',
  E'## About the Role\n\nYou will be the face of Chabrin Agencies at our Nacico Plaza head office, ensuring smooth day-to-day office operations and delivering excellent client service to walk-in landlords and tenants.\n\n## Responsibilities\n\n- Manage front-office reception and handle all walk-in clients professionally\n- Handle all incoming and outgoing correspondence (email, phone, physical mail)\n- Maintain filing systems for lease agreements, landlord files, and tenant records\n- Schedule and coordinate meetings and property viewings\n- Assist the accounts team with basic data entry and invoice filing\n- Prepare standard documents, reports, and presentations\n- Order and manage office supplies\n\n## What We Offer\n\n- Competitive salary\n- Structured onboarding and training\n- Professional working environment\n- Career growth within an established company',
  ARRAY[
    'Diploma in Business Administration, Secretarial Studies, or related field',
    '1+ years office experience',
    'Excellent written and verbal communication in English and Swahili',
    'Organised, detail-oriented, and professional',
    'Proficiency in Microsoft Office (Word, Excel, Outlook)'
  ],
  ARRAY[
    'Experience in a real estate or property management office',
    'Basic bookkeeping or Quickbooks knowledge'
  ],
  '[{"question":"Are you fluent in both English and Swahili?","required":true},{"question":"What is your expected monthly salary (KES)?","required":false}]'::jsonb,
  'open'
)
ON CONFLICT (slug) DO NOTHING;
