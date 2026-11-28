// Tonggak PW · izin orang tua/wali (manifest Tonggak PW v0.3, 28 Nov 2026).
// Orang tua tidak perlu akun: tautan sekali pakai dari siswa, dibuka di HP orang tua, centang, nama, selesai.
// Aksi:
//   buat     (siswa masuk)  → {} → { token, berlaku_sampai }
//   status   (siswa masuk)  → {} → { aktif, diberikan_pada, hubungan }
//   lihat    (tanpa akun)   → { token } → { keadaan, nama_anak, teks, teks_versi }
//   setuju   (tanpa akun)   → { token, nama, hubungan, centang, teks_versi } → { kelola }
//   kelola   (tanpa akun)   → { kelola } → { aktif, diberikan_pada, dicabut_pada, hubungan }
//   tarik    (tanpa akun)   → { kelola } → { ditarik }
// Hanya sidik HMAC token dan kode kelola yang disimpan. Nomor HP orang tua tidak pernah sampai ke server.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jawab, klienLayanan, penggunaPemanggil, hmac, kodeAcak, rahasiaVersi, VERSI_KUNCI_AKTIF, lajuOk, ipDari } from "../_shared/pintu.ts";
import { TEKS_IZIN, TEKS_VERSI, MASA_TAUTAN_MS, teksKanonik, sha256, sahToken, periksaSetuju, keadaanTautan, bolehMintaIzin, namaPanggilan } from "../_shared/izinWali.ts";

async function sidik(nilai: string): Promise<string | null> {
  const r = rahasiaVersi(VERSI_KUNCI_AKTIF);
  return r ? await hmac(r, "wali:" + nilai) : null;
}

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
    const token = kodeAcak(32);
    const s = await sidik(token);
    if (!s) return jawab(500, { galat: "rahasia_belum_dipasang" });
    const berlaku = new Date(sekarang.getTime() + MASA_TAUTAN_MS).toISOString();
    const { error } = await layanan.from("sulu_tautan_wali").insert({ sidik: s, user_id: pengguna.id, berlaku_sampai: berlaku });
    if (error) return jawab(500, { galat: "gagal_simpan" });
    return jawab(200, { token, berlaku_sampai: berlaku });
  }

  // ===== Aksi orang tua (tanpa akun) =====
  if (aksi === "lihat" || aksi === "setuju") {
    if (!(await lajuOk(layanan, "wali_" + aksi, 60, ip))) return jawab(429, { galat: "terlalu_sering" });
    if (!sahToken(isi.token)) return jawab(400, { galat: "tautan_tidak_sah" });
    const s = await sidik(isi.token);
    if (!s) return jawab(500, { galat: "rahasia_belum_dipasang" });
    const { data: t } = await layanan.from("sulu_tautan_wali").select("sidik, user_id, berlaku_sampai, dipakai_pada").eq("sidik", s).maybeSingle();
    const keadaan = keadaanTautan(t, sekarang);

    if (aksi === "lihat") {
      if (keadaan !== "sah") return jawab(200, { keadaan });
      const { data: u } = await layanan.auth.admin.getUserById(t!.user_id);
      return jawab(200, { keadaan, nama_anak: namaPanggilan(u?.user?.user_metadata as Record<string, unknown>), teks: TEKS_IZIN, teks_versi: TEKS_VERSI });
    }

    if (keadaan !== "sah") return jawab(409, { galat: keadaan });
    const p = periksaSetuju(isi);
    if (!p.ok) return jawab(400, { galat: p.galat });
    // tandai tautan terpakai lebih dulu; kalah balapan berarti tautan sudah dipakai
    const { data: kena } = await layanan.from("sulu_tautan_wali").update({ dipakai_pada: sekarang.toISOString() })
      .eq("sidik", s).is("dipakai_pada", null).select("sidik");
    if (!kena || kena.length === 0) return jawab(409, { galat: "sudah_dipakai" });
    const kelola = kodeAcak(32);
    const ks = await sidik("kelola:" + kelola);
    // izin lama yang masih aktif ditutup dulu (indeks unik satu aktif per tujuan)
    await layanan.from("sulu_izin_wali").update({ dicabut_pada: sekarang.toISOString(), dicabut_oleh: "wali" })
      .eq("user_id", t!.user_id).eq("tujuan", "simpan_perbaikan_layanan").is("dicabut_pada", null);
    const { error } = await layanan.from("sulu_izin_wali").insert({
      user_id: t!.user_id, tujuan: "simpan_perbaikan_layanan", nama_wali: p.nama, hubungan: p.hubungan,
      teks_versi: TEKS_VERSI, teks_sidik: await sha256(teksKanonik()), jalur: "tautan_wa", tautan_sidik: s, kelola_sidik: ks,
    });
    if (error) {
      await layanan.from("sulu_tautan_wali").update({ dipakai_pada: null }).eq("sidik", s);
      return jawab(500, { galat: "gagal_simpan" });
    }
    return jawab(200, { kelola });
  }

  if (aksi === "kelola" || aksi === "tarik") {
    if (!(await lajuOk(layanan, "wali_" + aksi, 60, ip))) return jawab(429, { galat: "terlalu_sering" });
    if (!sahToken(isi.kelola)) return jawab(400, { galat: "kode_tidak_sah" });
    const ks = await sidik("kelola:" + isi.kelola);
    if (!ks) return jawab(500, { galat: "rahasia_belum_dipasang" });
    const { data: w } = await layanan.from("sulu_izin_wali").select("id, diberikan_pada, dicabut_pada, hubungan").eq("kelola_sidik", ks).maybeSingle();
    if (!w) return jawab(404, { galat: "kode_tidak_dikenal" });
    if (aksi === "kelola") return jawab(200, { aktif: !w.dicabut_pada, diberikan_pada: w.diberikan_pada, dicabut_pada: w.dicabut_pada, hubungan: w.hubungan });
    if (w.dicabut_pada) return jawab(200, { ditarik: true });
    const { error } = await layanan.from("sulu_izin_wali").update({ dicabut_pada: sekarang.toISOString(), dicabut_oleh: "wali" }).eq("id", w.id).is("dicabut_pada", null);
    if (error) return jawab(500, { galat: "gagal_simpan" });
    return jawab(200, { ditarik: true });
  }

  return jawab(400, { galat: "aksi" });
});
