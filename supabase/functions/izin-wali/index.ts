// Tonggak PW · izin orang tua/wali (manifest Tonggak PW v0.3, 28 Nov 2026).
// Orang tua tidak perlu akun: tautan sekali pakai dari siswa, dibuka di HP orang tua, centang, nama, selesai.
// Aksi:
//   buat     (siswa masuk)  → {} → { token, berlaku_sampai }
//   status   (siswa masuk)  → {} → { aktif, diberikan_pada, hubungan }
//   lihat    (tanpa akun)   → { token } → { keadaan, nama_anak, teks, teks_versi }
//   setuju   (tanpa akun)   → { token, nama, hubungan, centang, teks_versi } → { kelola }
//   kelola   (tanpa akun)   → { kelola } → { aktif, diberikan_pada, dicabut_pada, hubungan }
//   tarik    (tanpa akun)   → { kelola } → { ditarik }
// Hanya sidik HMAC token dan kode kelola yang disimpan, beserta versi rahasianya (rotasi tanpa memutus tautan).
// Nomor HP orang tua tidak pernah sampai ke server.
// Kode kelola mengenali anaknya: kelola dan tarik selalu menyangkut izin anak itu yang berlaku sekarang, supaya
// orang tua yang izinnya sudah diganti izin baru tetap bisa melihat dan menarik izin yang berlaku.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jawab, klienLayanan, penggunaPemanggil, hmac, kodeAcak, rahasiaVersi, VERSI_KUNCI_AKTIF, lajuOk, ipDari } from "../_shared/pintu.ts";
import { TEKS_IZIN, TEKS_VERSI, MASA_TAUTAN_MS, teksKanonik, sha256, sahToken, periksaSetuju, keadaanTautan, bolehMintaIzin, namaPanggilan } from "../_shared/izinWali.ts";

async function sidikVersi(v: number, nilai: string): Promise<string | null> {
  const r = rahasiaVersi(v);
  return r ? await hmac(r, "wali:" + nilai) : null;
}

/** Cari baris lewat sidik, mencoba tiap versi rahasia yang terpasang (pola aktifkan-peserta). */
async function cariBersidik<T>(cari: (s: string, v: number) => Promise<T | null>, nilai: string): Promise<{ baris: T | null; adaRahasia: boolean }> {
  let adaRahasia = false;
  for (let v = 1; v <= 9; v++) {
    const s = await sidikVersi(v, nilai);
    if (!s) continue;
    adaRahasia = true;
    const b = await cari(s, v);
    if (b) return { baris: b, adaRahasia };
  }
  return { baris: null, adaRahasia };
}

