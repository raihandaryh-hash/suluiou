ALTER TABLE public.assessment_results 
  ADD COLUMN IF NOT EXISTS selected_pathways JSONB;