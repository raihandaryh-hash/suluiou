-- Keamanan 1c · tutup baca publik tabel classes (temuan kritis pemindai Lovable 11 Nov 2026).
-- Sebelumnya anon dan semua pengguna bisa membaca seluruh daftar kelas, termasuk semua kode gabung,
-- sehingga siapa pun bisa menyusup ke sesi kelas sekolah mana pun. Kini pencocokan hanya lewat fungsi yang
-- menerima satu kode persis dan mengembalikan satu kelas; admin tetap lewat policy "Admins manage classes".

DROP POLICY IF EXISTS "Public can read classes for join validation" ON public.classes;

CREATE OR REPLACE FUNCTION public.cari_kelas_dari_kode(p_kode text)
RETURNS TABLE (id uuid, name text, school_name text, session_closed boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT c.id, c.name, c.school_name, c.session_closed
  FROM public.classes c
  WHERE c.join_code = upper(trim(p_kode))
    AND length(trim(p_kode)) = 4
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.cari_kelas_dari_kode(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cari_kelas_dari_kode(text) TO anon, authenticated;

-- Peserta yang masuk (akun Google) tetap bisa membaca kelas tempat ia terdaftar, untuk join bersarang
-- class_enrollments → classes di src/lib/authRouter.ts (pemeriksa 1c, temuan 1). Tamu tidak bisa membaca
-- class_enrollments sejak drizzle 0001, jadi tidak terdampak.
DROP POLICY IF EXISTS "Peserta membaca kelasnya" ON public.classes;
CREATE POLICY "Peserta membaca kelasnya" ON public.classes
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.class_enrollments e
    WHERE e.class_id = classes.id AND e.user_id = auth.uid()
  ));
