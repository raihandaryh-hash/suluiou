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
SET search_path = public
AS $$
  SELECT c.id, c.name, c.school_name, c.session_closed
  FROM public.classes c
  WHERE c.join_code = upper(trim(p_kode))
    AND length(trim(p_kode)) = 4
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.cari_kelas_dari_kode(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cari_kelas_dari_kode(text) TO anon, authenticated;
