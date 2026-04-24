
CREATE TABLE IF NOT EXISTS public.assessment_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  guest_identifier TEXT,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  student_profile JSONB,
  hexaco_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  sds_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  stage TEXT NOT NULL DEFAULT 'profile',
  hexaco_index INTEGER NOT NULL DEFAULT 0,
  sds_section INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Unique: satu progres per Google user
CREATE UNIQUE INDEX IF NOT EXISTS assessment_progress_user_unique
  ON public.assessment_progress(user_id)
  WHERE user_id IS NOT NULL;

-- Unique: satu progres per guest_identifier + class_id
CREATE UNIQUE INDEX IF NOT EXISTS assessment_progress_guest_class
  ON public.assessment_progress(guest_identifier, class_id)
  WHERE guest_identifier IS NOT NULL;

CREATE INDEX IF NOT EXISTS assessment_progress_class_idx
  ON public.assessment_progress(class_id);

ALTER TABLE public.assessment_progress ENABLE ROW LEVEL SECURITY;

-- Siapa saja bisa insert progres (Google user dengan user_id atau guest dengan guest_identifier)
CREATE POLICY "Anyone can create progress"
ON public.assessment_progress
FOR INSERT
TO anon, authenticated
WITH CHECK (
  ((auth.uid() IS NOT NULL) AND (user_id = auth.uid()))
  OR ((user_id IS NULL) AND (guest_identifier IS NOT NULL))
);

-- Siapa saja bisa update progres miliknya
CREATE POLICY "Anyone can update own progress"
ON public.assessment_progress
FOR UPDATE
TO anon, authenticated
USING (
  ((auth.uid() IS NOT NULL) AND (user_id = auth.uid()))
  OR ((user_id IS NULL) AND (guest_identifier IS NOT NULL))
)
WITH CHECK (
  ((auth.uid() IS NOT NULL) AND (user_id = auth.uid()))
  OR ((user_id IS NULL) AND (guest_identifier IS NOT NULL))
);

-- Siapa saja bisa baca progres miliknya (guest cari by guest_identifier client-side)
CREATE POLICY "Public read progress"
ON public.assessment_progress
FOR SELECT
TO anon, authenticated
USING (true);

-- Admin manage semua
CREATE POLICY "Admins manage progress"
ON public.assessment_progress
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Trigger update timestamp
CREATE OR REPLACE FUNCTION public.touch_assessment_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_assessment_progress ON public.assessment_progress;
CREATE TRIGGER trg_touch_assessment_progress
BEFORE UPDATE ON public.assessment_progress
FOR EACH ROW
EXECUTE FUNCTION public.touch_assessment_progress();
