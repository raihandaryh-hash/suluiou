import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Printer, MessageCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/track";
import { ringkasanContent } from "@/data/ringkasanContent";
import { compileSurat } from "@/lib/suratPerjalanan";

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

function ChapterDivider({ kicker, title, line }: { kicker: string; title: string; line: string }) {
  return (
    <div className="mt-14 border-t border-border pt-8 print:mt-8">
      <p className="font-[Outfit] text-xs font-semibold tracking-[0.2em] uppercase text-[hsl(var(--mid-blue))]">{kicker}</p>
      <h2 className="mt-1 font-[Outfit] text-2xl font-bold text-[hsl(var(--ink-deep))] md:text-3xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{line}</p>
    </div>
  );
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
  const surat = useMemo(() => compileSurat(), []);

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
          {ringkasanContent.header.title}
        </h1>
        <p className="mt-2 text-base text-[hsl(var(--mid-blue))] md:text-lg">
          {ringkasanContent.header.subtitle}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">{formatTanggal(row.created_at)}</span>
          <Badge variant="secondary" className="rounded-full">
            {ringkasanContent.header.badge}
          </Badge>
        </div>
      </header>

      <ChapterDivider {...ringkasanContent.chapters.siapaKamu} />

      {/* SECTION 1 — Values */}
      <section className="mt-8">
        <h2 className="font-[Outfit] text-xl font-bold text-[hsl(var(--ink-deep))] md:text-2xl">
          {ringkasanContent.values.heading}
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
          {ringkasanContent.narrative.heading}
        </h2>
        <div className="mt-4">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-primary/50 text-primary">
            {ringkasanContent.narrative.badge}
          </Badge>
        </div>
        <article className="mt-3 whitespace-pre-wrap rounded-lg border border-border bg-card p-5 text-base leading-relaxed text-foreground/90 print:border-black/30 print:bg-transparent">
          {row.ai_narrative}
        </article>
        <p className="mt-3 text-sm italic text-muted-foreground">
          {ringkasanContent.narrative.note}
        </p>
      </section>

      {/* SECTION — Refleksi Dirimu (journaling 2A) */}
      {surat.refleksiDiri.length > 0 && (
        <section className="mt-10">
          <h2 className="font-[Outfit] text-xl font-bold text-[hsl(var(--ink-deep))] md:text-2xl">
            Refleksi Dirimu
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hal-hal yang kamu tuliskan saat mengenali dirimu.
          </p>
          <div className="mt-4 space-y-4">
            {surat.refleksiDiri.map((qa, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-4 print:border-black/30 print:bg-transparent"
              >
                <p className="text-sm font-semibold text-[hsl(var(--ink-deep))]">{qa.question}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">{qa.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION — Kompetensi yang Kamu Pilih (2B) */}
      {surat.kompetensi.length > 0 && (
        <section className="mt-10">
          <h2 className="font-[Outfit] text-xl font-bold text-[hsl(var(--ink-deep))] md:text-2xl">
            Kompetensi yang Kamu Pilih
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {surat.kompetensi.map((c) => (
              <span
                key={c}
                className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground/90 print:bg-transparent print:ring-1 print:ring-black/40"
              >
                {c}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* SECTION — Arah Jalan Baktimu (3) */}
      {surat.jalanBakti.isu.length + surat.jalanBakti.subBidang.length + surat.jalanBakti.peduli.length > 0 && (
        <section className="mt-10">
          <h2 className="font-[Outfit] text-xl font-bold text-[hsl(var(--ink-deep))] md:text-2xl">
            Arah Jalan Baktimu
          </h2>
          <div className="mt-4 space-y-4">
            {([
              ["Isu yang paling dekat", surat.jalanBakti.isu],
              ["Sub-bidang yang kamu pilih", surat.jalanBakti.subBidang],
              ["Yang kamu pedulikan", surat.jalanBakti.peduli],
            ] as [string, string[]][]).map(([label, items]) =>
              items.length > 0 ? (
                <div key={label}>
                  <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((it) => (
                      <span
                        key={it}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/80 print:bg-transparent"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* SECTION — Refleksi Sintesis (4) */}
      {surat.refleksiSintesis && (
        <section className="mt-10">
          <h2 className="font-[Outfit] text-xl font-bold text-[hsl(var(--ink-deep))] md:text-2xl">
            Refleksi Sintesis
          </h2>
          <article className="mt-3 whitespace-pre-wrap rounded-lg border border-border bg-card p-5 text-base leading-relaxed text-foreground/90 print:border-black/30 print:bg-transparent">
            {surat.refleksiSintesis}
          </article>
        </section>
      )}

      {/* SECTION — Catatan dari Perjalananmu (Catatanku: Insight + Skill-map) */}
      {surat.catatan.length > 0 && (
        <section className="mt-10">
          <h2 className="font-[Outfit] text-xl font-bold text-[hsl(var(--ink-deep))] md:text-2xl">
            Catatan dari Perjalananmu
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hal-hal yang sempat kamu tandai saat membaca.
          </p>
          <div className="mt-4 space-y-3">
            {surat.catatan.map((n) => (
              <div
                key={n.id}
                className="rounded-lg border border-border bg-card p-4 print:border-black/30 print:bg-transparent"
              >
                <p className="text-xs font-semibold text-muted-foreground">{n.label}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">{n.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <ChapterDivider {...ringkasanContent.chapters.jalanDepan} />

      {/* SECTION 3 — Jalur */}
      <section className="mt-8">
        <h2 className="font-[Outfit] text-xl font-bold text-[hsl(var(--ink-deep))] md:text-2xl">
          {ringkasanContent.jalur.heading}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {ringkasanContent.jalur.intro}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-2">
          {ringkasanContent.jalur.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-lg border border-border bg-card p-5 print:border-black/30 print:bg-transparent"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-[Outfit] text-base font-bold text-[hsl(var(--ink-deep))]">
                  {card.title}
                </h3>
                {card.badge && (
                  <Badge variant="outline" className="text-[10px]">{card.badge}</Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-foreground/80">{card.desc}</p>
              {card.bullets && (
                <ul className="mt-3 space-y-1 text-sm text-foreground/80">
                  {card.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-muted-foreground">{card.meta}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer disclaimer — always visible, including print */}
      <section className="mt-10 rounded-lg border border-border bg-muted/50 p-5 print:border-black/40 print:bg-transparent">
        <p className="text-sm leading-relaxed text-foreground/90">
          {ringkasanContent.footer}
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
