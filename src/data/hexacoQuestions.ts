// Kepribadian: Mini-IPIP6 (24 butir, enam faktor "Big Six"), butir International Personality Item Pool (domain publik).
// Sumber butir: https://ipip.ori.org/MiniIPIP6Key.htm (dibaca 25 Nov 2026).
// Rujukan: Sibley dkk. (2011) NZ Journal of Psychology 40(3), 142-158; Sibley (2012) NZJP 41, 21-31;
//          Milojev dkk. (2013) Journal of Research in Personality 47, 936-944.
// KEPUTUSAN Raihan 25 Nov 10.25 "Lisensi dua instrumen, ke yang terbuka." menggantikan HEXACO-PI-R 60
// (lisensi hanya riset akademik nirlaba, hexaco.org/hexaco-inventory).
// Nama berkas dan kunci dimensi dipertahankan supaya alur, skor, dan data lama tidak patah.
// Catatan konstruk: kunci 'emotionality' di sini berisi Neuroticism Mini-IPIP6 (kepekaan emosi), bukan Emotionality HEXACO;
// 'agreeableness' berisi Agreeableness Big Five (empati), bukan Agreeableness HEXACO (kesabaran).
// Terjemahan Indonesia: DRAF Chief Sulu, menunggu terjemah balik dan tinjauan SME (Mbak Satwika). Teks Inggris disimpan di `asli`.
// ID 101-124 supaya tidak bertabrakan dengan jawaban HEXACO-PI-R lama (1-60) yang tersimpan.

export type HexacoDimension =
  | 'honesty'
  | 'emotionality'
  | 'extraversion'
  | 'agreeableness'
  | 'conscientiousness'
  | 'openness';

export interface HexacoQuestion {
  id: number;
  dimension: HexacoDimension;
  reverse: boolean;
  text: string;
  /** Teks butir IPIP asli (Inggris). */
  asli: string;
}

export const hexacoLikertLabels = [
  'Sangat Tidak Sesuai',
  'Tidak Sesuai',
  'Netral',
  'Sesuai',
  'Sangat Sesuai',
];

export const instrumenKepribadian = {
  nama: 'Mini-IPIP6',
  lisensi: 'Butir IPIP domain publik (ipip.ori.org)',
  sumber: 'https://ipip.ori.org/MiniIPIP6Key.htm',
  petunjuk: 'Seberapa sesuai tiap pernyataan dengan dirimu yang sekarang? Tidak ada jawaban benar atau salah.',
};

const B = (id: number, dimension: HexacoDimension, reverse: boolean, text: string, asli: string): HexacoQuestion =>
  ({ id, dimension, reverse, text, asli });

// Urutan diselang-seling antarfaktor supaya butir sefaktor tidak berdempetan.
export const hexacoQuestions: HexacoQuestion[] = [
  B(101, 'extraversion', false, 'Saya menjadi penghidup suasana saat berkumpul.', 'Am the life of the party.'),
  B(102, 'agreeableness', false, 'Saya ikut merasakan perasaan orang lain.', "Sympathize with others' feelings."),
  B(103, 'conscientiousness', false, 'Saya langsung menyelesaikan pekerjaan rutin.', 'Get chores done right away.'),
  B(104, 'emotionality', false, 'Suasana hati saya sering berubah-ubah.', 'Have frequent mood swings.'),
  B(105, 'openness', false, 'Imajinasi saya hidup.', 'Have a vivid imagination.'),
  B(106, 'honesty', true, 'Saya merasa berhak mendapatkan lebih dari segalanya.', 'Feel entitled to more of everything.'),
  B(107, 'extraversion', true, 'Saya tidak banyak bicara.', "Don't talk a lot."),
  B(108, 'agreeableness', true, 'Saya tidak terlalu tertarik pada orang lain.', 'Am not really interested in others.'),
  B(109, 'conscientiousness', true, 'Saya sering lupa mengembalikan barang ke tempatnya.', 'Often forget to put things back in their proper place.'),
  B(110, 'emotionality', true, 'Saya merasa tenang hampir sepanjang waktu.', 'Am relaxed most of the time.'),
  B(111, 'openness', true, 'Saya sulit memahami gagasan abstrak.', 'Have difficulty understanding abstract ideas.'),
  B(112, 'honesty', true, 'Saya pantas mendapatkan lebih banyak hal dalam hidup.', 'Deserve more things in life.'),
  B(113, 'extraversion', false, 'Saya mengobrol dengan banyak orang berbeda saat berkumpul.', 'Talk to a lot of different people at parties.'),
  B(114, 'agreeableness', false, 'Saya bisa merasakan emosi orang lain.', "Feel others' emotions."),
  B(115, 'conscientiousness', false, 'Saya menyukai keteraturan.', 'Like order.'),
  B(116, 'emotionality', false, 'Saya mudah merasa kesal.', 'Get upset easily.'),
  B(117, 'openness', true, 'Saya tidak tertarik pada gagasan abstrak.', 'Am not interested in abstract ideas.'),
  B(118, 'honesty', true, 'Saya ingin terlihat mengendarai mobil yang sangat mahal.', 'Would like to be seen driving around in a very expensive car.'),
  B(119, 'extraversion', true, 'Saya cenderung tidak menonjolkan diri.', 'Keep in the background.'),
  B(120, 'agreeableness', true, 'Saya tidak tertarik pada masalah orang lain.', "Am not interested in other people's problems."),
  B(121, 'conscientiousness', true, 'Saya sering membuat berantakan.', 'Make a mess of things.'),
  B(122, 'emotionality', true, 'Saya jarang merasa murung.', 'Seldom feel blue.'),
  B(123, 'openness', true, 'Imajinasi saya kurang baik.', 'Do not have a good imagination.'),
  B(124, 'honesty', true, 'Saya akan sangat senang memiliki barang mewah yang mahal.', 'Would get a lot of pleasure from owning expensive luxury goods.'),
];
