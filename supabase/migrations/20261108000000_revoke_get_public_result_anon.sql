-- Tonggak 1 A6-data: tutup RPC hasil publik dari peran anon.
-- Izin anon semula diberikan di 20260430094941_*.sql. Pemilik hasil tetap
-- bisa memanggil lewat peran authenticated.
REVOKE EXECUTE ON FUNCTION public.get_public_result(uuid) FROM anon;
