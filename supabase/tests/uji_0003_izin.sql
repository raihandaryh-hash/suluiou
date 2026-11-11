-- Uji migrasi drizzle 0003 di PostgreSQL lokal: psql -f uji_0003_prasyarat.sql; psql -f ../../drizzle/migrations/0003_izin_per_tujuan.sql; psql -f uji_0003_izin.sql. Hasil 11 Nov 2026: semua sesuai label.
\set ON_ERROR_STOP 0
insert into assessment_results(id,user_id,student_name,student_email,school_name,match_percentage,lead_score,layer1_text) values ('11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','A','a@b','Umum',80,70,'L1');
insert into assessment_results(id,user_id,student_name,lead_score,layer1_text) values ('22222222-2222-2222-2222-222222222222','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','B',0,'L1');
update assessment_results set lead_score=70 where id='22222222-2222-2222-2222-222222222222';
select 'lama dipaksa 70 via superuser (recompute => 0)', lead_score from assessment_results where id='22222222-2222-2222-2222-222222222222';
alter table assessment_results disable trigger sulu_skor_hasil; update assessment_results set lead_score=70 where id='22222222-2222-2222-2222-222222222222'; alter table assessment_results enable trigger sulu_skor_hasil;
update assessment_results set follow_up_status='contacted' where id='22222222-2222-2222-2222-222222222222';
select 'N5 admin ubah status, skor tetap 70', lead_score from assessment_results where id='22222222-2222-2222-2222-222222222222';
set role authenticated; select set_config('x.uid','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',false);
select 'kontak tanpa P1 (false)', sulu_isi_kontak('11111111-1111-1111-1111-111111111111','A','a@b','0812','SMA X','12','Jabar');
insert into sulu_izin(result_id,user_id,tujuan,pemberi,menyatakan_18_plus,teks_versi) values ('11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','dihubungi_kuliah','diri',true,'v1');
select 'P1 skor 45', lead_score from assessment_results where id='11111111-1111-1111-1111-111111111111';
select 'kontak dengan P1 (true)', sulu_isi_kontak('11111111-1111-1111-1111-111111111111','A','a@b','0812','SMA X','12','Jabar');
select 'sesudah kontak skor 60', lead_score, student_phone from assessment_results where id='11111111-1111-1111-1111-111111111111';
select 'kontak hasil orang lain (false)', sulu_isi_kontak('22222222-2222-2222-2222-222222222222','x','','','','','');
insert into sulu_izin(result_id,user_id,tujuan,pemberi,menyatakan_18_plus,teks_versi) values ('11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','hasil_untuk_tawaran','diri',true,'v1');
select 'P2 skor 92', lead_score from assessment_results where id='11111111-1111-1111-1111-111111111111';
update sulu_izin set dicabut_pada=now() where result_id='11111111-1111-1111-1111-111111111111' and tujuan='dihubungi_kuliah';
select 'cabut P1 skor 0', lead_score from assessment_results where id='11111111-1111-1111-1111-111111111111';
select 'P2 ikut dicabut', count(*) from sulu_izin where dicabut_pada is null;
reset role; set role anon; select set_config('x.uid','',false);
select 'anon rpc ditolak'; select sulu_isi_kontak('11111111-1111-1111-1111-111111111111','A','','','','','');
insert into assessment_results(guest_identifier, student_name, lead_score) values ('g','tamu',99) returning 'anon insert skor 0', lead_score;
