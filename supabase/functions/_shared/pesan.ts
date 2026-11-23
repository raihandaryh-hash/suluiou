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
