export type Reference = {
  id: string;
  label: string;
  category: string;
};

// Master citation registry. Order = citation number (index + 1).
// <Cite id="..."/> looks up its number dynamically — reordering this array
// re-numbers every citation site automatically, nothing hardcoded elsewhere.
//
// Provenance: every `label` below is copied VERBATIM from its source file —
// no paraphrasing. See inline comments for exact origin.
export const references: Reference[] = [
  // ─── Section-specific sources (Insight + Mukadimah) ───────────────
  {
    id: 'mukadimah-neet-jumlah',
    label: 'Jumlah = NEET% terkini (World Bank WDI / ILO modelled est.) × populasi usia 15–24. Indonesia ±9 juta konsisten dengan BPS (Sakernas 2025: 19,44%).',
    category: 'Demografi & Kependudukan',
  }, // src/data/mukadimahBabakContent.ts → neet.source
  {
    id: 'mukadimah-neet-scarring',
    label: 'Carcillo dkk. (2015), NEET Youth in the Aftermath of the Crisis, OECD Working Paper No. 164; Ralston dkk. (2022), Work, Employment and Society — Scottish Longitudinal Study.',
    category: 'Demografi & Kependudukan',
  }, // src/data/mukadimahBabakContent.ts → scarring (riset 20 Jun, sitasi re-verified 6 Jul)
  {
    id: 'bappenas-bonus-demografi',
    label: 'Proyeksi Penduduk Indonesia 2020–2050, Bappenas/BPS; RPJPN 2025–2045',
    category: 'Demografi & Kependudukan',
  }, // src/data/insightContent.ts → skillSection card "2030–2035 puncak bonus demografi"
  {
    id: 'wef-mckinsey-skill-landscape',
    label: 'WEF Future of Jobs Report 2025; McKinsey Global Institute',
    category: 'Ketenagakerjaan & Skill',
  }, // src/data/insightContent.ts → skillSection.source
  {
    id: 'linkmatch-bps-kemendikbud',
    label: 'BPS Sakernas 2024; Kemendikbudristek Evaluasi Program Link and Match 2023',
    category: 'Pendidikan',
  }, // src/data/insightContent.ts → linkMatchSection.source
  {
    id: 'neet-asean-wdi',
    label: 'World Bank WDI, indikator SL.UEM.NEET.ZS (ILO modeled estimate); observasi terbaru per negara 2022–2024.',
    category: 'Demografi & Kependudukan',
  }, // src/data/insightContent.ts → neetSection.source
  {
    id: 'mckinsey-automation-id',
    label: 'McKinsey Indonesia, "Automation & the Future of Work in Indonesia" (2030)',
    category: 'Ketenagakerjaan & Skill',
  }, // src/data/insightContent.ts → arah.mckinsey.source

  // ─── Dari dataSources (FooterSources lama), verbatim, 21 entri ───
  { id: 'bps-sakernas-2024-2025', label: 'BPS Sakernas 2024 dan 2025', category: 'Ketenagakerjaan & Skill' },
  { id: 'wef-fow-2025', label: 'WEF Future of Jobs Report 2025', category: 'Ketenagakerjaan & Skill' },
  { id: 'stanford-ai-index-2026', label: 'Stanford AI Index 2026', category: 'Ketenagakerjaan & Skill' },
  { id: 'mckinsey-global-institute-fow-id', label: 'McKinsey Global Institute — Future of Work Indonesia', category: 'Ketenagakerjaan & Skill' },
  { id: 'ilo-asean-transformation-2024', label: 'ILO ASEAN in Transformation 2024', category: 'Demografi & Kependudukan' },
  { id: 'bappenas-proyeksi-penduduk-umum', label: 'Bappenas — Proyeksi Penduduk Indonesia 2020–2050', category: 'Demografi & Kependudukan' },
  { id: 'rpjpn-2025-2045', label: 'RPJPN 2025–2045 (UU No. 59/2024)', category: 'Kebijakan' },
  { id: 'kneks-sgie-2024', label: 'KNEKS 2024; SGIE Report 2024/2025', category: 'Ekonomi Syariah & Halal' },
  { id: 'oecd-teenage-career-2025', label: 'OECD State of Global Teenage Career Preparation 2025 (data PISA 2022)', category: 'Pendidikan' },
  { id: 'irene-guntur-iccn', label: 'Irene Guntur, Psikolog Pendidikan IDF; Indonesia Career Center Network', category: 'Pendidikan' },
  { id: 'abkin-upi-uny-guru-bk', label: 'Jurnal ABKIN; UPI; UNY — Riset kebutuhan guru BK', category: 'Pendidikan' },
  { id: 'permendikbud-111-dapodik-emis', label: 'Permendikbud No. 111/2014; Data Dapodik; EMIS Kemenag', category: 'Kebijakan' },
  { id: 'iesr-bappenas-hijau-2025', label: 'IESR 2024; Bappenas Peta Jalan Tenaga Kerja Hijau 2025', category: 'Ekonomi Hijau' },
  { id: 'kemnaker-rtkn-2025-2029', label: 'Kemnaker RTKN 2025-2029', category: 'Kebijakan' },
  { id: 'bps-sakernas-informal-economy', label: 'BPS Sakernas 2024-2025 (informal economy, pekerja lepas, poly-jobbing)', category: 'Ketenagakerjaan & Skill' },
  { id: 'world-bank-kelas-menengah-2024', label: 'World Bank Indonesia — Kelas Menengah 2024', category: 'Ekonomi' },
  { id: 'jabar-bps-bi', label: 'BPS Jawa Barat 2025; Bank Indonesia Jawa Barat Q1 2026', category: 'Jawa Barat' },
  { id: 'bpjph-2026-halal-jabar', label: 'BPJPH 2026 — Data Sertifikasi Halal Jawa Barat', category: 'Jawa Barat' },
  { id: 'britishcouncil-avpn-dice', label: 'British Council/AVPN DICE Study — Social Enterprise Indonesia', category: 'Ekonomi' },
  { id: 'tracer-uin-pbsb-kemenag', label: 'Tracer Study UIN Jakarta; Data PBSB Kemenag RI', category: 'Pendidikan' },
  { id: 'idn-media-genz-2024', label: 'IDN Media Indonesian Millennials & Gen Z Report 2024', category: 'Demografi & Kependudukan' },
  { id: 'ukt-2024-kemendikbud', label: 'Permendikbudristek No. 2/2024 (kenaikan UKT, dibatalkan Mei 2024 setelah protes nasional); biaya pendidikan naik rata-rata 10-15% per tahun (OJK).', category: 'Pendidikan' },
  { id: 'gaji-fresh-grad-bps', label: 'Rata-rata gaji bulanan lulusan PT Indonesia Rp4,63 juta; fresh graduate usia 20-25 sering Rp2-2,5 juta di awal karier (BPS; Data UKT Kemendikbud 2025).', category: 'Ketenagakerjaan & Skill' },
  { id: 'anthropic-economic-index', label: 'Anthropic Economic Index, laporan pertama (Februari 2025): sekitar 36% pekerjaan memakai AI untuk minimal seperempat tugasnya, sekitar 4% untuk tiga-perempat tugasnya; penggunaan condong ke augmentasi (57%) dibanding otomasi (43%).', category: 'Era AI & Masa Depan Kerja' },
  { id: 'anthropic-aug-vs-auto-2025', label: 'Anthropic Economic Index, laporan ke-4 (November 2025): augmentasi kembali memimpin 52% berbanding otomasi 45%, setelah otomasi sempat unggul tipis pada sampel Agustus 2025. Pekerjaan yang paling banyak memakai AI adalah bidang kognitif menengah-atas (programmer, penulis, analis data), bukan pekerjaan manual.', category: 'Era AI & Masa Depan Kerja' },
  { id: 'stanford-entry-level-ai-2025', label: 'Brynjolfsson, Chandar & Chen (Stanford Digital Economy Lab, 2025), analisis data payroll ADP: pekerja muda usia 22-25 di bidang paling terpapar AI mengalami penurunan relatif lapangan kerja sekitar 13% sejak akhir 2022, sementara pekerja senior di bidang yang sama relatif stabil atau tumbuh. Penurunan terkonsentrasi di bidang yang diotomasi, bukan yang diaugmentasi.', category: 'Era AI & Masa Depan Kerja' },
  { id: 'umkm-kemenkopukm', label: 'Kementerian Koperasi dan UKM RI: usaha mikro, kecil, dan menengah mencakup sekitar 99% dari seluruh unit usaha di Indonesia, menyerap sekitar 97% tenaga kerja, dan menyumbang sekitar 60% Produk Domestik Bruto.', category: 'Ekonomi' },
  { id: 'bps-informal-mayoritas', label: 'BPS Sakernas: mayoritas penduduk bekerja di Indonesia berada di sektor informal (sekitar 59% per 2024), tanpa jaring pengaman ketenagakerjaan formal.', category: 'Ketenagakerjaan & Skill' },
  { id: 'literasi-digital-kominfo', label: 'Kementerian Kominfo & Katadata Insight Center, Status Literasi Digital Indonesia: indeks literasi digital nasional berada di kisaran 3,5 dari skala 5, tergolong tingkat "sedang", belum "tinggi", meski adopsi teknologi meluas cepat.', category: 'Era AI & Masa Depan Kerja' },
  { id: 'vocational-fit-research', label: 'Teori person-environment fit dalam psikologi vokasional (Holland, RIASEC; lihat Nauta, 2010; Nye dkk., 2012). Meta-analisis menunjukkan kecocokan antara minat, kemampuan, dan nilai seseorang dengan tuntutan lingkungan kerja berkaitan dengan kepuasan, kinerja, dan kebertahanan karier. Efeknya konsisten meski para peneliti mencatat besarnya moderat, bukan penentu tunggal.', category: 'Karier & Pengembangan Diri' },
];
