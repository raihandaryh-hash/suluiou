import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { kartuDaerahContent as T } from "@/data/kartuDaerahContent";

// Tonggak 2b · A1. Kartu kebutuhan daerah bersumber (kabupaten/kota).
// Tanpa model, tanpa pembanding, tanpa angka jarak. Pilihan kabupaten/kota
// hanya hidup di layar ini dan tidak disimpan.

type Sumber = { penerbit: string; judul: string; periode_survei: string; tautan_baca: string | null };
type Kartu = {
  id: string;
  wilayah: { kode_bps: string; nama: string; tingkat: string };
  jenis_kebutuhan: string;
  angka: { nilai: number; satuan: string; tahun_data: number; sumber_id: string };
  hati_hati: boolean;
  judul: string;
  ringkasan: string;
  langkah_awal: string;
};
type Indeks = {
  tanda_hati_hati: string;
  sumber: Record<string, Sumber>;
  jenis_kebutuhan: string[];
  provinsi: Record<string, { nama: string; berkas: string; belum_punya_kartu: Record<string, { kode_bps: string; nama: string }[]> }>;
};

// Nama dari berkas sumber kadang berjarak ("S I A K") atau berspasi ganda.
const rapi = (nama: string) => nama.replace(/\s+/g, " ").trim();
const berjarak = (nama: string) => /(^| )\S \S( |$)/.test(nama);

const DASAR = `${import.meta.env.BASE_URL}data/kartu/`;

async function ambil<TT>(nama: string): Promise<TT> {
  const r = await fetch(DASAR + nama);
  if (!r.ok) throw new Error(String(r.status));
  return (await r.json()) as TT;
}

export default function KartuDaerah({ province }: { province: string }) {
  const [indeks, setIndeks] = useState<Indeks | null>(null);
  const [kartu, setKartu] = useState<Kartu[] | null>(null);
  const [gagal, setGagal] = useState(false);
  const [kode, setKode] = useState<string>("");

  useEffect(() => {
    let aktif = true;
    setKartu(null);
    setKode("");
    setGagal(false);
    (async () => {
      try {
        const ix = indeks ?? (await ambil<Indeks>("indeks.json"));
        if (!aktif) return;
        if (!indeks) setIndeks(ix);
        const prov = Object.values(ix.provinsi).find((p) => p.nama === province);
        if (!prov) {
          setKartu([]);
          return;
        }
        const isi = await ambil<{ kartu: Kartu[] }>(prov.berkas);
        if (aktif) setKartu(isi.kartu);
      } catch {
        if (aktif) setGagal(true);
      }
    })();
    return () => {
      aktif = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province]);

  const prov = useMemo(
    () => (indeks ? Object.values(indeks.provinsi).find((p) => p.nama === province) ?? null : null),
    [indeks, province],
  );

  const wilayah = useMemo(() => {
    const peta = new Map<string, string>();
    (kartu ?? []).forEach((k) => {
      const nama = rapi(k.wilayah.nama);
      const lama = peta.get(k.wilayah.kode_bps);
      if (!lama || (berjarak(lama) && !berjarak(nama))) peta.set(k.wilayah.kode_bps, nama);
    });
    // Kabupaten/kota yang tercatat tetapi belum punya kartu tetap bisa dipilih.
    Object.values(prov?.belum_punya_kartu ?? {}).forEach((daftar) =>
      daftar.forEach((w) => {
        if (peta.has(w.kode_bps)) return;
        const nama = rapi(w.nama);
        peta.set(w.kode_bps, /^(Kab\.|Kabupaten|Kota) /.test(nama) ? nama : `Kab. ${nama}`);
      }),
    );
    return Array.from(peta, ([kodeBps, nama]) => ({ kodeBps, nama })).sort((a, b) =>
      a.kodeBps.localeCompare(b.kodeBps),
    );
  }, [kartu, prov]);

  const terpilih = useMemo(() => (kartu ?? []).filter((k) => k.wilayah.kode_bps === kode), [kartu, kode]);
  const belum =
    prov && indeks && kode
      ? indeks.jenis_kebutuhan.filter((j) => (prov.belum_punya_kartu[j] ?? []).some((w) => w.kode_bps === kode))
      : [];

  if (gagal) {
    return <p className="text-sm text-muted-foreground">{T.gagalMuat}</p>;
  }
  if (!indeks || kartu === null) return null;

  return (
    <section className="space-y-5 rounded-xl border border-border bg-card p-5" data-uji="kartu-daerah">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">
          {T.judulBagian}: {province}
        </h2>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{T.pengantar}</p>
      </div>

      {wilayah.length === 0 ? (
        <p className="text-sm text-foreground/85">{T.belumAdaProvinsi}</p>
      ) : (
        <>
          <div className="space-y-2">
            <label className="text-sm text-foreground/85" htmlFor="kartu-daerah-pilih">
              {T.pilihLabel}
            </label>
            <Select value={kode} onValueChange={setKode}>
              <SelectTrigger id="kartu-daerah-pilih" className="w-full sm:w-80">
                <SelectValue placeholder={T.pilihPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {wilayah.map((w) => (
                  <SelectItem key={w.kodeBps} value={w.kodeBps}>
                    {w.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {terpilih.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {terpilih.map((k) => {
                const s = indeks.sumber[k.angka.sumber_id];
                return (
                  <article key={k.id} className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
                    <span className="inline-block text-[10px] rounded-full border border-border bg-card px-2 py-0.5 text-muted-foreground">
                      {T.tandaKurasi}
                    </span>
                    <h3 className="font-heading text-base font-semibold text-foreground leading-snug">{k.judul}</h3>
                    <p className="text-sm leading-relaxed text-foreground/90">{k.ringkasan}</p>
                    <div className="rounded-md border border-[hsl(var(--torch-gold))]/40 bg-[hsl(var(--torch-gold))]/5 p-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{T.labelLangkah}</p>
                      <p className="text-sm leading-relaxed text-foreground/90">{T.langkahAmati}</p>
                    </div>
                    {s && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {T.labelSumber}: {s.penerbit}, {s.judul} ({s.periode_survei}).{" "}
                        {s.tautan_baca && (
                          <a
                            href={s.tautan_baca}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          >
                            {T.bukaSumber}
                          </a>
                        )}
                      </p>
                    )}
                    {k.hati_hati && (
                      <p className="text-xs text-muted-foreground italic leading-relaxed">{indeks.tanda_hati_hati}</p>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {belum.length > 0 && (
            <p className="text-sm text-foreground/85">
              {T.belumAdaKabkota} {belum.map((j) => T.namaJenis[j] ?? j).join(", ")}.
            </p>
          )}
        </>
      )}
    </section>
  );
}
