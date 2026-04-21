ALTER TABLE public.assessment_results
ADD COLUMN IF NOT EXISTS student_class TEXT,
ADD COLUMN IF NOT EXISTS province TEXT;