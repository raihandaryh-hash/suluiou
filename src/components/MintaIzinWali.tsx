// Tonggak PW · kartu siswa: minta izin orang tua lewat WhatsApp. Tampil hanya untuk akun anak yang belum berizin.
// Nomor HP orang tua tidak pernah diisi di Sulu: siswa memilih kontak di WhatsApp-nya sendiri.
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VARIAN_AKTIF } from '@/data/izinKuliahContent';
import { TEKS_WALI } from '@/data/izinWaliContent';
import { buatTautanWali, statusIzinWali, tautanIzin } from '@/lib/izinWali';
import { bolehSimpan, lupakanCacheIzin, unggahPerangkatKeAkun } from '@/lib/perangkat';

export default function MintaIzinWali({ ringkas = false }: { ringkas?: boolean }) {
  const t = TEKS_WALI[VARIAN_AKTIF];
  const { toast } = useToast();
  const [tampil, setTampil] = useState<'tidak' | 'minta' | 'aktif'>('tidak');
  const [hubungan, setHubungan] = useState<string>('');
  const [tautan, setTautan] = useState<string | null>(null);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(false);

  useEffect(() => {
    let batal = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const meta = (data.user?.app_metadata ?? {}) as Record<string, unknown>;
      if (!data.user || meta.umur_terkunci !== true || meta.dewasa === true) return;
      const s = await statusIzinWali();
      if (batal) return;
      if (s.data?.aktif) {
        // izin baru masuk: unggah isian perangkat ke akun (pola aktivasi kode peserta)
        lupakanCacheIzin();
        if (await bolehSimpan(true)) await unggahPerangkatKeAkun(data.user.id);
        setHubungan(s.data.hubungan ? t.hubungan[s.data.hubungan] : '');
        setTampil('aktif');
      } else if (!(await bolehSimpan())) {
        setTampil('minta');
      }
    })();
    return () => { batal = true; };
  }, [t]);

  const minta = async () => {
    setMemuat(true);
    const r = await buatTautanWali();
    setMemuat(false);
    if (!r.data) { toast({ title: t.galat[r.galat ?? 'lainnya'] ?? t.galat.lainnya, variant: 'destructive' }); return; }
    const url = tautanIzin(r.data.token);
    setTautan(url);
    const { data } = await supabase.auth.getUser();
    const nama = String((data.user?.user_metadata as Record<string, unknown> | undefined)?.full_name ?? '').split(/\s+/)[0] ?? '';
    // jendela WhatsApp dibuka oleh ketukan siswa sendiri (tautan di bawah), karena peramban HP memblokir
    // window.open yang terjadi sesudah menunggu jawaban server
    setWaUrl(`https://wa.me/?text=${encodeURIComponent(t.pesanWa(nama, url))}`);
  };

  const salin = async () => {
    if (!tautan) return;
    try { await navigator.clipboard.writeText(tautan); toast({ title: t.tersalin }); } catch { /* */ }
  };

  if (tampil === 'tidak') return null;
  if (tampil === 'aktif') return ringkas ? null : <p className="text-sm text-muted-foreground">{t.aktif(hubungan || t.hubungan.wali)}</p>;

  return (
    <div className={ringkas ? 'rounded-xl border border-border p-4 space-y-3' : 'space-y-3'}>
      <h3 className="text-base font-heading font-semibold">{t.judulSiswa}</h3>
      <p className="text-sm text-muted-foreground">{t.pengantarSiswa}</p>
      <div className="flex flex-wrap gap-2">
        {waUrl ? (
          <Button size="sm" asChild><a href={waUrl} target="_blank" rel="noopener noreferrer">{t.tombolMinta}</a></Button>
        ) : (
          <Button size="sm" onClick={minta} disabled={memuat}>
            {memuat && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t.tombolBuat}
          </Button>
        )}
        {tautan && <Button size="sm" variant="outline" onClick={salin}>{t.salinTautan}</Button>}
      </div>
      {tautan && <p className="text-xs text-muted-foreground">{t.sudahDikirim}</p>}
    </div>
  );
}
