// Tautan primer per sumber yang tampil di layar (audit niat 24 Nov L3/L6, L18).
// Asal: lajur mesin, dicocokkan ke basis bukti Sulu dan Buku Pengetahuan v1.4 (mesin-me1-fondasi fbd4754,
// mesin/serah/L3_insight_cocok-basis-bukti.json dan L6_petabekal_cocok-basis-bukti.json). Hanya status
// "ya", "sebagian", dan "sekunder"; "periksa", "TIDAK", dan "tidak ditemukan" sengaja tidak ditautkan.
// Kunci = teks sumber persis seperti di berkas konten; bila teks sumber diubah, tautannya ikut dicek ulang.

/** Teks sumber di insightContent.ts → tautan. */
export const tautanPerSumber: Record<string, string[]> = {
  "IESR, dikutip Republika, 2025": ["https://ekonomi.republika.co.id/berita/szut32349/"],
  "BPS Sakernas Agustus 2024": [
    "https://www.bps.go.id/en/publication/2024/12/09/6f1fd1036968c8a28e4cfe26/keadaan-angkatan-kerja-di-indonesia-agustus-2024.html"
  ],
  "Stanford AI Index 2026 (sektor tech/knowledge work)": [
    "https://hai.stanford.edu/ai-index/2026-ai-index-report/economy"
  ],
  "WEF Future of Jobs Report 2025; McKinsey Global Institute": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf"
  ],
  "OECD State of Global Teenage Career Preparation 2025 (data PISA 2022)": [
    "https://www.educationandemployers.org/wp-content/uploads/2025/05/The-State-of-Global-Teenage-Career-Preparation-20th-May-2025-2.pdf"
  ],
  "WEF Future of Jobs Report 2025": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf"
  ],
  "WEF Future of Jobs Report 2025; BAPPENAS-WEF Jobs and Skills Accelerator 2025": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf"
  ],
  "Laporan Halal Value Chain, Bank Indonesia dan KNEKS 2024; SGIE Report 2024/2025": [
    "https://kneks.go.id/berita/703/"
  ],
  "Tracer Study UIN Jakarta; Data PBSB Kemenag": [
    "https://kemenag.go.id/nasional/tracer-study-hampir-50-lulusan-uin-jakarta-terserap-dunia-kerja-sebelum-wisuda-OohrA"
  ],
  "Executive Workshop SEVIMA, Jakarta, 12 Februari 2026": [
    "https://sevima.com/ai-hancurkan-monopoli-pengetahuan-kampus-sevima-prof-rhenald-kasali-ajak-pendidikan-tinggi-berubah/"
  ],
  "Pertemuan Musim Semi IMF-World Bank, Washington D.C., April 2024": [
    "https://www.idnfinancials.com/news/54292"
  ],
  "OJK, Desember 2024": [
    "https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/Kinerja-Positif-Perbankan-Syariah-2024.aspx"
  ],
  "McKinsey Indonesia, \"Automation & the Future of Work in Indonesia\" (2030)": [
    "https://www.mckinsey.com/~/media/mckinsey/featured%20insights/asia%20pacific/automation%20and%20the%20future%20of%20work%20in%20indonesia/automation-and-the-future-of-work-in-indonesia-vf.pdf"
  ],
  "BPS, Indikator Perumahan dan Lingkungan 2024": [
    "https://www.bps.go.id/id/publication/2025/02/28/8cfe1a589ad3693396d3db9f/"
  ],
  "BPS Sakernas 2025, data 38 provinsi": [
    "https://www.bps.go.id/id/pressrelease/2025/11/05/2479/"
  ],
  "BPS Sakernas 2024; Kemendikbudristek Evaluasi Program Link and Match 2023": [
    "https://www.bps.go.id/en/publication/2024/12/09/6f1fd1036968c8a28e4cfe26/keadaan-angkatan-kerja-di-indonesia-agustus-2024.html"
  ],
  "BPS; World Bank Indonesia 2024; ISEAS Agustus 2025": [
    "https://www.worldbank.org/en/country/indonesia/brief/indonesia-human-capital"
  ],
  "World Bank WDI, indikator SL.UEM.NEET.ZS (ILO modeled estimate); observasi terbaru per negara 2022–2024.": [
    "https://data.worldbank.org/indicator/SL.UEM.NEET.ZS"
  ],
  "Layoffs.fyi": [
    "https://layoffs.fyi/"
  ],
  "BPS Jawa Barat 2025; Bank Indonesia Jawa Barat Q1 2026": [
    "https://www.bi.go.id/id/publikasi/laporan/lpp/Pages/Laporan-Perekonomian-Provinsi-Jawa-Barat-Mei-2026.aspx"
  ]
};

