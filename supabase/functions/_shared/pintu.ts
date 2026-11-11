// Tonggak 2a · alat bersama untuk atur-peran, aktifkan-peserta, kelola-peserta (manifest v0.6).
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

export function jawab(status: number, isi: unknown): Response {
  return new Response(JSON.stringify(isi), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

/** IP pemanggil: cf-connecting-ip, atau elemen TERAKHIR x-forwarded-for (manifest E.2). Header yang dipakai ikut dicatat. */
export function ipDari(req: Request): { ip: string; sumber: string } {
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  if (cf) return { ip: cf, sumber: "cf-connecting-ip" };
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const bagian = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (bagian.length) return { ip: bagian[bagian.length - 1], sumber: "x-forwarded-for(akhir)" };
  }
  const xr = req.headers.get("x-real-ip")?.trim();
  if (xr) return { ip: xr, sumber: "x-real-ip" };
  return { ip: "tanpa-ip", sumber: "tidak-ada" };
}

/** HMAC-SHA256 heksadesimal. Rahasia berversi: SULU_KODE_RAHASIA_V<n> (manifest B.5). */
export async function hmac(rahasia: string, teks: string): Promise<string> {
  const kunci = await crypto.subtle.importKey("raw", new TextEncoder().encode(rahasia), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", kunci, new TextEncoder().encode(teks));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const VERSI_KUNCI_AKTIF = 1;
export function rahasiaVersi(v: number, get: (k: string) => string | undefined = (k) => Deno.env.get(k)): string | null {
  return get(`SULU_KODE_RAHASIA_V${v}`) || null;
}

/** Kode peserta dinormalkan: huruf besar, tanpa spasi atau tanda hubung. */
export function normalkanKode(k: string): string {
  return (k || "").toUpperCase().replace(/[\s-]/g, "");
}

export const ABJAD = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function kodeAcak(panjang: number): string {
  let s = "";
  while (s.length < panjang) {
    const b = crypto.getRandomValues(new Uint8Array(32));
    for (const x of b) if (x < 248 && s.length < panjang) s += ABJAD[x % 31];
  }
  return s;
}

export function klienLayanan(): SupabaseClient {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
}

/** Pengguna pemanggil dari token permintaan; null bila tamu atau token tidak sah. */
export async function penggunaPemanggil(req: Request, layanan: SupabaseClient) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await layanan.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function lajuOk(layanan: SupabaseClient, aksi: string, batas: number, ip: string, tambahan = ""): Promise<boolean> {
  const { data, error } = await layanan.rpc("sulu_laju_ok_ip", { p_aksi: aksi, p_batas_ip: batas, p_ip: ip, p_tambahan: tambahan });
  if (error) return false; // gagal tertutup
  return data === true;
}

export async function adalahAdmin(layanan: SupabaseClient, uid: string): Promise<boolean> {
  const { data } = await layanan.rpc("is_admin", { _user_id: uid });
  return data === true;
}
