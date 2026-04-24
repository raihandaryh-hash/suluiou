ALTER TABLE public.assessment_results
  ADD COLUMN IF NOT EXISTS parent_consent BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS parent_phone TEXT,
  ADD COLUMN IF NOT EXISTS parent_name TEXT;

ALTER TABLE public.assessment_progress
  ADD COLUMN IF NOT EXISTS consent_given BOOLEAN NOT NULL DEFAULT false;