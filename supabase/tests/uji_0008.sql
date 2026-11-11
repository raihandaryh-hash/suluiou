-- Uji 0008 (Putusan 2), sesudah prasyarat 0007, data, 0007, dan uji 0007. Gagal = EXCEPTION.
\set ON_ERROR_STOP on
reset role;
select set_config('x.uid','',false);
alter table class_enrollments add column if not exists guest_name text;
alter table assessment_results add column if not exists parent_phone text, add column if not exists student_name text;
create or replace function pg_temp.harus(ok boolean, pesan text) returns void language plpgsql as $$
begin if not coalesce(ok,false) then raise exception 'GAGAL: %', pesan; end if; raise notice 'lulus: %', pesan; end $$;
insert into assessment_results(user_id, guest_identifier, student_phone, parent_phone, student_name) values (null,'guest_081234567890_AB2C','0812','0813','Budi');
insert into assessment_progress(user_id, guest_identifier) values (null,'guest_081234567890_AB2C');
insert into class_enrollments(class_id, guest_identifier, guest_phone, guest_name) values ('00000000-0000-0000-0000-00000000c1a5','guest_081234567890_AB2C','0812','Budi');
insert into kenali_dirimu_sessions(session_id, wa_number) values ('s','0812');
insert into waitlist_sulu(name,email,whatsapp) values ('Anak','anak@x.id','0812'),('Dewasa2','dewasa@x.id','0899');
insert into phase_2a_inventory(user_id, data) values ('00000000-0000-0000-0000-0000000000b1','{"x":1}');
select set_config('x.uid','',false);
\i 0008_bersihkan_data_lama_2a.sql
select pg_temp.harus((select count(*) from assessment_results where guest_identifier ~ '^guest_[0-9]') = 0, 'tidak ada pengenal ber-HP di hasil');
select pg_temp.harus((select count(*) from class_enrollments where guest_identifier ~ '^guest_[0-9]') = 0, 'tidak ada pengenal ber-HP di enrollment');
select pg_temp.harus((select count(*) from assessment_results where student_phone is not null or parent_phone is not null) = 0, 'kolom HP hasil kosong');
select pg_temp.harus((select count(*) from class_enrollments where guest_phone is not null or (user_id is null and guest_name is not null)) = 0, 'HP dan nama tamu di enrollment kosong');
select pg_temp.harus((select count(*) from kenali_dirimu_sessions) = 0, 'kenali_dirimu_sessions dipensiunkan');
select pg_temp.harus((select whatsapp from waitlist_sulu where email='anak@x.id') is null, 'WA daftar tunggu non-dewasa dikosongkan');
select pg_temp.harus((select whatsapp from waitlist_sulu where email='dewasa@x.id' and name='Dewasa2') = '0899', 'WA daftar tunggu dewasa tetap');
select pg_temp.harus((select count(*) from assessment_results where user_id is null and student_name is not null) = 0, 'nama tamu lama dihapus');
-- hapus data sendiri: akun kelas lama (terkunci di bawah 18) bisa; akun belum terkunci tidak disentuh
insert into phase_2a_inventory(user_id, data) values ('00000000-0000-0000-0000-0000000000b3','{"y":1}');
select set_config('x.uid','00000000-0000-0000-0000-0000000000b3',false); set role authenticated; select public.sulu_hapus_data_sendiri(); reset role;
select pg_temp.harus((select count(*) from phase_2a_inventory where user_id='00000000-0000-0000-0000-0000000000b3') = 1, 'akun belum terkunci tidak dihapus');
select set_config('x.uid','00000000-0000-0000-0000-0000000000b1',false); set role authenticated; select public.sulu_hapus_data_sendiri(); reset role;
select pg_temp.harus((select count(*) from phase_2a_inventory where user_id='00000000-0000-0000-0000-0000000000b1') = 0, 'akun anak lama menghapus data sendiri');
do $$ begin perform public.sulu_hapus_data_anak_lama(); raise exception 'GAGAL: penghapusan 60 hari jalan terlalu dini'; exception when raise_exception then
  if sqlerrm like 'GAGAL%' then raise; end if; raise notice 'lulus: penghapusan 60 hari menolak sebelum waktunya'; end $$;
select 'SEMUA UJI 0008 LULUS' as hasil;
