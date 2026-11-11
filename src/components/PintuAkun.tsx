// Tonggak 2a · panel akun (manifest v0.6 A.9, B.3, C.7): masa ralat atau minta buka kunci, aktivasi kode peserta,
// dan hapus dari perangkat. Dipasang di halaman hasil dan profil.
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TEKS_PINTU } from '@/data/pintuMasukContent';
import { VARIAN_AKTIF } from '@/data/izinKuliahContent';
import { bacaPeran, mintaBukaKunci, type StatusPeran } from '@/lib/peran';
import { bolehSimpan, hapusSemuaDariPerangkat, lupakanCacheIzin, unggahPerangkatKeAkun } from '@/lib/perangkat';

export default function PintuAkun() {
  const t = TEKS_PINTU[VARIAN_AKTIF];
  const { toast } = useToast();
  const [uid, setUid] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusPeran | null>(null);
  const [boleh, setBoleh] = useState<boolean | null>(null);
  const [kode, setKode] = useState('');
  const [paham, setPaham] = useState(false);
  const [memuat, setMemuat] = useState(false);
  const [mintaTerkirim, setMintaTerkirim] = useState(false);

  const segarkan = async () => {
    const { data } = await supabase.auth.getUser();
    setUid(data.user?.id ?? null);
    setBoleh(await bolehSimpan(true));
    if (data.user) { const r = await bacaPeran(); if (r.data) setStatus(r.data); }
  };
  useEffect(() => { void segarkan(); }, []);

  const aktifkan = async () => {
    setMemuat(true);
    const { data, error } = await supabase.functions.invoke('aktifkan-peserta', { body: { aksi: 'aktifkan', kode } });
    let galat: string | null = null;
    if (error) { galat = 'lainnya'; try { const j = await (error as { context?: Response }).context?.json(); if (j?.galat) galat = String(j.galat); } catch { /* */ } }
    if (galat) {
      setMemuat(false);
      toast({ title: t.galatKode[galat] ?? t.galatKode.lainnya, variant: 'destructive' });
      return;
    }
    await supabase.auth.refreshSession();
    lupakanCacheIzin();
    if (uid) await unggahPerangkatKeAkun(uid);
    setMemuat(false);
    toast({ title: t.aktivasiBerhasil((data as { peserta?: { nama_panggilan?: string } })?.peserta?.nama_panggilan ?? '') });
    await segarkan();
  };

  const minta = async () => {
    const r = await mintaBukaKunci();
    if (!r.galat) setMintaTerkirim(true);
  };

  const hapus = () => {
    if (!window.confirm(t.hapusPerangkatYakin)) return;
    hapusSemuaDariPerangkat();
    toast({ title: t.hapusPerangkatSelesai });
  };

  if (boleh === null) return null;

  return (
    <div className="glass rounded-2xl p-6 md:p-8 mb-12 space-y-5">
      {status?.terkunci && (
        <div className="space-y-2">
          {status.sisa_ralat_ms > 0 ? (
            <p className="text-sm text-muted-foreground">{t.sisaRalat(Math.ceil(status.sisa_ralat_ms / 60000))}</p>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground">{t.terkunci}</p>
              {mintaTerkirim ? <p className="text-sm">{t.mintaBukaTerkirim}</p> : <Button size="sm" variant="outline" onClick={minta}>{t.mintaBuka}</Button>}
            </div>
          )}
        </div>
      )}

      {uid && !boleh && (status?.peran === 'siswa' || !status?.dewasa) && (
        <div className="space-y-3">
          <h3 className="text-base font-heading font-semibold">{t.judulAktivasi}</h3>
          <p className="text-sm text-muted-foreground">{t.pengantarAktivasi}</p>
          <div className="space-y-1">
            <Label htmlFor="kode-peserta">{t.labelKode}</Label>
            <Input id="kode-peserta" value={kode} maxLength={9} autoComplete="off"
              onChange={(e) => setKode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))} />
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="kode-paham" checked={paham} onCheckedChange={(v) => setPaham(v === true)} />
            <Label htmlFor="kode-paham" className="text-sm leading-relaxed">{t.peringatanAktivasi}</Label>
          </div>
          <Button onClick={aktifkan} disabled={memuat || kode.length !== 8 || !paham}>
            {memuat && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t.aktifkan}
          </Button>
        </div>
      )}

      {!boleh && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t.modePerangkat} {t.modePerangkatKelas}</p>
          <Button size="sm" variant="outline" onClick={hapus}>{t.hapusPerangkat}</Button>
        </div>
      )}
    </div>
  );
}
