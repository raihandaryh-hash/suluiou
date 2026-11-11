-- Tonggak 2a · pembersihan data lama (manifest v0.6 Putusan 2, disetujui Raihan 11 Nov 22.24: "Ambil semua yang terbaik").
-- TIDAK BISA DIBATALKAN. Dijalankan sesudah 0007 dan sesudah jumlah per kolom dicatat (cek baca 11 Nov 22.32:
-- pengenal tamu 22/29/31, guest_phone 31, parent_phone 1, student_phone 97, wa_number 0, waitlist whatsapp 0).
-- Sidik satu arah tidak dipakai karena nomor HP mudah ditebak balik dari sidiknya.

-- 1. Pengenal tamu berisi HP → kode acak, konsisten lintas tiga tabel.
CREATE TEMP TABLE peta_pengenal AS
SELECT lama, 'lama_' || replace(gen_random_uuid()::text, '-', '') AS baru
FROM (
  SELECT guest_identifier AS lama FROM public.assessment_results WHERE guest_identifier ~ '^guest_[0-9]{6,}'
  UNION SELECT guest_identifier FROM public.assessment_progress WHERE guest_identifier ~ '^guest_[0-9]{6,}'
  UNION SELECT guest_identifier FROM public.class_enrollments WHERE guest_identifier ~ '^guest_[0-9]{6,}'
) s;

UPDATE public.assessment_results t SET guest_identifier = p.baru FROM peta_pengenal p WHERE t.guest_identifier = p.lama;
UPDATE public.assessment_progress t SET guest_identifier = p.baru FROM peta_pengenal p WHERE t.guest_identifier = p.lama;
UPDATE public.class_enrollments t SET guest_identifier = p.baru FROM peta_pengenal p WHERE t.guest_identifier = p.lama;
DROP TABLE peta_pengenal;

-- 2. Kolom nomor dikosongkan.
UPDATE public.class_enrollments SET guest_phone = NULL WHERE guest_phone IS NOT NULL;
UPDATE public.assessment_results SET parent_phone = NULL WHERE parent_phone IS NOT NULL;
UPDATE public.assessment_results SET student_phone = NULL WHERE student_phone IS NOT NULL;
UPDATE public.kenali_dirimu_sessions SET wa_number = NULL WHERE wa_number IS NOT NULL;

-- 3. Daftar tunggu: whatsapp dikosongkan kecuali emailnya cocok dengan akun dewasa.
UPDATE public.waitlist_sulu w SET whatsapp = NULL
WHERE w.whatsapp IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM auth.users u WHERE lower(u.email) = lower(w.email) AND public.sulu_dewasa(u.id));

-- 4. Hasil tamu lama tanpa izin: nama panggilan dan pengenal dihapus; yang tersisa angka per kelas (C.8).
UPDATE public.assessment_results SET student_name = NULL, guest_identifier = NULL
WHERE user_id IS NULL AND guest_identifier IS NOT NULL AND guest_identifier NOT LIKE 'p\_%';
UPDATE public.class_enrollments SET guest_name = NULL WHERE user_id IS NULL;
DELETE FROM public.assessment_progress WHERE user_id IS NULL AND guest_identifier NOT LIKE 'p\_%';

-- 5. kenali_dirimu_sessions dipensiunkan (C.5): data lamanya dihapus.
DELETE FROM public.kenali_dirimu_sessions;

-- 6. Data server akun anak lama tanpa izin: dipindah ke perangkat saat pemiliknya masuk lagi (klien memanggil
--    sulu_hapus_data_sendiri sesudah menyalin), lalu sisanya dihapus 60 hari sesudah rilis lewat sulu_hapus_data_anak_lama.
INSERT INTO public.sulu_pengaturan(kunci, nilai) VALUES ('hapus_data_anak_lama_sesudah', (current_date + 60)::text)
ON CONFLICT (kunci) DO UPDATE SET nilai = EXCLUDED.nilai;

CREATE OR REPLACE FUNCTION public.sulu_hapus_data_sendiri()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE u uuid := auth.uid();
BEGIN
  -- hanya akun yang umurnya sudah terkunci di bawah 18 dan tanpa izin; akun yang belum memilih tidak disentuh
  IF u IS NULL OR public.boleh_simpan(u) OR NOT EXISTS (SELECT 1 FROM auth.users x WHERE x.id = u
       AND x.raw_app_meta_data->>'umur_terkunci' = 'true' AND coalesce(x.raw_app_meta_data->>'dewasa','false') <> 'true') THEN RETURN; END IF;
  DELETE FROM public.phase_2a_inventory WHERE user_id = u;
  DELETE FROM public.phase_2b_skills WHERE user_id = u;
  DELETE FROM public.phase_3_jalan_bakti WHERE user_id = u;
  DELETE FROM public.phase_4_sintesis WHERE user_id = u;
  DELETE FROM public.phase_5_action_plan WHERE user_id = u;
  DELETE FROM public.assessment_progress WHERE user_id = u;
  DELETE FROM public.sulu_izin WHERE user_id = u;
  DELETE FROM public.assessment_results WHERE user_id = u;
  DELETE FROM public.bridge_requests WHERE user_id = u;
  DELETE FROM public.class_enrollments WHERE user_id = u;
END $$;
REVOKE ALL ON FUNCTION public.sulu_hapus_data_sendiri() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sulu_hapus_data_sendiri() TO authenticated;

-- Dijalankan admin (lewat chat Lovable) pada atau sesudah tanggal hapus_data_anak_lama_sesudah.
CREATE OR REPLACE FUNCTION public.sulu_hapus_data_anak_lama()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE batas date; n int := 0; r record;
BEGIN
  SELECT nullif(nilai,'')::date INTO batas FROM public.sulu_pengaturan WHERE kunci = 'hapus_data_anak_lama_sesudah';
  IF batas IS NULL OR current_date < batas THEN RAISE EXCEPTION 'belum waktunya (%).', batas; END IF;
  FOR r IN SELECT u.id FROM auth.users u
           WHERE u.raw_app_meta_data->>'umur_terkunci' = 'true'
             AND coalesce(u.raw_app_meta_data->>'dewasa','false') <> 'true'
             AND NOT public.boleh_simpan(u.id) LOOP
    DELETE FROM public.phase_2a_inventory WHERE user_id = r.id;
    DELETE FROM public.phase_2b_skills WHERE user_id = r.id;
    DELETE FROM public.phase_3_jalan_bakti WHERE user_id = r.id;
    DELETE FROM public.phase_4_sintesis WHERE user_id = r.id;
    DELETE FROM public.phase_5_action_plan WHERE user_id = r.id;
    DELETE FROM public.assessment_progress WHERE user_id = r.id;
    DELETE FROM public.sulu_izin WHERE user_id = r.id;
    DELETE FROM public.assessment_results WHERE user_id = r.id;
    DELETE FROM public.bridge_requests WHERE user_id = r.id;
    DELETE FROM public.class_enrollments WHERE user_id = r.id;
    n := n + 1;
  END LOOP;
  RETURN n;
END $$;
REVOKE ALL ON FUNCTION public.sulu_hapus_data_anak_lama() FROM PUBLIC;