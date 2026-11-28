-- Tonggak PW · izin orang tua/wali untuk menyimpan data pengguna di bawah 18 (manifest Tonggak PW v0.3, 28 Nov 2026).
-- Dasar: KEPUTUSAN Raihan 25 Nov 2026 16.41 (data pengguna di bawah 18 disimpan dan diakses internal untuk
-- memperbaiki layanan) dan 28 Nov 2026 22.51 (alur tidak boleh terlalu ketat: orang tua tidak perlu datang ke
-- sekolah). UU 27/2022 Pasal 25 ayat (2); PP 33/2026 Pasal 34, 36, 37, 38.
-- Alur: siswa membuat tautan sekali pakai, mengirimnya ke orang tua lewat WhatsApp; orang tua membaca, mencentang,
-- mengetik nama, selesai. Orang tua tidak perlu akun. Semua tulisan lewat fungsi izin-wali (service role).
-- Jalur sekolah (sulu_peserta, kode peserta) tidak berubah.

-- ===== Tautan sekali pakai =====
CREATE TABLE IF NOT EXISTS public.sulu_tautan_wali (
  sidik text PRIMARY KEY,                      -- HMAC token; token mentah tidak disimpan
  user_id uuid NOT NULL,                       -- akun siswa pemilik tautan
  dibuat_pada timestamptz NOT NULL DEFAULT now(),
  berlaku_sampai timestamptz NOT NULL,
  dipakai_pada timestamptz,
  kunci_versi int NOT NULL DEFAULT 1           -- versi rahasia SULU_KODE_RAHASIA_V<n> (rotasi tanpa memutus tautan)
);
-- Hak tepat sesudah CREATE TABLE, sebelum RLS (aturan migrasi proyek Lovable). Tidak bergantung pada hak bawaan.
REVOKE ALL ON public.sulu_tautan_wali FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.sulu_tautan_wali TO service_role;   -- fungsi izin-wali
CREATE INDEX IF NOT EXISTS sulu_tautan_wali_user_idx ON public.sulu_tautan_wali (user_id);
ALTER TABLE public.sulu_tautan_wali ENABLE ROW LEVEL SECURITY;

-- ===== Izin wali beserta buktinya (PP 33/2026 Pasal 36) =====
-- Terikat user_id, bukan result_id: siswa SMA tidak punya baris assessment_results (asesmen terkunci).
-- Tidak memakai ON DELETE CASCADE dan tidak disentuh sulu_hapus_data_sendiri atau sulu_hapus_data_anak_lama,
-- supaya bukti persetujuan dan penarikannya tetap ada sesudah data dihapus.
CREATE TABLE IF NOT EXISTS public.sulu_izin_wali (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tujuan text NOT NULL CHECK (tujuan IN ('simpan_perbaikan_layanan')),
  nama_wali text NOT NULL CHECK (char_length(nama_wali) BETWEEN 3 AND 120),
  hubungan text NOT NULL CHECK (hubungan IN ('ayah', 'ibu', 'wali')),
  teks_versi text NOT NULL,
  teks_sidik text NOT NULL,                    -- sha256 teks yang tampil di laman wali
  jalur text NOT NULL DEFAULT 'tautan_wa' CHECK (jalur IN ('tautan_wa')),
  tautan_sidik text NOT NULL,
  kelola_sidik text NOT NULL UNIQUE,           -- HMAC kode kelola milik orang tua (untuk menarik izin)
  kunci_versi int NOT NULL DEFAULT 1,
  diberikan_pada timestamptz NOT NULL DEFAULT now(),
  dicabut_pada timestamptz,
  dicabut_oleh text CHECK (dicabut_oleh IN ('wali', 'admin', 'diganti'))  -- diganti = tertutup oleh izin baru, bukan ditarik
);
-- Hak tepat sesudah CREATE TABLE, sebelum RLS. Klien hanya membaca (dibatasi policy di bawah); fungsi izin-wali
-- membaca, menulis, dan menandai tarik; tanpa DELETE, karena bukti persetujuan tidak dihapus.
REVOKE ALL ON public.sulu_izin_wali FROM anon, authenticated;
GRANT SELECT ON public.sulu_izin_wali TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.sulu_izin_wali TO service_role;
CREATE UNIQUE INDEX IF NOT EXISTS sulu_izin_wali_satu_aktif ON public.sulu_izin_wali (user_id, tujuan) WHERE dicabut_pada IS NULL;
ALTER TABLE public.sulu_izin_wali ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Pemilik atau admin membaca izin wali" ON public.sulu_izin_wali;
CREATE POLICY "Pemilik atau admin membaca izin wali" ON public.sulu_izin_wali FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
-- Tidak ada policy INSERT/UPDATE/DELETE: hanya fungsi izin-wali (service role) yang menulis.

