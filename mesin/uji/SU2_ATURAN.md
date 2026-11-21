# SU-2 Teks kartu: aturan tertulis per mode kegagalan (beku sebelum juri ditulis)

Satu teks kartu = `judul`, `ringkasan`, `harapan` (lihat `kartu/kartu.py`). Placeholder sah: `{<kode indikator>}`, `{pembanding}`, `{jarak}`, `{tahun_data}`. Teks BENAR bila tidak melanggar satu pun mode di bawah. Teks BERGALAT untuk mode M bila melanggar M; satu teks bergalat diberi tepat satu mode.

| Mode | Kode | Teks bergalat bila | Contoh bergalat | Contoh benar |
|---|---|---|---|---|
| Wilayah salah | `wilayah` | menyebut wilayah lain dari `wilayah.nama` kartu, menukar kabupaten dengan kota bernama sama, atau menaikkan ke tingkat provinsi/nasional | kartu Kab. Bandung: "Di Kota Bandung ..." | "Di Kab. Bandung ..." |
| Populasi digeneralisasi | `populasi` | mengganti populasi indikator (balita, penduduk, rumah tangga) dengan kelompok lebih luas atau lain | "anak-anak" untuk stunting balita; "warga" untuk penduduk miskin tetap sah karena sama luasnya, "keluarga" tidak | "balita" |
| Sebab-akibat tersirat | `sebab` | menyatakan atau menyiratkan penyebab angka, atau akibat yang tidak ada di kartu | "karena gizi buruk", "akibat kurangnya perhatian pemda", "sehingga masa depan anak suram" | menyebut angka dan pembanding saja |
| Kata vonis | `vonis` | menilai wilayah atau warganya secara moral atau final: gagal, parah, darurat, memalukan, tertinggal (kecuali nama status resmi Indeks Desa), krisis, bencana (kecuali bencana alam), terpuruk | "Kab. X gagal menekan stunting" | "angkanya di atas nilai tengah nasional" |
| Rujukan placeholder salah | `placeholder` | placeholder menunjuk angka yang maknanya tidak sesuai kalimat (mis. `{pembanding}` disebut nilai wilayah, `{jarak}` disebut persentase), atau angka di judul/harapan | "Prevalensinya {pembanding}" | "Prevalensinya {prevalensi_stunting}, nilai tengah nasional {pembanding}" |
| Kuantitas dalam kata | `kuantitas` | menyatakan besaran dengan kata, bukan placeholder: separuh, sepertiga, satu dari empat, mayoritas, hampir semua, dua kali lipat, ribuan, dan sejenisnya, termasuk yang lolos regex | "hampir seperempat balita" | "{prevalensi_stunting} balita" |

Aturan umum yang bukan mode SU-2 tetapi tetap wajib (diperiksa skrip G1.4): tanpa digit di luar placeholder; tanpa kata "cukup", "tercukupi", "fardu kifayah"; `harapan` tidak kosong dan tanpa angka.

Pemutus sengketa: label akhir ditetapkan pemutus yang bukan penulis teks dan bukan juri, dengan berkas ini sebagai satu-satunya dasar.
