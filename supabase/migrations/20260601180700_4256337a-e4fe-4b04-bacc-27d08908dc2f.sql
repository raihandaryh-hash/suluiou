CREATE TABLE public.kenali_dirimu_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  wa_number TEXT,
  values_sorted TEXT[],
  possible_selves JSONB,
  odyssey_plans JSONB,
  ai_narrative TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_kenali_dirimu_sessions_session_id ON public.kenali_dirimu_sessions(session_id);

GRANT SELECT, INSERT, UPDATE ON public.kenali_dirimu_sessions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.kenali_dirimu_sessions TO authenticated;
GRANT ALL ON public.kenali_dirimu_sessions TO service_role;

ALTER TABLE public.kenali_dirimu_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create kd session"
ON public.kenali_dirimu_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can read kd sessions"
ON public.kenali_dirimu_sessions
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can update kd sessions"
ON public.kenali_dirimu_sessions
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can delete kd sessions"
ON public.kenali_dirimu_sessions
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE TRIGGER kenali_dirimu_sessions_touch
BEFORE UPDATE ON public.kenali_dirimu_sessions
FOR EACH ROW
EXECUTE FUNCTION public.site_content_touch();