
-- Fix exposed sensitive data on assessment_progress
DROP POLICY IF EXISTS "Public read progress" ON public.assessment_progress;

CREATE POLICY "Authenticated read own progress"
ON public.assessment_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anon read guest progress only"
ON public.assessment_progress
FOR SELECT
TO anon
USING (user_id IS NULL AND guest_identifier IS NOT NULL);

-- Fix exposed sensitive data on class_enrollments
DROP POLICY IF EXISTS "Public can read enrollments" ON public.class_enrollments;

CREATE POLICY "Authenticated read own enrollments"
ON public.class_enrollments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anon read guest enrollments only"
ON public.class_enrollments
FOR SELECT
TO anon
USING (user_id IS NULL AND guest_identifier IS NOT NULL);

-- Restrict layer1_text UPDATE to row owner so attackers can't overwrite arbitrary rows
DROP POLICY IF EXISTS "Anyone can fill empty layer1_text" ON public.assessment_results;

CREATE POLICY "Owner can fill empty layer1_text"
ON public.assessment_results
FOR UPDATE
TO anon, authenticated
USING (
  layer1_text IS NULL
  AND (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND user_id IS NULL AND guest_identifier IS NOT NULL)
  )
)
WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR (auth.uid() IS NULL AND user_id IS NULL AND guest_identifier IS NOT NULL)
);
