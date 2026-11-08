import { Link } from 'react-router-dom';
import { Phone, Globe } from 'lucide-react';
import { distressContent as D, type BarisRujukan } from '@/data/distressContent';
import type { TingkatDistress } from '@/lib/distress';
import { useUserTrack, type UserTrack } from '@/hooks/useUserTrack';
import { Button } from '@/components/ui/button';

/**
 * B4 + B6: urutan rujukan.
 * - Jalur siswa (B4): Guru BK atau wali kelas, orang tua atau orang dewasa tepercaya, Healing119.
 * - mahasiswa_iou (B6): HSA di atas; selama kontak HSA belum ada, jalur B4 tetap tampil di bawahnya.
 * - Jalur umum (orang dewasa tepercaya + Healing119) selalu ada.
 * - bahaya_langsung: Healing119 (119 ekstensi 8) paling atas.
 */
export function urutanRujukan(tingkat: TingkatDistress, track: UserTrack): BarisRujukan[] {
  const b = D.baris;
  let urut: BarisRujukan[] =
    track === 'mahasiswa_iou' ? [b.hsa, b.bk, b.orangTua, b.healing119] : [b.bk, b.orangTua, b.healing119];
  if (tingkat === 'bahaya_langsung') urut = [b.healing119, ...urut.filter((x) => x.id !== 'healing119')];
  return urut;
}

export function DaftarRujukan({ urut }: { urut: BarisRujukan[] }) {
  return (
    <ol className="space-y-3">
      {urut.map((r) => (
        <li key={r.id} className="rounded-lg border border-border bg-background p-3">
          <p className="font-semibold text-sm">{r.judul}</p>
          <p className="text-sm text-muted-foreground mt-1">{r.isi}</p>
          {r.telepon && (
            <a href="tel:119" className="mt-2 flex items-center gap-2 text-sm font-medium underline">
              <Phone className="h-4 w-4" aria-hidden /> {D.labelTelepon}: {r.telepon}
            </a>
          )}
          {r.situs && (
            <a
              href={`https://${r.situs}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-2 text-sm underline"
            >
              <Globe className="h-4 w-4" aria-hidden /> {D.labelSitus}: {r.situs}
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}

/** B3a/B6: layar rujukan. Tampil saat pemeriksa distress cocok (klien atau server). Tidak memanggil AI. */
export default function RujukanDistress({
  tingkat,
  onTutup,
}: {
  tingkat: TingkatDistress;
  onTutup?: () => void;
}) {
  const track = useUserTrack();
  const urut = urutanRujukan(tingkat, track);
  return (
    <div role="alert" aria-live="assertive" className="rounded-xl border border-border bg-muted/40 p-4 space-y-3 text-left">
      <h3 className="font-semibold">{D.judul[tingkat]}</h3>
      <p className="text-sm">{D.pembuka[tingkat]}</p>
      <DaftarRujukan urut={urut} />
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Link to="/bila-tidak-baik-baik-saja" className="text-sm underline">
          {D.tautanPenjelasan}
        </Link>
        {onTutup && (
          <Button variant="outline" size="sm" onClick={onTutup}>
            {D.tombolTutup}
          </Button>
        )}
      </div>
    </div>
  );
}