/** Simpul Peta Bekal (skillMapContent.ts id) → tautan. */
export const tautanPerSimpul: Record<string, string[]> = {
  "rasa-ingin-tahu": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf",
    "https://www.nature.com/articles/s41539-025-00384-5"
  ],
  "resiliensi": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf",
    "https://link.springer.com/article/10.1007/s40894-025-00270-6",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12127306/"
  ],
  "kesadaran-diri": [
    "https://doi.org/10.1037/emo0000943"
  ],
  "etika": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf",
    "https://journals.sagepub.com/doi/10.3102/00346543055003319"
  ],
  "metakognisi": [
    "https://www.sciencedirect.com/science/article/abs/pii/S0361476X21000357",
    "https://journals.sagepub.com/doi/abs/10.1177/1529100612453266"
  ],
  "berpikir-analitis": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf",
    "https://www.onetcenter.org/content.html",
    "https://eric.ed.gov/?id=EJ1061695",
    "https://journals.sagepub.com/doi/10.3102/0034654308326084"
  ],
  "berpikir-kreatif": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf",
    "http://www.psychologie.uni-mannheim.de/cip/tut/seminare_wittmann/meta_fribourg/sources/Scott_etal_2004_Effectiveness_of_creativity_training.pdf"
  ],
  "berpikir-sistemik": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf",
    "https://onlinelibrary.wiley.com/doi/10.1002/sres.3208"
  ],
  "empati": [
    "https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/",
    "https://pubmed.ncbi.nlm.nih.gov/26191979/"
  ],
  "kepemimpinan": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf"
  ],
  "literasi-ai": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf"
  ],
  "keamanan-digital": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf"
  ],
  "literasi-teknologi": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf",
    "https://www.onetcenter.org/content.html"
  ],
  "manajemen-proyek": [
    "https://www.onetcenter.org/content.html"
  ],
  "komunikasi-kompleks": [
    "https://www.onetcenter.org/content.html",
    "https://journals.sagepub.com/doi/full/10.1177/0145445521991102"
  ],
  "energi-terbarukan": ["https://ekonomi.republika.co.id/berita/szut32349/"],
  "kepedulian-lingkungan": [
    "https://ekonomi.republika.co.id/berita/szut32349/",
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf",
    "https://doi.org/10.1016/j.jenvp.2022.101782"
  ],
  "mengajar": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf",
    "https://journals.sagepub.com/doi/10.1177/0143034318808832"
  ],
  "teknologi-digital": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf",
    "https://hai.stanford.edu/ai-index/2026-ai-index-report/economy"
  ],
  "pendidikan": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf",
    "https://www.educationandemployers.org/wp-content/uploads/2025/05/The-State-of-Global-Teenage-Career-Preparation-20th-May-2025-2.pdf"
  ],
  "kesehatan": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf"
  ],
  "keuangan-syariah": [
    "https://kneks.go.id/berita/703/",
    "https://dinarstandard.com/insights/sgier-2024-25"
  ],
  "pertanian-modern": [
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf"
  ],
  "klerikal": [
    "https://www.ilo.org/resource/article/navigating-generative-ai%E2%80%99s-transformations-asean-labour-markets",
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf"
  ],
  "ritel-manual": [
    "https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@ed_dialogue/@act_emp/documents/publication/wcms_579554.pdf",
    "https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf"
  ]
};

export function tautanUntuk(teks?: string | null, simpul?: string | null): string[] {
  if (simpul && tautanPerSimpul[simpul]) return tautanPerSimpul[simpul];
  return (teks && tautanPerSumber[teks.trim()]) || [];
}
