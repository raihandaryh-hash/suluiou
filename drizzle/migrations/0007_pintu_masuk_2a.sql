-- Tonggak 2a · pintu masuk dan keselamatan (manifest v0.6, disetujui Raihan 11 Nov 2026 22.24).
-- Isi: status umur dari app_metadata, boleh_simpan + policy restriktif, sulu_peserta (kode peserta),
-- pembatas laju, penghitung kelas tanpa identitas, kode kelas 6 karakter dari server, daftar tunggu dan
-- analytics lewat RPC, policy izin diri dikunci status dewasa server, backfill status umur akun lama.
-- Pembersihan data lama (Putusan 2, tidak bisa dibatalkan) ada di 0008, dijalankan terpisah.
-- Daftar policy yang di-DROP diambil dari pg_policies produksi 11 Nov 22.32 (cek baca Raihan).

-- ===== A. Status umur dari server =====
-- app_metadata hanya bisa ditulis service role; dibaca langsung dari auth.users, bukan dari token (A.6).
CREATE OR REPLACE FUNCTION public.sulu_dewasa(p_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT coalesce((SELECT (u.raw_app_meta_data->>'dewasa')::boolean FROM auth.users u WHERE u.id = p_uid), false);
$$;
REVOKE ALL ON FUNCTION public.sulu_dewasa(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sulu_dewasa(uuid) TO authenticated;

-- ===== C.1 Peserta berizin dari formulir orang tua =====
CREATE TABLE IF NOT EXISTS public.sulu_peserta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  nama_panggilan text NOT NULL,
  kode_hmac text NOT NULL UNIQUE,
  kunci_versi smallint NOT NULL DEFAULT 1,
  -- tiga pilihan formulir sekolah (Docs 11 Nov): asesmen AI, dihubungi soal kuliah, hasil untuk tawaran
  izin_asesmen_ai boolean NOT NULL DEFAULT false,
  izin_dihubungi_kuliah boolean NOT NULL DEFAULT false,
  izin_hasil_untuk_tawaran boolean NOT NULL DEFAULT false,
  nama_orang_tua text NOT NULL,
  tanggal_formulir date NOT NULL,
  dicatat_oleh uuid NOT NULL,
  pin_hmac text,
  pin_salah smallint NOT NULL DEFAULT 0,
  user_id_aktif uuid UNIQUE,
  diaktifkan_pada timestamptz,
  dicabut_pada timestamptz,
  dibuat_pada timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sulu_peserta ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sulu_peserta FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sulu_peserta TO authenticated;
DROP POLICY IF EXISTS "Admin mengelola peserta" ON public.sulu_peserta;
CREATE POLICY "Admin mengelola peserta" ON public.sulu_peserta FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE IF NOT EXISTS public.sulu_token_peserta (
  sidik text PRIMARY KEY,
  peserta_id uuid NOT NULL REFERENCES public.sulu_peserta(id) ON DELETE CASCADE,
  berlaku_sampai timestamptz NOT NULL
);
ALTER TABLE public.sulu_token_peserta ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sulu_token_peserta FROM anon, authenticated;

-- B.7 · pemeriksa jalur token, dipanggil tiap permintaan sesi-peserta
CREATE OR REPLACE FUNCTION public.izin_peserta_aktif(p_peserta uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.sulu_peserta p
    WHERE p.id = p_peserta AND p.izin_asesmen_ai AND p.dicabut_pada IS NULL AND p.pin_salah < 5);
$$;
REVOKE ALL ON FUNCTION public.izin_peserta_aktif(uuid) FROM PUBLIC;

-- Cabut, reset, atau lepas ikatan mematikan semua token peserta seketika.
CREATE OR REPLACE FUNCTION public.sulu_peserta_matikan_token()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NEW.dicabut_pada IS DISTINCT FROM OLD.dicabut_pada OR NEW.kode_hmac IS DISTINCT FROM OLD.kode_hmac
     OR NEW.user_id_aktif IS DISTINCT FROM OLD.user_id_aktif OR NEW.pin_salah >= 5 THEN
    DELETE FROM public.sulu_token_peserta WHERE peserta_id = NEW.id;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS sulu_peserta_matikan_token ON public.sulu_peserta;
CREATE TRIGGER sulu_peserta_matikan_token AFTER UPDATE ON public.sulu_peserta
  FOR EACH ROW EXECUTE FUNCTION public.sulu_peserta_matikan_token();

-- ===== C.2 boleh_simpan + policy restriktif =====
CREATE OR REPLACE FUNCTION public.boleh_simpan(p_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT p_uid IS NOT NULL AND (
    public.sulu_dewasa(p_uid)
    OR public.is_admin(p_uid)
    OR EXISTS (SELECT 1 FROM public.sulu_peserta p
               WHERE p.user_id_aktif = p_uid AND p.izin_asesmen_ai AND p.dicabut_pada IS NULL)
  );
$$;
REVOKE ALL ON FUNCTION public.boleh_simpan(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.boleh_simpan(uuid) TO anon, authenticated;

-- Policy permisif lama yang membuka tulis anon atau tulis tanpa pemilik (cek baca 11 Nov 22.32).
DROP POLICY IF EXISTS "Anyone can create progress" ON public.assessment_progress;
DROP POLICY IF EXISTS "Anyone can submit assessment" ON public.assessment_results;
DROP POLICY IF EXISTS "Owner can fill empty layer1_text" ON public.assessment_results;
DROP POLICY IF EXISTS "Anyone can enroll in a class" ON public.class_enrollments;
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist_sulu;
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;

-- Pengganti: hanya pemilik akun. Tamu tanpa kode peserta tidak menulis apa pun ke server (B.2).
DROP POLICY IF EXISTS "Pemilik membuat progres" ON public.assessment_progress;
CREATE POLICY "Pemilik membuat progres" ON public.assessment_progress FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Pemilik menyimpan hasil" ON public.assessment_results;
CREATE POLICY "Pemilik menyimpan hasil" ON public.assessment_results FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Pemilik mengisi layer1 kosong" ON public.assessment_results;
CREATE POLICY "Pemilik mengisi layer1 kosong" ON public.assessment_results FOR UPDATE TO authenticated
  USING (layer1_text IS NULL AND user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Pemilik masuk kelas" ON public.class_enrollments;
CREATE POLICY "Pemilik masuk kelas" ON public.class_enrollments FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Hak tabel anon dicabut sekalian (pertahanan kedua di balik policy).
REVOKE INSERT, UPDATE, DELETE ON public.assessment_progress, public.assessment_results, public.class_enrollments,
  public.waitlist_sulu, public.analytics_events FROM anon;

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

-- ===== A.7 izin diri dikunci status dewasa server (T12) =====
DROP POLICY IF EXISTS "Izin diri oleh pemilik dewasa" ON public.sulu_izin;
CREATE POLICY "Izin diri oleh pemilik dewasa" ON public.sulu_izin
  FOR INSERT TO authenticated
  WITH CHECK (
    pemberi = 'diri'
    AND user_id = auth.uid()
    AND dicabut_pada IS NULL
    AND menyatakan_18_plus
    AND public.sulu_dewasa(auth.uid())
    AND EXISTS (SELECT 1 FROM public.assessment_results r WHERE r.id = sulu_izin.result_id AND r.user_id = auth.uid())
    AND (
      tujuan = 'dihubungi_kuliah'
      OR EXISTS (SELECT 1 FROM public.sulu_izin p
                 WHERE p.result_id = sulu_izin.result_id AND p.tujuan = 'dihubungi_kuliah' AND p.dicabut_pada IS NULL)
    )
  );

-- ===== E. Pembatas laju =====
CREATE TABLE IF NOT EXISTS public.sulu_batas_laju (
  aksi text NOT NULL,
  kunci text NOT NULL,
  jendela timestamptz NOT NULL,
  jumlah int NOT NULL DEFAULT 0,
  PRIMARY KEY (aksi, kunci, jendela)
);
ALTER TABLE public.sulu_batas_laju ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sulu_batas_laju FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS public.sulu_alarm_laju (
  id bigserial PRIMARY KEY,
  aksi text NOT NULL,
  jendela timestamptz NOT NULL,
  jumlah int NOT NULL,
  dicatat_pada timestamptz NOT NULL DEFAULT now(),
  UNIQUE (aksi, jendela)
);
ALTER TABLE public.sulu_alarm_laju ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sulu_alarm_laju FROM anon, authenticated;
GRANT SELECT ON public.sulu_alarm_laju TO authenticated;
DROP POLICY IF EXISTS "Admin membaca alarm laju" ON public.sulu_alarm_laju;
CREATE POLICY "Admin membaca alarm laju" ON public.sulu_alarm_laju FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- IP sekolah mitra dengan batas lebih tinggi (E.2), diisi admin.
CREATE TABLE IF NOT EXISTS public.sulu_ip_mitra (
  ip text PRIMARY KEY,
  pengali int NOT NULL DEFAULT 5 CHECK (pengali BETWEEN 1 AND 50),
  catatan text
);
ALTER TABLE public.sulu_ip_mitra ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sulu_ip_mitra FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sulu_ip_mitra TO authenticated;
DROP POLICY IF EXISTS "Admin mengelola IP mitra" ON public.sulu_ip_mitra;
CREATE POLICY "Admin mengelola IP mitra" ON public.sulu_ip_mitra FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- IP pemanggil: cf-connecting-ip, atau elemen terakhir x-forwarded-for (E.2). Kosong → 'tanpa-ip'.
CREATE OR REPLACE FUNCTION public.sulu_ip_pemanggil()
RETURNS text LANGUAGE plpgsql STABLE SET search_path = '' AS $$
DECLARE h json; xff text; v text;
BEGIN
  BEGIN h := current_setting('request.headers', true)::json; EXCEPTION WHEN others THEN h := NULL; END;
  v := h->>'cf-connecting-ip';
  IF coalesce(v,'') = '' THEN
    xff := h->>'x-forwarded-for';
    IF coalesce(xff,'') <> '' THEN v := trim(split_part(xff, ',', array_length(string_to_array(xff, ','), 1))); END IF;
  END IF;
  RETURN coalesce(nullif(v,''), 'tanpa-ip');
END $$;

-- Satu hitungan per (aksi, kunci) per jendela 10 menit. Mengembalikan true bila masih di bawah batas.
CREATE OR REPLACE FUNCTION public.sulu_hitung_laju(p_aksi text, p_kunci text, p_batas int)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE w timestamptz := date_trunc('hour', now()) + floor(extract(minute FROM now()) / 10) * interval '10 minutes';
        n int;
BEGIN
  INSERT INTO public.sulu_batas_laju(aksi, kunci, jendela, jumlah) VALUES (p_aksi, p_kunci, w, 1)
  ON CONFLICT (aksi, kunci, jendela) DO UPDATE SET jumlah = public.sulu_batas_laju.jumlah + 1
  RETURNING jumlah INTO n;
  RETURN n <= p_batas;
END $$;
REVOKE ALL ON FUNCTION public.sulu_hitung_laju(text, text, int) FROM PUBLIC;

-- Pemeriksa laju lengkap: per IP (dengan pengali IP mitra), per /24, dan global sebagai alarm saja.
-- p_tambahan: kunci tambahan (mis. kelas) yang digabung dengan IP.
-- Varian dengan IP eksplisit untuk edge function (yang memanggil basis data atas namanya sendiri).
CREATE OR REPLACE FUNCTION public.sulu_laju_ok_ip(p_aksi text, p_batas_ip int, p_ip text, p_tambahan text DEFAULT '')
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_ip text := coalesce(nullif(p_ip,''), 'tanpa-ip');
        k int := coalesce((SELECT m.pengali FROM public.sulu_ip_mitra m WHERE m.ip = v_ip), 1);
        net text := CASE WHEN v_ip ~ '^\d+\.\d+\.\d+\.\d+$' THEN regexp_replace(v_ip, '\.\d+$', '.0/24') ELSE v_ip END;
        ok_ip boolean; ok_net boolean; w timestamptz; g int;
BEGIN
  ok_ip := public.sulu_hitung_laju(p_aksi, 'ip:' || v_ip || ':' || p_tambahan, p_batas_ip * k);
  ok_net := public.sulu_hitung_laju(p_aksi, 'net:' || net || ':' || p_tambahan, p_batas_ip * 2 * k);
  -- global: hanya alarm (E.2), tidak memblokir
  IF NOT public.sulu_hitung_laju(p_aksi, 'global', p_batas_ip * 10) THEN
    w := date_trunc('hour', now()) + floor(extract(minute FROM now()) / 10) * interval '10 minutes';
    SELECT jumlah INTO g FROM public.sulu_batas_laju WHERE aksi = p_aksi AND kunci = 'global' AND jendela = w;
    INSERT INTO public.sulu_alarm_laju(aksi, jendela, jumlah) VALUES (p_aksi, w, g)
    ON CONFLICT (aksi, jendela) DO UPDATE SET jumlah = EXCLUDED.jumlah;
  END IF;
  RETURN ok_ip AND ok_net;
END $$;
REVOKE ALL ON FUNCTION public.sulu_laju_ok_ip(text, int, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sulu_laju_ok_ip(text, int, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.sulu_laju_ok(p_aksi text, p_batas_ip int, p_tambahan text DEFAULT '')
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  SELECT public.sulu_laju_ok_ip(p_aksi, p_batas_ip, public.sulu_ip_pemanggil(), p_tambahan);
$$;
REVOKE ALL ON FUNCTION public.sulu_laju_ok(text, int, text) FROM PUBLIC;

-- Hapus hitungan lama (dipanggil oportunistik dari RPC; jendela > 1 hari).
CREATE OR REPLACE FUNCTION public.sulu_bersihkan_laju()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  DELETE FROM public.sulu_batas_laju WHERE jendela < now() - interval '1 day';
$$;
REVOKE ALL ON FUNCTION public.sulu_bersihkan_laju() FROM PUBLIC;

-- ===== A.9 Permintaan buka kunci umur (ditangani admin) =====
CREATE TABLE IF NOT EXISTS public.sulu_permintaan_buka_kunci (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  dibuat_pada timestamptz NOT NULL DEFAULT now(),
  ditangani_pada timestamptz,
  ditangani_oleh uuid
);
CREATE UNIQUE INDEX IF NOT EXISTS sulu_permintaan_buka_satu_terbuka ON public.sulu_permintaan_buka_kunci(user_id) WHERE ditangani_pada IS NULL;
ALTER TABLE public.sulu_permintaan_buka_kunci ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sulu_permintaan_buka_kunci FROM anon, authenticated;
GRANT SELECT, UPDATE ON public.sulu_permintaan_buka_kunci TO authenticated;
DROP POLICY IF EXISTS "Admin menangani permintaan buka kunci" ON public.sulu_permintaan_buka_kunci;
CREATE POLICY "Admin menangani permintaan buka kunci" ON public.sulu_permintaan_buka_kunci FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ===== E.1 Kode kelas 6 karakter dari server; kode 4 karakter berakhir pada tanggal pengaturan =====
ALTER TABLE public.classes ALTER COLUMN join_code TYPE varchar(6);

CREATE TABLE IF NOT EXISTS public.sulu_pengaturan (kunci text PRIMARY KEY, nilai text);
ALTER TABLE public.sulu_pengaturan ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sulu_pengaturan FROM anon, authenticated;
-- kode4_berlaku_sampai diisi saat rilis: tanggal rilis + 7 hari (manifest E.1). Kosong = masih berlaku.
INSERT INTO public.sulu_pengaturan(kunci, nilai) VALUES ('kode4_berlaku_sampai', NULL) ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.sulu_kode_acak(p_panjang int)
RETURNS text LANGUAGE plpgsql VOLATILE SET search_path = '' AS $$
DECLARE abjad constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; b bytea; s text := ''; i int;
BEGIN
  -- tolak bias modulo: buang byte >= 248 (8 × 31)
  WHILE length(s) < p_panjang LOOP
    -- uuid v4 dari inti Postgres (tanpa pgcrypto); byte 6 dan 8 memuat bit versi, jadi dilewati
    b := uuid_send(gen_random_uuid());
    FOR i IN 0..15 LOOP
      IF i NOT IN (6, 8) AND get_byte(b, i) < 248 AND length(s) < p_panjang THEN
        s := s || substr(abjad, (get_byte(b, i) % 31) + 1, 1);
      END IF;
    END LOOP;
  END LOOP;
  RETURN s;
END $$;
REVOKE ALL ON FUNCTION public.sulu_kode_acak(int) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.sulu_kode_kelas_baru()
RETURNS text LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $$
DECLARE k text;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'hanya admin'; END IF;
  LOOP
    k := public.sulu_kode_acak(6);
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.classes c WHERE c.join_code = k);
  END LOOP;
  RETURN k;
END $$;
REVOKE ALL ON FUNCTION public.sulu_kode_kelas_baru() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sulu_kode_kelas_baru() TO authenticated;

DROP FUNCTION IF EXISTS public.cari_kelas_dari_kode(text);
CREATE FUNCTION public.cari_kelas_dari_kode(p_kode text)
RETURNS TABLE (id uuid, name text, school_name text, session_closed boolean)
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $$
DECLARE kd text := upper(trim(p_kode)); batas4 date;
BEGIN
  IF length(kd) NOT IN (4, 6) THEN RETURN; END IF;
  IF NOT public.sulu_laju_ok('cari_kelas', 200) THEN RAISE EXCEPTION 'terlalu_sering' USING ERRCODE = 'P0429'; END IF;
  IF length(kd) = 4 THEN
    SELECT nullif(s.nilai,'')::date INTO batas4 FROM public.sulu_pengaturan s WHERE s.kunci = 'kode4_berlaku_sampai';
    IF batas4 IS NOT NULL AND current_date > batas4 THEN RETURN; END IF;
  END IF;
  RETURN QUERY SELECT c.id, c.name::text, c.school_name::text, c.session_closed FROM public.classes c
    WHERE upper(trim(c.join_code)) = kd LIMIT 1;
END $$;
REVOKE ALL ON FUNCTION public.cari_kelas_dari_kode(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cari_kelas_dari_kode(text) TO anon, authenticated;

-- ===== C.8 Penghitung kelas tanpa identitas =====
CREATE TABLE IF NOT EXISTS public.sulu_hitung_kelas (
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  tanggal date NOT NULL,
  jenis text NOT NULL CHECK (jenis IN ('mulai','selesai')),
  jumlah int NOT NULL DEFAULT 0,
  PRIMARY KEY (class_id, tanggal, jenis)
);
ALTER TABLE public.sulu_hitung_kelas ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sulu_hitung_kelas FROM anon, authenticated;
GRANT SELECT ON public.sulu_hitung_kelas TO authenticated;
DROP POLICY IF EXISTS "Admin membaca hitungan kelas" ON public.sulu_hitung_kelas;
CREATE POLICY "Admin membaca hitungan kelas" ON public.sulu_hitung_kelas FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.sulu_naikkan_hitung(p_class uuid, p_jenis text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF p_jenis NOT IN ('mulai','selesai') THEN RAISE EXCEPTION 'jenis tidak dikenal'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.classes c WHERE c.id = p_class AND NOT coalesce(c.session_closed,false)) THEN RETURN; END IF;
  IF NOT public.sulu_laju_ok('hitung_kelas', 400, p_class::text) THEN RAISE EXCEPTION 'terlalu_sering' USING ERRCODE = 'P0429'; END IF;
  INSERT INTO public.sulu_hitung_kelas(class_id, tanggal, jenis, jumlah) VALUES (p_class, current_date, p_jenis, 1)
  ON CONFLICT (class_id, tanggal, jenis) DO UPDATE SET jumlah = public.sulu_hitung_kelas.jumlah + 1;
END $$;
REVOKE ALL ON FUNCTION public.sulu_naikkan_hitung(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sulu_naikkan_hitung(uuid, text) TO anon, authenticated;

-- ===== C.4 Daftar tunggu: hanya dewasa, lewat RPC =====
ALTER TABLE public.waitlist_sulu ALTER COLUMN whatsapp DROP NOT NULL;
ALTER TABLE public.waitlist_sulu ADD COLUMN IF NOT EXISTS user_id uuid;

CREATE OR REPLACE FUNCTION public.sulu_daftar_tunggu(p_nama text, p_email text, p_whatsapp text, p_persona text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.sulu_dewasa(auth.uid()) THEN RAISE EXCEPTION 'khusus_dewasa' USING ERRCODE = 'P0403'; END IF;
  IF NOT public.sulu_laju_ok('daftar_tunggu', 5) THEN RAISE EXCEPTION 'terlalu_sering' USING ERRCODE = 'P0429'; END IF;
  INSERT INTO public.waitlist_sulu(name, email, whatsapp, persona, user_id)
  VALUES (left(trim(p_nama), 120), left(trim(p_email), 200), nullif(left(trim(coalesce(p_whatsapp,'')), 30), ''),
          left(p_persona, 40), auth.uid());
END $$;
REVOKE ALL ON FUNCTION public.sulu_daftar_tunggu(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sulu_daftar_tunggu(text, text, text, text) TO authenticated;

-- ===== C.6 Analytics: kunci props dari daftar tetap, lewat RPC berbatas laju =====
CREATE OR REPLACE FUNCTION public.sulu_catat_peristiwa(p_nama text, p_sesi text, p_props jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE bersih jsonb := '{}'::jsonb; k text;
BEGIN
  IF NOT public.sulu_laju_ok('analytics', 2000) THEN RETURN; END IF;  -- diam: analytics tidak boleh memutus alur
  FOREACH k IN ARRAY ARRAY['method','jalur','value','persona'] LOOP
    IF p_props ? k AND jsonb_typeof(p_props->k) IN ('string','number','boolean') AND length((p_props->>k)) <= 60 THEN
      bersih := bersih || jsonb_build_object(k, p_props->k);
    END IF;
  END LOOP;
  INSERT INTO public.analytics_events(event_name, session_id, props)
  VALUES (left(p_nama, 60), left(p_sesi, 64), bersih);
  IF random() < 0.01 THEN PERFORM public.sulu_bersihkan_laju(); END IF;
END $$;
REVOKE ALL ON FUNCTION public.sulu_catat_peristiwa(text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sulu_catat_peristiwa(text, text, jsonb) TO anon, authenticated;

-- ===== A.4 Backfill status umur akun lama =====
-- Dasar: cek baca 11 Nov 22.32 (170 akun tanpa jalur, 1 mahasiswa_iou, 157 pernah masuk kelas).
-- - admin: dewasa, terkunci
-- - mahasiswa_iou: dewasa, terkunci (Putusan 1b)
-- - pernah masuk kelas atau berjalur siswa: di bawah 18, terkunci
-- - selain itu: dibiarkan belum terkunci, sehingga pemiliknya melihat layar konfirmasi saat masuk lagi.
--   Menyimpang dari v0.6 A.4 ("akun tanpa jalur → terkunci di bawah 18") supaya orang dewasa di luar kelas
--   tidak terjebak (KEPUTUSAN 11 Nov 22.24: "jangan sampai dia salah klik lalu stuck").
UPDATE auth.users u SET raw_app_meta_data = coalesce(u.raw_app_meta_data,'{}'::jsonb)
  || jsonb_build_object('dewasa', true, 'umur_terkunci', true, 'umur_sumber', 'backfill_admin')
WHERE public.is_admin(u.id) AND NOT coalesce((u.raw_app_meta_data->>'umur_terkunci')::boolean, false);

UPDATE auth.users u SET raw_app_meta_data = coalesce(u.raw_app_meta_data,'{}'::jsonb)
  || jsonb_build_object('dewasa', true, 'umur_terkunci', true, 'umur_sumber', 'backfill_mahasiswa_iou')
WHERE u.raw_user_meta_data->>'user_track' = 'mahasiswa_iou'
  AND NOT coalesce((u.raw_app_meta_data->>'umur_terkunci')::boolean, false);

UPDATE auth.users u SET raw_app_meta_data = coalesce(u.raw_app_meta_data,'{}'::jsonb)
  || jsonb_build_object('dewasa', false, 'umur_terkunci', true, 'umur_sumber', 'backfill_siswa')
WHERE (u.raw_user_meta_data->>'user_track' = 'siswa'
       OR EXISTS (SELECT 1 FROM public.class_enrollments e WHERE e.user_id = u.id))
  AND NOT coalesce((u.raw_app_meta_data->>'umur_terkunci')::boolean, false);
