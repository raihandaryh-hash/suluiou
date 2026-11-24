import { assert, assertFalse } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { PERAN_DITOLAK } from "../broaden-roles/index.ts";
const ditolak = ["Sekretaris Desa (Sekdes)", "Pendamping Desa", "Kader Posyandu Lansia", "Pengurus Karang Taruna", "Ketua BPD (Badan Permusyawaratan Desa)", "Kepala Desa", "Kepala Dinas Sosial", "Camat", "Relawan bencana"];
const diterima = ["Perencana wilayah dan kota", "Peneliti kebijakan sosial", "Pendiri BUMDes berbasis teknologi", "Ahli gizi masyarakat", "Analis data kesehatan", "Insinyur air bersih"];
Deno.test("penolak peran menolak tujuan struktural, kader, relawan", () => { for (const t of ditolak) assert(PERAN_DITOLAK.test(t), t); });
Deno.test("penolak peran meloloskan profesi", () => { for (const t of diterima) assertFalse(PERAN_DITOLAK.test(t), t); });
