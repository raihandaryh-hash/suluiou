// Izin per tujuan dan jalur tarik (manifest Persetujuan dan Jalur Tarik v0.2, disetujui Raihan 11 Nov 15.52).
// Menggantikan ParentConsentSection di halaman hasil: anak tidak lagi diminta mengisi nomor orang tua.
// - Dewasa (masuk, dan jalur mahasiswa IOU atau menyatakan 18+): dua centang terpisah P1 dan P2, tidak tercentang
//   bawaan, tersimpan bersama versi teks, dan bisa dicabut.
// - Anak dan tamu: jalur tarik. Tombol membuka WhatsApp resmi penerimaan; tidak ada yang disimpan.
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserTrack } from '@/hooks/useUserTrack';
import { TEKS_IZIN, TEKS_TARIK, VARIAN_AKTIF, KANAL_PENERIMAAN } from '@/data/izinKuliahContent';
import { normalkanIzin, tautanTarik, tentukanAlur } from '@/lib/izinKuliah';
import { TANPA_IZIN, type IzinSkor } from '@/lib/leadScoring';

interface Props {
  resultId: string | null;
  programDipilih: string[];
  onIzinBerubah: (izin: IzinSkor) => void;
}

interface BarisIzin {
  id: string;
  tujuan: 'dihubungi_kuliah' | 'hasil_untuk_tawaran';
  dicabut_pada: string | null;
}

// Tabel baru belum ada di tipe hasil generasi Lovable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tabelIzin = () => (supabase as any).from('sulu_izin');

