-- Clean potential duplicates before adding unique constraints
DELETE FROM public.assessment_progress a
USING public.assessment_progress b
WHERE a.ctid < b.ctid
  AND a.user_id IS NOT NULL
  AND a.user_id = b.user_id;

DELETE FROM public.assessment_progress a
USING public.assessment_progress b
WHERE a.ctid < b.ctid
  AND a.user_id IS NULL
  AND b.user_id IS NULL
  AND a.guest_identifier IS NOT NULL
  AND a.guest_identifier = b.guest_identifier
  AND a.class_id IS NOT DISTINCT FROM b.class_id;

-- Unique partial indexes (handle NULLs correctly via partial WHERE)
CREATE UNIQUE INDEX IF NOT EXISTS assessment_progress_user_id_key
  ON public.assessment_progress (user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS assessment_progress_guest_class_key
  ON public.assessment_progress (guest_identifier, class_id)
  WHERE user_id IS NULL AND guest_identifier IS NOT NULL;

-- New flag for email delivery request
ALTER TABLE public.assessment_results
  ADD COLUMN IF NOT EXISTS email_requested boolean NOT NULL DEFAULT false;