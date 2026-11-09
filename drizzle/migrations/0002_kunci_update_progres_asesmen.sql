DROP POLICY IF EXISTS "Anyone can update own progress" ON public.assessment_progress;
DROP POLICY IF EXISTS "Own or claim progress update" ON public.assessment_progress;
CREATE POLICY "Own progress update" ON public.assessment_progress
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());