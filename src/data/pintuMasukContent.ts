// Tonggak 2a · teks pintu masuk (manifest v0.6 A.9, B, C, F.1). DRAF: dua varian menunggu pilihan Raihan dalam satu paket.
// Ganti teks di sini, bukan di JSX. VARIAN_PINTU menentukan yang tampil; komponen memakai TEKS_PINTU[VARIAN_AKTIF]
// sampai Raihan memilih, lalu VARIAN_AKTIF bersama izinKuliahContent cukup diganti satu tempat.
import type { VarianTeks } from './izinKuliahContent';

export type PeranPilihan = 'siswa' | 'mahasiswa' | 'orang_tua' | 'guru_bk' | 'guru' | 'umum';

interface TeksPintu {
  judulPeran: string;
  pengantarPeran: string;
  peran: Record<PeranPilihan, { label: string; ket: string }>;
  judulJenjang: string;
  jenjang: { kelas_10_11: string; kelas_12: string; baru_lulus: string };
  umur18: string;
  tanyaIou: string;
  iouYa: string;
  iouTidak: string;
  lanjut: string;
  // layar konfirmasi (A.9)
  judulKonfirmasi: string;
  ringkasan: (peranLabel: string, dewasa: boolean) => string;
  akibatAnak: string;
  akibatDewasa: string;
  peringatanKunci: string;
  yaBenar: string;
  ubahPilihan: string;
  // profil
  sisaRalat: (menit: number) => string;
  terkunci: string;
  mintaBuka: string;
  mintaBukaTerkirim: string;
  // aktivasi kode peserta (B.3)
  judulAktivasi: string;
  pengantarAktivasi: string;
  labelKode: string;
  aktifkan: string;
  peringatanAktivasi: string;
  aktivasiBerhasil: (nama: string) => string;
  galatKode: Record<string, string>;
  // tamu dan mode perangkat (B.1, B.2, C.7)
  tamuPengantar: string;
  modePerangkat: string;
  modePerangkatKelas: string;
  hapusPerangkat: string;
  hapusPerangkatYakin: string;
  hapusPerangkatSelesai: string;
  jembatanTerkunci: string;
  daftarTungguAnak: string;
}

