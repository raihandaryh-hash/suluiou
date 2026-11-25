// Kemampuan adaptasi karier: Career Adapt-Abilities Scale (CAAS-International, 24 butir; Savickas & Porfeli 2012).
// Empat dimensi: kepedulian (concern), kontrol (control), keingintahuan (curiosity), keyakinan (confidence), 6 butir masing-masing.
// Teks Indonesia: adaptasi Purwoko, Wibowo & Japar (2020), Jurnal Bimbingan Konseling UNNES 9(2), reliabilitas 0,77-0,85
//   https://journal.unnes.ac.id/sju/jubk/article/download/37036/15268 (dibaca 25 Nov 2026).
// Formulir asli dibagikan bebas oleh penyusunnya: https://www.marksavickas.com/files/Assessments/CAAS/1.%20CAAS%20master.pdf
//   (© Mark L. Savickas & Erik J. Porfeli). Katalog EdInstruments mencatat Open Access: Yes (https://edinstruments.org/node/534).
// Dasar paket: Buku Sulu v1.4 (paket untuk Mbak Satwika: "kemampuan adaptasi karier (calon: CAAS versi Indonesia)");
//   RB-2 dan White Paper Bab 7 (ukuran pra-pasca pilot CAAS-ID).
// ID 201-224, disimpan bersama jawaban kepribadian (medan angka) tanpa mengubah skema basis data.
// Label skala Indonesia: DRAF Chief Sulu (artikel hanya memuat label Inggris), menunggu tinjauan SME.

export type CaasDimensi = 'kepedulian' | 'kontrol' | 'keingintahuan' | 'keyakinan';

export interface CaasQuestion {
  id: number;
  dimensi: CaasDimensi;
  text: string;
  asli: string;
}

export const caasLabels = ['Tidak kuat', 'Cukup kuat', 'Kuat', 'Sangat kuat', 'Paling kuat'];

export const caasDimensiLabel: Record<CaasDimensi, string> = {
  kepedulian: 'Kepedulian pada masa depan',
  kontrol: 'Kendali atas pilihan',
  keingintahuan: 'Keingintahuan menjelajah',
  keyakinan: 'Keyakinan menyelesaikan',
};

export const instrumenAdaptasi = {
  nama: 'CAAS (versi Indonesia)',
  petunjuk:
    'Tiap orang memakai kekuatan yang berbeda untuk membangun kariernya. Tidak ada yang hebat dalam semua hal. Seberapa kuat kamu sudah mengembangkan tiap kemampuan di bawah ini?',
  atribusi: 'Career Adapt-Abilities Scale © Mark L. Savickas & Erik J. Porfeli. Versi Indonesia: Purwoko, Wibowo & Japar (2020).',
};

const Q = (id: number, dimensi: CaasDimensi, text: string, asli: string): CaasQuestion => ({ id, dimensi, text, asli });

export const caasQuestions: CaasQuestion[] = [
  Q(201, 'kepedulian', 'Memikirkan seperti apa masa depan saya', 'Thinking about what my future will be like'),
  Q(202, 'kepedulian', 'Menyadari bahwa pilihan saya sekarang akan menentukan masa depan saya', "Realizing that today's choices shape my future"),
  Q(203, 'kepedulian', 'Menyiapkan masa depan saya', 'Preparing for the future'),
  Q(204, 'kepedulian', 'Menyadari akan pilihan pendidikan dan keterampilan yang harus saya ambil', 'Becoming aware of the educational and vocational choices that I must make'),
  Q(205, 'kepedulian', 'Merencanakan cara mencapai tujuan saya', 'Planning how to achieve my goals'),
  Q(206, 'kepedulian', 'Memperhatikan karier saya', 'Concerned about my career'),
  Q(207, 'kontrol', 'Selalu optimis', 'Keeping upbeat'),
  Q(208, 'kontrol', 'Membuat keputusan sendiri', 'Making decisions by myself'),
  Q(209, 'kontrol', 'Bertanggung jawab atas perbuatan saya', 'Taking responsibility for my actions'),
  Q(210, 'kontrol', 'Teguh dengan keyakinan saya', 'Sticking up for my beliefs'),
  Q(211, 'kontrol', 'Mengandalkan diri sendiri', 'Counting on myself'),
  // 212: teks Purwoko dkk. (2020) dipertahankan; catatan SME: "right" lebih dekat ke "tepat" daripada "baik".
  Q(212, 'kontrol', 'Melakukan yang baik bagi diri sendiri', "Doing what's right for me"),
  Q(213, 'keingintahuan', 'Mengeksplorasi lingkungan saya', 'Exploring my surroundings'),
  Q(214, 'keingintahuan', 'Mencari kesempatan untuk berkembang sebagai pribadi', 'Looking for opportunities to grow as a person'),
  Q(215, 'keingintahuan', 'Menyelidiki pilihan sebelum membuat keputusan', 'Investigating options before making a choice'),
  Q(216, 'keingintahuan', 'Mengamati berbagai cara dalam melakukan sesuatu', 'Observing different ways of doing things'),
  Q(217, 'keingintahuan', 'Menyelidiki dengan mendalam pertanyaan yang saya miliki', 'Probing deeply into questions I have'),
  Q(218, 'keingintahuan', 'Selalu ingin tahu tentang kesempatan baru', 'Becoming curious about new opportunities'),
  Q(219, 'keyakinan', 'Mengerjakan tugas secara efisien', 'Performing tasks efficiently'),
  Q(220, 'keyakinan', 'Berhati-hati untuk melakukan sesuatu dengan baik', 'Taking care to do things well'),
  Q(221, 'keyakinan', 'Mempelajari keterampilan baru', 'Learning new skills'),
  Q(222, 'keyakinan', 'Bekerja dengan kemampuan saya', 'Working up to my ability'),
  Q(223, 'keyakinan', 'Mengatasi rintangan', 'Overcoming obstacles'),
  Q(224, 'keyakinan', 'Menyelesaikan masalah', 'Solving problems'),
];

/** Rerata 1-5 per dimensi; null bila dimensi belum dijawab. */
export function skorCaas(jawaban: Record<number, number>): Record<CaasDimensi, number | null> {
  const out = {} as Record<CaasDimensi, number | null>;
  (Object.keys(caasDimensiLabel) as CaasDimensi[]).forEach((d) => {
    const nilai = caasQuestions.filter((q) => q.dimensi === d).map((q) => jawaban[q.id]).filter((v) => typeof v === 'number');
    out[d] = nilai.length ? nilai.reduce((a, b) => a + b, 0) / nilai.length : null;
  });
  return out;
}
