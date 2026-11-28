import { describe, expect, it } from "vitest";
import { buangKlaimDitarik } from "./klaimDitarik";
import { tautanPerSumber, tautanPerSimpul } from "./tautanSumber";
import { readFileSync } from "node:fs";

describe("klaim ditarik", () => {
  it("membuang butir guru madrasah 16.223 dan menyisakan lainnya", () => {
    const hasil = buangKlaimDitarik(["Kekurangan 16.223 guru madrasah di Jawa Barat", "13.005 pesantren"]);
    expect(hasil).toEqual(["13.005 pesantren"]);
  });
});

describe("tautan sumber", () => {
  it("semua tautan https dan tidak kosong", () => {
    const semua = [...Object.values(tautanPerSumber), ...Object.values(tautanPerSimpul)].flat();
    expect(semua.length).toBeGreaterThan(20);
    for (const u of semua) expect(u).toMatch(/^https?:\/\//);
  });
  it("tiap kunci teks sumber masih ada di berkas konten (tautan tidak basi)", () => {
    const konten = ["insightContent.ts"].map((f) => readFileSync(`src/data/${f}`, "utf8")).join("\n");
    const basi = Object.keys(tautanPerSumber).filter((k) => !konten.includes(k.replace(/'/g, "\\'")) && !konten.includes(k));
    expect(basi).toEqual([]);
  });
});
