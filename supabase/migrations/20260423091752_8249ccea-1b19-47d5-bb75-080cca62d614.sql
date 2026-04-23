ALTER TABLE public.assessment_results
ADD COLUMN IF NOT EXISTS lm_name TEXT,
ADD COLUMN IF NOT EXISTS lm_id TEXT;

COMMENT ON COLUMN public.assessment_results.lm_name IS 'Name of the Learning Mentor who ran this session';
COMMENT ON COLUMN public.assessment_results.lm_id IS 'Identifier of the Learning Mentor';