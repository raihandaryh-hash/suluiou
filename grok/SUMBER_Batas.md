# SUMBER_Batas · tujuh wilayah tanpa geometri BIG

SINTESIS. Retrieval sesi Grok Meja IOU, 19 Nov 2026 17.39–18.00 WIB, brief/02 tugas 1; ditambah penanda konflik dua sumber 19 Nov malam (Q40), nilai lama tetap (Ledger https://app.notion.com/p/41da045d995781d88b01e89f0d4ef5d9). Retrieval only: dokumen ini mencatat sumber, lisensi, dan cakupan; pilihan sumber untuk tayang tetap di tangan Chief atau Raihan. Data batas dipakai sebagai fakta wilayah, bukan klaim sengketa.

SUMBER: mesin/sambung/tetangga_wilayah.py @ a8e0f1e (cabang mesin-me1-fondasi) · curl 2026-11-19 10:40Z

## TL;DR
- Satu sumber berlisensi tertulis yang bisa diunduh tanpa akun dan memuat ketujuh wilayah: **HDX COD-AB Indonesia (cod-ab-idn)**, asal data BPS, disusun OCHA, lisensi **CC BY-IGO 3.0**. Dipakai sebagai "pelengkap" di tetangga_wilayah.py v3.
- geoBoundaries IDN ADM2 adalah turunan dari data yang sama (BPS/WFP/OCHA ROAP), lisensi sama. Dicatat sebagai cadangan, tidak dipakai.
- GADM: lisensi melarang redistribusi dan pemakaian komersial tanpa izin. Tidak dipakai.
- BIG (geoservices.big.go.id dan Ina-Geoportal): lisensi tertulis terbuka **TIDAK DITEMUKAN**; layanan FeatureServer kab/kota masih galat 500 pada 19 Nov 2026 17.42 WIB.

## Sumber 1 · HDX COD-AB Indonesia (DIPAKAI)
- Nama: Indonesia - Subnational Administrative Boundaries (cod-ab-idn), versi v01, berkas `idn_admin2` (shp)
- URL halaman: https://data.humdata.org/dataset/cod-ab-idn
- URL metadata (CKAN API, dibaca sesi ini): https://data.humdata.org/api/3/action/package_show?id=cod-ab-idn
- URL unduh: https://data.humdata.org/dataset/84a1d98a-790b-4d66-9d14-bbfa48500802/resource/50b9aafa-47c5-483e-a361-826320bf75d5/download/idn_admin_boundaries.shp.zip
  - sha256 zip: f40a48b058f779256bfb05234cee9aae98e7669dd6b0eeb1e058b2eec4ee3948
  - sha256 idn_admin2.shp: 6398e88c167559ec7d354d684bf3d7e7efa6f9b6bf7197b9ee88ba3748a28a06
- Asal data (verbatim metadata `dataset_source`): "Badan Pusat Statistik (BPS - Statistics Indonesia)"
- Metodologi (verbatim): "The data was obtained and provided by the World Food Programme from ArcGIS REST Services from various government GIS portals, accessed through QGIS REST interface."
- Lisensi (verbatim metadata): "Creative Commons Attribution for Intergovernmental Organisations (CC BY-IGO)", license_url "http://creativecommons.org/licenses/by/3.0/igo/legalcode"
- Teks lisensi, pasal 3 (verbatim dari https://creativecommons.org/licenses/by/3.0/igo/legalcode): "Subject to the terms and conditions of this License, the Licensor hereby grants You a worldwide, royalty-free, non-exclusive license to exercise the rights in the Work as follows: to Reproduce, Distribute and Publicly Perform the Work, to incorporate the Work into one or more Collections, and to Reproduce, Distribute and Publicly Perform the Work as incorporated in the Collections; and, to create, Reproduce, Distribute and Publicly Perform Adaptations, provided that You clearly label, demarcate or otherwise identify that changes were made to the original Work."
- Pasal 4 (verbatim, potongan): "You must include a copy of, or the Uniform Resource Identifier (URI) for, this License with every copy of the Work You Distribute or Publicly Perform."
- Tahun data (verbatim metadata `notes`): "01 April 2020: valid for use by the humanitarian community", "08 April 2020: boundaries created by the source", "30 October 2025: dataset reviewed for accuracy and completeness". Berkas di HDX diperbarui 2026-06-23. Rekaman `valid_on` = 2020-04-01.
- Catatan kualitas: primer untuk lisensi (HDX/OCHA), sekunder untuk geometri (BPS lewat WFP/OCHA, bukan BIG). Batas 2020; nama enam kabupaten masih nama lama (lihat di bawah), kode tetap.
- Caveat metadata (verbatim): "Administrative level 1P-codes are not consecutive; level 1 P-codes start with p-code \"ID11\" instead of \"ID01\"."

### Cakupan tujuh wilayah (rekaman idn_admin2, dibaca sesi ini)
| Kode BPS | adm2_pcode | adm2_name | adm1_name | valid_on | area_sqkm (atribut sumber) |
|---|---|---|---|---|---|
| 1271 | ID1271 | Kota Sibolga | Sumatera Utara | 2020-04-01 | 10,86130146 |
| 1274 | ID1274 | Kota Tebing Tinggi | Sumatera Utara | 2020-04-01 | 39,9309146 |
| 1374 | ID1374 | Kota Padang Panjang | Sumatera Barat | 2020-04-01 | 21,0920394 |
| 1375 | ID1375 | Kota Bukittinggi | Sumatera Barat | 2020-04-01 | 23,83166106 |
| 3101 | ID3101 | Kepulauan Seribu | Dki Jakarta | 2020-04-01 | 10,78310453 |
| 3371 | ID3371 | Kota Magelang | Jawa Tengah | 2020-04-01 | 17,8734787 |
| 3576 | ID3576 | Kota Mojokerto | Jawa Timur | 2020-04-01 | 20,21015534 |

Luas di atas adalah atribut berkas sumber, diteruskan apa adanya, bukan luas resmi daerah.

### Hasil tetangga v3 (pelengkap) lawan pembanding Alf-Anas
| Wilayah | Tetangga dari pelengkap (km kira) | Tetangga di pembanding Alf-Anas (v2, km kira) | Sama |
|---|---|---|---|
| 1271 Kota Sibolga | 1204 Tapanuli Tengah (8,7) | 1204 (10,9) | ya |
| 1274 Kota Tebing Tinggi | 1218 Serdang Bedagai (52,1) | 1218 (53,8) | ya |
| 1374 Kota Padang Panjang | 1305 Tanah Datar (25,7) | 1305 (30,5), 1306 Padang Pariaman (2,1) | **tidak** |
| 1375 Kota Bukittinggi | 1307 Agam (26,6) | 1307 (28,2) | ya |
| 3101 Kepulauan Seribu | tanpa tetangga darat | tanpa tetangga darat | ya |
| 3371 Kota Magelang | 3308 Magelang (27,1) | 3308 (29,3) | ya |
| 3576 Kota Mojokerto | 3516 Mojokerto (26,7) | 3516 (28,5) | ya |

Selisih Padang Panjang: di COD-AB, jarak terdekat Padang Panjang ke Padang Pariaman 0,0037 derajat (sekitar 0,41 km), di atas toleransi 0,001 derajat, jadi tidak dihitung bertetangga. Di Alf-Anas keduanya bersinggungan 2,1 km. Mana yang benar di lapangan [BELUM DIVERIFIKASI]; perlu acuan batas resmi (Permendagri penegasan batas daerah atau BIG), dan tidak diputuskan di sini.

### KONFLIK DUA SUMBER · Padang Panjang (1374) dan Padang Pariaman (1306)

Dicatat ulang 19 Nov 2026 malam (Q40). Nilai lama tidak diubah. Tidak ada sumber yang dipilih.

| Sumber | Hubungan yang tercatat | Nilai lama (19 Nov sore) |
|---|---|---|
| Alf-Anas (pembanding, tetangga v2) | bersinggungan | 2,1 km |
| HDX COD-AB (pelengkap, tetangga v3) | tidak bertetangga; ada celah | 0,0037 derajat (sekitar 0,41 km), di atas toleransi 0,001 derajat |

Keluarannya tetap seperti v3: pasangan ini tidak masuk tetangga_wilayah.json; total sisi 1001 → 1000. Acuan batas resmi (Permendagri atau BIG) masih TIDAK DITEMUKAN. Mana yang benar di lapangan [BELUM DIVERIFIKASI].


Nama beda pelengkap lawan DIKK 2025 (kode cocok, nama lama di data 2020; dicatat di `catatan_pencocokan`): ID1206 Toba Samosir → Toba; ID6302 Kota Baru → Kotabaru; ID6411 Mahakam Hulu → Mahakam Ulu; ID7108 Siau Tagulandang Biaro → Kepulauan Sitaro; ID7605 Mamuju Utara → Pasangkayu; ID8101 Maluku Tenggara Barat → Kepulauan Tanimbar. Delapan fitur danau, waduk, dan hutan (ID1288, ID1388, ID1688, ID1888, ID3288, ID3388, ID3399, ID7188) tidak berpadanan DIKK dan dilewati.

## Sumber 2 · geoBoundaries IDN ADM2 (cadangan, tidak dipakai)
- URL API: https://www.geoboundaries.org/api/current/gbOpen/IDN/ADM2/
- Unduh: https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IDN/ADM2/geoBoundaries-IDN-ADM2.geojson
- Lisensi (verbatim `boundaryLicense`): "Creative Commons Attribution 3.0 Intergovernmental Organisations (CC BY 3.0 IGO)"
- Asal (verbatim `boundarySource`): "Badan Pusat Statistik (BPS - Statistics Indonesia), World Food Programme, OCHA ROAP"; `licenseSource`: "data.humdata.org/dataset/indonesia-administrative-boundary-polygons-lines-and-places-levels-0-4b" (alamat HDX lama; API HDX menjawab Not Found untuk id itu pada 19 Nov 2026, dataset kini cod-ab-idn)
- Tahun: `boundaryYearRepresented` "2020", `buildDate` "Dec 12, 2023", 519 unit.
- Cakupan: ketujuh nama ada (Kota Sibolga, Kota Tebing Tinggi, Kota Padang Panjang, Kota Bukittinggi, Kepulauan Seribu, Kota Magelang, Kota Mojokerto), tetapi berkas tidak memuat kode BPS atau nama provinsi, jadi pencocokan harus lewat nama. Karena turunan dari COD-AB, sumber primernya COD-AB.

## Sumber 3 · GADM (ditolak)
- URL: https://gadm.org/license.html
- Lisensi (verbatim): "The data are freely available for academic use and other non-commercial use. Redistribution or commercial use is not allowed without prior permission."
- Alasan tidak dipakai: repo publik dan halaman tayang = redistribusi.

## Sumber 4 · BIG (lisensi TIDAK DITEMUKAN)
- Layanan: https://geoservices.big.go.id/rbi/rest/services/Hosted/Wilayah_Administrasi_Kabupaten__Kota/FeatureServer
  - 19 Nov 2026 17.42 WIB: `query?where=1=1&returnCountOnly=true&f=json` menjawab `{"error":{"code":500,"message":"Error performing query operation"}}`; metadata layanan tanpa `copyrightText`.
- Ina-Geoportal (https://tanahair.indonesia.go.id/): teks lisensi terbuka untuk unduhan batas kab/kota TIDAK DITEMUKAN dalam satu pencarian. Pedoman Geoportal KSP (https://onemap.big.go.id/Buku_Pedoman_Geoportal%20KSP_v2.pdf) menyebut akses berbagi data diatur Keppres 20/2018 dengan kewenangan "mengunduh, melihat, dan/atau tertutup" per pemegang akses; itu bukan lisensi publik.
- Ketentuan UU 4/2011 yang sudah dikutip di v2 tetap berlaku sebagai catatan untuk sumber utama, bukan lisensi.

## Dampak hilir
- mesin/sambung/keluaran/tetangga/tetangga_wilayah.json: skema naik ke tetangga-wilayah/3; enam sisi tujuh wilayah kini ber-asal "pelengkap", sisi ber-asal "pembanding" menjadi 0; total sisi 1001 → 1000 (pasangan Padang Panjang–Padang Pariaman hilang).
- Syarat tayang v2 ("Batas dari data pembanding yang asal datanya tidak dinyatakan.") tidak lagi cocok untuk tujuh wilayah. Kalimat pengganti BELUM DISUSUN: teks tayang adalah gerbang Chief atau Raihan. CC BY-IGO mewajibkan atribusi, URI lisensi, dan tanda bahwa data diubah (disederhanakan).
- Uji 9 di uji_tetangga_wilayah.py dilonggarkan dari "asal = pembanding" menjadi "asal non-utama yang sama dengan geometri_dari"; tiga uji v3 ditambahkan.

## TIDAK DITEMUKAN
- Lisensi terbuka tertulis BIG/Ina-Geoportal untuk batas kab/kota.
- Batas resmi yang memutus selisih Padang Panjang–Padang Pariaman.

Recommendations: retrieval-only sesuai instruksi, tidak ada verdict. Serah ke sesi verdict: Chief Sulu atau Raihan.
