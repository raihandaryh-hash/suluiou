// src/data/pathways.ts
// Sumber: bahasa.iou.edu.gm — fetched April 2026
// riasecVector DIKOSONGKAN — menunggu validasi wakaprodi + Bu Hasna sebelum matching diaktifkan
// careers & localIndustries DIHAPUS — menunggu data wakaprodi agar tidak misleading

export const pathways = [
  {
    id: "bba",
    name: "Administrasi Bisnis",
    fullName: "Bachelor of Business Administration (BBA)",
    degree: "S1",
    faculty: "Fakultas Administrasi Bisnis",
    url: "https://bahasa.iou.edu.gm/stream/bba/",
    description:
      "Program BBA IOU menggabungkan ilmu manajemen modern dengan perspektif Islam. Kamu akan mempelajari marketing, keuangan, SDM, kepemimpinan, dan kewirausahaan — sekaligus memahami bagaimana bisnis yang etis dijalankan dalam kerangka nilai Islam. Program ini mengembangkan kemampuan pengambilan keputusan dalam situasi bisnis nyata, keterampilan analitis, inovasi bisnis, dan tanggung jawab sosial-Islami.",
    iouUniqueness:
      "IOU mengintegrasikan perspektif Islam ke setiap aspek kurikulum bisnis — dari etika marketing hingga kepemimpinan berbasis nilai. Lulusan tidak hanya cerdas secara bisnis, tapi juga bertanggung jawab secara moral dan sosial.",
  },
  {
    id: "psy",
    name: "Psikologi",
    fullName: "Bachelor of Science in Psychology (BSc PSY)",
    degree: "S1",
    faculty: "Fakultas Psikologi",
    url: "https://bahasa.iou.edu.gm/stream/psy/",
    description:
      "Program Psikologi IOU menawarkan pendidikan luas dalam subdisiplin psikologi — perilaku normal dan patologis, emosi, kesejahteraan, kognisi, ilmu saraf, interaksi sosial, dan motivasi. Yang membedakan IOU: kurikulum mempertimbangkan interaksi antara pengaruh fisik, psikologis, budaya, agama, dan sosial untuk memahami manusia secara utuh. Tersedia juga pelatihan klinis terapan dan mata kuliah studi Islam.",
    iouUniqueness:
      "IOU mengintegrasikan psikologi Islam — pemahaman tentang jiwa (nafs) dalam perspektif Quran dan Sunnah — ke dalam kurikulum sains psikologi modern. Lulusan memahami manusia secara holistik: fisik, psikologis, dan ruhani.",
  },
  {
    id: "bais",
    name: "Studi Islam",
    fullName: "Bachelor of Arts in Islamic Studies (BAIS)",
    degree: "S1",
    faculty: "Fakultas Studi Islam",
    url: "https://bahasa.iou.edu.gm/stream/bais/",
    description:
      "Program BAIS IOU memberikan pemahaman mendalam dalam berbagai bidang kajian Islam: Aqidah, Fiqh, Tafsir, Seerah, dan dasar bahasa Arab. Program ini menghubungkan ajaran-ajaran klasik Islam dengan isu-isu kontemporer, memungkinkan mahasiswa memperluas studi teoretis Islam menjadi praktik yang bermakna. Gelar ini telah dibandingkan dengan universitas terkemuka di Timur Tengah, Afrika, dan Inggris untuk memastikan standar internasional.",
    iouUniqueness:
      "IOU didirikan oleh Dr. Bilal Philips dengan misi menyebarkan ilmu Islam otentik ke seluruh dunia. Kurikulum BAIS dirancang oleh ulama dan akademisi Islam bereputasi global, dengan penekanan pada metodologi yang benar dan relevansi kontemporer.",
  },
  {
    id: "als",
    name: "Bahasa Arab",
    fullName: "Bachelor of Arts in Arabic Language Studies (BA ALS)",
    degree: "S1",
    faculty: "Fakultas Bahasa Arab & Linguistik",
    url: "https://bahasa.iou.edu.gm/stream/ba-als/",
    description:
      "Program BA ALS IOU dirancang untuk memberikan fondasi yang kuat dalam bahasa Arab bagi penutur non-natif, dengan pendekatan pengajaran bahasa kedua. Program ini membangun kemampuan dari komunikasi sehari-hari hingga teks-teks akademis dan klasik Islam — membuka akses langsung ke khazanah keilmuan Islam yang sebagian besar masih dalam bahasa Arab.",
    iouUniqueness:
      "Program ALS IOU dirancang untuk menguasai bahasa Arab dari komunikasi dasar hingga sastra tinggi — dengan penekanan pada bahasa Arab fusha. Ini membuka akses ke ribuan kitab ulama yang belum diterjemahkan, menjadikan lulusan sebagai jembatan penting antara khazanah Islam klasik dan masyarakat modern.",
  },
  {
    id: "med",
    name: "Pendidikan",
    fullName: "Master of Education (MEd)",
    degree: "S2",
    degreeNote:
      "Program ini adalah jenjang S2 — cocok sebagai tujuan jangka panjang setelah menyelesaikan S1 di bidang apapun.",
    faculty: "Fakultas Pendidikan",
    url: "https://bahasa.iou.edu.gm/stream/med/",
    description:
      "Program MEd IOU dirancang untuk memperdalam pemahaman konseptual tentang pendidikan dan mendorong eksplorasi dalam bidang-bidang yang relevan. Mencakup penelitian mendalam, metodologi penelitian, analisis kritis, dan komunikasi akademis. Program ini mengadopsi pendekatan kontemporer dan mengangkat diskusi utama dalam bidang pendidikan — dengan nilai-nilai Islam tentang perdamaian, harmoni, dan toleransi yang tertanam dalam kurikulum.",
    iouUniqueness:
      "MEd IOU memandang pendidikan sebagai ibadah — meneruskan tradisi nabi sebagai mu'allim terbaik. Kurikulum mengintegrasikan metodologi penelitian pendidikan modern dengan falsafah tarbiyah Islamiyah, menghasilkan pendidik yang kompeten sekaligus berkarakter.",
  },
] as const;

export type Pathway = (typeof pathways)[number];

export function getPathwayById(id: string): Pathway | undefined {
  return pathways.find((p) => p.id === id);
}

export function getPathwayName(id: string): string {
  return getPathwayById(id)?.name ?? id;
}
