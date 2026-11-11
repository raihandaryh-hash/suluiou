// Uji manifest Persetujuan dan Jalur Tarik v0.2 (ditulis sebelum perilaku dianggap selesai).
import { describe, it, expect } from "vitest";
import { calculateLeadScore, getLeadPriority, TANPA_IZIN } from "../lib/leadScoring";
import { tentukanAlur, normalkanIzin, tautanTarik } from "../lib/izinKuliah";
import { KANAL_PENERIMAAN, TEKS_IZIN, TEKS_TARIK } from "../data/izinKuliahContent";

const lengkap = { student_name: "A", student_email: "a@b.id", student_phone: "0812", school_name: "SMA X", match_percentage: 100, scores: { o: 5, c: 5, e: 5, a: 5, h: 5 } };

describe("skor prospek", () => {
  it("tanpa P1 tidak ada skor dan tidak ada prioritas", () => {
    expect(calculateLeadScore(lengkap)).toBe(0);
    expect(calculateLeadScore(lengkap, TANPA_IZIN)).toBe(0);
    expect(calculateLeadScore(lengkap, { dihubungi: false, hasilUntukTawaran: true })).toBe(0);
    expect(getLeadPriority(0)).toBe("none");
  });
  it("sifat kepribadian tidak pernah dihitung", () => {
    const a = calculateLeadScore(lengkap, { dihubungi: true, hasilUntukTawaran: true });
    const b = calculateLeadScore({ ...lengkap, scores: {} }, { dihubungi: true, hasilUntukTawaran: true });
    expect(a).toBe(b);
  });
  it("kecocokan program hanya dengan P2, dan batas tanpa P2 = 60 (dipakai pemicu basis data)", () => {
    const tanpaP2 = calculateLeadScore(lengkap, { dihubungi: true, hasilUntukTawaran: false });
    const denganP2 = calculateLeadScore(lengkap, { dihubungi: true, hasilUntukTawaran: true });
    expect(tanpaP2).toBe(60);
    expect(denganP2).toBe(100);
  });
});

describe("alur izin", () => {
  it("tamu selalu jalur tarik, apa pun pernyataannya", () => {
    expect(tentukanAlur({ masuk: false, jalurMahasiswa: false, menyatakan18: true })).toBe("tarik");
    expect(tentukanAlur({ masuk: false, jalurMahasiswa: true, menyatakan18: true })).toBe("tarik");
  });
  it("pengguna masuk: dewasa hanya bila jalur mahasiswa atau menyatakan 18+", () => {
    expect(tentukanAlur({ masuk: true, jalurMahasiswa: true, menyatakan18: false })).toBe("dewasa");
    expect(tentukanAlur({ masuk: true, jalurMahasiswa: false, menyatakan18: true })).toBe("dewasa");
    expect(tentukanAlur({ masuk: true, jalurMahasiswa: false, menyatakan18: false })).toBe("tarik");
  });
  it("P2 tidak berlaku tanpa P1", () => {
    expect(normalkanIzin({ dihubungi: false, hasilUntukTawaran: true })).toEqual(TANPA_IZIN);
  });
});

describe("jalur tarik", () => {
  it("pesan hanya memuat program pilihan, bukan hasil atau data diri", () => {
    const url = tautanTarik(KANAL_PENERIMAAN[0].nomorWa, ["S1 Psikologi", "S1 Studi Islam"]);
    expect(url.startsWith("https://wa.me/6287784411000?text=")).toBe(true);
    const pesan = decodeURIComponent(url.split("text=")[1]);
    expect(pesan).toContain("S1 Psikologi");
    expect(pesan).not.toMatch(/skor|hasil|HEXACO|RIASEC|@|08\d/i);
  });
  it("tanpa program tetap ada pesan umum", () => {
    expect(decodeURIComponent(tautanTarik("6282125351100", []).split("text=")[1])).toContain("kuliah di IOU");
  });
});

describe("teks izin berversi", () => {
  it("tiap varian punya versi P1 dan P2 yang berbeda", () => {
    const v = [TEKS_IZIN.A.p1.versi, TEKS_IZIN.A.p2.versi, TEKS_IZIN.B.p1.versi, TEKS_IZIN.B.p2.versi];
    expect(new Set(v).size).toBe(4);
  });
  it("teks tanpa em dash", () => {
    expect(JSON.stringify(TEKS_IZIN) + JSON.stringify(TEKS_TARIK)).not.toContain("—");
  });
});
