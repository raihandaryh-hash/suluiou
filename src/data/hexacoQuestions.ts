// HEXACO-PIR 60 item (Indonesian version - Widyanti & Sugiarto)
// 6 dimensi × 10 item. Skala 1-5 (Sangat Tidak Setuju → Sangat Setuju).
// `reverse: true` artinya skor dibalik (6 - jawaban) saat scoring.

export type HexacoDimension =
  | 'honesty'
  | 'emotionality'
  | 'extraversion'
  | 'agreeableness'
  | 'conscientiousness'
  | 'openness';

export interface HexacoItem {
  id: number;          // 1-60, urutan penyajian (sesuai CSV "60 que")
  scaleOrder: number;  // urutan asli skala (kolom "60 scale")
  varName: string;     // kode item (e.g. Oaesa1)
  dimension: HexacoDimension;
  reverse: boolean;
  text: string;
}

// Mapping prefix kode → dimensi HEXACO
// H = Honesty, E = Emotionality, X = eXtraversion,
// A = Agreeableness, C = Conscientiousness, O = Openness
const prefixToDim: Record<string, HexacoDimension> = {
  H: 'honesty',
  E: 'emotionality',
  X: 'extraversion',
  A: 'agreeableness',
  C: 'conscientiousness',
  O: 'openness',
};

function dimOf(varName: string): HexacoDimension {
  return prefixToDim[varName[0]];
}

