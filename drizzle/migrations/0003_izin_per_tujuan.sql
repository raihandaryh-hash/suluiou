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
    AND (
      menyatakan_18_plus
      OR coalesce(auth.jwt() -> 'user_metadata' ->> 'user_track', '') = 'mahasiswa_iou'
    )
    AND EXISTS (
      SELECT 1 FROM public.assessment_results r
      WHERE r.id = result_id AND r.user_id = auth.uid()
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

-- Pencabutan ditegakkan basis data:
-- - P1 dicabut: skor 0 (tanpa prioritas) dan izin P2 ikut dicabut;
-- - P2 dicabut: skor dibatasi 60, batas tertinggi skor tanpa kecocokan program (src/lib/leadScoring.ts).
CREATE OR REPLACE FUNCTION public.sulu_izin_saat_dicabut()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.dicabut_pada IS NOT NULL AND OLD.dicabut_pada IS NULL THEN
    IF NEW.tujuan = 'dihubungi_kuliah' THEN
      UPDATE public.assessment_results SET lead_score = 0 WHERE id = NEW.result_id;
      UPDATE public.sulu_izin SET dicabut_pada = NEW.dicabut_pada
        WHERE result_id = NEW.result_id AND tujuan = 'hasil_untuk_tawaran' AND dicabut_pada IS NULL;
    ELSE
      UPDATE public.assessment_results SET lead_score = LEAST(lead_score, 60) WHERE id = NEW.result_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sulu_izin_dicabut ON public.sulu_izin;
CREATE TRIGGER sulu_izin_dicabut
  AFTER UPDATE OF dicabut_pada ON public.sulu_izin
  FOR EACH ROW EXECUTE FUNCTION public.sulu_izin_saat_dicabut();
