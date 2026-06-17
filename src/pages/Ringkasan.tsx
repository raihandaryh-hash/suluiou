import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

const ROMAN = ["", "I", "II", "III", "IV", "V"];

function ChapterDivider({
  num,
  kicker,
  title,
  line,
}: {
  num: number;
  kicker: string;
  title: string;
  line: string;
}) {
  return (
    <div className="mt-20 mb-10 text-center print:mt-12 print:mb-6 print:break-before-page">
      <p
        className="font-[Outfit] text-3xl font-light tracking-[0.3em] text-[hsl(var(--torch-gold))]"
        aria-hidden
      >
        {ROMAN[num] ?? num}
      </p>
      <p
        className="mt-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[hsl(var(--mid-blue))]"
      >
        {kicker}
      </p>
      <h2 className="mt-2 font-[Outfit] text-2xl font-semibold text-[hsl(var(--ink-deep))] md:text-3xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 flex items-center justify-center gap-2 text-[hsl(var(--torch-gold))]/70">
        <span className="h-px w-8 bg-[hsl(var(--torch-gold))]/50" />
        <span className="text-xs">• • •</span>
        <span className="h-px w-8 bg-[hsl(var(--torch-gold))]/50" />
      </div>
      <p className="mx-auto mt-4 max-w-md text-sm italic text-muted-foreground">{line}</p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-[Outfit] text-lg font-semibold tracking-tight text-[hsl(var(--ink-deep))] md:text-xl">
      {children}
    </h3>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[hsl(var(--mid-blue))]/80">
      {children}
    </p>
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

  const catatanInsight = useMemo(
    () => surat.catatan.filter((n) => n.source === "insight"),
    [surat.catatan],
  );
  const catatanSkill = useMemo(
    () => surat.catatan.filter((n) => n.source === "skillmap"),
    [surat.catatan],
  );

  const tanggalDisplay = formatTanggal(row?.created_at ?? new Date().toISOString());

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

  if (!row && !surat.hasAny) {
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

  if (row && (!row.completed || !row.ai_narrative) && !surat.hasAny) {
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

  const hasJalanBakti =
    surat.jalanBakti.isu.length +
      surat.jalanBakti.subBidang.length +
      surat.jalanBakti.peduli.length >
    0;

  return (
    <div className="bg-[hsl(var(--bg-scholarly))] py-8 md:py-14 print:bg-white print:py-0">
      {/* Outer reading frame */}
      <main className="mx-auto max-w-[760px] px-4 print:max-w-none print:px-0">
        {/* The "page" — a single book leaf */}
        <article
          className="rounded-md border border-border/60 bg-white px-6 py-12 shadow-[0_10px_40px_-20px_hsl(var(--brand-navy)/0.18)] md:px-14 md:py-16 print:border-0 print:bg-transparent print:p-0 print:shadow-none"
          style={{ maxWidth: "72ch", margin: "0 auto" }}
        >
          {/* ── Header ── */}
          <header className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[hsl(var(--mid-blue))]">
              {ringkasanContent.header.title}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{tanggalDisplay}</p>
            <h1 className="mt-6 font-[Outfit] text-3xl font-semibold leading-tight tracking-tight text-[hsl(var(--ink-deep))] md:text-[44px] md:leading-[1.1]">
              Surat untukmu,<br />
              <span className="italic font-normal text-[hsl(var(--mid-blue))]">
                dan siapa pun yang kamu percaya
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm italic text-muted-foreground">
              {ringkasanContent.header.subtitle}
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-[hsl(var(--torch-gold))]/60" />
              <span className="text-[10px] uppercase tracking-[0.28em] text-[hsl(var(--torch-gold))]">
                {ringkasanContent.header.badge}
              </span>
              <span className="h-px w-12 bg-[hsl(var(--torch-gold))]/60" />
            </div>
          </header>

          <ChapterDivider num={1} {...ringkasanContent.chapters.siapaKamu} />

          {/* ── Values pull-quote ── */}
          {values3.length > 0 && (
            <section className="mb-14 text-center">
              <Kicker>{ringkasanContent.values.heading}</Kicker>
              <p className="mt-3 font-[Outfit] text-2xl font-light leading-snug tracking-tight text-[hsl(var(--ink-deep))] md:text-[28px]">
                {values3.map((v, i) => (
                  <span key={v}>
                    <span className="font-semibold">{v}</span>
                    {i < values3.length - 1 && (
                      <span className="mx-3 text-[hsl(var(--torch-gold))]">·</span>
                    )}
                  </span>
                ))}
              </p>
            </section>
          )}

          {/* ── AI Narrative — pull-quote ── */}
          {row?.ai_narrative && (
            <section className="mb-14">
              <Kicker>{ringkasanContent.narrative.heading}</Kicker>
              <blockquote className="mt-4 border-l-2 border-[hsl(var(--torch-gold))] pl-6 print:break-inside-avoid">
                <p className="whitespace-pre-wrap text-[17px] leading-loose text-[hsl(var(--ink-deep))]/90">
                  {row.ai_narrative}
                </p>
              </blockquote>
              <p className="mt-4 pl-6 text-xs italic text-muted-foreground">
                {ringkasanContent.narrative.note}
              </p>
            </section>
          )}

          {/* ── Refleksi Dirimu — journal entries ── */}
          {surat.refleksiDiri.length > 0 && (
            <section className="mb-14">
              <SectionHeading>Refleksi Dirimu</SectionHeading>
              <p className="mt-1 text-sm italic text-muted-foreground">
                Hal-hal yang kamu tuliskan saat mengenali dirimu.
              </p>
              <div className="mt-6 space-y-8">
                {surat.refleksiDiri.map((qa, i) => (
                  <div key={i} className="print:break-inside-avoid">
                    <p className="font-[Outfit] text-sm font-semibold leading-snug text-[hsl(var(--mid-blue))]">
                      {qa.question}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-[16px] leading-loose text-[hsl(var(--ink-deep))]/90">
                      {qa.answer}
                    </p>
                    {i < surat.refleksiDiri.length - 1 && (
                      <div className="mt-8 flex justify-center text-[hsl(var(--torch-gold))]/40">
                        <span className="text-xs tracking-[0.4em]">• • •</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Kompetensi ── */}
          {surat.kompetensi.length > 0 && (
            <section className="mb-14">
              <SectionHeading>Kompetensi yang Kamu Pilih</SectionHeading>
              <div className="mt-4 flex flex-wrap gap-2">
                {surat.kompetensi.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-[hsl(var(--torch-gold))]/40 bg-[hsl(var(--bg-scholarly))] px-3.5 py-1.5 text-sm text-[hsl(var(--ink-deep))] print:bg-transparent"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ── Jalan Bakti — inline catalog ── */}
          {hasJalanBakti && (
            <section className="mb-14">
              <SectionHeading>Arah Jalan Baktimu</SectionHeading>
              <div className="mt-5 space-y-5">
                {(
                  [
                    ["Isu yang paling dekat", surat.jalanBakti.isu],
                    ["Sub-bidang yang kamu pilih", surat.jalanBakti.subBidang],
                    ["Yang kamu pedulikan", surat.jalanBakti.peduli],
                  ] as [string, string[]][]
                ).map(([label, items]) =>
                  items.length > 0 ? (
                    <div key={label}>
                      <Kicker>{label}</Kicker>
                      <p className="mt-2 text-[16px] leading-relaxed text-[hsl(var(--ink-deep))]/90">
                        {items.map((it, i) => (
                          <span key={it}>
                            {it}
                            {i < items.length - 1 && (
                              <span className="mx-2 text-[hsl(var(--torch-gold))]/70">·</span>
                            )}
                          </span>
                        ))}
                      </p>
                    </div>
                  ) : null,
                )}
              </div>
            </section>
          )}

          {/* ── Refleksi Sintesis ── */}
          {surat.refleksiSintesis && (
            <section className="mb-14">
              <SectionHeading>Refleksi Sintesis</SectionHeading>
              <div className="relative mt-5 pl-8 print:break-inside-avoid">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 font-[Outfit] text-5xl leading-none text-[hsl(var(--torch-gold))]/60"
                >
                  &ldquo;
                </span>
                <p className="whitespace-pre-wrap text-[17px] italic leading-loose text-[hsl(var(--ink-deep))]/90">
                  {surat.refleksiSintesis}
                </p>
              </div>
            </section>
          )}

          {/* ── Catatan dari Perjalananmu (grouped) ── */}
          {(catatanInsight.length > 0 || catatanSkill.length > 0) && (
            <section className="mb-14">
              <SectionHeading>Catatan dari Perjalananmu</SectionHeading>
              <p className="mt-1 text-sm italic text-muted-foreground">
                Hal-hal yang sempat kamu tandai saat membaca.
              </p>

              {catatanInsight.length > 0 && (
                <div className="mt-6">
                  <Kicker>Catatan saat mengenal dunia</Kicker>
                  <div className="mt-3 divide-y divide-border/60">
                    {catatanInsight.map((n) => (
                      <div key={n.id} className="py-4 first:pt-2 print:break-inside-avoid">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--mid-blue))]/80">
                          {n.label}
                        </p>
                        <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-relaxed text-[hsl(var(--ink-deep))]/90">
                          {n.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {catatanSkill.length > 0 && (
                <div className="mt-8">
                  <Kicker>Catatan dari Peta Keahlian</Kicker>
                  <div className="mt-3 divide-y divide-border/60">
                    {catatanSkill.map((n) => (
                      <div key={n.id} className="py-4 first:pt-2 print:break-inside-avoid">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--mid-blue))]/80">
                          {n.label}
                        </p>
                        <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-relaxed text-[hsl(var(--ink-deep))]/90">
                          {n.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          <ChapterDivider num={2} {...ringkasanContent.chapters.jalanDepan} />

          {/* ── Jalur — paths as journal entries (not card grid) ── */}
          <section className="mb-12">
            <SectionHeading>{ringkasanContent.jalur.heading}</SectionHeading>
            <p className="mt-2 text-sm italic text-muted-foreground">
              {ringkasanContent.jalur.intro}
            </p>

            <div className="mt-6 divide-y divide-border/60">
              {ringkasanContent.jalur.cards.map((card) => (
                <div key={card.title} className="py-6 first:pt-2 print:break-inside-avoid">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h4 className="font-[Outfit] text-base font-semibold text-[hsl(var(--ink-deep))]">
                      {card.title}
                    </h4>
                    {card.badge && (
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--torch-gold))]">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed text-[hsl(var(--ink-deep))]/85">
                    {card.desc}
                  </p>
                  {card.bullets && (
                    <ul className="mt-2 space-y-1 text-[14px] text-[hsl(var(--ink-deep))]/80">
                      {card.bullets.map((b) => (
                        <li key={b}>— {b}</li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-2 text-xs italic text-muted-foreground">{card.meta}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Closing ── */}
          <footer className="mt-14 border-t border-border/60 pt-8 text-center print:break-inside-avoid">
            <p className="mx-auto max-w-xl text-[15px] italic leading-loose text-[hsl(var(--ink-deep))]/80">
              {ringkasanContent.footer}
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[hsl(var(--torch-gold))]/50" />
              <span className="font-[Outfit] text-xs uppercase tracking-[0.32em] text-[hsl(var(--torch-gold))]">
                Sulu
              </span>
              <span className="h-px w-10 bg-[hsl(var(--torch-gold))]/50" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{tanggalDisplay}</p>
          </footer>
        </article>

        {/* ── CTAs (outside the page artifact) ── */}
        <section className="mx-auto mt-8 flex max-w-[72ch] flex-col gap-3 print:hidden">
          <Button asChild size="lg" className="w-full sm:w-auto sm:self-center">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("export_ringkasan", { method: "wa" })}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Bagikan ke Orang Tua (WA)
            </a>
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                track("export_ringkasan", { method: "print" });
                window.print();
              }}
            >
              <Printer className="mr-2 h-4 w-4" /> Cetak / Simpan PDF
            </Button>
            <Button asChild variant="ghost">
              <Link to="/compass">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Sulu
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
