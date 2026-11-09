-- Menutup ubah baris progres tamu dari luar (temuan 2 Nov 22.50, dikonfirmasi periksa_anon.py v2 9 Nov 2026).
-- Tidak menghapus data.
-- (1) Anon tidak bisa lagi mengubah baris tamu (penulisan buta). Jalur ubah oleh anon di klien sudah tidak
--     terpakai sejak baca anon ditutup 2 Nov.
-- (2) Pengguna login tidak bisa lagi "mengklaim" baris tamu mana pun lalu membacanya lewat "Own progress read"
--     (pemeriksa independen 9 Nov). Akibat: klaim progres tamu ke akun Google (applyClaim) mati sementara
--     sampai alur tamu dirancang ulang dengan token rahasia (Tonggak 2). Klaim hasil dan pendaftaran sudah tidak
--     punya kebijakan UPDATE sebelum ini.
DROP POLICY IF EXISTS "Anyone can update own progress" ON public.assessment_progress;
DROP POLICY IF EXISTS "Own or claim progress update" ON public.assessment_progress;
CREATE POLICY "Own progress update" ON public.assessment_progress
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
