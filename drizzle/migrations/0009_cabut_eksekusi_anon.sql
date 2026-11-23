-- 0009 · Cabut hak EXECUTE bawaan dari anon (dan authenticated untuk fungsi khusus layanan/admin).
-- Temuan Chief Sulu 23 Nov 2026 saat verifikasi produksi (butir 1 titipan Kepala Staf):
-- Supabase memberi EXECUTE langsung ke anon dan authenticated pada fungsi baru di skema public.
-- "REVOKE ALL ... FROM PUBLIC" di migrasi 0003-0008 tidak mencabut hibah langsung itu.
-- Bukti produksi (kunci publishable, 23 Nov): GET /rest/v1/rpc/sulu_hapus_data_anak_lama dijalankan untuk anon
-- dan berhenti di RAISE 'belum waktunya' (P0001). Sesudah tanggal hapus_data_anak_lama_sesudah, siapa pun
-- dengan kunci publik bisa memicu penghapusan massal data akun di bawah 18 tanpa izin.
-- Tidak disentuh (dipakai klien tanpa login atau oleh kebijakan RLS): sulu_daftar_tunggu, boleh_simpan,
-- cari_kelas_dari_kode, sulu_catat_peristiwa, sulu_naikkan_hitung, sulu_dewasa, izin_peserta_aktif, get_public_result.

-- Hanya layanan atau admin (lewat chat Lovable / service role):
REVOKE EXECUTE ON FUNCTION public.sulu_hapus_data_anak_lama() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sulu_laju_ok_ip(text, int, text, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sulu_laju_ok(text, int, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sulu_hitung_laju(text, text, int) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sulu_bersihkan_laju() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sulu_kode_acak(int) FROM anon, authenticated;

-- Hanya pengguna yang masuk:
REVOKE EXECUTE ON FUNCTION public.sulu_hapus_data_sendiri() FROM anon;
REVOKE EXECUTE ON FUNCTION public.sulu_kode_kelas_baru() FROM anon;

-- Cegah hal yang sama pada fungsi baru di masa depan.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon;

-- Uji sesudah dijalankan (kunci publishable, harus 401/42501 permission denied, bukan P0001 atau 204):
--   GET /rest/v1/rpc/sulu_hapus_data_anak_lama
--   GET /rest/v1/rpc/sulu_hapus_data_sendiri