export const TEKS_PINTU: Record<VarianTeks, TeksPintu> = {
  A: {
    judulPeran: 'Kamu datang sebagai siapa?',
    pengantarPeran: 'Pilih satu. Sulu menyesuaikan isinya dengan pilihanmu.',
    peran: {
      siswa: { label: 'Siswa SMA/SMK/MA', ket: 'Masih sekolah atau baru lulus' },
      mahasiswa: { label: 'Mahasiswa', ket: 'Sedang kuliah, di IOU atau di tempat lain' },
      orang_tua: { label: 'Orang tua atau wali', ket: 'Mendampingi anak memilih jalan' },
      guru_bk: { label: 'Guru BK', ket: 'Membimbing siswa soal studi dan karier' },
      guru: { label: 'Guru', ket: 'Mengajar dan ingin memakai Sulu di kelas' },
      umum: { label: 'Umum', ket: 'Ingin menjelajah untuk diri sendiri' },
    },
    judulJenjang: 'Sekarang kamu di mana?',
    jenjang: { kelas_10_11: 'Kelas 10 atau 11', kelas_12: 'Kelas 12', baru_lulus: 'Baru lulus' },
    umur18: 'Saya berumur 18 tahun atau lebih',
    tanyaIou: 'Kamu kuliah di IOU?',
    iouYa: 'Ya, di IOU',
    iouTidak: 'Di kampus lain',
    lanjut: 'Lanjut',
    judulKonfirmasi: 'Cek sekali lagi, ya',
    ringkasan: (p, d) => `Kamu memilih: ${p}, ${d ? '18 tahun atau lebih' : 'di bawah 18 tahun'}.`,
    akibatAnak: 'Untuk di bawah 18 tahun, obrolan bebas dengan Sulu terkunci dan hasilmu hanya tersimpan di perangkat ini, sampai orang tua atau wali memberi izin lewat sekolah.',
    akibatDewasa: 'Untuk 18 tahun ke atas, semua fitur terbuka dan hasilmu bisa tersimpan di akunmu.',
    peringatanKunci: 'Pilihan umur bisa kamu ubah sendiri selama 15 menit. Sesudah itu terkunci, dan perubahannya perlu bantuan admin.',
    yaBenar: 'Ya, sudah benar',
    ubahPilihan: 'Ubah pilihan',
    sisaRalat: (m) => `Masih bisa diubah sendiri sekitar ${m} menit lagi.`,
    terkunci: 'Pilihan umur sudah terkunci.',
    mintaBuka: 'Salah pilih? Minta dibuka',
    mintaBukaTerkirim: 'Permintaanmu sudah sampai ke admin. Pilihanmu akan dibuka secepatnya.',
    judulAktivasi: 'Punya kode dari guru?',
    pengantarAktivasi: 'Masukkan kode peserta dari lembar yang dibagikan guru. Cukup sekali; sesudahnya kamu tinggal masuk dengan akun Google ini.',
    labelKode: 'Kode peserta (8 huruf dan angka)',
    aktifkan: 'Aktifkan',
    peringatanAktivasi: 'Akun Google ini akan tercatat sebagai akun siswa di bawah 18. Kalau ini akun orang tua atau akun lain, jangan lanjutkan.',
    aktivasiBerhasil: (n) => `Kode aktif. Halo, ${n}! Hasilmu sekarang tersimpan di akun ini.`,
    galatKode: {
      kode_tidak_sah: 'Kodenya 8 huruf dan angka. Coba periksa lagi.',
      kode_tidak_dikenal: 'Kode ini tidak dikenal atau sudah tidak berlaku. Tanyakan ke gurumu.',
      kode_sudah_dipakai: 'Kode ini sudah dipakai akun lain. Minta guru atau admin mengurusnya.',
      akun_sudah_terikat_peserta_lain: 'Akun ini sudah terhubung ke kode lain.',
      terlalu_sering: 'Terlalu banyak percobaan. Tunggu 10 menit, ya.',
      lainnya: 'Belum berhasil. Coba lagi sebentar lagi.',
    },
    tamuPengantar: 'Cukup nama panggilan. Sulu tidak meminta nomor HP.',
    modePerangkat: 'Hasilmu hanya tersimpan di perangkat ini dan tidak bisa dibuka dari perangkat lain.',
    modePerangkatKelas: 'Di komputer kelas, hasil di perangkat ini terhapus sendiri satu jam sesudah selesai.',
    hapusPerangkat: 'Hapus dari perangkat ini',
    hapusPerangkatYakin: 'Semua hasil Sulu di perangkat ini akan terhapus dan tidak bisa dikembalikan. Lanjut?',
    hapusPerangkatSelesai: 'Sudah terhapus dari perangkat ini.',
    jembatanTerkunci: 'Minta dihubungkan ke narasumber terbuka sesudah izin orang tua tercatat lewat sekolah. Sementara itu, kamu bisa bertanya langsung ke tim IOU.',
    daftarTungguAnak: 'Mau tahu kabar terbaru? Tanya langsung ke tim IOU. Kamu yang memulai obrolan, dan Sulu tidak menyimpan nomormu.',
  },
  B: {
    judulPeran: 'Siapa kamu di sini?',
    pengantarPeran: 'Satu pilihan saja, supaya Sulu pas untukmu.',
    peran: {
      siswa: { label: 'Siswa', ket: 'SMA, SMK, MA, atau baru lulus' },
      mahasiswa: { label: 'Mahasiswa', ket: 'Sedang kuliah' },
      orang_tua: { label: 'Orang tua/wali', ket: 'Menemani anak menjelajah' },
      guru_bk: { label: 'Guru BK', ket: 'Pendamping studi dan karier siswa' },
      guru: { label: 'Guru', ket: 'Memakai Sulu bersama kelas' },
      umum: { label: 'Umum', ket: 'Menjelajah untuk diri sendiri' },
    },
    judulJenjang: 'Kamu di jenjang mana?',
    jenjang: { kelas_10_11: 'Kelas 10–11', kelas_12: 'Kelas 12', baru_lulus: 'Sudah lulus' },
    umur18: 'Umur saya sudah 18 tahun',
    tanyaIou: 'Mahasiswa IOU?',
    iouYa: 'Ya',
    iouTidak: 'Bukan',
    lanjut: 'Lanjut',
    judulKonfirmasi: 'Sudah pas?',
    ringkasan: (p, d) => `${p}, ${d ? 'sudah 18 tahun' : 'belum 18 tahun'}.`,
    akibatAnak: 'Karena belum 18 tahun, obrolan bebas belum terbuka dan hasilmu disimpan di perangkat ini saja. Begitu izin orang tua masuk lewat sekolah, semuanya terbuka.',
    akibatDewasa: 'Karena sudah 18 tahun, kamu bisa memakai semua fitur dan menyimpan hasil di akun.',
    peringatanKunci: 'Kamu punya 15 menit untuk mengubahnya sendiri. Lewat dari itu, admin yang membantu mengubah.',
    yaBenar: 'Sudah pas',
    ubahPilihan: 'Ganti',
    sisaRalat: (m) => `Sisa waktu untuk mengubah: sekitar ${m} menit.`,
    terkunci: 'Pilihan umur terkunci.',
    mintaBuka: 'Pilihanku keliru',
    mintaBukaTerkirim: 'Terkirim ke admin. Tunggu kabar, ya.',
    judulAktivasi: 'Kode peserta dari sekolah',
    pengantarAktivasi: 'Ketik kode di lembar dari gurumu. Sekali saja, lalu cukup masuk dengan Google.',
    labelKode: 'Kode peserta',
    aktifkan: 'Pakai kode',
    peringatanAktivasi: 'Akun ini akan menjadi akun siswa di bawah 18. Pastikan ini akun Google milikmu sendiri.',
    aktivasiBerhasil: (n) => `Berhasil, ${n}. Mulai sekarang hasilmu tersimpan di akun.`,
    galatKode: {
      kode_tidak_sah: 'Format kode belum pas (8 karakter).',
      kode_tidak_dikenal: 'Kode tidak ditemukan. Cek ke gurumu.',
      kode_sudah_dipakai: 'Kode sudah dipakai. Hubungi guru atau admin.',
      akun_sudah_terikat_peserta_lain: 'Akun ini sudah memakai kode lain.',
      terlalu_sering: 'Kebanyakan mencoba. Coba lagi 10 menit lagi.',
      lainnya: 'Gagal. Coba lagi nanti.',
    },
    tamuPengantar: 'Isi nama panggilan saja. Tidak perlu nomor HP.',
    modePerangkat: 'Hasilmu disimpan di perangkat ini saja.',
    modePerangkatKelas: 'Komputer kelas menghapus hasil satu jam sesudah kamu selesai.',
    hapusPerangkat: 'Hapus hasil di perangkat ini',
    hapusPerangkatYakin: 'Hasil Sulu di perangkat ini akan hilang. Yakin?',
    hapusPerangkatSelesai: 'Terhapus.',
    jembatanTerkunci: 'Fitur ini menunggu izin orang tua lewat sekolah. Kalau mau bertanya sekarang, hubungi tim IOU.',
    daftarTungguAnak: 'Ingin kabar terbaru? Hubungi tim IOU langsung; nomormu tidak disimpan Sulu.',
  },
};
