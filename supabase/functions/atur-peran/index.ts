// Tonggak 2a · atur-peran (manifest v0.6 A.3, A.9). Menulis peran dan status umur ke app_metadata dengan service role.
// Aksi:
//   baca            → status sekarang + sisa masa ralat
//   tulis           → { peran, jenjang?, menyatakan18 } sesuai aturan kunci (umur.ts)
//   minta_buka      → catat permintaan buka kunci untuk admin (tanpa kontak)
//   buka_kunci      → admin saja: { target } kembalikan ke belum terkunci
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jawab, klienLayanan, penggunaPemanggil, adalahAdmin, lajuOk, ipDari } from "../_shared/pintu.ts";
import { putuskanTulisan, sisaRalat, type MetaUmur, type Permintaan } from "../_shared/umur.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jawab(405, { galat: "metode" });
  const layanan = klienLayanan();
  const pengguna = await penggunaPemanggil(req, layanan);
  if (!pengguna) return jawab(401, { galat: "perlu_masuk" });
  // Login anonim tidak dipakai di Sulu; bila suatu hari menyala, jangan pernah beri status dewasa.
  if ((pengguna as { is_anonymous?: boolean }).is_anonymous) return jawab(403, { galat: "tamu" });

  let isi: Record<string, unknown> = {};
  try { isi = await req.json(); } catch { return jawab(400, { galat: "isi" }); }
  const { ip } = ipDari(req);
  if (!(await lajuOk(layanan, "atur_peran", 60, ip, pengguna.id))) return jawab(429, { galat: "terlalu_sering" });

  const meta = (pengguna.app_metadata || {}) as MetaUmur & Record<string, unknown>;
  const sekarang = new Date();

  switch (isi.aksi) {
    case "baca":
      return jawab(200, { peran: meta.peran ?? null, jenjang: meta.jenjang ?? null, dewasa: meta.dewasa === true,
        terkunci: meta.umur_terkunci === true, sisa_ralat_ms: sisaRalat(meta, sekarang) });

    case "tulis": {
      const p: Permintaan = { peran: isi.peran as Permintaan["peran"], jenjang: (isi.jenjang ?? null) as Permintaan["jenjang"], menyatakan18: isi.menyatakan18 === true };
      const h = putuskanTulisan(meta, p, sekarang);
      if (!h.ok) return jawab(409, { galat: h.alasan });
      const { error } = await layanan.auth.admin.updateUserById(pengguna.id, { app_metadata: { ...meta, ...h.meta } });
      if (error) return jawab(500, { galat: "gagal_simpan" });
      return jawab(200, { peran: h.meta.peran, dewasa: h.meta.dewasa === true, terkunci: true, sisa_ralat_ms: sisaRalat(h.meta, sekarang) });
    }

    case "minta_buka": {
      const { error } = await layanan.from("sulu_permintaan_buka_kunci").insert({ user_id: pengguna.id });
      // pelanggaran indeks unik = sudah ada permintaan terbuka; itu bukan galat bagi pengguna
      if (error && !String(error.code).startsWith("23")) return jawab(500, { galat: "gagal_simpan" });
      return jawab(200, { tercatat: true });
    }

    case "buka_kunci": {
      if (!(await adalahAdmin(layanan, pengguna.id))) return jawab(403, { galat: "hanya_admin" });
      const target = String(isi.target || "");
      const { data: t, error: e1 } = await layanan.auth.admin.getUserById(target);
      if (e1 || !t.user) return jawab(404, { galat: "tidak_ada" });
      const lama = (t.user.app_metadata || {}) as Record<string, unknown>;
      const { umur_terkunci: _a, umur_ditulis_pada: _b, umur_sumber: _c, dewasa: _d, ...sisa } = lama;
      const { error: e2 } = await layanan.auth.admin.updateUserById(target, { app_metadata: { ...sisa, umur_terkunci: false, dewasa: false } });
      if (e2) return jawab(500, { galat: "gagal_simpan" });
      await layanan.from("sulu_permintaan_buka_kunci").update({ ditangani_pada: sekarang.toISOString(), ditangani_oleh: pengguna.id })
        .eq("user_id", target).is("ditangani_pada", null);
      return jawab(200, { dibuka: true });
    }

    default:
      return jawab(400, { galat: "aksi" });
  }
});
