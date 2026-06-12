CREATE TABLE public.phase_5_action_plan (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.phase_5_action_plan TO authenticated;
GRANT ALL ON public.phase_5_action_plan TO service_role;
ALTER TABLE public.phase_5_action_plan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own action plan"
  ON public.phase_5_action_plan FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own action plan"
  ON public.phase_5_action_plan FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own action plan"
  ON public.phase_5_action_plan FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own action plan"
  ON public.phase_5_action_plan FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_phase_5_action_plan_updated_at
  BEFORE UPDATE ON public.phase_5_action_plan
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();