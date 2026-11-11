// Tonggak 2a · aktifkan-peserta (manifest v0.6 B.3). Siswa yang sudah masuk Google memasukkan kode peserta sekali.
// Sesudah aktif: app_metadata dewasa=false terkunci, baris jalur cadangan (p_<id>) dipindah ke akun.
// Data perangkat diunggah klien sendiri sesudahnya lewat jalur biasa, karena boleh_simpan kini benar.
// Aksi:
//   aktifkan → { kode } → { peserta: { nama_panggilan, class_id } }
//   status   → { } → { aktif: boolean } (untuk cek pemuatan C.7)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jawab, klienLayanan, penggunaPemanggil, hmac, normalkanKode, rahasiaVersi, lajuOk, ipDari } from "../_shared/pintu.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jawab(405, { galat: "metode" });
  const layanan = klienLayanan();
  const pengguna = await penggunaPemanggil(req, layanan);
  if (!pengguna) return jawab(401, { galat: "perlu_masuk" });
  let isi: Record<string, unknown> = {};
  try { isi = await req.json(); } catch { return jawab(400, { galat: "isi" }); }
  const { ip } = ipDari(req);

  if (isi.aksi === "status") {
    if (!(await lajuOk(layanan, "cek_status", 200, ip))) return jawab(429, { galat: "terlalu_sering" });
    const { data } = await layanan.from("sulu_peserta").select("id").eq("user_id_aktif", pengguna.id)
      .eq("izin_asesmen_ai", true).is("dicabut_pada", null).maybeSingle();
    return jawab(200, { aktif: !!data });
  }

  if (isi.aksi !== "aktifkan") return jawab(400, { galat: "aksi" });
  if (!(await lajuOk(layanan, "aktifkan_peserta", 200, ip))) return jawab(429, { galat: "terlalu_sering" });
  const kode = normalkanKode(String(isi.kode || ""));
  if (!/^[A-Z2-9]{8}$/.test(kode)) return jawab(400, { galat: "kode_tidak_sah" });

  // Coba tiap versi rahasia yang terpasang (rotasi tanpa membatalkan kode lama, B.5).
  let peserta: { id: string; class_id: string; nama_panggilan: string; user_id_aktif: string | null; dicabut_pada: string | null; izin_asesmen_ai: boolean } | null = null;
  for (let v = 1; v <= 9; v++) {
    const r = rahasiaVersi(v);
    if (!r) continue;
    const { data } = await layanan.from("sulu_peserta").select("id, class_id, nama_panggilan, user_id_aktif, dicabut_pada, izin_asesmen_ai")
      .eq("kode_hmac", await hmac(r, kode)).eq("kunci_versi", v).maybeSingle();
    if (data) { peserta = data; break; }
  }
  if (!peserta || peserta.dicabut_pada || !peserta.izin_asesmen_ai) return jawab(404, { galat: "kode_tidak_dikenal" });
  if (peserta.user_id_aktif && peserta.user_id_aktif !== pengguna.id) return jawab(409, { galat: "kode_sudah_dipakai" });

  // Satu akun hanya untuk satu peserta.
  const { data: lain } = await layanan.from("sulu_peserta").select("id").eq("user_id_aktif", pengguna.id).neq("id", peserta.id).maybeSingle();
  if (lain) return jawab(409, { galat: "akun_sudah_terikat_peserta_lain" });

  if (!peserta.user_id_aktif) {
    const { data: kena, error } = await layanan.from("sulu_peserta").update({ user_id_aktif: pengguna.id, diaktifkan_pada: new Date().toISOString() })
      .eq("id", peserta.id).is("user_id_aktif", null).select("id");
    if (error) return jawab(500, { galat: "gagal_simpan" });
    if (!kena || kena.length === 0) return jawab(409, { galat: "kode_sudah_dipakai" }); // kalah balapan (pemeriksa R1)
    const meta = (pengguna.app_metadata || {}) as Record<string, unknown>;
    const { error: eMeta } = await layanan.auth.admin.updateUserById(pengguna.id, { app_metadata: { ...meta, peran: "siswa", dewasa: false, umur_terkunci: true, umur_sumber: "aktivasi_peserta" } });
    if (eMeta) {
      await layanan.from("sulu_peserta").update({ user_id_aktif: null, diaktifkan_pada: null }).eq("id", peserta.id);
      return jawab(500, { galat: "gagal_simpan" });
    }
    // baris jalur cadangan pindah ke akun (B.4)
    await layanan.from("assessment_progress").update({ user_id: pengguna.id, guest_identifier: null }).eq("guest_identifier", `p_${peserta.id}`);
    await layanan.from("assessment_results").update({ user_id: pengguna.id, guest_identifier: null }).eq("guest_identifier", `p_${peserta.id}`);
    await layanan.from("sulu_token_peserta").delete().eq("peserta_id", peserta.id);
    await layanan.from("class_enrollments").insert({ class_id: peserta.class_id, user_id: pengguna.id });
  }
  return jawab(200, { peserta: { nama_panggilan: peserta.nama_panggilan, class_id: peserta.class_id } });
});
