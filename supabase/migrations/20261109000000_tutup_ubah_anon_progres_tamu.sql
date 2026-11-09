-- Menutup penulisan buta anon ke progres tamu (temuan 2 Nov 22.50, dikonfirmasi periksa_anon.py v2 9 Nov 2026).
-- Tidak menghapus data. Jalur ubah progres tamu oleh anon di klien sudah tidak terpakai sejak baca anon
-- ditutup 2 Nov (klien mencari baris lewat SELECT dulu, dan SELECT anon kini selalu kosong).
-- Pengguna login tetap bisa mengklaim progres tamunya (applyClaim di src/lib/claimGuestResult.ts):
-- baris tamu hanya boleh diubah menjadi miliknya sendiri. Sisa risiko (pengguna login mana pun bisa mengklaim
-- baris tamu mana pun) ditutup bersama rancang ulang alur tamu dengan token rahasia (Tonggak 2).
DROP POLICY IF EXISTS "Anyone can update own progress" ON public.assessment_progress;
CREATE POLICY "Own or claim progress update" ON public.assessment_progress
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR (user_id IS NULL AND guest_identifier IS NOT NULL))
  WITH CHECK (user_id = auth.uid());
