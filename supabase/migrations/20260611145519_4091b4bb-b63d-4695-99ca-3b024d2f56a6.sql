CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.phase_3_jalan_bakti (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.phase_3_jalan_bakti TO authenticated;
GRANT ALL ON public.phase_3_jalan_bakti TO service_role;
ALTER TABLE public.phase_3_jalan_bakti ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own jalan bakti"
  ON public.phase_3_jalan_bakti
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_phase_3_jalan_bakti_updated_at
  BEFORE UPDATE ON public.phase_3_jalan_bakti
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();