CREATE TABLE public.phase_2b_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.phase_2b_skills TO authenticated;
GRANT ALL ON public.phase_2b_skills TO service_role;

ALTER TABLE public.phase_2b_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own phase_2b_skills"
  ON public.phase_2b_skills
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER phase_2b_skills_touch
  BEFORE UPDATE ON public.phase_2b_skills
  FOR EACH ROW EXECUTE FUNCTION public.touch_assessment_progress();