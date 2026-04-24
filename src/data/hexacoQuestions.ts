// Auto-generated from IndonesianHEXACOPIR_-_60_ITEM.csv
// 60 items, 6 dimensions x 10 items each. Likert 1-5.

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
}

export const hexacoLikertLabels = [
  'Sangat Tidak Setuju',
  'Tidak Setuju',
  'Netral',
  'Setuju',
  'Sangat Setuju',
];

export const hexacoQuestions: HexacoQuestion[] = [
  { id: 1, dimension: 'openness', reverse: true, text: 'Saya akan cukup bosan ketika mengunjungi sebuah pameran seni.' },
  { id: 2, dimension: 'conscientiousness', reverse: false, text: 'Saya membuat rencana dan mengatur segala sesuatu sedemikian rupa agar tidak kelabakan di saat-saat terakhir.' },
  { id: 3, dimension: 'agreeableness', reverse: false, text: 'Saya jarang menyimpan dendam, bahkan terhadap mereka yang telah menyakitiku.' },
  { id: 4, dimension: 'extraversion', reverse: false, text: 'Saya merasa cukup puas dengan keadaan diri saya secara keseluruhan.' },
  { id: 5, dimension: 'emotionality', reverse: false, text: 'Saya akan merasa takut jika harus bepergian dalam cuaca yang buruk.' },
  { id: 6, dimension: 'honesty', reverse: false, text: 'Saya tidak akan menggunakan sanjungan untuk mendapatkan kenaikan gaji atau pangkat di tempat kerja, bahkan jika saya kira itu akan berhasil.' },
  { id: 7, dimension: 'openness', reverse: false, text: 'Saya tertarik untuk mempelajari sejarah dan politik negara-negara lain.' },
  { id: 8, dimension: 'conscientiousness', reverse: false, text: 'Saya sering berusaha sangat keras untuk dapat mencapai target yang saya inginkan.' },
  { id: 9, dimension: 'agreeableness', reverse: true, text: 'Terkadang orang mengatakan bahwa saya terlalu suka mengkritik orang lain.' },
  { id: 10, dimension: 'extraversion', reverse: true, text: 'Saya jarang mengemukakan pendapat dalam diskusi atau rapat.' },
  { id: 11, dimension: 'emotionality', reverse: false, text: 'Terkadang saya tidak bisa untuk tidak mengkhawatirkan hal-hal sepele.' },
  { id: 12, dimension: 'honesty', reverse: true, text: 'Seandainya saya tahu saya tidak akan pernah tertangkap, saya akan bersedia mencuri milyaran rupiah.' },
  { id: 13, dimension: 'openness', reverse: false, text: 'Saya akan menikmati menciptakan karya seni, seperti novel, lagu, atau lukisan.' },
  { id: 14, dimension: 'conscientiousness', reverse: true, text: 'Ketika mengerjakan sesuatu, saya tidak terlalu memperhatikan hal-hal kecil.' },
  { id: 15, dimension: 'agreeableness', reverse: true, text: 'Terkadang orang mengatakan bahwa saya terlalu keras kepala.' },
  { id: 16, dimension: 'extraversion', reverse: false, text: 'Saya lebih suka pekerjaan yang harus banyak berinteraksi dengan orang lain daripada yang harus bekerja sendiri.' },
  { id: 17, dimension: 'emotionality', reverse: false, text: 'Saya butuh seseorang untuk menghibur saya ketika mengalami kejadian yang menyakitkan.' },
  { id: 18, dimension: 'honesty', reverse: false, text: 'Memiliki banyak uang bukanlah hal yang terlalu penting bagi saya.' },
  { id: 19, dimension: 'openness', reverse: true, text: 'Saya rasa memperhatikan ide-ide baru yang sangat tidak biasa itu membuang-buang waktu.' },
  { id: 20, dimension: 'conscientiousness', reverse: true, text: 'Saya membuat keputusan berdasarkan suasana hati daripada pertimbangan matang.' },
  { id: 21, dimension: 'agreeableness', reverse: true, text: 'Orang lain menganggap saya adalah orang yang cepat marah.' },
  { id: 22, dimension: 'extraversion', reverse: false, text: 'Hampir setiap hari saya merasa ceria dan optimis.' },
  { id: 23, dimension: 'emotionality', reverse: false, text: 'Saya jadi ingin menangis ketika melihat orang lain menangis.' },
  { id: 24, dimension: 'honesty', reverse: true, text: 'Saya merasa seharusnya saya lebih dihormati dibandingkan orang kebanyakan.' },
  { id: 25, dimension: 'openness', reverse: false, text: 'Seandainya saja saat ini saya punya kesempatan, saya mau datang ke sebuah konser musik.' },
  { id: 26, dimension: 'conscientiousness', reverse: true, text: 'Saya kadang mengalami kesulitan dalam bekerja karena ketidakrapian saya.' },
  { id: 27, dimension: 'agreeableness', reverse: false, text: 'Sikap saya terhadap mereka yang telah memperlakukan saya dengan buruk adalah “maafkan dan lupakan”.' },
  { id: 28, dimension: 'extraversion', reverse: true, text: 'Saya merasa saya adalah orang yang tidak populer.' },
  { id: 29, dimension: 'emotionality', reverse: false, text: 'Saya sangat takut saat berhadapan dengan bahaya yang mengancam fisik saya.' },
  { id: 30, dimension: 'honesty', reverse: true, text: 'Kalau saya menginginkan sesuatu dari seseorang, lelucon tidak lucu dari orang tersebut pun akan saya tertawakan.' },
  { id: 31, dimension: 'openness', reverse: true, text: 'Saya tidak pernah benar-benar menikmati membaca ensiklopedia.' },
  { id: 32, dimension: 'conscientiousness', reverse: true, text: 'Saya hanya melakukan usaha minimum yang dibutuhkan untuk menyelesaikan pekerjaan saya.' },
  { id: 33, dimension: 'agreeableness', reverse: false, text: 'Saya cenderung bersikap lunak dalam menilai orang lain.' },
  { id: 34, dimension: 'extraversion', reverse: false, text: 'Dalam pertemuan sosial, saya biasanya berinisiatif untuk memulai pembicaraan dengan orang lain.' },
  { id: 35, dimension: 'emotionality', reverse: true, text: 'Dibandingkan kebanyakan orang, saya sangat jarang merasa khawatir.' },
  { id: 36, dimension: 'honesty', reverse: false, text: 'Saya tidak akan pernah menerima suap, bahkan jika  jumlahnya sangat besar sekalipun.' },
  { id: 37, dimension: 'openness', reverse: false, text: 'Orang lain sering mengatakan bahwa saya memiliki imajinasi yang bagus.' },
  { id: 38, dimension: 'conscientiousness', reverse: false, text: 'Saya selalu berusaha untuk akurat dalam bekerja, meskipun itu memakan banyak waktu.' },
  { id: 39, dimension: 'agreeableness', reverse: false, text: 'Saat orang tidak setuju dengan pendapat saya, saya biasanya cukup fleksibel untuk menerimanya.' },
  { id: 40, dimension: 'extraversion', reverse: false, text: 'Hal pertama yang selalu saya lakukan di tempat baru adalah mencari teman baru.' },
  { id: 41, dimension: 'emotionality', reverse: true, text: 'Saya dapat mengatasi situasi sulit tanpa perlu dukungan moral dari orang lain.' },
  { id: 42, dimension: 'honesty', reverse: true, text: 'Saya akan mendapatkan banyak kepuasan dari memiliki barang-barang mewah yang mahal.' },
  { id: 43, dimension: 'openness', reverse: false, text: 'Saya suka orang yang memiliki pandangan tidak konvensional.' },
  { id: 44, dimension: 'conscientiousness', reverse: true, text: 'Saya melakukan banyak kesalahan karena saya tidak berpikir sebelum bertindak.' },
  { id: 45, dimension: 'agreeableness', reverse: false, text: 'Kebanyakan orang cenderung lebih mudah marah daripada saya.' },
  { id: 46, dimension: 'extraversion', reverse: true, text: 'Kebanyakan orang lebih lincah dan dinamis dibandingkan saya.' },
  { id: 47, dimension: 'emotionality', reverse: false, text: 'Saya merasa sangat kehilangan ketika orang dekat saya pergi untuk waktu yang lama.' },
  { id: 48, dimension: 'honesty', reverse: true, text: 'Saya ingin orang-orang tahu bahwa saya ini orang penting berstatus tinggi.' },
  { id: 49, dimension: 'openness', reverse: true, text: 'Saya tidak menganggap diri saya sebagai seorang yang artistik ataupun kreatif.' },
  { id: 50, dimension: 'conscientiousness', reverse: false, text: 'Orang sering menyebut saya sebagai seorang perfeksionis.' },
  { id: 51, dimension: 'agreeableness', reverse: false, text: 'Bahkan saat seseorang melakukan banyak kesalahan, saya jarang mengomel atau menggerutu.' },
  { id: 52, dimension: 'extraversion', reverse: true, text: 'Kadang saya merasa saya ini orang yang tidak berguna.' },
  { id: 53, dimension: 'emotionality', reverse: true, text: 'Saya tidak akan merasa panik meskipun dalam situasi genting.' },
  { id: 54, dimension: 'honesty', reverse: false, text: 'Saya tidak akan berpura-pura menyukai seseorang hanya agar dia mau membantu saya.' },
  { id: 55, dimension: 'openness', reverse: true, text: 'Bagi saya, diskusi filosofis itu membosankan.' },
  { id: 56, dimension: 'conscientiousness', reverse: true, text: 'Saya lebih memilih untuk bertindak spontan daripada mengikuti rencana.' },
  { id: 57, dimension: 'agreeableness', reverse: true, text: 'Ketika orang lain mengatakan bahwa saya salah, reaksi pertama saya adalah membantah mereka.' },
  { id: 58, dimension: 'extraversion', reverse: false, text: 'Ketika berada dalam sebuah kelompok, saya sering menjadi seseorang yang berbicara mewakili kelompok tersebut.' },
  { id: 59, dimension: 'emotionality', reverse: true, text: 'Saya tetap tidak merasakan apapun meskipun berada dalam situasi yang membuat banyak orang menjadi sangat sentimental.' },
  { id: 60, dimension: 'honesty', reverse: true, text: 'Saya akan tergoda untuk menggunakan uang palsu, jika saya yakin tidak akan ketahuan.' },
];
