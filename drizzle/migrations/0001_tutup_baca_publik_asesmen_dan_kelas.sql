-- Close anonymous/public SELECT policies on assessment progress and class enrollments without deleting data.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('assessment_progress', 'class_enrollments')
      AND cmd IN ('SELECT', 'ALL')
      AND (roles @> array['anon']::name[] OR roles @> array['public']::name[])
  LOOP
    EXECUTE format('drop policy %I on public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Own progress read" ON public.assessment_progress;
CREATE POLICY "Own progress read" ON public.assessment_progress
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Own enrollment read" ON public.class_enrollments;
CREATE POLICY "Own enrollment read" ON public.class_enrollments
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));