// Disusun sesuai urutan penyajian (kolom "60 que" di CSV).
// Urutan ini sengaja interleaved antar-dimensi untuk mengurangi response bias.
const raw: Array<[number, number, string, boolean, string]> = [
  [1, 51, 'Oaesa1', true, 'Saya akan cukup bosan ketika mengunjungi sebuah pameran seni.'],
  [2, 41, 'Corga3', false, 'Saya membuat rencana dan mengatur segala sesuatu sedemikian rupa agar tidak kelabakan di saat-saat terakhir.'],
  [3, 31, 'Aforg1', false, 'Saya jarang menyimpan dendam, bahkan terhadap mereka yang telah menyakitiku.'],
  [4, 21, 'Xsses1', false, 'Saya merasa cukup puas dengan keadaan diri saya secara keseluruhan.'],
  [5, 11, 'Efear1', false, 'Saya akan merasa takut jika harus bepergian dalam cuaca yang buruk.'],
  [6, 1, 'Hsinc4', false, 'Saya tidak akan menggunakan sanjungan untuk mendapatkan kenaikan gaji atau pangkat di tempat kerja, bahkan jika saya kira itu akan berhasil.'],
  [7, 53, 'Oinqu1', false, 'Saya tertarik untuk mempelajari sejarah dan politik negara-negara lain.'],
  [8, 43, 'Cdili2', false, 'Saya sering berusaha sangat keras untuk dapat mencapai target yang saya inginkan.'],
  [9, 33, 'Agent4', true, 'Terkadang orang mengatakan bahwa saya terlalu suka mengkritik orang lain.'],
  [10, 24, 'Xsocb2', true, 'Saya jarang mengemukakan pendapat dalam diskusi atau rapat.'],
  [11, 14, 'Eanxi1', false, 'Terkadang saya tidak bisa untuk tidak mengkhawatirkan hal-hal sepele.'],
  [12, 4, 'Hfair1', true, 'Seandainya saya tahu saya tidak akan pernah tertangkap, saya akan bersedia mencuri milyaran rupiah.'],
  [13, 55, 'Ocrea6', false, 'Saya akan menikmati menciptakan karya seni, seperti novel, lagu, atau lukisan.'],
  [14, 45, 'Cperf2', true, 'Ketika mengerjakan sesuatu, saya tidak terlalu memperhatikan hal-hal kecil.'],
  [15, 36, 'Aflex1', true, 'Terkadang orang mengatakan bahwa saya terlalu keras kepala.'],
  [16, 27, 'Xsoci5', false, 'Saya lebih suka pekerjaan yang harus banyak berinteraksi dengan orang lain daripada yang harus bekerja sendiri.'],
  [17, 16, 'Edepe3', false, 'Saya butuh seseorang untuk menghibur saya ketika mengalami kejadian yang menyakitkan.'],
  [18, 7, 'Hgree2', false, 'Memiliki banyak uang bukanlah hal yang terlalu penting bagi saya.'],
  [19, 58, 'Ounco2', true, 'Saya rasa memperhatikan ide-ide baru yang sangat tidak biasa itu membuang-buang waktu.'],
  [20, 48, 'Cprud2', true, 'Saya membuat keputusan berdasarkan suasana hati daripada pertimbangan matang.'],
  [21, 39, 'Apati2', true, 'Orang lain menganggap saya adalah orang yang cepat marah.'],
  [22, 29, 'Xlive3', false, 'Hampir setiap hari saya merasa ceria dan optimis.'],
  [23, 18, 'Esent1', false, 'Saya jadi ingin menangis ketika melihat orang lain menangis.'],
  [24, 9, 'Hmode6', true, 'Saya merasa seharusnya saya lebih dihormati dibandingkan orang kebanyakan.'],
  [25, 52, 'Oaesa4', false, 'Seandainya saja saat ini saya punya kesempatan, saya mau datang ke sebuah konser musik.'],
  [26, 42, 'Corga8', true, 'Saya kadang mengalami kesulitan dalam bekerja karena ketidakrapian saya.'],
  [27, 32, 'Aforg3', false, 'Sikap saya terhadap mereka yang telah memperlakukan saya dengan buruk adalah "maafkan dan lupakan".'],
  [28, 22, 'Xsses5', true, 'Saya merasa saya adalah orang yang tidak populer.'],
  [29, 12, 'Efear7', false, 'Saya sangat takut saat berhadapan dengan bahaya yang mengancam fisik saya.'],
  [30, 2, 'Hsinc5', true, 'Kalau saya menginginkan sesuatu dari seseorang, lelucon tidak lucu dari orang tersebut pun akan saya tertawakan.'],
  [31, 54, 'Oinqu8', true, 'Saya tidak pernah benar-benar menikmati membaca ensiklopedia.'],
  [32, 44, 'Cdili6', true, 'Saya hanya melakukan usaha minimum yang dibutuhkan untuk menyelesaikan pekerjaan saya.'],
  [33, 34, 'Agent6', false, 'Saya cenderung bersikap lunak dalam menilai orang lain.'],
  [34, 25, 'Xsocb3', false, 'Dalam pertemuan sosial, saya biasanya berinisiatif untuk memulai pembicaraan dengan orang lain.'],
  [35, 15, 'Eanxi4', true, 'Dibandingkan kebanyakan orang, saya sangat jarang merasa khawatir.'],
  [36, 5, 'Hfair6', false, 'Saya tidak akan pernah menerima suap, bahkan jika jumlahnya sangat besar sekalipun.'],
  [37, 56, 'Ocrea7', false, 'Orang lain sering mengatakan bahwa saya memiliki imajinasi yang bagus.'],
  [38, 46, 'Cperf3', false, 'Saya selalu berusaha untuk akurat dalam bekerja, meskipun itu memakan banyak waktu.'],
  [39, 37, 'Aflex5', false, 'Saat orang tidak setuju dengan pendapat saya, saya biasanya cukup fleksibel untuk menerimanya.'],
  [40, 28, 'Xsoci6', false, 'Hal pertama yang selalu saya lakukan di tempat baru adalah mencari teman baru.'],
  [41, 17, 'Edepe6', true, 'Saya dapat mengatasi situasi sulit tanpa perlu dukungan moral dari orang lain.'],
  [42, 8, 'Hgree7', true, 'Saya akan mendapatkan banyak kepuasan dari memiliki barang-barang mewah yang mahal.'],
  [43, 59, 'Ounco5', false, 'Saya suka orang yang memiliki pandangan tidak konvensional.'],
  [44, 49, 'Cprud3', true, 'Saya melakukan banyak kesalahan karena saya tidak berpikir sebelum bertindak.'],
  [45, 40, 'Apati4', false, 'Kebanyakan orang cenderung lebih mudah marah daripada saya.'],
  [46, 30, 'Xlive7', true, 'Kebanyakan orang lebih lincah dan dinamis dibandingkan saya.'],
  [47, 19, 'Esent3', false, 'Saya merasa sangat kehilangan ketika orang dekat saya pergi untuk waktu yang lama.'],
  [48, 10, 'Hmode8', true, 'Saya ingin orang-orang tahu bahwa saya ini orang penting berstatus tinggi.'],
  [49, 57, 'Ocrea8', true, 'Saya tidak menganggap diri saya sebagai seorang yang artistik ataupun kreatif.'],
  [50, 47, 'Cperf4', false, 'Orang sering menyebut saya sebagai seorang perfeksionis.'],
  [51, 35, 'Agent7', false, 'Bahkan saat seseorang melakukan banyak kesalahan, saya jarang mengomel atau menggerutu.'],
  [52, 23, 'Xsses8', true, 'Kadang saya merasa saya ini orang yang tidak berguna.'],
  [53, 13, 'Efear8', true, 'Saya tidak akan merasa panik meskipun dalam situasi genting.'],
  [54, 3, 'Hsinc6', false, 'Saya tidak akan berpura-pura menyukai seseorang hanya agar dia mau membantu saya.'],
  [55, 60, 'Ounco8', true, 'Bagi saya, diskusi filosofis itu membosankan.'],
  [56, 50, 'Cprud8', true, 'Saya lebih memilih untuk bertindak spontan daripada mengikuti rencana.'],
  [57, 38, 'Aflex7', true, 'Ketika orang lain mengatakan bahwa saya salah, reaksi pertama saya adalah membantah mereka.'],
  [58, 26, 'Xsocb4', false, 'Ketika berada dalam sebuah kelompok, saya sering menjadi seseorang yang berbicara mewakili kelompok tersebut.'],
  [59, 20, 'Esent7', true, 'Saya tetap tidak merasakan apapun meskipun berada dalam situasi yang membuat banyak orang menjadi sangat sentimental.'],
  [60, 6, 'Hfair8', true, 'Saya akan tergoda untuk menggunakan uang palsu, jika saya yakin tidak akan ketahuan.'],
];

export const hexacoQuestions: HexacoItem[] = raw.map(([id, scaleOrder, varName, reverse, text]) => ({
  id,
  scaleOrder,
  varName,
  dimension: dimOf(varName),
  reverse,
  text,
}));

export const hexacoLikertLabels = [
  'Sangat Tidak Setuju',
  'Tidak Setuju',
  'Netral',
  'Setuju',
  'Sangat Setuju',
];

export const hexacoDimensionLabels: Record<HexacoDimension, string> = {
  honesty: 'Kejujuran-Kerendahhatian',
  emotionality: 'Emosionalitas',
  extraversion: 'Ekstraversi',
  agreeableness: 'Keramahan',
  conscientiousness: 'Keteraturan',
  openness: 'Keterbukaan Pengalaman',
};
