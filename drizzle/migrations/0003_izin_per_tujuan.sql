-- Tonggak 1b · izin per tujuan (KEPUTUSAN Raihan 11 Nov 12.08 dan 15.52; manifest Persetujuan dan Jalur Tarik v0.2).
-- Pola ditiru dari cc.izin Career Center: per tujuan, versi teks, diberikan dan dicabut.
-- Hanya pengguna masuk (bukan tamu) yang bisa memberi izin sendiri, dan hanya bila ia jalur mahasiswa IOU
-- atau menyatakan berumur 18 tahun atau lebih. Umur tidak disimpan; yang disimpan hanya pernyataan itu.
-- Izin dari orang tua (formulir sekolah) hanya ditulis admin.

CREATE TABLE IF NOT EXISTS public.sulu_izin (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id uuid NOT NULL REFERENCES public.assessment_results(id) ON DELETE CASCADE,
  user_id uuid DEFAULT auth.uid(),
  tujuan text NOT NULL CHECK (tujuan IN ('dihubungi_kuliah', 'hasil_untuk_tawaran')),
  pemberi text NOT NULL CHECK (pemberi IN ('diri', 'orang_tua')),
  menyatakan_18_plus boolean NOT NULL DEFAULT false,
  teks_versi text NOT NULL,
  diberikan_pada timestamptz NOT NULL DEFAULT now(),
  dicabut_pada timestamptz
);

CREATE INDEX IF NOT EXISTS sulu_izin_result_idx ON public.sulu_izin (result_id);
-- Satu izin aktif per tujuan per hasil (pemeriksa 1b, S4).
CREATE UNIQUE INDEX IF NOT EXISTS sulu_izin_satu_aktif ON public.sulu_izin (result_id, tujuan) WHERE dicabut_pada IS NULL;

ALTER TABLE public.sulu_izin ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.sulu_izin FROM anon;
REVOKE ALL ON public.sulu_izin FROM authenticated;
GRANT SELECT, INSERT ON public.sulu_izin TO authenticated;
GRANT UPDATE (dicabut_pada) ON public.sulu_izin TO authenticated;

-- Pemilik memberi izinnya sendiri, hanya bila dewasa menurut jalur atau pernyataan.
CREATE POLICY "Izin diri oleh pemilik dewasa" ON public.sulu_izin
  FOR INSERT TO authenticated
  WITH CHECK (
    pemberi = 'diri'
    AND user_id = auth.uid()
    AND dicabut_pada IS NULL
    -- user_metadata bisa diubah pengguna sendiri, jadi tidak dipakai sebagai bukti dewasa (pemeriksa 1b, S5).
    AND menyatakan_18_plus
    AND EXISTS (
      SELECT 1 FROM public.assessment_results r
      WHERE r.id = sulu_izin.result_id AND r.user_id = auth.uid()
    )
    AND (
      tujuan = 'dihubungi_kuliah'
      OR EXISTS (
        SELECT 1 FROM public.sulu_izin p
        WHERE p.result_id = sulu_izin.result_id AND p.tujuan = 'dihubungi_kuliah' AND p.dicabut_pada IS NULL
      )
    )
  );

-- Admin mencatat izin orang tua dari rekap formulir sekolah.
CREATE POLICY "Izin orang tua oleh admin" ON public.sulu_izin
  FOR INSERT TO authenticated
  WITH CHECK (pemberi = 'orang_tua' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Pemilik atau admin membaca izin" ON public.sulu_izin
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Pemilik hanya bisa mencabut (kolom dicabut_pada), tidak bisa membuka kembali.
CREATE POLICY "Pemilik mencabut izin" ON public.sulu_izin
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND dicabut_pada IS NULL)
  WITH CHECK (user_id = auth.uid() AND dicabut_pada IS NOT NULL);

-- Skor prospek dihitung basis data, bukan klien (pemeriksa 1b, B1). Rumus sama dengan src/lib/leadScoring.ts:
-- tanpa P1 aktif 0; P1 30 + nama 5 + surel 10 + HP 10 + sekolah selain "Umum" 5; dengan P2 + kecocokan x 0,4.
-- Nilai lead_score yang dikirim klien selalu ditimpa.
CREATE OR REPLACE FUNCTION public.sulu_hitung_skor(r public.assessment_results)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN NOT EXISTS (SELECT 1 FROM public.sulu_izin i WHERE i.result_id = r.id AND i.tujuan = 'dihubungi_kuliah' AND i.dicabut_pada IS NULL)
      THEN 0
    ELSE LEAST(100,
      30
      + CASE WHEN coalesce(r.student_name, '') <> '' THEN 5 ELSE 0 END
      + CASE WHEN coalesce(r.student_email, '') <> '' THEN 10 ELSE 0 END
      + CASE WHEN coalesce(r.student_phone, '') <> '' THEN 10 ELSE 0 END
      + CASE WHEN coalesce(r.school_name, '') NOT IN ('', 'Umum') THEN 5 ELSE 0 END
      + CASE WHEN EXISTS (SELECT 1 FROM public.sulu_izin i WHERE i.result_id = r.id AND i.tujuan = 'hasil_untuk_tawaran' AND i.dicabut_pada IS NULL)
          THEN round(GREATEST(0, LEAST(100, coalesce(r.match_percentage, 0))) * 0.4)::integer ELSE 0 END)
  END;
$$;

