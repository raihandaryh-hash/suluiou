\set ON_ERROR_STOP 0
-- akun: anak A (berizin wali), anak B (tanpa), admin
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-00000000000a','{"umur_terkunci":true,"dewasa":false}'),
 ('00000000-0000-0000-0000-00000000000b','{"umur_terkunci":true,"dewasa":false}'),
 ('00000000-0000-0000-0000-0000000000ad','{"dewasa":true}');
INSERT INTO public.admins VALUES ('00000000-0000-0000-0000-0000000000ad');
INSERT INTO public.sulu_tautan_wali(sidik,user_id,berlaku_sampai) VALUES
 ('T1','00000000-0000-0000-0000-00000000000a', now()+interval '14 days'),
 ('T2','00000000-0000-0000-0000-00000000000a', now()+interval '14 days'),
 ('TX','00000000-0000-0000-0000-00000000000b', now()-interval '1 second'),
 ('TN','00000000-0000-0000-0000-00000000000b', now()+interval '14 days');

\echo '--- 1 setuju sebagai service_role'
SET ROLE service_role; SELECT set_config('request.jwt.claims','{"role":"service_role"}',false);
SELECT 'T1 pertama' k, public.sulu_setujui_izin_wali('T1','Siti Aminah','ibu','pw-1','h','K1',1);
SELECT 'T1 kedua' k, public.sulu_setujui_izin_wali('T1','Siti Aminah','ibu','pw-1','h','K1b',1);
SELECT 'TX kedaluwarsa' k, public.sulu_setujui_izin_wali('TX','Budi Santoso','ayah','pw-1','h','KX',1);
SELECT 'TZ tidak ada' k, public.sulu_setujui_izin_wali('TZ','Budi Santoso','ayah','pw-1','h','KZ',1);
\echo '--- 1b nama 2 karakter: harus galat, tautan TN tetap belum terpakai'
SELECT public.sulu_setujui_izin_wali('TN','AB','ayah','pw-1','h','KN',1);
SELECT 'TN dipakai_pada (harus kosong)' k, dipakai_pada FROM public.sulu_tautan_wali WHERE sidik='TN';
\echo '--- 1c T2 mengganti izin A: lama jadi diganti'
SELECT public.sulu_setujui_izin_wali('T2','Ahmad Fauzi','ayah','pw-1','h','K2',1);
SELECT kelola_sidik, dicabut_oleh, dicabut_pada IS NOT NULL dicabut FROM public.sulu_izin_wali ORDER BY diberikan_pada, kelola_sidik;
RESET ROLE;

\echo '--- 2 anak A login: boleh_simpan true, penuh false; tulis fase ok, jembatan ditolak'
SET ROLE authenticated; SELECT set_config('request.jwt.claims','{"role":"authenticated","sub":"00000000-0000-0000-0000-00000000000a"}',false);
SELECT public.boleh_simpan('00000000-0000-0000-0000-00000000000a') boleh, public.boleh_simpan_penuh('00000000-0000-0000-0000-00000000000a') penuh;
INSERT INTO public.phase_2a_inventory(user_id,data) VALUES ('00000000-0000-0000-0000-00000000000a','{}');
INSERT INTO public.bridge_requests(user_id,data) VALUES ('00000000-0000-0000-0000-00000000000a','{}');
INSERT INTO public.assessment_results(user_id,data) VALUES ('00000000-0000-0000-0000-00000000000a','{}');
\echo '--- 2b anak A mengintip izin B / memanggil fungsi internal'
SELECT public.boleh_simpan('00000000-0000-0000-0000-00000000000b') intip_b;
SELECT public.sulu_izin_wali_aktif('00000000-0000-0000-0000-00000000000b');
SELECT public.sulu_setujui_izin_wali('TN','Budi Santoso','ayah','pw-1','h','KN2',1);
SELECT public.sulu_hapus_sisa_izin_ditarik();
SELECT count(*) baca_izin_terlihat FROM public.sulu_izin_wali;
RESET ROLE;
\echo '--- 3 anak B tanpa izin: tulis fase ditolak'
SET ROLE authenticated; SELECT set_config('request.jwt.claims','{"role":"authenticated","sub":"00000000-0000-0000-0000-00000000000b"}',false);
INSERT INTO public.phase_2a_inventory(user_id,data) VALUES ('00000000-0000-0000-0000-00000000000b','{}');
RESET ROLE;
\echo '--- 4 anon memanggil penghapus'
SET ROLE anon; SELECT set_config('request.jwt.claims','{"role":"anon"}',false);
SELECT public.sulu_hapus_sisa_izin_ditarik();
RESET ROLE;
\echo '--- 5 temuan 2: penarikan lama + penarikan baru 1 hari lalu -> tidak dihapus'
SELECT set_config('request.jwt.claims','',false);
UPDATE public.sulu_izin_wali SET diberikan_pada=now()-interval '100 days', dicabut_pada=now()-interval '90 days' WHERE kelola_sidik='K1';
UPDATE public.sulu_izin_wali SET dicabut_pada=now()-interval '1 day', dicabut_oleh='wali' WHERE kelola_sidik='K2';
SET ROLE authenticated; SELECT set_config('request.jwt.claims','{"role":"authenticated","sub":"00000000-0000-0000-0000-0000000000ad"}',false);
SELECT 'admin, harus 0' k, public.sulu_hapus_sisa_izin_ditarik();
RESET ROLE; SELECT set_config('request.jwt.claims','',false);
UPDATE public.sulu_izin_wali SET dicabut_pada=now()-interval '61 days' WHERE kelola_sidik='K2';
SET ROLE authenticated; SELECT set_config('request.jwt.claims','{"role":"authenticated","sub":"00000000-0000-0000-0000-0000000000ad"}',false);
SELECT 'admin, harus 1' k, public.sulu_hapus_sisa_izin_ditarik();
RESET ROLE; SELECT set_config('request.jwt.claims','',false);
SELECT 'fase A sisa' k, count(*) FROM public.phase_2a_inventory WHERE user_id='00000000-0000-0000-0000-00000000000a';
SELECT 'bukti tetap' k, count(*) FROM public.sulu_izin_wali;
