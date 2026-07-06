CREATE TABLE public.bridge_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_text TEXT NOT NULL,
  question_text TEXT NOT NULL,
  province TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'done')),
  matched_lm_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.bridge_requests TO authenticated;
GRANT ALL ON public.bridge_requests TO service_role;
ALTER TABLE public.bridge_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bridge requests"
  ON public.bridge_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bridge requests"
  ON public.bridge_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all bridge requests"
  ON public.bridge_requests FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update bridge requests"
  ON public.bridge_requests FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.lm_narasumber (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  profesi TEXT NOT NULL,
  provinsi TEXT,
  wa_contact TEXT NOT NULL,
  aktif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.lm_narasumber TO service_role;
ALTER TABLE public.lm_narasumber ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage lm_narasumber"
  ON public.lm_narasumber FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));