REVOKE EXECUTE ON FUNCTION public.sulu_hapus_data_anak_lama() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sulu_laju_ok_ip(text, int, text, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sulu_laju_ok(text, int, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sulu_hitung_laju(text, text, int) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sulu_bersihkan_laju() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sulu_kode_acak(int) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sulu_hapus_data_sendiri() FROM anon;
REVOKE EXECUTE ON FUNCTION public.sulu_kode_kelas_baru() FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon;