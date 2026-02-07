import type { Dimension } from './questions';

export interface Pathway {
  id: string;
  name: string;
  faculty: string;
  icon: string;
  description: string;
  careers: string[];
  localIndustries: string[];
  weights: Partial<Record<Dimension, number>>;
  projectionTemplates: string[];
}

export const pathways: Pathway[] = [
  {
    id: 'business',
    name: 'Business Administration',
    faculty: 'Faculty of Business',
    icon: '📊',
    description:
      'Membangun fondasi kewirausahaan dan manajemen bisnis yang kuat untuk menggerakkan ekonomi Indonesia.',
    careers: [
      'Entrepreneur',
      'Business Consultant',
      'Marketing Manager',
      'Financial Analyst',
      'Startup Founder',
    ],
    localIndustries: [
      'UMKM Digital',
      'E-commerce Lokal',
      'Franchise F&B',
      'Agribisnis Modern',
      'Fintech',
    ],
    weights: {
      enterprising: 3,
      conscientiousness: 3,
      extraversion: 2,
      conventional: 2,
      honesty: 2,
    },
    projectionTemplates: [
      'Tahun 2030. Kamu baru saja menutup laptop setelah meeting virtual dengan tim-mu yang terdiri dari 12 orang. Bisnis digital yang kamu rintis saat masih kuliah semester 4 kini sudah melayani lebih dari 500 UMKM di Jawa Timur. Keberanianmu mengambil risiko, dikombinasikan dengan kemampuan manajemen yang kamu asah, membuat para investor percaya pada visimu. Hari ini, kamu bukan hanya pengusaha — kamu adalah pembuka lapangan kerja.',
      'Tahun 2030. Di usiamu yang masih muda, kamu sudah menjadi konsultan bisnis yang dipercaya oleh jaringan UMKM di kotamu. Kejelianmu membaca pasar dan kedisiplinanmu dalam mengelola data membuat setiap rekomendasi yang kamu berikan selalu tepat sasaran. Kamu membuktikan bahwa gelar tidak harus dari kampus mahal untuk bisa memberikan dampak nyata.',
    ],
  },
  {
    id: 'it',
    name: 'Information Technology',
    faculty: 'Faculty of IT',
    icon: '💻',
    description:
      'Menguasai teknologi yang menggerakkan dunia digital, dari pengembangan software hingga keamanan siber.',
    careers: [
      'Software Developer',
      'Data Analyst',
      'Cybersecurity Specialist',
      'AI Engineer',
      'Tech Startup Founder',
    ],
    localIndustries: [
      'Startup Teknologi',
      'Digital Agency',
      'Sistem Informasi Pemerintah',
      'EdTech',
      'HealthTech',
    ],
    weights: {
      investigative: 3,
      openness: 3,
      realistic: 2,
      conscientiousness: 2,
      conventional: 1,
    },
    projectionTemplates: [
      'Tahun 2030. Layar monitormu menampilkan dashboard sistem yang kamu bangun untuk sebuah rumah sakit daerah. Sistem AI yang kamu kembangkan mampu memprediksi kebutuhan obat dengan akurasi 94%. Rasa ingin tahumu yang tak pernah padam dan kemampuan analitismu membawamu dari seorang mahasiswa IT biasa menjadi problem-solver yang dicari banyak institusi.',
      'Tahun 2030. Kamu baru saja mendapat kontrak dari sebuah perusahaan logistik untuk mengembangkan sistem optimasi rute pengiriman. Tim remote-mu tersebar di 3 kota berbeda. Kemampuanmu memecahkan masalah kompleks dan ketekunanmu mempelajari teknologi baru menjadikanmu aset yang tak tergantikan di era digital ini.',
    ],
  },
  {
    id: 'psychology',
    name: 'Psychology',
    faculty: 'Faculty of Psychology',
    icon: '🧠',
    description:
      'Memahami jiwa manusia untuk membantu individu dan organisasi mencapai potensi terbaiknya.',
    careers: [
      'Konselor',
      'HR Specialist',
      'UX Researcher',
      'Organizational Psychologist',
      'Life Coach',
    ],
    localIndustries: [
      'Layanan Konseling',
      'HR Consulting',
      'Wellness Industry',
      'UX Design Agency',
      'NGO Sosial',
    ],
    weights: {
      social: 3,
      agreeableness: 3,
      emotionality: 2,
      openness: 2,
      investigative: 2,
    },
    projectionTemplates: [
      'Tahun 2030. Kamu baru saja menyelesaikan sesi konseling online dengan seorang remaja di pelosok Kalimantan. Platform konseling digital yang kamu dirikan bersama 2 temanmu kini sudah menjangkau lebih dari 10.000 anak muda Indonesia. Empatimu yang natural dan kemampuanmu memahami orang lain bukan sekadar bakat — itu adalah senjata untuk mengubah kesehatan mental generasi ini.',
      'Tahun 2030. Sebagai HR Psychologist di sebuah perusahaan teknologi, kamu baru saja merancang program wellbeing yang menurunkan tingkat burnout karyawan sebesar 40%. Kepekaan emosionalmu dan kemampuan analisis perilaku manusia menjadikanmu orang yang paling dicari saat perusahaan butuh membangun budaya kerja yang sehat.',
    ],
  },
  {
    id: 'education',
    name: 'Education',
    faculty: 'Faculty of Education',
    icon: '📚',
    description:
      'Membentuk generasi masa depan melalui pendidikan yang inovatif dan memberdayakan.',
    careers: [
      'Guru Inovatif',
      'Curriculum Designer',
      'EdTech Specialist',
      'Education Consultant',
      'Training Manager',
    ],
    localIndustries: [
      'Lembaga Pendidikan',
      'Bimbingan Belajar Digital',
      'Corporate Training',
      'Pesantren Modern',
      'EdTech Startup',
    ],
    weights: {
      social: 3,
      conscientiousness: 3,
      agreeableness: 2,
      extraversion: 2,
      openness: 1,
    },
    projectionTemplates: [
      'Tahun 2030. Metode pembelajaran yang kamu kembangkan saat skripsi kini sudah diadopsi oleh 50 sekolah di Indonesia. Kamu bukan guru biasa — kamu adalah arsitek pendidikan yang menggabungkan teknologi dengan sentuhan manusiawi. Kesabaranmu dan kemampuanmu mengorganisir kurikulum membuat setiap siswa merasa dilihat dan dipahami.',
      'Tahun 2030. Platform e-learning yang kamu rintis khusus untuk anak-anak pesantren kini sudah memiliki 25.000 pengguna aktif. Semangatmu untuk berbagi ilmu dan kedisiplinanmu dalam membuat konten berkualitas membuktikan bahwa pendidikan berkualitas tidak harus mahal.',
    ],
  },
  {
    id: 'islamic-studies',
    name: 'Islamic Studies',
    faculty: 'Faculty of Islamic Studies',
    icon: '🌙',
    description:
      'Mendalami ilmu Islam yang relevan dengan tantangan kontemporer dan membangun kepemimpinan berbasis nilai.',
    careers: [
      'Islamic Finance Specialist',
      'Halal Industry Consultant',
      'Community Leader',
      'Islamic Content Creator',
      'Shariah Advisor',
    ],
    localIndustries: [
      'Perbankan Syariah',
      'Industri Halal',
      'Wakaf Produktif',
      'Media Dakwah Digital',
      'Wisata Halal',
    ],
    weights: {
      openness: 3,
      honesty: 3,
      social: 2,
      artistic: 1,
      conscientiousness: 2,
    },
    projectionTemplates: [
      'Tahun 2030. Kamu baru saja selesai memberikan konsultasi shariah untuk sebuah startup fintech yang ingin meluncurkan produk investasi halal. Pemahamanmu yang mendalam tentang prinsip-prinsip Islam, dikombinasikan dengan keterbukaan pikiranmu terhadap inovasi, menjadikanmu jembatan antara tradisi dan modernitas. Industri halal global bernilai $7 triliun, dan kamu ada di garis depannya.',
      'Tahun 2030. Channel YouTube-mu tentang Islamic financial literacy sudah memiliki 500.000 subscriber. Kejujuranmu dalam menyampaikan ilmu dan kemampuanmu mengemas konten yang relevan dengan kehidupan anak muda membuktikan bahwa ilmu agama dan kesuksesan dunia bukan dua hal yang terpisah.',
    ],
  },
];