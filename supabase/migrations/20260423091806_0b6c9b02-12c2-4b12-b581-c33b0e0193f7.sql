CREATE TABLE IF NOT EXISTS public.province_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province TEXT NOT NULL UNIQUE,
  economic_sectors TEXT[] DEFAULT '{}',
  opportunities_2030 TEXT,
  social_context TEXT,
  narrative_hooks TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.province_contexts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read province_contexts" ON public.province_contexts
  FOR SELECT USING (true);

CREATE POLICY "Admin write province_contexts" ON public.province_contexts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );