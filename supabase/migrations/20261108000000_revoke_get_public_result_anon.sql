-- Tonggak 1 A6-data: tutup RPC hasil publik dari semua peran klien.
-- Izin semula diberikan di 20260430094941_*.sql (anon, authenticated).
-- Klien tidak memanggil fungsi ini selama HASIL_PUBLIK_TERBUKA=false (src/data/flags.ts),
-- jadi pemilik hasil tidak kehilangan akses apa pun. Fungsi tetap bisa dipanggil oleh
-- postgres dan service_role. Saat HASIL_PUBLIK_TERBUKA dinyalakan kelak, GRANT ulang
-- lewat migrasi baru yang ditinjau, sesuai keputusan akses saat itu.
REVOKE EXECUTE ON FUNCTION public.get_public_result(uuid) FROM PUBLIC, anon, authenticated;

-- Verifikasi di produksi sesudah migrasi (keduanya harus false):
--   select has_function_privilege('anon', 'public.get_public_result(uuid)', 'EXECUTE');
--   select has_function_privilege('authenticated', 'public.get_public_result(uuid)', 'EXECUTE');
