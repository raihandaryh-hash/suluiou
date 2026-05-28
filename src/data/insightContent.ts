// All textual content, numbers, and narrative for the Insight page (/insight).
// This file holds the DEFAULTS. Admins can override these via /admin/insight,
// which writes to the `site_content` table (slug = 'insight').
// Components only render — they never hardcode strings.

export type Tone = 'negative' | 'positive' | 'neutral';

export interface StatCardContent {
  value: string;
  label: string;
  detail: string;
  source: string;
  tone?: Tone;
}

export interface NeetRow {
  country: string;
  value: number;
  color: string; // tailwind bg-* class
}

export interface OpportunityItem {
  title: string;
  body: string;
}

export interface InsightContent {
  meta: {
    countdownTargetIso: string;
    neetChartMaxPercent: number;
  };
  nav: {
    backLabel: string;
    backHref: string;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    countdown: {
      yearsSuffix: string;
      monthsSuffix: string;
      demographic: { value: string; label: string };
    };
    cta: { label: string; href: string };
  };
  indonesiaSection: {
    eyebrow: string;
    cards: StatCardContent[];
  };
  neetSection: {
    eyebrow: string;
    source: string;
    rows: NeetRow[];
  };
  worldSection: {
    eyebrow: string;
    cards: StatCardContent[];
  };
  opportunitiesSection: {
    eyebrow: string;
    items: OpportunityItem[];
  };
  ctaSection: {
    titleLine1: string;
    titleLine2: string;
    primaryCta: { label: string; href: string };
    footer: {
      body: string;
      cta: { label: string; href: string };
    };
  };
  labels: {
    sourcePrefix: string;
  };
}

