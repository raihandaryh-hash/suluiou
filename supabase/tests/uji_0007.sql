-- Uji 0007 (manifest 2a v0.6 §6), dijalankan sesudah prasyarat, data, dan migrasi. Gagal = EXCEPTION.
\set ON_ERROR_STOP on
create or replace function pg_temp.harus(ok boolean, pesan text) returns void language plpgsql as $$
begin if not coalesce(ok,false) then raise exception 'GAGAL: %', pesan; end if; raise notice 'lulus: %', pesan; end $$;
create or replace function pg_temp.sebagai(peran text, uid text) returns void language plpgsql as $$
begin perform set_config('x.uid', coalesce(uid,''), false); execute format('set role %I', peran); end $$;

-- §6.1 backfill
select pg_temp.harus((select raw_app_meta_data->>'dewasa' from auth.users where email='admin@iou.id')='true','admin dewasa');
select pg_temp.harus((select raw_app_meta_data->>'dewasa' from auth.users where email='lama_mhs@x.id')='true','mahasiswa_iou lama dewasa terkunci');
select pg_temp.harus((select raw_app_meta_data->>'dewasa' from auth.users where email='lama_kelas@x.id')='false','akun pernah masuk kelas di bawah 18');
select pg_temp.harus((select raw_app_meta_data->>'umur_terkunci' from auth.users where email='lama_kelas@x.id')='true','akun kelas terkunci');
select pg_temp.harus((select raw_app_meta_data ? 'umur_terkunci' from auth.users where email='lama_bebas@x.id') = false,'akun di luar kelas belum terkunci (anti-terjebak)');

-- §6.4 tamu anon tidak bisa menulis apa pun
select pg_temp.sebagai('anon', null);
do $$ begin
  begin insert into assessment_results(guest_identifier) values ('guest_x'); raise exception 'GAGAL: anon menulis hasil'; exception when insufficient_privilege then raise notice 'lulus: anon tidak menulis hasil'; end;
  begin insert into assessment_progress(guest_identifier) values ('guest_x'); raise exception 'GAGAL: anon menulis progres'; exception when insufficient_privilege then raise notice 'lulus: anon tidak menulis progres'; end;
  begin insert into class_enrollments(class_id, guest_identifier) values ('00000000-0000-0000-0000-00000000c1a5','g'); raise exception 'GAGAL: anon masuk kelas'; exception when insufficient_privilege then raise notice 'lulus: anon tidak menulis enrollment'; end;
  begin insert into phase_3_jalan_bakti(user_id) values (null); raise exception 'GAGAL: anon menulis fase'; exception when insufficient_privilege then raise notice 'lulus: anon tidak menulis fase'; end;
  begin insert into waitlist_sulu(name,email) values ('a','b'); raise exception 'GAGAL: anon daftar tunggu langsung'; exception when insufficient_privilege then raise notice 'lulus: anon tidak menulis daftar tunggu'; end;
end $$;
-- anon tetap bisa memakai RPC aman
select pg_temp.harus((select count(*) from public.cari_kelas_dari_kode('ab2c'))=1,'anon mencari kelas 4 karakter');
select public.sulu_naikkan_hitung('00000000-0000-0000-0000-00000000c1a5','mulai');
select public.sulu_catat_peristiwa('uji','s1','{"method":"x","nama":"Budi"}'::jsonb);
reset role;
select pg_temp.harus((select jumlah from sulu_hitung_kelas)=1,'penghitung kelas naik tanpa identitas');
select pg_temp.harus((select not (props ? 'nama') and props ? 'method' from analytics_events where event_name='uji'),'kunci props di luar daftar dibuang');

