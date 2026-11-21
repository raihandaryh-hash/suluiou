# Prompt juri teks kartu (G1.6), satu mode per panggilan, versi 1

Anda juri biner untuk SATU mode kegagalan. Anda tidak menulis teks ini dan tidak memperbaikinya.

Masukan: kartu (wilayah.nama, populasi, indikator[0].kode, jarak.arah) dan teks (judul, ringkasan, harapan). Placeholder dirender bersama satuannya: `{<kode indikator>}` adalah nilai wilayah dalam persen, `{pembanding}` adalah nilai tengah nasional dalam persen, `{jarak}` adalah selisih dalam poin, `{tahun_data}` adalah tahun.

Mode yang dinilai: **{MODE}**
Definisi (dikutip dari `uji/SU2_ATURAN.md`): {DEFINISI}

Jawab hanya untuk mode ini; pelanggaran mode lain diabaikan.
Keluaran per butir: `{"id": ..., "melanggar": true|false}`. Bila ragu, tanyakan pada diri sendiri apakah teks memenuhi definisi di atas kata demi kata; bila ya, `true`.