export const defaultInsightContent: InsightContent = {
  meta: {
    countdownTargetIso: '2030-01-01',
    neetChartMaxPercent: 25,
  },
  nav: {
    backLabel: 'Kembali',
    backHref: '/',
  },
  hero: {
    titleLine1: 'Dunia yang akan kamu masuki',
    titleLine2: 'sudah berubah sebelum kamu siap.',
    subtitle: 'Bukan untuk menakut-nakuti. Tapi karena kamu berhak tahu.',
    countdown: {
      yearsSuffix: 'tahun tersisa menuju 2030',
      monthsSuffix: 'bulan untuk bergerak',
      demographic: {
        value: '208 juta',
        label: 'jiwa produktif pada puncak bonus demografi',
      },
    },
    cta: {
      label: 'Kenali profilmu sekarang',
      href: '/',
    },
  },
  indonesiaSection: {
    eyebrow: 'INDONESIA HARI INI',
    cards: [
      {
        value: '19,44%',
        label: 'pemuda Indonesia berstatus NEET',
        detail:
          'Tidak bekerja, tidak sekolah, tidak pelatihan. Setara lebih dari 9 juta anak muda yang terputus dari jalur pengembangan diri — di tengah puncak bonus demografi. Kesenjangan gender tajam: perempuan 35,77% vs laki-laki 16,38%.',
        source: 'BPS Sakernas 2025',
        tone: 'negative',
      },
      {
        value: '87%',
        label: 'mahasiswa mengaku salah jurusan',
        detail:
          'Bukan kebetulan — ini akibat sistem bimbingan karir yang hampir tidak ada. Rasio guru BK di madrasah: 1:150. Dampaknya: 43% mengalami gangguan mental health, 26% nilai akademik turun drastis.',
        source: 'Survei nasional IDF 2023–2024; OECD',
        tone: 'negative',
      },
      {
        value: '17,32%',
        label: 'tingkat pengangguran pemuda usia 15–24',
        detail:
          'Lebih dari 3× lipat rata-rata nasional (4,76%). Ironinya: lulusan SMK — yang dirancang siap kerja — justru penganggurannya paling tinggi (9,01%). Hanya 35,4% bekerja sesuai keahlian.',
        source: 'BPS Sakernas Agustus 2024',
        tone: 'negative',
      },
      {
        value: '20%',
        label: 'penurunan posisi entry-level di sektor terpapar AI',
        detail:
          '"Junior Squeeze" — AI mengambil alih tugas yang biasanya diberikan ke karyawan junior. Yang survive bukan yang sekadar terampil teknis, tapi yang punya judgment manusia + nilai yang tidak bisa direplikasi mesin.',
        source: 'Stanford AI Index 2026',
        tone: 'negative',
      },
    ],
  },
  neetSection: {
    eyebrow: 'NEET INDONESIA VS ASEAN',
    source: 'Sumber: BPS Sakernas 2025; ASEAN Statistical Yearbook 2024.',
    rows: [
      { country: 'Indonesia', value: 19.44, color: 'bg-destructive' },
      { country: 'Malaysia', value: 13.63, color: 'bg-amber-500' },
      { country: 'Vietnam', value: 10.82, color: 'bg-amber-500' },
      { country: 'Singapura', value: 4.1, color: 'bg-primary' },
    ],
  },
  worldSection: {
    eyebrow: 'DUNIA YANG SEDANG BERUBAH — 2025–2030',
    cards: [
      {
        value: '+78 juta',
        label: 'pertumbuhan neto lapangan kerja global',
        detail:
          '170 juta pekerjaan baru tercipta, 92 juta hilang. Tapi tidak merata — negara berkembang seperti Indonesia menghadapi instabilitas lebih besar karena ketergantungan pada sektor yang mudah diotomasi. 59 dari 100 pekerja butuh pelatihan ulang sebelum 2030.',
        source: 'WEF Future of Jobs Report 2025',
        tone: 'neutral',
      },
      {
        value: '39%',
        label: 'skill inti hari ini akan usang pada 2030',
        detail:
          'Yang bertahan: analytical thinking, kreativitas, resiliensi, literasi AI, kepemimpinan — semua human-core skills yang tidak bisa direplikasi mesin.',
        source: 'WEF Future of Jobs Report 2025',
        tone: 'negative',
      },
      {
        value: '47,27%',
        label: 'kontribusi sektor halal ke PDB Indonesia',
        detail:
          '~Rp10.600 triliun pada 2024. Indonesia #1 dunia modest fashion, #2 halal tourism. Masalahnya: SDM yang paham fiqh muamalah sekaligus bisnis modern sangat langka.',
        source: 'KNEKS 2024, SGIE Report 2024/2025',
        tone: 'positive',
      },
      {
        value: '1:150',
        label: 'rasio guru BK di madrasah Indonesia',
        detail:
          'OECD membuktikan: bimbingan karir usia 15 berkorelasi kuat dengan outcome kerja usia 25. Kebutuhan nyata yang hampir tidak ada supplainya — ini peluang, bukan sekadar masalah.',
        source: 'OECD Education at a Glance; data Kemendikbud',
        tone: 'neutral',
      },
    ],
  },
  opportunitiesSection: {
    eyebrow: 'PELUANG YANG BELUM DIISI — SHORTAGE SDM 2030',
    items: [
      {
        title: 'Agritech & ketahanan pangan',
        body:
          'Indonesia masih impor gandum, kedelai, bawang putih. Infrastruktur sedang dibangun, SDM belum ada.',
      },
      {
        title: 'Keuangan syariah',
        body:
          'Aset tumbuh 33,92% tapi mismatch SDM akut. Dibutuhkan analis yang paham keduanya.',
      },
      {
        title: 'Konten digital Islam',
        body:
          'Pasar besar, sangat kekurangan kreator yang punya otoritas keagamaan sekaligus keterampilan media digital.',
      },
      {
        title: 'Bimbingan karir berbasis nilai',
        body:
          'Rasio 1:150 di madrasah. Kebutuhan nyata yang hampir tidak ada supplainya.',
      },
    ],
  },
  ctaSection: {
    titleLine1: 'Kamu sudah tahu kondisinya.',
    titleLine2: 'Sekarang, kenali dirimu.',
    primaryCta: {
      label: 'Mulai asesmen Sulu — gratis',
      href: '/',
    },
    footer: {
      body: 'Mendampingi siswa menentukan arah?\nSulu membantu membuka percakapan yang bermakna.',
      cta: { label: 'Pelajari lebih lanjut', href: '/' },
    },
  },
  labels: {
    sourcePrefix: 'Sumber:',
  },
};

// Available tailwind bg-* classes for the NEET chart bar color picker.
export const neetBarColorOptions: { label: string; value: string }[] = [
  { label: 'Merah (destructive)', value: 'bg-destructive' },
  { label: 'Kuning (amber)', value: 'bg-amber-500' },
  { label: 'Biru (primary)', value: 'bg-primary' },
  { label: 'Hijau (emerald)', value: 'bg-emerald-500' },
  { label: 'Abu (muted)', value: 'bg-muted-foreground' },
];

export const toneOptions: { label: string; value: Tone }[] = [
  { label: 'Negatif (merah)', value: 'negative' },
  { label: 'Positif (biru)', value: 'positive' },
  { label: 'Netral (default)', value: 'neutral' },
];
