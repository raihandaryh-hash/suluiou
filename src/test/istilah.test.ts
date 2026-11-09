// Penegak istilah: LM = Layanan Masyarakat (KEPUTUSAN Raihan 3 Nov 15.41, ditegaskan 9 Nov 19.03).
// Gagal bila teks pengguna atau prompt menulis "Layanan Mahasiswa".
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function berkas(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return n === "test" ? [] : berkas(p);
    return /\.(ts|tsx)$/.test(n) ? [p] : [];
  });
}

describe("istilah LM", () => {
  it("tidak ada 'Layanan Mahasiswa' di src dan edge function", () => {
    const kena = [...berkas("src"), ...berkas("supabase/functions")].filter((p) =>
      /layanan\s+mahasiswa/i.test(readFileSync(p, "utf8")),
    );
    expect(kena).toEqual([]);
  });
});
