-- Salinan bagian 0007_pintu_masuk_2a.sql yang dibutuhkan 0010 (sulu_boleh_tanya, sulu_dewasa, boleh_simpan lama, policy restriktif).
CREATE OR REPLACE FUNCTION public.sulu_boleh_tanya(p_uid uuid)
RETURNS boolean LANGUAGE plpgsql STABLE SET search_path = '' AS $$
DECLARE peran text;
BEGIN
  IF auth.uid() IS NOT NULL THEN RETURN p_uid = auth.uid(); END IF;
  BEGIN peran := current_setting('request.jwt.claims', true)::json->>'role'; EXCEPTION WHEN others THEN peran := NULL; END;
  RETURN coalesce(peran, 'service_role') = 'service_role';
END $$;

CREATE OR REPLACE FUNCTION public.sulu_dewasa(p_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT public.sulu_boleh_tanya(p_uid)
     AND coalesce((SELECT (u.raw_app_meta_data->>'dewasa')::boolean FROM auth.users u WHERE u.id = p_uid), false);
$$;
REVOKE ALL ON FUNCTION public.sulu_dewasa(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sulu_dewasa(uuid) TO authenticated;
CREATE OR REPLACE FUNCTION public.boleh_simpan(p_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT p_uid IS NOT NULL AND public.sulu_boleh_tanya(p_uid) AND (
    public.sulu_dewasa(p_uid)
    OR public.is_admin(p_uid)
    OR EXISTS (SELECT 1 FROM public.sulu_peserta p
               WHERE p.user_id_aktif = p_uid AND p.izin_asesmen_ai AND p.dicabut_pada IS NULL)
  );
$$;
REVOKE ALL ON FUNCTION public.boleh_simpan(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.boleh_simpan(uuid) TO anon, authenticated;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['assessment_progress','assessment_results','class_enrollments','phase_2a_inventory',
    'phase_2b_skills','phase_3_jalan_bakti','phase_4_sintesis','phase_5_action_plan','bridge_requests'] LOOP
    IF to_regclass('public.' || t) IS NULL THEN CONTINUE; END IF;
    EXECUTE format('DROP POLICY IF EXISTS "Simpan hanya berizin (insert)" ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Simpan hanya berizin (update)" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Simpan hanya berizin (insert)" ON public.%I AS RESTRICTIVE FOR INSERT TO public
      WITH CHECK ((SELECT public.boleh_simpan(auth.uid())))', t);
    EXECUTE format('CREATE POLICY "Simpan hanya berizin (update)" ON public.%I AS RESTRICTIVE FOR UPDATE TO public
      USING ((SELECT public.boleh_simpan(auth.uid()))) WITH CHECK ((SELECT public.boleh_simpan(auth.uid())))', t);
  END LOOP;
END $$;
