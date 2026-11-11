// Tonggak 2a · pilihan peran dan umur (manifest v0.6 A.1–A.3, A.9; KEPUTUSAN Raihan 11 Nov 22.24).
// Alur: pilih peran → (siswa: jenjang · mahasiswa: di IOU?) → (bukan siswa: centang 18+) → layar konfirmasi → simpan di server.
// Tidak ada pilihan bawaan yang tercentang. Layar konfirmasi menyebut akibat dan masa ralat 15 menit sebelum kunci.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { TEKS_PINTU, type PeranPilihan } from '@/data/pintuMasukContent';
import { VARIAN_AKTIF } from '@/data/izinKuliahContent';
import { tulisPeran, type Jenjang } from '@/lib/peran';
import { lupakanCacheIzin } from '@/lib/perangkat';

export type UserTrack = 'siswa' | 'mahasiswa_iou';

interface RoleOnboardingProps {
  onDone: (track: UserTrack) => void | Promise<void>;
}

const URUTAN: PeranPilihan[] = ['siswa', 'mahasiswa', 'orang_tua', 'guru_bk', 'guru', 'umum'];

export default function RoleOnboarding({ onDone }: RoleOnboardingProps) {
  const { toast } = useToast();
  const t = TEKS_PINTU[VARIAN_AKTIF];
  const [peran, setPeran] = useState<PeranPilihan | null>(null);
  const [jenjang, setJenjang] = useState<Jenjang | null>(null);
  const [iou, setIou] = useState<boolean | null>(null);
  const [dewasa18, setDewasa18] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);

  const dewasa = peran !== null && peran !== 'siswa' && dewasa18;
  const lengkap = peran !== null && (peran !== 'siswa' || jenjang !== null) && (peran !== 'mahasiswa' || iou !== null);

  const simpan = async () => {
    if (!peran) return;
    setMenyimpan(true);
    const h = await tulisPeran({ peran, jenjang: peran === 'siswa' ? jenjang : null, mahasiswaIou: peran === 'mahasiswa' ? iou === true : false, menyatakan18: dewasa });
    setMenyimpan(false);
    if (h.galat) {
      toast({ title: 'Belum tersimpan', description: 'Coba lagi sebentar lagi.', variant: 'destructive' });
      return;
    }
    lupakanCacheIzin();
    await onDone(peran === 'mahasiswa' && iou === true ? 'mahasiswa_iou' : 'siswa');
  };

  if (konfirmasi && peran) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-lg font-heading font-semibold text-foreground text-center">{t.judulKonfirmasi}</h2>
        <p className="text-sm text-foreground">{t.ringkasan(t.peran[peran].label, dewasa)}</p>
        <p className="text-sm text-muted-foreground">{dewasa ? t.akibatDewasa : t.akibatAnak}</p>
        <p className="text-sm text-muted-foreground">{t.peringatanKunci}</p>
        <div className="flex flex-col gap-2">
          <Button onClick={simpan} disabled={menyimpan}>
            {menyimpan && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t.yaBenar}
          </Button>
          <Button variant="outline" onClick={() => setKonfirmasi(false)} disabled={menyimpan}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.ubahPilihan}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10">
        <School className="w-5 h-5 text-primary" />
      </div>
      <div className="text-center space-y-1">
        <h2 className="text-lg font-heading font-semibold text-foreground">{t.judulPeran}</h2>
        <p className="text-sm text-muted-foreground">{t.pengantarPeran}</p>
      </div>

      <div className="space-y-2" role="radiogroup" aria-label={t.judulPeran}>
        {URUTAN.map((p) => (
          <button
            key={p}
            type="button"
            role="radio"
            aria-checked={peran === p}
            onClick={() => { setPeran(p); setJenjang(null); setIou(null); if (p === 'siswa') setDewasa18(false); }}
            className={`w-full rounded-xl border p-3 text-left transition-colors ${peran === p ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
          >
            <p className="text-sm font-semibold text-foreground">{t.peran[p].label}</p>
            <p className="text-xs text-muted-foreground">{t.peran[p].ket}</p>
          </button>
        ))}
      </div>

      {peran === 'siswa' && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{t.judulJenjang}</p>
          <div className="flex flex-wrap gap-2">
            {(['kelas_10_11', 'kelas_12', 'baru_lulus'] as Jenjang[]).map((j) => (
              <Button key={j} type="button" size="sm" variant={jenjang === j ? 'default' : 'outline'} onClick={() => setJenjang(j)}>{t.jenjang[j]}</Button>
            ))}
          </div>
        </div>
      )}

      {peran === 'mahasiswa' && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{t.tanyaIou}</p>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant={iou === true ? 'default' : 'outline'} onClick={() => setIou(true)}>{t.iouYa}</Button>
            <Button type="button" size="sm" variant={iou === false ? 'default' : 'outline'} onClick={() => setIou(false)}>{t.iouTidak}</Button>
          </div>
        </div>
      )}

      {peran !== null && peran !== 'siswa' && (
        <div className="flex items-start gap-3">
          <Checkbox id="pintu-18" checked={dewasa18} onCheckedChange={(v) => setDewasa18(v === true)} />
          <Label htmlFor="pintu-18" className="text-sm leading-relaxed">{t.umur18}</Label>
        </div>
      )}

      <Button className="w-full" disabled={!lengkap} onClick={() => setKonfirmasi(true)}>{t.lanjut}</Button>
    </motion.div>
  );
}
