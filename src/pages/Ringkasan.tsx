import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Printer, MessageCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ringkasanContent } from "@/data/ringkasanContent";

type KdRow = {
  id: string;
  session_id: string;
  values_sorted: string[] | null;
  ai_narrative: string | null;
  completed: boolean;
  created_at: string;
};

function formatTanggal(iso: string): string {
  try {
    const d = new Date(iso);
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return "";
  }
}

export default function Ringkasan() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState<KdRow | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    let sid = searchParams.get("s") || "";
    if (!sid) {
      try { sid = localStorage.getItem("kd_session_id") || ""; } catch {}
    }
    setSessionId(sid);
    if (!sid) { setLoading(false); return; }

    (async () => {
      const { data } = await supabase
        .from("kenali_dirimu_sessions")
        .select("*")
        .eq("session_id", sid)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setRow(data as unknown as KdRow);
      setLoading(false);
    })();
  }, [searchParams]);

  const values3 = useMemo(() => (row?.values_sorted || []).slice(0, 3), [row]);

  const waHref = useMemo(() => {
    if (!row || values3.length < 1) return "";
    const url = `${window.location.origin}/ringkasan?s=${sessionId}`;
    const text = `Halo, aku baru selesai refleksi karier di platform Sulu. Nilai yang paling penting bagiku: ${values3[0] || ""}, ${values3[1] || ""}, ${values3[2] || ""}. Mau ngobrol soal langkah selanjutnya? Link ringkasannya: ${url}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [row, values3, sessionId]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!sessionId || !row) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-[Outfit] text-2xl font-bold text-[hsl(var(--ink-deep))]">
          Refleksimu belum tersimpan
        </h1>
        <p className="mt-3 text-muted-foreground">
          Mulai dulu latihan refleksi di Kenali Dirimu untuk bisa membuat ringkasan ini.
        </p>
        <div className="mt-6">
          <Button asChild><Link to="/kenali-dirimu">Mulai Refleksi →</Link></Button>
        </div>
      </main>
    );
  }

  if (!row.completed || !row.ai_narrative) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-[Outfit] text-2xl font-bold text-[hsl(var(--ink-deep))]">
          Refleksimu belum selesai
        </h1>
        <p className="mt-3 text-muted-foreground">
          Lanjutkan refleksimu — kami sudah menyimpan progresmu.
        </p>
        <div className="mt-6">
          <Button asChild><Link to="/kenali-dirimu">Lanjutkan di Kenali Dirimu →</Link></Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:py-12 print:max-w-none print:py-0 print:px-0">
      {/* Header */}
      <header className="border-b border-border pb-6">
        <h1 className="font-[Outfit] text-3xl font-bold text-[hsl(var(--ink-deep))] md:text-4xl">
          Ringkasan Refleksi Karier
        </h1>
        <p className="mt-2 text-base text-[hsl(var(--mid-blue))] md:text-lg">
          Bahan obrolan dengan orang tua atau siapapun yang kamu percaya
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">{formatTanggal(row.created_at)}</span>
          <Badge variant="secondary" className="rounded-full">
            Bukan hasil tes. Ini refleksimu sendiri.
          </Badge>
        </div>
      </header>

      {/* SECTION 1 — Values */}
      <section className="mt-10">
        <h2 className="font-[Outfit] text-xl font-bold text-[hsl(var(--ink-deep))] md:text-2xl">
          Yang paling bermakna bagimu
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {values3.map((v) => (
            <span
              key={v}
              className="rounded-full bg-[hsl(var(--brand-navy))] px-4 py-2 text-base font-semibold text-white print:bg-transparent print:text-black print:ring-1 print:ring-black"
            >
              {v}
            </span>
          ))}
        </div>
      </section>

      {/* SECTION 2 — Narrative */}
      <section className="mt-10">
        <h2 className="font-[Outfit] text-xl font-bold text-[hsl(var(--ink-deep))] md:text-2xl">
          Dari refleksimu sendiri
        </h2>
        <div className="mt-4">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-primary/50 text-primary">
            Refleksi dari jawabanmu
          </Badge>
        </div>
        <article className="mt-3 whitespace-pre-wrap rounded-lg border border-border bg-card p-5 text-base leading-relaxed text-foreground/90 print:border-black/30 print:bg-transparent">
          {row.ai_narrative}
        </article>
        <p className="mt-3 text-sm italic text-muted-foreground">
          Teks ini dirangkai dari jawaban yang kamu tulis sendiri, bukan dari tes psikologi.
        </p>
      </section>

      {/* SECTION 3 — Jalur */}
      <section className="mt-10">
        <h2 className="font-[Outfit] text-xl font-bold text-[hsl(var(--ink-deep))] md:text-2xl">
          Jalur yang bisa kamu pertimbangkan
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tidak ada satu jalur yang "paling benar". Ini informasi — bukan rekomendasi.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-2">
          {/* Card 1 — KIP Kuliah */}
          <div className="rounded-lg border border-border bg-card p-5 print:border-black/30 print:bg-transparent">
            <h3 className="font-[Outfit] text-base font-bold text-[hsl(var(--ink-deep))]">
              KIP Kuliah → PTN / PTS
            </h3>
            <p className="mt-2 text-sm text-foreground/80">
              Bantuan biaya kuliah dan hidup untuk keluarga yang membutuhkan.
              Bisa digunakan ke PTN maupun PTS terakreditasi di seluruh Indonesia.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Daftar: kip-kuliah.kemdikbud.go.id</p>
          </div>

          {/* Card 2 — PBSB */}
          <div className="rounded-lg border border-border bg-card p-5 print:border-black/30 print:bg-transparent">
            <h3 className="font-[Outfit] text-base font-bold text-[hsl(var(--ink-deep))]">
              PBSB Kemenag
            </h3>
            <p className="mt-2 text-sm text-foreground/80">
              Program Beasiswa Santri Berprestasi — beasiswa penuh ke PTN pilihan.
              Untuk lulusan pesantren.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Cek: pbsb.kemenag.go.id</p>
          </div>

          {/* Card 3 — IOU */}
          <div className="rounded-lg border border-border bg-card p-5 print:border-black/30 print:bg-transparent">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-[Outfit] text-base font-bold text-[hsl(var(--ink-deep))]">
                IOU Indonesia
              </h3>
              <Badge variant="outline" className="text-[10px]">Penyelenggara Sulu</Badge>
            </div>
            <p className="mt-2 text-sm text-foreground/80">
              Kuliah Islam berbasis online — bisa dari rumah, jadwal fleksibel.
              Sejak semester pertama sudah praktik nyata lewat Layanan Mahasiswa.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-foreground/80">
              <li>• Biaya: Rp 1,5–2,4 juta per semester</li>
              <li>• Ijazah setara Kemendikbud RI</li>
              <li>• Program: BBA, Psikologi, BAIS, ALS, Pendidikan</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">bahasa.iou.edu.gm</p>
          </div>

          {/* Card 4 — Jalur Lain */}
          <div className="rounded-lg border border-border bg-card p-5 print:border-black/30 print:bg-transparent">
            <h3 className="font-[Outfit] text-base font-bold text-[hsl(var(--ink-deep))]">
              Jalur Lain & Gap Year
            </h3>
            <p className="mt-2 text-sm text-foreground/80">
              Kerja, magang, atau bangun keahlian dulu — ini strategi yang diambil
              banyak orang yang akhirnya masuk jalur terbaik mereka.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Lihat juga: /programs</p>
          </div>
        </div>
      </section>

      {/* Footer disclaimer — always visible, including print */}
      <section className="mt-10 rounded-lg border border-border bg-muted/50 p-5 print:border-black/40 print:bg-transparent">
        <p className="text-sm leading-relaxed text-foreground/90">
          Ini adalah awal percakapan, bukan keputusan final.
          Keputusan terbaik lahir dari obrolan yang jujur dengan orang-orang yang kamu percaya.
        </p>
      </section>

      {/* CTA — hidden in print */}
      <section className="mt-8 flex flex-col gap-3 print:hidden">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('export_ringkasan', { method: 'wa' })}
          >
            <MessageCircle className="mr-2 h-4 w-4" /> Bagikan ke Orang Tua (WA)
          </a>
        </Button>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => {
              track('export_ringkasan', { method: 'print' });
              window.print();
            }}
          >
            <Printer className="mr-2 h-4 w-4" /> Cetak / Simpan PDF
          </Button>
          <Button asChild variant="ghost">
            <Link to="/compass"><ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Sulu</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