CREATE OR REPLACE FUNCTION public.sulu_izin_wali_aktif(p_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.sulu_izin_wali w
                 WHERE w.user_id = p_uid AND w.tujuan = 'simpan_perbaikan_layanan' AND w.dicabut_pada IS NULL);
$$;
-- Tidak bisa dipanggil klien: hanya dipakai di dalam fungsi SECURITY DEFINER (boleh_simpan, penghapus sisa).
REVOKE ALL ON FUNCTION public.sulu_izin_wali_aktif(uuid) FROM PUBLIC, anon, authenticated;

-- ===== boleh_simpan diperluas, boleh_simpan_penuh untuk yang lebih dari simpan isian =====
-- boleh_simpan_penuh = isi boleh_simpan lama (0007): dewasa, admin, atau peserta kelas berizin formulir sekolah.
-- Izin wali hanya membuka penyimpanan isian (tabel fase dan progres asesmen). Permintaan Jembatan (kontak),
-- hasil asesmen, dan pendaftaran kelas tetap memakai boleh_simpan_penuh, karena teks izin wali menjanjikan
-- data tidak dipakai untuk menghubungi dan asesmen SMA tetap tertutup.
CREATE OR REPLACE FUNCTION public.boleh_simpan_penuh(p_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT p_uid IS NOT NULL AND public.sulu_boleh_tanya(p_uid) AND (
    public.sulu_dewasa(p_uid)
    OR public.is_admin(p_uid)
    OR EXISTS (SELECT 1 FROM public.sulu_peserta p
               WHERE p.user_id_aktif = p_uid AND p.izin_asesmen_ai AND p.dicabut_pada IS NULL)
  );
$$;
REVOKE ALL ON FUNCTION public.boleh_simpan_penuh(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.boleh_simpan_penuh(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.boleh_simpan(p_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT p_uid IS NOT NULL AND public.sulu_boleh_tanya(p_uid) AND (
    public.boleh_simpan_penuh(p_uid) OR public.sulu_izin_wali_aktif(p_uid)
  );
$$;
REVOKE ALL ON FUNCTION public.boleh_simpan(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.boleh_simpan(uuid) TO anon, authenticated;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['assessment_results','class_enrollments','bridge_requests'] LOOP
    IF to_regclass('public.' || t) IS NULL THEN CONTINUE; END IF;
    EXECUTE format('DROP POLICY IF EXISTS "Simpan hanya berizin (insert)" ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Simpan hanya berizin (update)" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Simpan hanya berizin (insert)" ON public.%I AS RESTRICTIVE FOR INSERT TO public
      WITH CHECK ((SELECT public.boleh_simpan_penuh(auth.uid())))', t);
    EXECUTE format('CREATE POLICY "Simpan hanya berizin (update)" ON public.%I AS RESTRICTIVE FOR UPDATE TO public
      USING ((SELECT public.boleh_simpan_penuh(auth.uid()))) WITH CHECK ((SELECT public.boleh_simpan_penuh(auth.uid())))', t);
  END LOOP;
END $$;

-- ===== Persetujuan dalam satu transaksi =====
-- Dipanggil fungsi izin-wali (service role). Tautan dikunci baris (FOR UPDATE), ditandai terpakai, izin aktif lama
-- ditutup sebagai 'diganti', bukti baru ditulis. Galat apa pun membatalkan semuanya.
CREATE OR REPLACE FUNCTION public.sulu_setujui_izin_wali(p_tautan_sidik text, p_nama text, p_hubungan text,
  p_teks_versi text, p_teks_sidik text, p_kelola_sidik text, p_kunci_versi int)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE t public.sulu_tautan_wali%ROWTYPE;
BEGIN
  IF auth.uid() IS NOT NULL OR NOT public.sulu_boleh_tanya(NULL::uuid) THEN RAISE EXCEPTION 'hanya layanan'; END IF;
  SELECT * INTO t FROM public.sulu_tautan_wali WHERE sidik = p_tautan_sidik FOR UPDATE;
  IF NOT FOUND THEN RETURN 'tidak_ada'; END IF;
  IF t.dipakai_pada IS NOT NULL THEN RETURN 'sudah_dipakai'; END IF;
  IF t.berlaku_sampai <= now() THEN RETURN 'kedaluwarsa'; END IF;
  UPDATE public.sulu_tautan_wali SET dipakai_pada = now() WHERE sidik = p_tautan_sidik;
  UPDATE public.sulu_izin_wali SET dicabut_pada = now(), dicabut_oleh = 'diganti'
   WHERE user_id = t.user_id AND tujuan = 'simpan_perbaikan_layanan' AND dicabut_pada IS NULL;
  INSERT INTO public.sulu_izin_wali (user_id, tujuan, nama_wali, hubungan, teks_versi, teks_sidik, jalur,
    tautan_sidik, kelola_sidik, kunci_versi)
  VALUES (t.user_id, 'simpan_perbaikan_layanan', p_nama, p_hubungan, p_teks_versi, p_teks_sidik, 'tautan_wa',
    p_tautan_sidik, p_kelola_sidik, p_kunci_versi);
  RETURN 'ok';
END $$;
REVOKE ALL ON FUNCTION public.sulu_setujui_izin_wali(text, text, text, text, text, text, int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sulu_setujui_izin_wali(text, text, text, text, text, text, int) TO service_role;

-- ===== Sisa data sesudah izin ditarik =====
-- Klien siswa memindah data ke perangkat lalu memanggil sulu_hapus_data_sendiri (berlaku karena boleh_simpan kini
-- salah). Data akun yang tidak dibuka lagi dihapus fungsi ini, dijalankan admin seperti sulu_hapus_data_anak_lama.
-- Bukti izin (sulu_izin_wali) tidak dihapus.
CREATE OR REPLACE FUNCTION public.sulu_hapus_sisa_izin_ditarik()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE n int := 0; r record;
BEGIN
  -- admin yang masuk, atau koneksi langsung / service role (chat Lovable); anon dan pengguna biasa ditolak
  IF NOT ((auth.uid() IS NOT NULL AND public.is_admin(auth.uid()))
          OR (auth.uid() IS NULL AND public.sulu_boleh_tanya(NULL::uuid))) THEN RAISE EXCEPTION 'hanya admin'; END IF;
  FOR r IN SELECT w.user_id FROM public.sulu_izin_wali w
           GROUP BY w.user_id
           -- 60 hari dihitung dari penarikan TERAKHIR akun itu, dan tidak ada izin yang masih aktif
           HAVING bool_and(w.dicabut_pada IS NOT NULL) AND max(w.dicabut_pada) < now() - interval '60 days' LOOP
    -- syarat ditulis langsung: boleh_simpan hanya menjawab untuk akun pemanggil (sulu_boleh_tanya)
    CONTINUE WHEN EXISTS (SELECT 1 FROM public.sulu_peserta p
                          WHERE p.user_id_aktif = r.user_id AND p.izin_asesmen_ai AND p.dicabut_pada IS NULL);
    CONTINUE WHEN EXISTS (SELECT 1 FROM auth.users u
                          WHERE u.id = r.user_id AND coalesce(u.raw_app_meta_data->>'dewasa', 'false') = 'true');
    -- daftar tabel sama dengan sulu_hapus_data_sendiri (0008); sulu_izin_wali (bukti) tidak dihapus
    DELETE FROM public.phase_2a_inventory WHERE user_id = r.user_id;
    DELETE FROM public.phase_2b_skills WHERE user_id = r.user_id;
    DELETE FROM public.phase_3_jalan_bakti WHERE user_id = r.user_id;
    DELETE FROM public.phase_4_sintesis WHERE user_id = r.user_id;
    DELETE FROM public.phase_5_action_plan WHERE user_id = r.user_id;
    DELETE FROM public.assessment_progress WHERE user_id = r.user_id;
    DELETE FROM public.sulu_izin WHERE user_id = r.user_id;
    DELETE FROM public.assessment_results WHERE user_id = r.user_id;
    DELETE FROM public.bridge_requests WHERE user_id = r.user_id;
    DELETE FROM public.class_enrollments WHERE user_id = r.user_id;
    n := n + 1;
  END LOOP;
  RETURN n;
END $$;
REVOKE ALL ON FUNCTION public.sulu_hapus_sisa_izin_ditarik() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sulu_hapus_sisa_izin_ditarik() TO authenticated;

-- Jadwal harian penghapus sisa (janji 60 hari di teks izin pw-1). Hanya dipasang bila ekstensi pg_cron aktif.
-- Bila tidak aktif, migrasi tetap jalan; aktifkan pg_cron lalu jalankan ulang blok ini, atau jalankan
-- `select public.sulu_hapus_sisa_izin_ditarik();` tiap minggu (lihat langkah rilis di manifest Tonggak PW v0.3).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    EXECUTE $c$SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'sulu_hapus_sisa_izin_ditarik'$c$;
    EXECUTE $c$SELECT cron.schedule('sulu_hapus_sisa_izin_ditarik', '17 19 * * *', 'select public.sulu_hapus_sisa_izin_ditarik()')$c$;
  ELSE
    RAISE NOTICE 'pg_cron tidak aktif: penghapus sisa izin wali belum terjadwal.';
  END IF;
END $$;

COMMENT ON TABLE public.sulu_izin_wali IS 'Izin orang tua/wali lewat tautan sekali pakai (Tonggak PW). Bukti persetujuan; tidak dihapus bersama data fase.';
COMMENT ON TABLE public.sulu_tautan_wali IS 'Tautan sekali pakai dari siswa ke orang tua (Tonggak PW). Hanya sidik HMAC yang disimpan.';
