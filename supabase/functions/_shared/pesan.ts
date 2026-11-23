// G2-14 (23 Nov 2026): pesan dari klien divalidasi sebelum apa pun dikirim ke model.
// Hanya peran "user" dan "assistant", isi teks, paling banyak 20 pesan terakhir, 4000 karakter per pesan.
// Peran beruntun yang sama digabung; pesan pertama dan terakhir harus dari pengguna.
type PesanObrolan = { role: "user" | "assistant"; content: string };
export function rapikanPesan(m: unknown): PesanObrolan[] | null {
  if (!Array.isArray(m) || m.length === 0) return null;
  const hasil: PesanObrolan[] = [];
  for (const x of m.slice(-20)) {
    const role = (x as { role?: unknown })?.role;
    const content = (x as { content?: unknown })?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const teks = content.slice(0, 4000);
    const akhir = hasil[hasil.length - 1];
    if (akhir && akhir.role === role) akhir.content += "\n\n" + teks;
    else hasil.push({ role, content: teks });
  }
  while (hasil.length && hasil[0].role !== "user") hasil.shift();
  if (!hasil.length || hasil[hasil.length - 1].role !== "user") return null;
  return hasil;
}

/**
 * G3-015: potong panjang string dan buang tag pembatas <konteks_siswa> / </konteks_siswa>
 * (berulang, tanpa membedakan huruf besar kecil) agar nilai konteks tidak bisa keluar dari pembungkus data.
 */
export function bersihkanKonteks(nilai: unknown, batas = 400, satuBaris = false): string {
  if (typeof nilai !== "string") return "";
  let hasil = nilai;
  let sebelum: string;
  do {
    sebelum = hasil;
    hasil = hasil.replace(/<\s*\/?\s*konteks_siswa\s*>/gi, "");
  } while (hasil !== sebelum);
  if (satuBaris) hasil = hasil.replace(/[\r\n]+/g, " ");
  return hasil.trim().slice(0, batas);
}
