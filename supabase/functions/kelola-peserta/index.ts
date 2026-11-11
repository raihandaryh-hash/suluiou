// Tonggak 2a · kelola-peserta, khusus admin (manifest v0.6 D). Kode peserta hanya tampil sekali; yang disimpan HMAC-nya.
// Aksi:
//   buat         → { class_id, baris: [{ nama_panggilan, izin_asesmen_ai, izin_dihubungi_kuliah, izin_hasil_untuk_tawaran, nama_orang_tua, tanggal_formulir }] }
//                  → [{ id, nama_panggilan, kode }]
//   reset        → { peserta_id } kode baru, PIN dikosongkan, kode lama mati (D.3) → { kode }
//   cabut        → { peserta_id } izin dicabut, token mati, data server siswa dihapus (D.4)
//   lepas_ikatan → { peserta_id } kode yang diaktifkan di akun salah dilepas; data pindah ke kode baru (D.5) → { kode }
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jawab, klienLayanan, penggunaPemanggil, adalahAdmin, hmac, kodeAcak, rahasiaVersi, VERSI_KUNCI_AKTIF } from "../_shared/pintu.ts";

const TABEL_DATA = ["assessment_progress", "assessment_results", "class_enrollments", "phase_2a_inventory", "phase_2b_skills",
  "phase_3_jalan_bakti", "phase_4_sintesis", "phase_5_action_plan", "bridge_requests"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jawab(405, { galat: "metode" });
  const layanan = klienLayanan();
  const admin = await penggunaPemanggil(req, layanan);
  if (!admin || !(await adalahAdmin(layanan, admin.id))) return jawab(403, { galat: "hanya_admin" });
  const rahasia = rahasiaVersi(VERSI_KUNCI_AKTIF);
  if (!rahasia) return jawab(503, { galat: "rahasia_belum_dipasang" });

  let isi: Record<string, unknown> = {};
  try { isi = await req.json(); } catch { return jawab(400, { galat: "isi" }); }

  const kodeBaru = async () => {
    const kode = kodeAcak(8);
    return { kode, kode_hmac: await hmac(rahasia, kode), kunci_versi: VERSI_KUNCI_AKTIF };
  };

  switch (isi.aksi) {
    case "buat": {
      const classId = String(isi.class_id || "");
      const baris = Array.isArray(isi.baris) ? (isi.baris as Record<string, unknown>[]) : [];
      if (!classId || baris.length === 0 || baris.length > 200) return jawab(400, { galat: "isi" });
      const keluaran: { id: string; nama_panggilan: string; kode: string }[] = [];
      for (const b of baris) {
        const nama = String(b.nama_panggilan || "").trim().slice(0, 60);
        const ortu = String(b.nama_orang_tua || "").trim().slice(0, 120);
        const tgl = String(b.tanggal_formulir || "");
        if (!nama || !ortu || !/^\d{4}-\d{2}-\d{2}$/.test(tgl)) return jawab(400, { galat: "baris_tidak_lengkap", nama });
        const k = await kodeBaru();
        const { data, error } = await layanan.from("sulu_peserta").insert({
          class_id: classId, nama_panggilan: nama, kode_hmac: k.kode_hmac, kunci_versi: k.kunci_versi,
          izin_asesmen_ai: b.izin_asesmen_ai === true, izin_dihubungi_kuliah: b.izin_dihubungi_kuliah === true,
          izin_hasil_untuk_tawaran: b.izin_hasil_untuk_tawaran === true, nama_orang_tua: ortu, tanggal_formulir: tgl, dicatat_oleh: admin.id,
        }).select("id").single();
        if (error || !data) return jawab(500, { galat: "gagal_simpan", nama });
        keluaran.push({ id: data.id, nama_panggilan: nama, kode: k.kode });
      }
      return jawab(200, { peserta: keluaran });
    }

    case "reset": {
      const id = String(isi.peserta_id || "");
      const { data: p } = await layanan.from("sulu_peserta").select("id, user_id_aktif").eq("id", id).maybeSingle();
      if (!p) return jawab(404, { galat: "tidak_ada" });
      if (p.user_id_aktif) return jawab(409, { galat: "sudah_aktif_pakai_lepas_ikatan" });
      const k = await kodeBaru();
      const { error } = await layanan.from("sulu_peserta").update({ kode_hmac: k.kode_hmac, kunci_versi: k.kunci_versi, pin_hmac: null, pin_salah: 0 }).eq("id", id);
      if (error) return jawab(500, { galat: "gagal_simpan" });
      return jawab(200, { kode: k.kode });
    }

    case "cabut": {
      const id = String(isi.peserta_id || "");
      const { data: p } = await layanan.from("sulu_peserta").select("id, user_id_aktif").eq("id", id).maybeSingle();
      if (!p) return jawab(404, { galat: "tidak_ada" });
      const { error } = await layanan.from("sulu_peserta").update({ dicabut_pada: new Date().toISOString() }).eq("id", id);
      if (error) return jawab(500, { galat: "gagal_simpan" });
      // hapus data server siswa itu: jalur akun dan jalur cadangan
      for (const t of TABEL_DATA) {
        if (p.user_id_aktif) await layanan.from(t).delete().eq("user_id", p.user_id_aktif);
      }
      await layanan.from("assessment_progress").delete().eq("guest_identifier", `p_${id}`);
      await layanan.from("assessment_results").delete().eq("guest_identifier", `p_${id}`);
      return jawab(200, { dicabut: true });
    }

    case "lepas_ikatan": {
      const id = String(isi.peserta_id || "");
      const { data: p } = await layanan.from("sulu_peserta").select("id, user_id_aktif").eq("id", id).maybeSingle();
      if (!p || !p.user_id_aktif) return jawab(404, { galat: "tidak_aktif" });
      const akunSalah = p.user_id_aktif;
      // data peserta pindah ke jalur cadangan (pengenal kode) supaya tidak hilang dan tidak tertinggal di akun salah
      await layanan.from("assessment_progress").update({ user_id: null, guest_identifier: `p_${id}` }).eq("user_id", akunSalah);
      await layanan.from("assessment_results").update({ user_id: null, guest_identifier: `p_${id}` }).eq("user_id", akunSalah);
      for (const t of TABEL_DATA.slice(2)) await layanan.from(t).delete().eq("user_id", akunSalah);
      const k = await kodeBaru();
      const { error } = await layanan.from("sulu_peserta").update({ user_id_aktif: null, diaktifkan_pada: null, kode_hmac: k.kode_hmac, kunci_versi: k.kunci_versi, pin_hmac: null, pin_salah: 0 }).eq("id", id);
      if (error) return jawab(500, { galat: "gagal_simpan" });
      const { data: u } = await layanan.auth.admin.getUserById(akunSalah);
      const meta = (u?.user?.app_metadata || {}) as Record<string, unknown>;
      await layanan.auth.admin.updateUserById(akunSalah, { app_metadata: { ...meta, umur_terkunci: false, dewasa: false, umur_sumber: "lepas_ikatan" } });
      return jawab(200, { kode: k.kode });
    }

    default:
      return jawab(400, { galat: "aksi" });
  }
});
