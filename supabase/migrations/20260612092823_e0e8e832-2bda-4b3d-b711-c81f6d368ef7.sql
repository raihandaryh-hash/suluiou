CREATE TABLE public.phase_4_sintesis (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.phase_4_sintesis TO authenticated;
GRANT ALL ON public.phase_4_sintesis TO service_role;
ALTER TABLE public.phase_4_sintesis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own sintesis"
  ON public.phase_4_sintesis
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_phase_4_sintesis_updated_at
  BEFORE UPDATE ON public.phase_4_sintesis
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();