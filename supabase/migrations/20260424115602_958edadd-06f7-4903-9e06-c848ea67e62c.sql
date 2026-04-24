-- 1. Tabel admin_users (email-based)
CREATE TABLE public.admin_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Helper: is_admin (email in admin_users OR role admin in user_roles)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = 'admin'::app_role
    )
    OR EXISTS (
      SELECT 1 FROM public.admin_users au
      JOIN auth.users u ON lower(u.email) = lower(au.email)
      WHERE u.id = _user_id
    );
$$;

-- Admin users policies
CREATE POLICY "Admins manage admin_users"
ON public.admin_users
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 3. Tabel classes
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school_name TEXT,
  join_code CHAR(4) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_closed BOOLEAN NOT NULL DEFAULT false,
  session_closed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read classes for join validation"
ON public.classes FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage classes"
ON public.classes FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 4. Tabel class_enrollments
CREATE TABLE public.class_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_identifier TEXT,
  guest_name TEXT,
  guest_phone TEXT,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT enrollment_subject_present CHECK (user_id IS NOT NULL OR guest_identifier IS NOT NULL)
);

CREATE UNIQUE INDEX class_enrollments_user_unique
  ON public.class_enrollments(class_id, user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX class_enrollments_guest_unique
  ON public.class_enrollments(class_id, guest_identifier)
  WHERE guest_identifier IS NOT NULL;

ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or auth) can insert their own enrollment
CREATE POLICY "Anyone can enroll in a class"
ON public.class_enrollments FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- if logged in, must be self
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- if guest, must provide guest_identifier and no user_id
  (auth.uid() IS NULL AND user_id IS NULL AND guest_identifier IS NOT NULL)
);

-- Public read so guests can resume by looking up their guest_identifier
CREATE POLICY "Public can read enrollments"
ON public.class_enrollments FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage enrollments"
ON public.class_enrollments FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 5. Tabel class_insights
CREATE TABLE public.class_insights (
  class_id UUID PRIMARY KEY REFERENCES public.classes(id) ON DELETE CASCADE,
  insight_text TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.class_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage class insights"
ON public.class_insights FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 6. Extend assessment_results
ALTER TABLE public.assessment_results
  ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS guest_identifier TEXT,
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS assessment_results_class_id_idx
  ON public.assessment_results(class_id);

-- New SELECT policy so admin (via is_admin OR has_role) can see class results
CREATE POLICY "Admins (email or role) view assessments"
ON public.assessment_results FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Allow students to view their own assessment (auth or guest by class+identifier)
CREATE POLICY "Users view own assessment"
ON public.assessment_results FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 7. Seed first admin
INSERT INTO public.admin_users (email)
VALUES ('it.shofiq@iou.edu.gm')
ON CONFLICT (email) DO NOTHING;