-- Tiruan minimal lingkungan Supabase untuk menguji 0010. Bukan skema produksi.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN CREATE ROLE service_role NOLOGIN BYPASSRLS; END IF;
END $$;
CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY, raw_app_meta_data jsonb DEFAULT '{}');
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claims', true)::json->>'sub','')::uuid $$;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
CREATE TABLE public.admins (user_id uuid);
CREATE FUNCTION public.is_admin(_user_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$ SELECT EXISTS(SELECT 1 FROM public.admins a WHERE a.user_id=_user_id) $$;
CREATE TABLE public.sulu_peserta (id uuid DEFAULT gen_random_uuid(), user_id_aktif uuid, izin_asesmen_ai boolean, dicabut_pada timestamptz);
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['phase_2a_inventory','phase_2b_skills','phase_3_jalan_bakti','phase_4_sintesis','phase_5_action_plan','assessment_progress','assessment_results','bridge_requests','class_enrollments','sulu_izin'] LOOP
  EXECUTE format('CREATE TABLE public.%I (id uuid DEFAULT gen_random_uuid(), user_id uuid, data jsonb)', t);
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated, service_role', t);
  EXECUTE format('CREATE POLICY milik ON public.%I FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())', t);
 END LOOP; END $$;