-- §6.4 akun anak tanpa izin tidak menyimpan
select pg_temp.sebagai('authenticated','00000000-0000-0000-0000-0000000000c1');
do $$ begin
  begin insert into assessment_results(user_id) values ('00000000-0000-0000-0000-0000000000c1'); raise exception 'GAGAL: anak tanpa izin menyimpan hasil'; exception when insufficient_privilege then raise notice 'lulus: anak tanpa izin tidak menyimpan hasil'; end;
  begin insert into phase_4_sintesis(user_id) values ('00000000-0000-0000-0000-0000000000c1'); raise exception 'GAGAL: anak tanpa izin menyimpan fase'; exception when insufficient_privilege then raise notice 'lulus: anak tanpa izin tidak menyimpan fase'; end;
  begin insert into class_enrollments(class_id,user_id) values ('00000000-0000-0000-0000-00000000c1a5','00000000-0000-0000-0000-0000000000c1'); raise exception 'GAGAL: anak tanpa izin masuk kelas server'; exception when insufficient_privilege then raise notice 'lulus: anak tanpa izin tidak menulis enrollment'; end;
  begin insert into bridge_requests(user_id) values ('00000000-0000-0000-0000-0000000000c1'); raise exception 'GAGAL: anak tanpa izin bridge'; exception when insufficient_privilege then raise notice 'lulus: anak tanpa izin tidak menulis bridge'; end;
  begin perform public.sulu_daftar_tunggu('a','b','0812','siswa'); raise exception 'GAGAL: anak daftar tunggu'; exception when sqlstate 'P0403' then raise notice 'lulus: anak ditolak daftar tunggu'; end;
end $$;
-- §6.1 / T12: anak tidak bisa memberi izin P1 dengan boolean klien
reset role;
insert into assessment_results(id,user_id) values ('00000000-0000-0000-0000-0000000000e1','00000000-0000-0000-0000-0000000000c1');
select pg_temp.sebagai('authenticated','00000000-0000-0000-0000-0000000000c1');
do $$ begin
  begin insert into sulu_izin(result_id,user_id,tujuan,pemberi,menyatakan_18_plus) values ('00000000-0000-0000-0000-0000000000e1','00000000-0000-0000-0000-0000000000c1','dihubungi_kuliah','diri',true);
    raise exception 'GAGAL: anak memberi izin P1'; exception when insufficient_privilege then raise notice 'lulus: anak tidak bisa memberi izin P1'; end;
end $$;
reset role;

-- §6.5 dewasa tidak terganggu
select pg_temp.sebagai('authenticated','00000000-0000-0000-0000-0000000000d1');
insert into assessment_results(id,user_id) values ('00000000-0000-0000-0000-0000000000e2','00000000-0000-0000-0000-0000000000d1');
insert into phase_4_sintesis(user_id) values ('00000000-0000-0000-0000-0000000000d1');
insert into class_enrollments(class_id,user_id) values ('00000000-0000-0000-0000-00000000c1a5','00000000-0000-0000-0000-0000000000d1');
insert into sulu_izin(result_id,user_id,tujuan,pemberi,menyatakan_18_plus) values ('00000000-0000-0000-0000-0000000000e2','00000000-0000-0000-0000-0000000000d1','dihubungi_kuliah','diri',true);
select public.sulu_daftar_tunggu('Dewasa','d@x.id','0812','umum');
update assessment_results set layer1_text='ok' where id='00000000-0000-0000-0000-0000000000e2';
-- §6.7 dewasa tidak bisa menimpa layer1 orang lain
update assessment_results set layer1_text='serobot' where id='00000000-0000-0000-0000-0000000000e1';
reset role;
select pg_temp.harus((select layer1_text from assessment_results where id='00000000-0000-0000-0000-0000000000e1') is null,'layer1 orang lain tidak bisa ditimpa');
select pg_temp.harus((select count(*) from waitlist_sulu where user_id='00000000-0000-0000-0000-0000000000d1')=1,'daftar tunggu dewasa tersimpan dengan user_id');
select pg_temp.harus((select count(*) from phase_4_sintesis where user_id='00000000-0000-0000-0000-0000000000d1')=1,'dewasa menyimpan fase');

