# Pindaian pertama layanan pencarian web untuk "pencarian lokal" Sulu · 15 Nov 2026

Sesi: SESI-11NOV-SULU-MESIN · https://claude.ai/code/session_01JZPjjr3cEST9SPkxZSaHrr
Label: SINTESIS. Retrieval saja, tanpa pemenang. Pelaksana: operator riset Sonnet, 14 pengambilan web, diakses 15 Nov 2026. **Cakupan: SEBAGIAN.** Yang terbaca hanya halaman harga dan dokumentasi; dokumen ketentuan pakai tidak satu pun terbaca. Angka adalah ringkasan halaman oleh alat baca, belum dicocokkan ulang ke halaman mentah: [BELUM DIVERIFIKASI] sampai dibaca kedua kalinya.

Kebutuhan: fungsi server menjalankan 2 sampai 4 kueri berbahasa Indonesia per permintaan (nama daerah + topik saja, tanpa data pribadi), menampilkan judul, sumber, tanggal, tautan. Perkiraan 500 sampai 5.000 kueri per bulan.

## Tabel (per 15 Nov 2026)
| Layanan | Terbuka untuk pelanggan baru | Harga per 1.000 kueri | Kuota gratis | Hasil mentah tanpa model | Sumber |
|---|---|---|---|---|---|
| Brave Search API | ya | $5 | kredit $5 per bulan (beranda menyebut "Up to $20", bertentangan) | ya (judul, URL, deskripsi, umur berita) | https://brave.com/search/api/ |
| Tavily | ya | sekitar $8 (hitungan dari $0,008 per kredit; bukan angka tertulis) | 1.000 kredit per bulan tanpa kartu | ya; tanggal terbit hanya bila diminta | https://docs.tavily.com/documentation/api-credits |
| Exa | ya | $4 sampai $12 menurut mode | kredit $10 per bulan | TIDAK DITEMUKAN | https://exa.ai/pricing |
| Serper.dev | ya | "starting at $0.30" (harga terendah; tabel paket tidak terbaca) | 2.500 kueri sekali | TIDAK DITEMUKAN | https://serper.dev |
| SerpApi | ya | $25 per bulan untuk 1.000 | 250 per bulan | TIDAK DITEMUKAN | https://serpapi.com/pricing |
| Perplexity Search API | TIDAK DITEMUKAN | $5; mode "fast" $1 | tidak disebut | ya (JSON berperingkat) | https://docs.perplexity.ai/docs/getting-started/pricing |
| Parallel Search API | ya | "From $1" (10 hasil per permintaan) | $5 per bulan dengan kartu | tidak dinyatakan di halaman harga | https://parallel.ai/pricing |
| Google Custom Search JSON API | **tidak**; pelanggan lama sampai 1 Jan 2027 | $5 | 100 per hari | ya | https://developers.google.com/custom-search/v1/overview |
| Bing Search API | **tidak**; dihentikan 11 Agu 2025 (hanya dari judul hasil pencarian) | TIDAK DITEMUKAN | TIDAK DITEMUKAN | TIDAK DITEMUKAN | https://learn.microsoft.com/en-us/lifecycle/announcements/bing-search-api-retirement |
| Gemini "Grounding with Google Search" | tidak diperiksa | $14 per 1.000 kueri (Gemini 3) atau $35 per 1.000 prompt (Gemini 2.5) | 5.000 prompt per bulan (Gemini 3) | lewat model, bukan hasil mentah | https://ai.google.dev/gemini-api/docs/pricing |
| Alat pencarian bawaan Anthropic dan OpenAI | TIDAK DITEMUKAN (halaman tidak terbaca) | TIDAK DITEMUKAN | TIDAK DITEMUKAN | TIDAK DITEMUKAN | — |

Mutu hasil untuk berita lokal Indonesia: belum diukur pada layanan mana pun.

## Tiga risiko dari yang terbaca
1. Hak menyimpan hasil (cache) tidak terjamin di paket standar. Brave menyebut hak simpan hanya lewat paket khusus. Layanan lain: TIDAK DITEMUKAN. Rancangan mesin memang tidak menyimpan temuan, jadi risiko ini hanya muncul bila kelak ingin cache.
2. Jaminan tanpa retensi kueri terkunci di paket besar (Exa Enterprise; Parallel paket Scale; SerpApi hanya Free dan Enterprise). Untuk paket kecil, retensi tidak terdokumentasi di halaman yang terbaca.
3. Layanan pencarian cepat berubah (Google ditutup untuk pelanggan baru, Bing dihentikan). Fungsi pencarian perlu satu lapis penyesuai supaya penyedia bisa diganti.

## Belum diperiksa (wajib sebelum penyedia dipilih)
Isi ketentuan pakai tiap penyedia (boleh tampil ke pengguna akhir, retensi, pemakaian untuk melatih model); parameter negara dan bahasa Indonesia; filter tanggal dan domain; saringan konten aman; uji mutu pada 10 kabupaten termasuk 3T; alat bawaan Anthropic dan OpenAI; lokasi data.

## Dampak hilir
Butir keputusan "penyedia pencarian" di rancangan tahap 2b Chief belum bisa diajukan ke Raihan. Calon untuk pindaian kedua (bukan pilihan): Brave, Tavily, Parallel, Perplexity, karena keempatnya mengembalikan hasil mentah atau berbiaya rendah dan terbuka untuk pelanggan baru.
