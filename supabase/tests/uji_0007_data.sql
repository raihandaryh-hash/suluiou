-- Data uji 0007, dimuat sebelum migrasi supaya backfill teruji.
-- data
insert into auth.users values
 ('00000000-0000-0000-0000-0000000000a1','admin@iou.id','{}','{}'),
 ('00000000-0000-0000-0000-0000000000d1','dewasa@x.id','{"dewasa":true,"umur_terkunci":true}','{}'),
 ('00000000-0000-0000-0000-0000000000c1','anak@x.id','{}','{}'),
 ('00000000-0000-0000-0000-0000000000c2','anakberizin@x.id','{}','{}'),
 ('00000000-0000-0000-0000-0000000000b1','lama_kelas@x.id','{}','{}'),
 ('00000000-0000-0000-0000-0000000000b2','lama_mhs@x.id','{}','{"user_track":"mahasiswa_iou"}'),
 ('00000000-0000-0000-0000-0000000000b3','lama_bebas@x.id','{}','{}');
insert into admin_users values ('admin@iou.id');
insert into classes(id,name,join_code) values ('00000000-0000-0000-0000-00000000c1a5','X IPA','AB2C');
insert into class_enrollments(class_id,user_id) values ('00000000-0000-0000-0000-00000000c1a5','00000000-0000-0000-0000-0000000000b1');