CREATE OR REPLACE FUNCTION public.sulu_skor_sebelum_simpan()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Hitung ulang hanya saat baris baru, saat izin berubah (penanda sesi dari sulu_izin_berubah), atau saat kolom
  -- pembentuk skor berubah. Ubahan admin seperti follow_up_status tidak menyentuh skor (pemeriksa 1b kedua, N5).
  -- Saat baris lahir belum ada P1, jadi nomor HP tidak disimpan siapa pun pengirimnya (pemeriksa 1b ketiga, N3).
  IF TG_OP = 'INSERT' THEN
    NEW.student_phone := NULL;
  END IF;
  IF TG_OP = 'INSERT'
     OR coalesce(current_setting('sulu.hitung_skor', true), '') = '1'
     OR NEW.student_name IS DISTINCT FROM OLD.student_name
     OR NEW.student_email IS DISTINCT FROM OLD.student_email
     OR NEW.student_phone IS DISTINCT FROM OLD.student_phone
     OR NEW.school_name IS DISTINCT FROM OLD.school_name
     OR NEW.match_percentage IS DISTINCT FROM OLD.match_percentage
     OR NEW.lead_score IS DISTINCT FROM OLD.lead_score THEN
    NEW.lead_score := public.sulu_hitung_skor(NEW);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sulu_skor_hasil ON public.assessment_results;
CREATE TRIGGER sulu_skor_hasil
  BEFORE INSERT OR UPDATE ON public.assessment_results
  FOR EACH ROW EXECUTE FUNCTION public.sulu_skor_sebelum_simpan();

-- Tiap perubahan izin menghitung ulang skor hasilnya. Cabut P1 juga mencabut P2.
CREATE OR REPLACE FUNCTION public.sulu_izin_berubah()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.tujuan = 'dihubungi_kuliah' AND NEW.dicabut_pada IS NOT NULL AND OLD.dicabut_pada IS NULL THEN
    UPDATE public.sulu_izin SET dicabut_pada = NEW.dicabut_pada
      WHERE result_id = NEW.result_id AND tujuan = 'hasil_untuk_tawaran' AND dicabut_pada IS NULL;
    -- Kontak dikumpulkan atas dasar P1; saat P1 dicabut, kontak dihapus (pemeriksa 1b ketiga, N2; UU 27/2022 Pasal 43).
    UPDATE public.assessment_results SET student_phone = NULL, student_email = NULL, email_requested = false
      WHERE id = NEW.result_id;
  END IF;
  -- Menyentuh baris memicu sulu_skor_hasil; penanda sesi memaksa hitung ulang.
  PERFORM set_config('sulu.hitung_skor', '1', true);
  UPDATE public.assessment_results SET lead_score = lead_score WHERE id = NEW.result_id;
  PERFORM set_config('sulu.hitung_skor', '', true);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sulu_izin_dicabut ON public.sulu_izin;
DROP TRIGGER IF EXISTS sulu_izin_berubah ON public.sulu_izin;
CREATE TRIGGER sulu_izin_berubah
  AFTER INSERT OR UPDATE OF dicabut_pada ON public.sulu_izin
  FOR EACH ROW EXECUTE FUNCTION public.sulu_izin_berubah();

-- Simpan kontak oleh pemilik yang sudah memberi P1 (pemeriksa 1b kedua, N1). Policy UPDATE lama di
-- assessment_results hanya mengizinkan pengisian layer1_text kosong, sehingga UPDATE kontak dari klien tersaring
-- tanpa galat. Fungsi ini satu-satunya jalan klien menulis kontak, dan menolak bila P1 tidak aktif.
CREATE OR REPLACE FUNCTION public.sulu_isi_kontak(
  p_result_id uuid,
  p_nama text,
  p_surel text,
  p_hp text,
  p_sekolah text,
  p_kelas text,
  p_provinsi text,
  p_minta_surel boolean DEFAULT false
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n integer;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.sulu_izin i
    WHERE i.result_id = p_result_id AND i.user_id = auth.uid()
      AND i.tujuan = 'dihubungi_kuliah' AND i.dicabut_pada IS NULL
  ) THEN
    RETURN false;
  END IF;
  -- Nilai menggantikan isi lama; isian kosong berarti dikosongkan (pemeriksa 1b ketiga, N1 dan N6).
  -- Nama tetap dipertahankan bila kosong, karena dipakai juga untuk tampilan hasil.
  UPDATE public.assessment_results SET
    student_name = coalesce(nullif(trim(p_nama), ''), student_name),
    student_email = nullif(trim(p_surel), ''),
    student_phone = nullif(trim(p_hp), ''),
    school_name = coalesce(nullif(trim(p_sekolah), ''), 'Umum'),
    student_class = nullif(trim(p_kelas), ''),
    student_province = nullif(trim(p_provinsi), ''),
    province = coalesce(nullif(trim(p_provinsi), ''), province),
    email_requested = coalesce(p_minta_surel, false)
  WHERE id = p_result_id AND user_id = auth.uid();
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n = 1;
END;
$$;

DROP FUNCTION IF EXISTS public.sulu_isi_kontak(uuid, text, text, text, text, text, text);
REVOKE ALL ON FUNCTION public.sulu_isi_kontak(uuid, text, text, text, text, text, text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sulu_isi_kontak(uuid, text, text, text, text, text, text, boolean) TO authenticated;
