// Klaim yang ditarik tetapi masih tersimpan di basis data (audit niat 24 Nov L12; putusan mesin 25 Nov 12.3x).
// Disaring di lapis baca supaya tidak tayang tanpa menunggu migrasi data.
export const POLA_KLAIM_DITARIK: RegExp[][] = [
  // "kekurangan 16.223 guru madrasah" Jawa Barat: sumbernya artikel Kemenag angka defisit 2005 (basis bukti).
  [/16[.,]?223/, /guru/i],
];

export function buangKlaimDitarik(butir: string[]): string[] {
  return butir.filter((b) => !POLA_KLAIM_DITARIK.some((semua) => semua.every((p) => p.test(b))));
}
