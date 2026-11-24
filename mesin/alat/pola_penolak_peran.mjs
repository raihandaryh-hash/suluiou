// Pola penolak peran sebagai TUJUAN (KEPUTUSAN Raihan 15 Nov 09.16, 18 Nov 14.38, 30 Mei "tidak islami").
// Usulan sesi mesin 24 Nov untuk dipasang Chief di broaden-roles dan career-chat. Periksa title, whatTheyDo, pathwayHint.
// Jalankan: node mesin/alat/pola_penolak_peran.mjs  (uji tolak/lolos)
export const PERAN_DITOLAK = new RegExp([
  String.raw`\bkepala\s+(desa|dusun|dinas|daerah|kampung|lingkungan)\b`, String.raw`\b(kades|kadus|lurah|camat|bupati|gubernur)\b`, String.raw`\bwali\s*kota\b`,
  String.raw`\banggota\s+(dewan|dprd?|bpd)\b`, String.raw`\bbpd\b`, String.raw`\b(ketua|pengurus|penggerak)\s+(rt|rw|bpd|pkk|karang\s*taruna|pokdarwis|lingkungan)\b`,
  String.raw`\bkarang\s*taruna\b`, String.raw`\bpkk\b`, String.raw`\bpokdarwis\b`,
  String.raw`\b(sekretaris|perangkat|staf|aparat)\s+(desa|kelurahan|kampung)\b`, String.raw`\bsekdes\b`,
  String.raw`\bkader\b`, String.raw`\brelawan\b`, String.raw`\bvolunteer\b`, String.raw`\bpengurus\b`,
  String.raw`\bpendamping\s+(desa|lokal|program|pkh|sosial|umkm|bansos)\b`, String.raw`\bpkh\b`,
  String.raw`\bfasilitator\s+(desa|posyandu|pemberdayaan|kelurahan|program)\b`, String.raw`\bhonor(er)?\b`,
  String.raw`\binfluencer\b`, String.raw`\bselebgram\b`, String.raw`\bcontent\s+creator\s+tiktok\b`,
].join("|"), "i");
const TOLAK = ["Sekretaris Desa","Pendamping Desa","Kader Posyandu Lansia","Pengurus Karang Taruna","Ketua BPD (Badan Permusyawaratan Desa)","Kepala Desa","Ketua PKK","Penggerak PKK","Pendamping PKH","Pendamping Lokal Desa","Fasilitator Desa","Kepala Dusun","Perangkat Kelurahan","Staf Kelurahan","Ketua Pokdarwis","Fasilitator Posyandu","Guru Honor","Volunteer Coordinator","Influencer TikTok","Selebgram","Lurah","Camat"];
const LOLOS = ["Perencana Wilayah dan Kota","Peneliti Kebijakan Publik","Analis Data Kesehatan","Perawat Komunitas","Insinyur Pengairan","Agronom","Analis Kredit Mikro Syariah","Ahli Gizi","Guru SD","Pengembang Perangkat Lunak","Pekerja Sosial Profesional","Arsitek Lanskap","Epidemiolog","Konsultan Pembangunan Daerah","Auditor Halal","Dosen"];
if (import.meta.url === `file://${process.argv[1]}`) {
  const salahTolak = LOLOS.filter((t) => PERAN_DITOLAK.test(t)), salahLolos = TOLAK.filter((t) => !PERAN_DITOLAK.test(t));
  console.log(`tolak ${TOLAK.length - salahLolos.length}/${TOLAK.length} · lolos ${LOLOS.length - salahTolak.length}/${LOLOS.length}`);
  if (salahLolos.length || salahTolak.length) { console.log({ salahLolos, salahTolak }); process.exit(1); }
}
