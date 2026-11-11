// Tonggak 2a · halaman admin izin orang tua per kelas (manifest v0.6 C.8, D).
// Rekap formulir → kode peserta (tampil sekali, untuk dicetak guru) · reset · cabut · lepas ikatan · hitungan tanpa identitas.
import { useCallback, useEffect, useState } from 'react';
import { Loader2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Peserta {
  id: string;
  nama_panggilan: string;
  izin_asesmen_ai: boolean;
  izin_dihubungi_kuliah: boolean;
  izin_hasil_untuk_tawaran: boolean;
  nama_orang_tua: string;
  tanggal_formulir: string;
  user_id_aktif: string | null;
  pin_salah: number;
  dicabut_pada: string | null;
}
interface Hitung { tanggal: string; jenis: 'mulai' | 'selesai'; jumlah: number }
interface KodeBaru { nama_panggilan: string; kode: string }

// Satu baris per siswa, dipisah titik koma, urutan kolom lembar rekap admin (formulir sekolah, Docs 11 Nov):
// nama;asesmen AI (ya/tidak);dihubungi soal kuliah;hasil untuk tawaran;nama orang tua;tanggal (YYYY-MM-DD)
export function uraiRekap(teks: string) {
  const ya = (v: string) => /^(ya|y|1|true|v|✓)$/i.test(v.trim());
  return teks.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [nama, ai, kontak, tawaran, ortu, tgl] = l.split(';').map((x) => (x ?? '').trim());
    return { nama_panggilan: nama, izin_asesmen_ai: ya(ai ?? ''), izin_dihubungi_kuliah: ya(kontak ?? ''), izin_hasil_untuk_tawaran: ya(tawaran ?? ''), nama_orang_tua: ortu, tanggal_formulir: tgl };
  });
}

async function panggil(isi: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('kelola-peserta', { body: isi });
  if (error) {
    let galat = 'gagal';
    try { const j = await (error as { context?: Response }).context?.json(); if (j?.galat) galat = String(j.galat); } catch { /* */ }
    return { data: null, galat };
  }
  return { data, galat: null as string | null };
}

