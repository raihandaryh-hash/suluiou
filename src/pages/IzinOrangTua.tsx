// Tonggak PW · laman orang tua/wali (tanpa akun). Dua rute:
//   /izin-orang-tua/:token        → baca keterangan, centang, nama, setuju
//   /izin-orang-tua/kelola/:kode  → lihat atau tarik izin
// Teks persetujuan diambil dari server (bukti PP 33/2026 Pasal 36); label layar dari izinWaliContent.
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { VARIAN_AKTIF } from '@/data/izinKuliahContent';
import { TEKS_WALI } from '@/data/izinWaliContent';
import {
  kelolaIzinWali, lihatTautanWali, setujuIzinWali, tarikIzinWali, tautanKelola, tanggalId,
  type KeadaanTautan, type TeksIzinServer,
} from '@/lib/izinWali';

function Bingkai({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-5 py-8">
      <div className="mx-auto max-w-lg space-y-6">
        <Logo />
        <div className="glass rounded-2xl p-6 space-y-5">{children}</div>
      </div>
    </div>
  );
}

function Setuju({ token }: { token: string }) {
  const t = TEKS_WALI[VARIAN_AKTIF];
  const [keadaan, setKeadaan] = useState<KeadaanTautan | 'memuat' | 'galat'>('memuat');
  const [teks, setTeks] = useState<TeksIzinServer | null>(null);
  const [versi, setVersi] = useState('');
  const [namaAnak, setNamaAnak] = useState('');
  const [nama, setNama] = useState('');
  const [hubungan, setHubungan] = useState<'' | 'ayah' | 'ibu' | 'wali'>('');
  const [centang, setCentang] = useState(false);
  const [kirim, setKirim] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [kelola, setKelola] = useState<string | null>(null);

  useEffect(() => {
    lihatTautanWali(token).then((r) => {
      if (!r.data) { setKeadaan('galat'); setGalat(r.galat); return; }
      setKeadaan(r.data.keadaan);
      if (r.data.teks) setTeks(r.data.teks);
      setVersi(r.data.teks_versi ?? '');
      setNamaAnak(r.data.nama_anak ?? '');
    });
  }, [token]);

  const setuju = async () => {
    setKirim(true); setGalat(null);
    const r = await setujuIzinWali({ token, nama, hubungan, centang, teks_versi: versi });
    setKirim(false);
    if (!r.data) {
      if (r.galat === 'sudah_dipakai' || r.galat === 'kedaluwarsa' || r.galat === 'tidak_ada') { setKeadaan(r.galat); return; }
      setGalat(r.galat); return;
    }
    setKelola(r.data.kelola);
  };

  if (keadaan === 'memuat') return <Bingkai><Loader2 className="w-5 h-5 animate-spin" /></Bingkai>;
  if (keadaan === 'galat') return <Bingkai><p className="text-sm">{t.galat[galat ?? 'lainnya'] ?? t.galat.lainnya}</p></Bingkai>;
  if (keadaan !== 'sah') return <Bingkai><p className="text-sm">{t.tautanTidakBerlaku[keadaan]}</p></Bingkai>;

  if (kelola) {
    const url = tautanKelola(kelola);
    return (
      <Bingkai>
        <p className="text-base font-semibold">{t.selesai}</p>
        <p className="text-sm text-muted-foreground">{t.simpanKelola}</p>
        <p className="break-all rounded-lg bg-muted p-3 text-sm">{url}</p>
      </Bingkai>
    );
  }

  return (
    <Bingkai>
      <p className="text-sm text-muted-foreground">{t.sapaan(namaAnak)}</p>
      {teks && (
        <div className="space-y-3">
          <h1 className="text-lg font-heading font-semibold">{teks.judul}</h1>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
            {teks.butir.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
      )}
      <div className="space-y-1">
        <Label htmlFor="nama-wali">{t.labelNama}</Label>
        <Input id="nama-wali" value={nama} maxLength={120} autoComplete="name" onChange={(e) => setNama(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t.labelHubungan}</Label>
        <div className="flex flex-wrap gap-2">
          {(['ayah', 'ibu', 'wali'] as const).map((h) => (
            <Button key={h} type="button" size="sm" variant={hubungan === h ? 'default' : 'outline'} onClick={() => setHubungan(h)}>
              {t.hubungan[h]}
            </Button>
          ))}
        </div>
      </div>
      {teks && (
        <div className="flex items-start gap-3">
          <Checkbox id="centang-wali" checked={centang} onCheckedChange={(v) => setCentang(v === true)} />
          <Label htmlFor="centang-wali" className="text-sm leading-relaxed">{teks.centang}</Label>
        </div>
      )}
      {galat && <p className="text-sm text-destructive">{t.galat[galat] ?? t.galat.lainnya}</p>}
      <Button onClick={setuju} disabled={kirim || !centang || !hubungan || nama.trim().length < 3}>
        {kirim && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {t.tombolSetuju}
      </Button>
    </Bingkai>
  );
}

function Kelola({ kode }: { kode: string }) {
  const t = TEKS_WALI[VARIAN_AKTIF];
  const [status, setStatus] = useState<{ aktif: boolean; diberikan_pada: string; dicabut_pada: string | null } | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const [kirim, setKirim] = useState(false);

  const muat = () => kelolaIzinWali(kode).then((r) => { if (r.data) setStatus(r.data); else setGalat(r.galat); });
  useEffect(() => { void muat(); }, [kode]);

  const tarik = async () => {
    if (!window.confirm(t.tarikYakin)) return;
    setKirim(true);
    const r = await tarikIzinWali(kode);
    setKirim(false);
    if (!r.data) { setGalat(r.galat); return; }
    await muat();
  };

  if (galat) return <Bingkai><p className="text-sm">{t.galat[galat] ?? t.tautanTidakBerlaku.tidak_ada}</p></Bingkai>;
  if (!status) return <Bingkai><Loader2 className="w-5 h-5 animate-spin" /></Bingkai>;
  return (
    <Bingkai>
      <h1 className="text-lg font-heading font-semibold">{t.judulKelola}</h1>
      <p className="text-sm">
        {status.aktif ? t.statusAktif(tanggalId(status.diberikan_pada)) : t.statusDitarik(tanggalId(status.dicabut_pada ?? ''))}
      </p>
      {status.aktif && (
        <Button variant="outline" onClick={tarik} disabled={kirim}>
          {kirim && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {t.tombolTarik}
        </Button>
      )}
    </Bingkai>
  );
}

export default function IzinOrangTua() {
  const { token, kode } = useParams();
  if (kode) return <Kelola kode={kode} />;
  return <Setuju token={token ?? ''} />;
}