export function IzinKuliahSection({ resultId, programDipilih, onIzinBerubah }: Props) {
  const { toast } = useToast();
  const track = useUserTrack();
  const t = TEKS_IZIN[VARIAN_AKTIF];
  const tt = TEKS_TARIK[VARIAN_AKTIF];
  const [userId, setUserId] = useState<string | null>(null);
  const [menyatakan18, setMenyatakan18] = useState(false);
  const [p1, setP1] = useState(false);
  const [p2, setP2] = useState(false);
  const [aktif, setAktif] = useState<BarisIzin[]>([]);
  const [memuat, setMemuat] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    if (!resultId || !userId) return;
    void tabelIzin()
      .select('id, tujuan, dicabut_pada')
      .eq('result_id', resultId)
      .is('dicabut_pada', null)
      .then(({ data }: { data: BarisIzin[] | null }) => {
        const baris = data ?? [];
        setAktif(baris);
        onIzinBerubah(
          normalkanIzin({
            dihubungi: baris.some((b) => b.tujuan === 'dihubungi_kuliah'),
            hasilUntukTawaran: baris.some((b) => b.tujuan === 'hasil_untuk_tawaran'),
          }),
        );
      });
    // onIzinBerubah sengaja tidak masuk dependensi agar tidak memuat ulang tiap render induk.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultId, userId]);

  const alur = tentukanAlur({ masuk: !!userId, jalurMahasiswa: track === 'mahasiswa_iou', menyatakan18 });

  const simpan = async () => {
    if (!resultId || !userId || !p1) return;
    setMemuat(true);
    const izin = normalkanIzin({ dihubungi: p1, hasilUntukTawaran: p2 });
    const baris = [
      { result_id: resultId, user_id: userId, tujuan: 'dihubungi_kuliah', pemberi: 'diri', menyatakan_18_plus: menyatakan18, teks_versi: t.p1.versi },
      ...(izin.hasilUntukTawaran
        ? [{ result_id: resultId, user_id: userId, tujuan: 'hasil_untuk_tawaran', pemberi: 'diri', menyatakan_18_plus: menyatakan18, teks_versi: t.p2.versi }]
        : []),
    ];
    // P1 lebih dulu: kebijakan basis data menolak P2 tanpa P1 aktif.
    for (const b of baris) {
      const { error } = await tabelIzin().insert(b);
      if (error) {
        setMemuat(false);
        toast({ title: 'Belum tersimpan', description: error.message, variant: 'destructive' });
        return;
      }
    }
    const { data } = await tabelIzin().select('id, tujuan, dicabut_pada').eq('result_id', resultId).is('dicabut_pada', null);
    setAktif((data as BarisIzin[] | null) ?? []);
    onIzinBerubah(izin);
    setMemuat(false);
    toast({ title: t.tersimpan });
  };

  const cabut = async () => {
    if (!resultId) return;
    setMemuat(true);
    // Mencabut P1 juga mencabut P2 dan mengosongkan skor (pemicu basis data 0003).
    const p1Aktif = aktif.find((b) => b.tujuan === 'dihubungi_kuliah');
    const sasaran = p1Aktif ? [p1Aktif] : aktif;
    for (const b of sasaran) {
      await tabelIzin().update({ dicabut_pada: new Date().toISOString() }).eq('id', b.id);
    }
    setAktif([]);
    setP1(false);
    setP2(false);
    onIzinBerubah(TANPA_IZIN);
    setMemuat(false);
    toast({ title: t.dicabut });
  };

  // Tamu (tanpa akun, termasuk kelas sekolah) selalu diperlakukan sebagai anak.
  if (!userId) {
    return <JalurTarik programDipilih={programDipilih} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 md:p-8 mb-12">
      <h3 className="text-lg font-heading font-bold mb-1">{alur === 'dewasa' ? t.judul : tt.judul}</h3>
      <p className="text-sm text-muted-foreground mb-4">{alur === 'dewasa' ? t.pengantar : tt.pengantar}</p>

      {track !== 'mahasiswa_iou' && aktif.length === 0 && (
        <div className="flex items-start gap-3 mb-4">
          <Checkbox id="izin-umur" checked={menyatakan18} onCheckedChange={(v) => { setMenyatakan18(v === true); if (v !== true) { setP1(false); setP2(false); } }} />
          <Label htmlFor="izin-umur" className="text-sm leading-relaxed">{t.umur}</Label>
        </div>
      )}

      {alur === 'tarik' ? (
        <JalurTarik programDipilih={programDipilih} tanpaBingkai />
      ) : aktif.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm">{t.tersimpan}</p>
          <ul className="text-sm text-muted-foreground list-disc pl-5">
            {aktif.some((b) => b.tujuan === 'dihubungi_kuliah') && <li>{t.p1.teks}</li>}
            {aktif.some((b) => b.tujuan === 'hasil_untuk_tawaran') && <li>{t.p2.teks}</li>}
          </ul>
          <Button variant="outline" onClick={cabut} disabled={memuat}>
            {memuat && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t.cabut}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox id="izin-p1" checked={p1} onCheckedChange={(v) => { setP1(v === true); if (v !== true) setP2(false); }} />
            <Label htmlFor="izin-p1" className="text-sm leading-relaxed">{t.p1.teks}</Label>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="izin-p2" checked={p2} disabled={!p1} onCheckedChange={(v) => setP2(v === true)} />
            <Label htmlFor="izin-p2" className={`text-sm leading-relaxed ${p1 ? '' : 'opacity-50'}`}>{t.p2.teks}</Label>
          </div>
          <Button onClick={simpan} disabled={!p1 || !resultId || memuat}>
            {memuat && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t.simpan}
          </Button>
        </div>
      )}
    </motion.div>
  );
}

/** Jalur tarik: tombol ke kanal resmi. Tidak menulis apa pun ke basis data. */
function JalurTarik({ programDipilih, tanpaBingkai = false }: { programDipilih: string[]; tanpaBingkai?: boolean }) {
  const tt = TEKS_TARIK[VARIAN_AKTIF];
  const isi = (
    <div className="flex flex-wrap gap-3">
      {KANAL_PENERIMAAN.map((k) => (
        <Button key={k.nomorWa} asChild variant="outline">
          <a href={tautanTarik(k.nomorWa, programDipilih)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-4 h-4 mr-2" />
            {tt.tombol} · {k.label}
          </a>
        </Button>
      ))}
    </div>
  );
  if (tanpaBingkai) return isi;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 md:p-8 mb-12">
      <h3 className="text-lg font-heading font-bold mb-1">{tt.judul}</h3>
      <p className="text-sm text-muted-foreground mb-4">{tt.pengantar}</p>
      {isi}
    </motion.div>
  );
}
