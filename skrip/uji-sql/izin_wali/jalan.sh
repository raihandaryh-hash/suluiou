#!/usr/bin/env bash
# Uji migrasi 0010 (Tonggak PW) di Postgres lokal sekali pakai. Tidak menyentuh Supabase.
# Pakai: PGHOST=/tmp PGPORT=5499 PGUSER=postgres bash skrip/uji-sql/izin_wali/jalan.sh
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"; R="$D/../../.."
psql -q -d postgres -c "DROP DATABASE IF EXISTS uji_izin_wali" -c "CREATE DATABASE uji_izin_wali"
for f in "$D/00_stub.sql" "$D/01_bagian_0007.sql" "$R/drizzle/migrations/0010_izin_wali.sql"; do
  psql -q -v ON_ERROR_STOP=1 -d uji_izin_wali -f "$f" >/dev/null 2>&1 || { echo "GAGAL memasang $f"; exit 1; }
done
OUT="$(psql -d uji_izin_wali -f "$D/10_uji.sql" 2>&1)"
gagal=0
cek() { if grep -qE "$1" <<<"$OUT"; then echo "ok   $2"; else echo "GAGAL $2"; gagal=1; fi; }
cek "T1 pertama \| ok" "setuju pertama berhasil"
cek "T1 kedua \| sudah_dipakai" "tautan sekali pakai"
cek "TX kedaluwarsa \| kedaluwarsa" "tautan kedaluwarsa ditolak"
cek "TZ tidak ada \| tidak_ada" "tautan tak dikenal"
cek "nama_wali_check" "nama 2 karakter ditolak basis data"
cek "^ t +\| f$" "izin wali membuka simpan isian, bukan izin penuh"
cek "policy \"Simpan hanya berizin \(insert\)\" for table \"bridge_requests\"" "Jembatan tertutup untuk izin wali"
cek "policy \"Simpan hanya berizin \(insert\)\" for table \"assessment_results\"" "hasil asesmen tertutup untuk izin wali"
cek "permission denied for function sulu_izin_wali_aktif" "fungsi internal tertutup untuk klien"
cek "permission denied for function sulu_setujui_izin_wali" "persetujuan hanya lewat layanan"
cek "hanya admin" "penghapus sisa menolak pengguna biasa"
cek "for table \"phase_2a_inventory\"" "anak tanpa izin tidak bisa menulis"
cek "permission denied for function sulu_hapus_sisa_izin_ditarik" "penghapus sisa tertutup untuk anon"
cek "admin, harus 0 \| +0" "60 hari dihitung dari penarikan terakhir"
cek "admin, harus 1 \| +1" "sisa terhapus sesudah 60 hari"
cek "fase A sisa \| +0" "data fase terhapus"
cek "bukti tetap \| +2" "bukti persetujuan tidak terhapus"
cek "layanan baca tautan \| +1" "service role boleh tulis dan baca tautan"
cek "layanan baca izin \| t" "service role boleh baca izin"
psql -q -d uji_izin_wali -c "SELECT sidik FROM public.sulu_tautan_wali WHERE sidik='TN' AND dipakai_pada IS NULL" -t | grep -q TN && echo "ok   gagal tulis membatalkan tanda tautan" || { echo "GAGAL atomik"; gagal=1; }
psql -q -d uji_izin_wali -t -c "SELECT dicabut_oleh FROM public.sulu_izin_wali WHERE kelola_sidik='K1'" | grep -q diganti && echo "ok   izin lama ditandai diganti" || { echo "GAGAL diganti"; gagal=1; }
psql -q -d postgres -c "DROP DATABASE uji_izin_wali"
exit $gagal
