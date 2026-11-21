# Pelabel ketepatan usulan pemeta · versi 1 · aturan sama dengan pelabelan sampel 40 (butir 97, 14 Nov 2026)

Label: PUTUSAN ATAS DELEGASI. Dipakai untuk mengukur pemeta v2 (butir 105) pada sampel baru. Pelabel adalah agen terpisah yang tidak
melihat prompt pemeta, keluaran yang ditolak, atau label sebelumnya.

Untuk tiap baris `{id, kebutuhan, peran, kutipan}`, nilai **dari kutipan saja**:
- `benar`: kutipan menunjukkan **orang** dalam peran itu (jabatan, profesi, petugas, kader, relawan) **mengerjakan sesuatu** yang berkait
  dengan kebutuhan tersebut.
- `salah`: peran berupa tim, kelompok, lembaga, dinas, badan, organisasi; atau orang itu hanya penerima, sasaran, atau pihak yang dilapori;
  atau kutipan tidak berkait dengan kebutuhan.
- `ragu`: kutipan hanya daftar atau susunan tanpa tugas peran itu; atau jabatan politik atau kepala daerah; atau kaitan dengan kebutuhan
  tidak tampak dari kutipan.
Keluaran: satu baris JSON per id: `{"id", "label", "alasan"}` dengan alasan paling banyak 15 kata.
