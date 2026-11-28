// Kenali Dirimu · tujuh kompetensi. Skill map K3 · PUTUSAN ATAS DELEGASI Chief Sulu 29 Nov 2026 atas kata Raihan
// 3 Jun 2026: «Jadi tak ada pengukuran apa-apa, tak ada algoritma ribet.», «jangan sampai ini jadi asesmen»,
// «bagaimana supaya tak menimbulkan Dunning-Kruger effect?» (berkas skill map §7.23, §7.28).
// Dasar riset: penilaian diri atas kemampuan hanya berkorelasi sedang dengan kinerja (rerata r = .29 dari 22
// meta-analisis) dan lebih akurat bila spesifik dan berpijak pada hal yang benar-benar pernah dilakukan
// (Zell & Krizan, 2014, Perspectives on Psychological Science 9(2), 111-125, doi:10.1177/1745691613518075).
// Maka pertanyaannya diganti: bukan "seberapa percaya diri", melainkan "seberapa sering sudah melakukannya".
// Nilai lama (belum, sedang, percaya) tetap tersimpan di `ratings` dan tidak ditampilkan, karena maknanya berbeda.
// Dua varian pengantar; VARIAN_AKTIF memilih (A atas delegasi; Raihan bisa mengganti ke B).

export type Pengalaman = "belum_pernah" | "sesekali" | "sering";

export const PILIHAN_PENGALAMAN: { value: Pengalaman; label: string }[] = [
  { value: "belum_pernah", label: "Belum pernah" },
  { value: "sesekali", label: "Pernah, sesekali" },
  { value: "sering", label: "Sering saya praktikkan" },
];

const PENGANTAR = {
  A: "Tujuh kompetensi berikut adalah bekal yang relevan di dunia kerja masa kini. Kamu tidak perlu menguasai semuanya sekarang. Untuk tiap kompetensi, ingat-ingat seberapa sering kamu benar-benar mempraktikkannya: di kelas, di rumah, di organisasi, atau saat membantu orang. Ini bukan ujian dan bukan penilaian kemampuan, hanya catatan pengalaman supaya kamu tahu dari mana bisa mulai.",
  B: "Tujuh kompetensi berikut adalah bekal yang relevan di dunia kerja masa kini. Yang ditanyakan di sini bukan seberapa hebat kamu, tapi seberapa sering kamu sudah mempraktikkannya: di sekolah, di rumah, atau di kegiatan apa pun. Tidak ada jawaban yang salah.",
} as const;
export const VARIAN_AKTIF: keyof typeof PENGANTAR = "A";
export const pengantarKompetensi = PENGANTAR[VARIAN_AKTIF];

// Untuk pengguna yang pernah mengisi skala lama (ratings) tetapi belum mengisi catatan pengalaman.
export const catatanSkalaBaru =
  "Pertanyaan di bagian ini sudah kami ubah. Sekarang yang ditanyakan adalah seberapa sering kamu mempraktikkan tiap kompetensi. Isi lagi, ya.";