type BarisTautan = { sidik: string; user_id: string; berlaku_sampai: string; dipakai_pada: string | null };

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jawab(405, { galat: "metode" });
  const layanan = klienLayanan();
  let isi: Record<string, unknown> = {};
  try { isi = await req.json(); } catch { return jawab(400, { galat: "isi" }); }
  const { ip } = ipDari(req);
  const aksi = String(isi.aksi || "");
  const sekarang = new Date();

  // ===== Aksi siswa (perlu masuk) =====
  if (aksi === "buat" || aksi === "status") {
    const pengguna = await penggunaPemanggil(req, layanan);
    if (!pengguna) return jawab(401, { galat: "perlu_masuk" });

    if (aksi === "status") {
      if (!(await lajuOk(layanan, "wali_status", 200, ip))) return jawab(429, { galat: "terlalu_sering" });
      const { data } = await layanan.from("sulu_izin_wali").select("diberikan_pada, hubungan")
        .eq("user_id", pengguna.id).eq("tujuan", "simpan_perbaikan_layanan").is("dicabut_pada", null).maybeSingle();
      return jawab(200, { aktif: !!data, diberikan_pada: data?.diberikan_pada ?? null, hubungan: data?.hubungan ?? null });
    }

    if (!bolehMintaIzin(pengguna.app_metadata as Record<string, unknown>)) return jawab(403, { galat: "bukan_akun_anak" });
    if (!(await lajuOk(layanan, "wali_buat", 30, ip, pengguna.id))) return jawab(429, { galat: "terlalu_sering" });
    // izin yang masih berlaku tidak diganti diam-diam lewat tautan baru
    const { data: aktif, error: galatAktif } = await layanan.from("sulu_izin_wali").select("id")
      .eq("user_id", pengguna.id).eq("tujuan", "simpan_perbaikan_layanan").is("dicabut_pada", null).maybeSingle();
    if (galatAktif) return jawab(500, { galat: "gagal_baca" });
    if (aktif) return jawab(409, { galat: "sudah_ada_izin" });
    const token = kodeAcak(32);
    const s = await sidikVersi(VERSI_KUNCI_AKTIF, token);
    if (!s) return jawab(500, { galat: "rahasia_belum_dipasang" });
    const berlaku = new Date(sekarang.getTime() + MASA_TAUTAN_MS).toISOString();
    const { error } = await layanan.from("sulu_tautan_wali").insert({ sidik: s, user_id: pengguna.id, berlaku_sampai: berlaku, kunci_versi: VERSI_KUNCI_AKTIF });
    if (error) return jawab(500, { galat: "gagal_simpan" });
    return jawab(200, { token, berlaku_sampai: berlaku });
  }

  // ===== Aksi orang tua (tanpa akun) =====
  if (aksi === "lihat" || aksi === "setuju") {
    if (!(await lajuOk(layanan, "wali_" + aksi, 60, ip))) return jawab(429, { galat: "terlalu_sering" });
    if (!sahToken(isi.token)) return jawab(400, { galat: "tautan_tidak_sah" });
    const { baris: t, adaRahasia } = await cariBersidik<BarisTautan>(async (sd, v) => {
      const { data } = await layanan.from("sulu_tautan_wali").select("sidik, user_id, berlaku_sampai, dipakai_pada")
        .eq("sidik", sd).eq("kunci_versi", v).maybeSingle();
      return data;
    }, isi.token);
    if (!adaRahasia) return jawab(500, { galat: "rahasia_belum_dipasang" });
    const keadaan = keadaanTautan(t, sekarang);

    if (aksi === "lihat") {
      if (keadaan !== "sah") return jawab(200, { keadaan });
      const { data: u } = await layanan.auth.admin.getUserById(t!.user_id);
      return jawab(200, { keadaan, nama_anak: namaPanggilan(u?.user?.user_metadata as Record<string, unknown>), teks: TEKS_IZIN, teks_versi: TEKS_VERSI });
    }

    if (keadaan !== "sah") return jawab(409, { galat: keadaan });
    const p = periksaSetuju(isi);
    if (!p.ok) return jawab(400, { galat: p.galat });
    const kelola = kodeAcak(32);
    const ks = await sidikVersi(VERSI_KUNCI_AKTIF, "kelola:" + kelola);
    if (!ks) return jawab(500, { galat: "rahasia_belum_dipasang" });
    // satu transaksi di basis data: kunci tautan, tandai terpakai, tutup izin lama sebagai 'diganti', tulis bukti
    const { data: hasil, error } = await layanan.rpc("sulu_setujui_izin_wali", {
      p_tautan_sidik: t!.sidik, p_nama: p.nama, p_hubungan: p.hubungan, p_teks_versi: TEKS_VERSI,
      p_teks_sidik: await sha256(teksKanonik()), p_kelola_sidik: ks, p_kunci_versi: VERSI_KUNCI_AKTIF,
    });
    if (error) return jawab(500, { galat: "gagal_simpan" });
    if (hasil !== "ok") return jawab(409, { galat: String(hasil) });
    return jawab(200, { kelola });
  }

  if (aksi === "kelola" || aksi === "tarik") {
    if (!(await lajuOk(layanan, "wali_" + aksi, 60, ip))) return jawab(429, { galat: "terlalu_sering" });
    if (!sahToken(isi.kelola)) return jawab(400, { galat: "kode_tidak_sah" });
    const { baris: w, adaRahasia } = await cariBersidik<{ user_id: string }>(async (sd, v) => {
      const { data } = await layanan.from("sulu_izin_wali").select("user_id").eq("kelola_sidik", sd).eq("kunci_versi", v).maybeSingle();
      return data;
    }, isi.kelola);
    if (!adaRahasia) return jawab(500, { galat: "rahasia_belum_dipasang" });
    if (!w) return jawab(404, { galat: "kode_tidak_dikenal" });
    // izin anak ini yang terakhir (yang berlaku, atau yang terakhir ditarik)
    const { data: kini, error: galatKini } = await layanan.from("sulu_izin_wali").select("id, diberikan_pada, dicabut_pada, hubungan")
      .eq("user_id", w.user_id).eq("tujuan", "simpan_perbaikan_layanan").order("diberikan_pada", { ascending: false }).limit(1).maybeSingle();
    if (galatKini || !kini) return jawab(500, { galat: "gagal_baca" });
    if (aksi === "kelola") return jawab(200, { aktif: !kini.dicabut_pada, diberikan_pada: kini.diberikan_pada, dicabut_pada: kini.dicabut_pada, hubungan: kini.hubungan });
    if (kini.dicabut_pada) return jawab(200, { ditarik: true });
    const { error } = await layanan.from("sulu_izin_wali").update({ dicabut_pada: sekarang.toISOString(), dicabut_oleh: "wali" }).eq("id", kini.id).is("dicabut_pada", null);
    if (error) return jawab(500, { galat: "gagal_simpan" });
    return jawab(200, { ditarik: true });
  }

  return jawab(400, { galat: "aksi" });
});
