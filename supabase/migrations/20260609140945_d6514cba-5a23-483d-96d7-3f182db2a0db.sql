CREATE TABLE IF NOT EXISTS public.phase_2a_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.phase_2a_inventory TO authenticated;
GRANT ALL ON public.phase_2a_inventory TO service_role;

ALTER TABLE public.phase_2a_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own phase_2a inventory"
ON public.phase_2a_inventory
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER phase_2a_inventory_touch
BEFORE UPDATE ON public.phase_2a_inventory
FOR EACH ROW EXECUTE FUNCTION public.touch_assessment_progress();