export default function PesertaKelasAdmin({ classId, namaKelas }: { classId: string; namaKelas: string }) {
  const { toast } = useToast();
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [hitung, setHitung] = useState<Hitung[]>([]);
  const [rekap, setRekap] = useState('');
  const [memuat, setMemuat] = useState(false);
  const [kodeBaru, setKodeBaru] = useState<KodeBaru[]>([]);

  const muat = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const [p, h] = await Promise.all([
      sb.from('sulu_peserta').select('id, nama_panggilan, izin_asesmen_ai, izin_dihubungi_kuliah, izin_hasil_untuk_tawaran, nama_orang_tua, tanggal_formulir, user_id_aktif, pin_salah, dicabut_pada').eq('class_id', classId).order('nama_panggilan'),
      sb.from('sulu_hitung_kelas').select('tanggal, jenis, jumlah').eq('class_id', classId).order('tanggal', { ascending: false }),
    ]);
    setPeserta((p.data as Peserta[]) ?? []);
    setHitung((h.data as Hitung[]) ?? []);
  }, [classId]);
  useEffect(() => { void muat(); }, [muat]);

  const buat = async () => {
    const baris = uraiRekap(rekap);
    if (baris.length === 0) return;
    setMemuat(true);
    const r = await panggil({ aksi: 'buat', class_id: classId, baris });
    setMemuat(false);
    if (r.galat) { toast({ title: 'Rekap belum tersimpan', description: r.galat, variant: 'destructive' }); return; }
    setKodeBaru((r.data as { peserta: KodeBaru[] }).peserta);
    setRekap('');
    void muat();
  };

  const aksi = async (nama: 'reset' | 'cabut' | 'lepas_ikatan', p: Peserta) => {
    const tanya = { reset: `Terbitkan kode baru untuk ${p.nama_panggilan}? Kode lama mati.`, cabut: `Cabut izin ${p.nama_panggilan}? Data server siswa ini dihapus.`, lepas_ikatan: `Lepas kode ${p.nama_panggilan} dari akun yang sekarang? Kode baru diterbitkan.` }[nama];
    if (!window.confirm(tanya)) return;
    const r = await panggil({ aksi: nama, peserta_id: p.id });
    if (r.galat) { toast({ title: 'Belum berhasil', description: r.galat, variant: 'destructive' }); return; }
    const kode = (r.data as { kode?: string })?.kode;
    if (kode) setKodeBaru([{ nama_panggilan: p.nama_panggilan, kode }]);
    void muat();
  };

  const totalHitung = (j: 'mulai' | 'selesai') => hitung.filter((h) => h.jenis === j).reduce((a, h) => a + h.jumlah, 0);

  return (
    <section className="rounded-xl border border-border bg-card p-6 space-y-5">
      <h2 className="text-lg font-heading font-bold text-foreground">Izin orang tua dan kode peserta</h2>

      <div className="text-sm text-muted-foreground">
        Peserta tanpa izin (data hanya di perangkat): mulai {totalHitung('mulai')}, selesai {totalHitung('selesai')}. Angka ini tanpa nama.
      </div>

      {kodeBaru.length > 0 && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2 print:border-0">
          <p className="text-sm font-semibold">Kode hanya tampil sekali. Cetak atau salin sekarang, lalu bagikan per siswa.</p>
          <table className="text-sm">
            <tbody>
              {kodeBaru.map((k) => (
                <tr key={k.kode}><td className="pr-6 py-1">{k.nama_panggilan}</td><td className="font-mono tracking-widest">{k.kode}</td><td className="pl-6 text-muted-foreground">{namaKelas}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" />Cetak</Button>
            <Button size="sm" variant="ghost" onClick={() => setKodeBaru([])}>Sudah dicatat</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm">Tempel rekap formulir yang kembali, satu baris per siswa:</p>
        <p className="text-xs text-muted-foreground font-mono">nama;asesmen AI;dihubungi soal kuliah;hasil untuk tawaran;nama orang tua;YYYY-MM-DD</p>
        <Textarea value={rekap} onChange={(e) => setRekap(e.target.value)} rows={5} placeholder="Ani;ya;tidak;ya;Ibu Siti;2026-11-12" />
        <Button onClick={buat} disabled={memuat || !rekap.trim()}>
          {memuat && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Buat kode peserta
        </Button>
      </div>

      {peserta.length > 0 && (
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted-foreground"><th className="py-1">Siswa</th><th>Izin</th><th>Status</th><th /></tr></thead>
          <tbody>
            {peserta.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="py-2">{p.nama_panggilan}<div className="text-xs text-muted-foreground">{p.nama_orang_tua} · {p.tanggal_formulir}</div></td>
                <td className="text-xs">{[p.izin_asesmen_ai && 'asesmen AI', p.izin_dihubungi_kuliah && 'dihubungi', p.izin_hasil_untuk_tawaran && 'tawaran'].filter(Boolean).join(', ') || 'tidak ada'}</td>
                <td className="text-xs">{p.dicabut_pada ? 'dicabut' : p.user_id_aktif ? 'aktif di akun' : p.pin_salah >= 5 ? 'terkunci PIN' : 'belum dipakai'}</td>
                <td className="text-right space-x-1">
                  {!p.dicabut_pada && !p.user_id_aktif && <Button size="sm" variant="outline" onClick={() => aksi('reset', p)}>Reset</Button>}
                  {!p.dicabut_pada && p.user_id_aktif && <Button size="sm" variant="outline" onClick={() => aksi('lepas_ikatan', p)}>Lepas ikatan</Button>}
                  {!p.dicabut_pada && <Button size="sm" variant="destructive" onClick={() => aksi('cabut', p)}>Cabut</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
