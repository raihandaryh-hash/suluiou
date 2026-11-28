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
  dipakai_pada timestamptz
);
CREATE INDEX IF NOT EXISTS sulu_tautan_wali_user_idx ON public.sulu_tautan_wali (user_id);
ALTER TABLE public.sulu_tautan_wali ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sulu_tautan_wali FROM anon, authenticated;

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
  diberikan_pada timestamptz NOT NULL DEFAULT now(),
  dicabut_pada timestamptz,
  dicabut_oleh text CHECK (dicabut_oleh IN ('wali', 'admin'))
);
CREATE UNIQUE INDEX IF NOT EXISTS sulu_izin_wali_satu_aktif ON public.sulu_izin_wali (user_id, tujuan) WHERE dicabut_pada IS NULL;
ALTER TABLE public.sulu_izin_wali ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sulu_izin_wali FROM anon, authenticated;
GRANT SELECT ON public.sulu_izin_wali TO authenticated;
DROP POLICY IF EXISTS "Pemilik atau admin membaca izin wali" ON public.sulu_izin_wali;
CREATE POLICY "Pemilik atau admin membaca izin wali" ON public.sulu_izin_wali FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
-- Tidak ada policy INSERT/UPDATE/DELETE: hanya fungsi izin-wali (service role) yang menulis.

CREATE OR REPLACE FUNCTION public.sulu_izin_wali_aktif(p_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.sulu_izin_wali w
                 WHERE w.user_id = p_uid AND w.tujuan = 'simpan_perbaikan_layanan' AND w.dicabut_pada IS NULL);
$$;
REVOKE ALL ON FUNCTION public.sulu_izin_wali_aktif(uuid) FROM PUBLIC;

-- ===== boleh_simpan diperluas (isi lama dipertahankan, ditambah izin wali) =====
CREATE OR REPLACE FUNCTION public.boleh_simpan(p_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT p_uid IS NOT NULL AND public.sulu_boleh_tanya(p_uid) AND (
    public.sulu_dewasa(p_uid)
    OR public.is_admin(p_uid)
    OR EXISTS (SELECT 1 FROM public.sulu_peserta p
               WHERE p.user_id_aktif = p_uid AND p.izin_asesmen_ai AND p.dicabut_pada IS NULL)
    OR public.sulu_izin_wali_aktif(p_uid)
  );
$$;
REVOKE ALL ON FUNCTION public.boleh_simpan(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.boleh_simpan(uuid) TO anon, authenticated;

-- ===== Sisa data sesudah izin ditarik =====
-- Klien siswa memindah data ke perangkat lalu memanggil sulu_hapus_data_sendiri (berlaku karena boleh_simpan kini
-- salah). Data akun yang tidak dibuka lagi dihapus fungsi ini, dijalankan admin seperti sulu_hapus_data_anak_lama.
-- Bukti izin (sulu_izin_wali) tidak dihapus.
CREATE OR REPLACE FUNCTION public.sulu_hapus_sisa_izin_ditarik()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE n int := 0; r record;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'hanya admin'; END IF;
  FOR r IN SELECT DISTINCT w.user_id FROM public.sulu_izin_wali w
           WHERE w.dicabut_pada IS NOT NULL AND w.dicabut_pada < now() - interval '60 days'
             -- syarat ditulis langsung: boleh_simpan hanya menjawab untuk akun pemanggil (sulu_boleh_tanya)
             AND NOT public.sulu_izin_wali_aktif(w.user_id)
             AND NOT EXISTS (SELECT 1 FROM public.sulu_peserta p
                             WHERE p.user_id_aktif = w.user_id AND p.izin_asesmen_ai AND p.dicabut_pada IS NULL)
             AND NOT EXISTS (SELECT 1 FROM auth.users u
                             WHERE u.id = w.user_id AND coalesce(u.raw_app_meta_data->>'dewasa', 'false') = 'true') LOOP
    DELETE FROM public.phase_2a_inventory WHERE user_id = r.user_id;
    DELETE FROM public.phase_2b_skills WHERE user_id = r.user_id;
    DELETE FROM public.phase_3_jalan_bakti WHERE user_id = r.user_id;
    DELETE FROM public.phase_4_sintesis WHERE user_id = r.user_id;
    DELETE FROM public.phase_5_action_plan WHERE user_id = r.user_id;
    DELETE FROM public.assessment_progress WHERE user_id = r.user_id;
    n := n + 1;
  END LOOP;
  RETURN n;
END $$;
REVOKE ALL ON FUNCTION public.sulu_hapus_sisa_izin_ditarik() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sulu_hapus_sisa_izin_ditarik() TO authenticated;

COMMENT ON TABLE public.sulu_izin_wali IS 'Izin orang tua/wali lewat tautan sekali pakai (Tonggak PW). Bukti persetujuan; tidak dihapus bersama data fase.';
COMMENT ON TABLE public.sulu_tautan_wali IS 'Tautan sekali pakai dari siswa ke orang tua (Tonggak PW). Hanya sidik HMAC yang disimpan.';
