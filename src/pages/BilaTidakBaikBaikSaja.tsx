import { Link } from 'react-router-dom';
import { distressContent as D } from '@/data/distressContent';
import { DaftarRujukan, urutanRujukan } from '@/components/RujukanDistress';
import { useUserTrack } from '@/hooks/useUserTrack';

/** B10: halaman publik penjelasan cabang distress. Semua teks DRAF dari src/data/distressContent.ts. */
export default function BilaTidakBaikBaikSaja() {
  const track = useUserTrack();
  const H = D.halaman;
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <article className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">{H.judul}</h1>
        <p className="text-muted-foreground">{H.pengantar}</p>
        {H.bagian.map((b) => (
          <section key={b.judul} className="space-y-1">
            <h2 className="text-lg font-semibold">{b.judul}</h2>
            <p>{b.isi}</p>
          </section>
        ))}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">{H.judulDaftar}</h2>
          <DaftarRujukan urut={urutanRujukan('tanda_berat', track)} />
        </section>
        <Link to="/" className="inline-block text-sm underline">
          {H.kembali}
        </Link>
      </article>
    </main>
  );
}
