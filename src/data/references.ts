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
];
