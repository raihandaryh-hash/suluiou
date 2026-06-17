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

const ROMAN: Record<string, string> = { "Bagian Satu": "I", "Bagian Dua": "II", "Bagian Tiga": "III" };

function ChapterDivider({ kicker, title, line }: { kicker: string; title: string; line: string }) {
  const numeral = ROMAN[kicker] ?? "";
  return (
    <div className="mt-20 mb-10 print:mt-12 print:mb-6">
      {/* Ornamental separator */}
      <div className="flex items-center justify-center gap-3" aria-hidden="true">
        <span className="h-px w-16 bg-[hsl(var(--brand-navy)/0.2)] print:bg-black/30" />
        <span className="font-[Outfit] text-xs tracking-[0.35em] text-[hsl(var(--torch-gold))] print:text-black/60">
          {numeral || "§"}
        </span>
        <span className="h-px w-16 bg-[hsl(var(--brand-navy)/0.2)] print:bg-black/30" />
      </div>
      <div className="mt-6 text-center">
        <p className="font-[Outfit] text-[11px] font-semibold tracking-[0.32em] uppercase text-[hsl(var(--mid-blue))] print:text-black/60">
          {kicker}
        </p>
        <h2 className="mt-2 font-[Outfit] text-3xl font-bold tracking-tight text-[hsl(var(--ink-deep))] md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-prose text-sm italic leading-relaxed text-muted-foreground">
          {line}
        </p>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-[Outfit] text-xl font-semibold tracking-tight text-[hsl(var(--ink-deep))] md:text-2xl">
      {children}
    </h2>
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
    <div className="bg-[hsl(var(--bg-scholarly))] print:bg-white">
      {/* Page-like container: warm cream "book page" */}
      <main className="mx-auto max-w-[42rem] px-5 py-12 md:px-8 md:py-20 print:max-w-none print:px-0 print:py-0">
        <article className="rounded-2xl bg-card px-6 py-10 shadow-[0_1px_2px_hsl(var(--brand-navy)/0.04),0_24px_60px_-30px_hsl(var(--brand-navy)/0.2)] ring-1 ring-[hsl(var(--brand-navy)/0.06)] md:px-12 md:py-16 print:rounded-none print:bg-transparent print:px-0 print:py-0 print:shadow-none print:ring-0">

          {/* Header — like a frontispiece */}
          <header className="text-center">
            <p className="font-[Outfit] text-[11px] font-semibold tracking-[0.4em] uppercase text-[hsl(var(--torch-gold))] print:text-black/60">
              Sulu
            </p>
            <div className="mx-auto mt-4 h-px w-24 bg-[hsl(var(--brand-navy)/0.15)] print:bg-black/30" />
            <h1 className="mt-6 font-[Outfit] text-4xl font-bold tracking-tight text-[hsl(var(--ink-deep))] md:text-5xl">
              {ringkasanContent.header.title}
            </h1>
            <p className="mx-auto mt-4 max-w-prose text-base italic leading-relaxed text-[hsl(var(--mid-blue))] md:text-lg">
              {ringkasanContent.header.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground">{formatTanggal(row.created_at)}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/50" aria-hidden />
              <Badge variant="secondary" className="rounded-full bg-[hsl(var(--torch-gold)/0.12)] text-[hsl(var(--ink-deep))] hover:bg-[hsl(var(--torch-gold)/0.18)] print:bg-transparent print:ring-1 print:ring-black/30">
                {ringkasanContent.header.badge}
              </Badge>
            </div>
            <div className="mx-auto mt-8 h-px w-16 bg-[hsl(var(--brand-navy)/0.15)] print:bg-black/30" />
          </header>

          <ChapterDivider {...ringkasanContent.chapters.siapaKamu} />

          {/* Reading column — comfortable measure */}
          <div className="mx-auto max-w-[68ch]">

            {/* Values */}
            <section className="mt-2">
              <SectionHeading>{ringkasanContent.values.heading}</SectionHeading>
              <div className="mt-4 flex flex-wrap gap-2">
                {values3.map((v) => (
                  <span
                    key={v}
                    className="rounded-full bg-[hsl(var(--brand-navy))] px-4 py-1.5 text-sm font-semibold tracking-wide text-white print:bg-transparent print:text-black print:ring-1 print:ring-black"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </section>

            {/* Narrative */}
            <section className="mt-12">
              <SectionHeading>{ringkasanContent.narrative.heading}</SectionHeading>
              <div className="mt-3">
                <Badge variant="outline" className="rounded-full border-[hsl(var(--torch-gold)/0.5)] px-3 py-1 text-[11px] tracking-wide text-[hsl(var(--ink-deep))] print:border-black/40">
                  {ringkasanContent.narrative.badge}
                </Badge>
              </div>
              <blockquote className="relative mt-5 rounded-xl border border-[hsl(var(--brand-navy)/0.08)] bg-[hsl(var(--bg-scholarly))]/60 px-6 py-6 print:border-black/20 print:bg-transparent print:px-0 print:py-2">
                <span aria-hidden className="absolute -top-3 left-5 select-none font-[Outfit] text-5xl leading-none text-[hsl(var(--torch-gold)/0.5)] print:hidden">“</span>
                <p className="whitespace-pre-wrap font-[Inter] text-[1.0625rem] leading-[1.85] text-foreground/90">
                  {row.ai_narrative}
                </p>
              </blockquote>
              <p className="mt-3 text-xs italic text-muted-foreground">
                {ringkasanContent.narrative.note}
              </p>
            </section>

            {/* Refleksi Dirimu */}
            {surat.refleksiDiri.length > 0 && (
              <section className="mt-12">
                <SectionHeading>Refleksi Dirimu</SectionHeading>
                <p className="mt-2 text-sm italic text-muted-foreground">
                  Hal-hal yang kamu tuliskan saat mengenali dirimu.
                </p>
                <div className="mt-5 space-y-4">
                  {surat.refleksiDiri.map((qa, i) => (
                    <div
                      key={i}
                      className="rounded-lg border-l-2 border-[hsl(var(--torch-gold))] bg-[hsl(var(--bg-scholarly))]/50 py-3 pl-5 pr-4 print:border-l print:border-black/40 print:bg-transparent"
                    >
                      <p className="font-[Outfit] text-sm font-semibold text-[hsl(var(--ink-deep))]">{qa.question}</p>
                      <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/85">{qa.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Kompetensi */}
            {surat.kompetensi.length > 0 && (
              <section className="mt-12">
                <SectionHeading>Kompetensi yang Kamu Pilih</SectionHeading>
                <div className="mt-4 flex flex-wrap gap-2">
                  {surat.kompetensi.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-[hsl(var(--brand-navy)/0.15)] bg-card px-3.5 py-1.5 text-sm text-foreground/85 print:bg-transparent print:ring-1 print:ring-black/40"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Jalan Bakti */}
            {surat.jalanBakti.isu.length + surat.jalanBakti.subBidang.length + surat.jalanBakti.peduli.length > 0 && (
              <section className="mt-12">
                <SectionHeading>Arah Jalan Baktimu</SectionHeading>
                <div className="mt-5 space-y-5">
                  {([
                    ["Isu yang paling dekat", surat.jalanBakti.isu],
                    ["Sub-bidang yang kamu pilih", surat.jalanBakti.subBidang],
                    ["Yang kamu pedulikan", surat.jalanBakti.peduli],
                  ] as [string, string[]][]).map(([label, items]) =>
                    items.length > 0 ? (
                      <div key={label}>
                        <p className="font-[Outfit] text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">{label}</p>
                        <div className="flex flex-wrap gap-2">
                          {items.map((it) => (
                            <span
                              key={it}
                              className="rounded-full border border-[hsl(var(--brand-navy)/0.12)] bg-card px-3 py-1.5 text-sm text-foreground/80 print:bg-transparent"
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

            {/* Refleksi Sintesis */}
            {surat.refleksiSintesis && (
              <section className="mt-12">
                <SectionHeading>Refleksi Sintesis</SectionHeading>
                <blockquote className="relative mt-4 rounded-xl border border-[hsl(var(--brand-navy)/0.08)] bg-[hsl(var(--bg-scholarly))]/60 px-6 py-6 print:border-black/20 print:bg-transparent print:px-0 print:py-2">
                  <p className="whitespace-pre-wrap font-[Inter] text-[1.0625rem] leading-[1.85] text-foreground/90">
                    {surat.refleksiSintesis}
                  </p>
                </blockquote>
              </section>
            )}

            {/* Catatan */}
            {surat.catatan.length > 0 && (
              <section className="mt-12">
                <SectionHeading>Catatan dari Perjalananmu</SectionHeading>
                <p className="mt-2 text-sm italic text-muted-foreground">
                  Hal-hal yang sempat kamu tandai saat membaca.
                </p>
                <div className="mt-5 space-y-3">
                  {surat.catatan.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-lg border-l-2 border-[hsl(var(--mid-blue)/0.4)] bg-[hsl(var(--bg-scholarly))]/50 py-3 pl-5 pr-4 print:border-l print:border-black/40 print:bg-transparent"
                    >
                      <p className="font-[Outfit] text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">{n.label}</p>
                      <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/85">{n.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <ChapterDivider {...ringkasanContent.chapters.jalanDepan} />

          {/* Jalur — slightly wider for two-column grid */}
          <section className="mx-auto max-w-[72ch]">
            <SectionHeading>{ringkasanContent.jalur.heading}</SectionHeading>
            <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground">
              {ringkasanContent.jalur.intro}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-2">
              {ringkasanContent.jalur.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-[hsl(var(--brand-navy)/0.1)] bg-card p-5 transition-shadow hover:shadow-[0_8px_30px_-12px_hsl(var(--brand-navy)/0.2)] print:border-black/30 print:bg-transparent print:hover:shadow-none"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-[Outfit] text-base font-bold text-[hsl(var(--ink-deep))]">
                      {card.title}
                    </h3>
                    {card.badge && (
                      <Badge variant="outline" className="text-[10px] border-[hsl(var(--torch-gold)/0.5)] text-[hsl(var(--ink-deep))]">{card.badge}</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">{card.desc}</p>
                  {card.bullets && (
                    <ul className="mt-3 space-y-1 text-sm text-foreground/80">
                      {card.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="text-[hsl(var(--torch-gold))]" aria-hidden>•</span>
                          <span>{b.replace(/^•\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 border-t border-[hsl(var(--brand-navy)/0.08)] pt-2 text-xs text-muted-foreground print:border-black/20">{card.meta}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer disclaimer — colophon */}
          <section className="mx-auto mt-14 max-w-[68ch]">
            <div className="mx-auto mb-6 flex items-center justify-center gap-3" aria-hidden>
              <span className="h-px w-12 bg-[hsl(var(--brand-navy)/0.2)] print:bg-black/30" />
              <span className="font-[Outfit] text-xs tracking-[0.35em] text-[hsl(var(--torch-gold))] print:text-black/60">§</span>
              <span className="h-px w-12 bg-[hsl(var(--brand-navy)/0.2)] print:bg-black/30" />
            </div>
            <p className="text-center text-[15px] italic leading-[1.85] text-foreground/85">
              {ringkasanContent.footer}
            </p>
          </section>
        </article>

        {/* CTA — hidden in print */}
        <section className="mx-auto mt-8 flex max-w-[42rem] flex-col gap-3 px-1 print:hidden">
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
    </div>
  );
}