-- C.2 anak berizin (kode peserta aktif) bisa menyimpan; dicabut → tidak lagi
insert into sulu_peserta(id,class_id,nama_panggilan,kode_hmac,izin_asesmen_ai,nama_orang_tua,tanggal_formulir,dicatat_oleh,user_id_aktif)
values ('00000000-0000-0000-0000-0000000000f1','00000000-0000-0000-0000-00000000c1a5','Ani','hmac1',true,'Ibu Ani','2026-11-11','00000000-0000-0000-0000-0000000000a1','00000000-0000-0000-0000-0000000000c2');
insert into sulu_token_peserta values ('sidik1','00000000-0000-0000-0000-0000000000f1', now()+interval '12 hours');
select pg_temp.harus(public.izin_peserta_aktif('00000000-0000-0000-0000-0000000000f1'),'token peserta berizin aktif');
select pg_temp.sebagai('authenticated','00000000-0000-0000-0000-0000000000c2');
insert into phase_3_jalan_bakti(user_id) values ('00000000-0000-0000-0000-0000000000c2');
reset role;
update sulu_peserta set dicabut_pada=now() where id='00000000-0000-0000-0000-0000000000f1';
select pg_temp.harus(not public.izin_peserta_aktif('00000000-0000-0000-0000-0000000000f1'),'izin dicabut mematikan jalur token');
select pg_temp.harus((select count(*) from sulu_token_peserta)=0,'cabut mematikan semua token');
select pg_temp.sebagai('authenticated','00000000-0000-0000-0000-0000000000c2');
do $$ begin
  begin update phase_3_jalan_bakti set data='{}' where user_id='00000000-0000-0000-0000-0000000000c2';
    if found then raise exception 'GAGAL: anak dicabut masih menulis'; end if; raise notice 'lulus: anak dicabut tidak menulis (0 baris)';
  exception when insufficient_privilege then raise notice 'lulus: anak dicabut tidak menulis'; end;
end $$;
reset role;

-- §6.3 kode kelas 6 karakter dari server, alfabet benar, kode 4 berakhir sesuai pengaturan
select pg_temp.sebagai('authenticated','00000000-0000-0000-0000-0000000000a1');
select pg_temp.harus(public.sulu_kode_kelas_baru() ~ '^[ABCDEFGHJKMNPQRSTUVWXYZ2-9]{6}$','kode kelas 6 karakter dari alfabet');
reset role;
select pg_temp.harus((select count(distinct public.sulu_kode_acak(8)) from generate_series(1,200))=200,'kode acak tidak berulang (200 sampel)');
update sulu_pengaturan set nilai=(current_date - 1)::text where kunci='kode4_berlaku_sampai';
select pg_temp.harus((select count(*) from public.cari_kelas_dari_kode('AB2C'))=0,'kode 4 karakter mati sesudah tanggal');
update sulu_pengaturan set nilai=null where kunci='kode4_berlaku_sampai';

-- §6.3 / §6.10 batas laju: satu kelas 100 siswa lolos, IP berbeda per kelas terpisah, global hanya alarm
delete from sulu_batas_laju;
select set_config('request.headers','{"x-forwarded-for":"9.9.9.9, 10.1.2.3"}',false);
select pg_temp.harus(public.sulu_ip_pemanggil()='10.1.2.3','IP = elemen terakhir x-forwarded-for');
select pg_temp.harus((select bool_and(public.sulu_laju_ok('cari_kelas',200)) from generate_series(1,100)),'100 siswa satu IP lolos');
select pg_temp.harus(not (select bool_and(public.sulu_laju_ok('cari_kelas',200)) from generate_series(1,150)),'IP yang sama ditolak sesudah 200');
select set_config('request.headers','{"cf-connecting-ip":"20.1.1.1"}',false);
select pg_temp.harus(public.sulu_laju_ok('cari_kelas',200),'IP lain tidak ikut terblok');
delete from sulu_batas_laju; delete from sulu_alarm_laju;
do $$ declare i int; begin for i in 1..21 loop
  perform set_config('request.headers', format('{"cf-connecting-ip":"30.%s.0.1"}', i), false);
  perform public.sulu_laju_ok('uji_global', 100) from generate_series(1,100);
end loop; end $$;
select pg_temp.harus((select count(*) from sulu_alarm_laju where aksi='uji_global')=1,'global terlampaui memicu alarm');
select set_config('request.headers','{"cf-connecting-ip":"40.0.0.1"}',false);
select pg_temp.harus(public.sulu_laju_ok('uji_global',100),'global terlampaui tidak memblokir IP baru');
select 'SEMUA UJI 0007 LULUS' as hasil;
