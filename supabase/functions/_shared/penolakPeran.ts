// Penolak peran sebagai TUJUAN (KEPUTUSAN Raihan 15 Nov 09.16, 18 Nov 14.38; 30 Mei "tidak islami").
// Salinan pola dari mesin/alat/pola_penolak_peran.mjs @0d3968a (sesi mesin; 22/22 tolak, 16/16 lolos).
// Diperiksa pada judul peran saja: whatTheyDo dan pathwayHint boleh menyebut relawan atau kader sebagai PIJAKAN pengalaman
// (KOREKSI 15 Nov 4.2 butir 1), jadi tidak disaring agar profesi sah tidak ikut terbuang.
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
