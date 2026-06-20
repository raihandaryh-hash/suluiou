import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Printer, MessageCircle, ArrowLeft, Filter } from "lucide-react";
import { track } from "@/lib/track";
import { ringkasanContent } from "@/data/ringkasanContent";
import { compileSurat } from "@/lib/suratPerjalanan";
import type { SuluNote } from "@/lib/notes";
import { cn } from "@/lib/utils";

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

// Field keys that should get extra visual emphasis (keystone + soft companions)
const AKSI_KEYSTONE = new Set(["aksi30"]);
const AKSI_SOFT = new Set(["niat", "doa"]);

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
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[hsl(var(--mid-blue))]">
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
      {line && <p className="mx-auto mt-4 max-w-md text-sm italic text-muted-foreground">{line}</p>}
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

type CatFilter = "all" | "insight" | "skillmap";

const FILTERS: { id: CatFilter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "insight", label: "Kenali Dunia" },
  { id: "skillmap", label: "Peta Keahlian" },
];

const SOURCE_LABEL: Record<SuluNote["source"], string> = {
  insight: "Kenali Dunia",
  skillmap: "Peta Keahlian",
};

const SOURCE_SUBHEADING: Record<SuluNote["source"], string> = {
  insight: "Catatan saat mengenal dunia",
  skillmap: "Catatan dari Peta Keahlian",
};

function NotesGroup({ notes }: { notes: SuluNote[] }) {
  if (notes.length === 0) return null;
  return (
    <div className="mt-6 divide-y divide-border/60">
      {notes.map((n) => (
        <article key={n.id} className="py-5 first:pt-2 print:break-inside-avoid">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--mid-blue))]/80">
            {n.label}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-loose text-[hsl(var(--ink-deep))]/90">
            {n.text}
          </p>
        </article>
      ))}
    </div>
  );
}

export default function Ringkasan() {
  const surat = useMemo(() => compileSurat(), []);
  const [filter, setFilter] = useState<CatFilter>("all");

  const allNotes = useMemo(
    () => [...surat.catatan].sort((a, b) => b.ts - a.ts),
    [surat.catatan],
  );
  const insightNotes = useMemo(
    () => allNotes.filter((n) => n.source === "insight"),
    [allNotes],
  );
  const skillmapNotes = useMemo(
    () => allNotes.filter((n) => n.source === "skillmap"),
    [allNotes],
  );
  const counts = {
    all: allNotes.length,
    insight: insightNotes.length,
    skillmap: skillmapNotes.length,
  };
  const visibleInsight = filter === "skillmap" ? [] : insightNotes;
  const visibleSkillmap = filter === "insight" ? [] : skillmapNotes;
  const visibleCount = visibleInsight.length + visibleSkillmap.length;

  const tanggalDisplay = formatTanggal(new Date().toISOString());

  const waHref = useMemo(() => {
    const url = `${window.location.origin}/ringkasan`;
    const text = `Halo, aku baru selesai refleksi di platform Sulu. Mau ngobrol soal arah ke depannya? Link ringkasannya: ${url}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, []);

  if (!surat.hasAny) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-[Outfit] text-2xl font-bold text-[hsl(var(--ink-deep))]">
          Refleksimu belum tersimpan
        </h1>
        <p className="mt-3 text-muted-foreground">
          Mulai dulu refleksimu di Kenali Dirimu untuk bisa membuat surat ini.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/kenali-dirimu">Mulai Refleksi →</Link>
          </Button>
        </div>
      </main>
    );
  }

  const hasJalanBakti =
    surat.jalanBakti.isu.length +
      surat.jalanBakti.subBidang.length +
      surat.jalanBakti.peduli.length >
    0;

  // Split rencanaAksi: keystone, soft (niat/doa), regular
  const aksiKeystone = surat.rencanaAksi.filter((qa) =>
    [...AKSI_KEYSTONE].some((k) => qa.question === (qa.question) && k && surat.rencanaAksi.find((x) => x === qa)) // placeholder
      ? true
      : false,
  );
  // Simpler split using a parallel array by key — but we only have label here.
  // We instead split using label heuristic from rencanaAksiContent.
  const aksi30Label = "Rencana Aksi 30 Hari";
  const niatLabel = "Niat";
  const doaLabel = "Doa yang Kupegang";
  const keystoneItem = surat.rencanaAksi.find((qa) => qa.question === aksi30Label);
  const softItems = surat.rencanaAksi.filter(
    (qa) => qa.question === niatLabel || qa.question === doaLabel,
  );
  const regularItems = surat.rencanaAksi.filter(
    (qa) =>
      qa.question !== aksi30Label &&
      qa.question !== niatLabel &&
      qa.question !== doaLabel,
  );
  // Silence unused
  void aksiKeystone;

  return (
    <div className="bg-[hsl(var(--bg-scholarly))] py-8 md:py-14 print:bg-white print:py-0">
      <main className="mx-auto max-w-[760px] px-4 print:max-w-none print:px-0">
        <article
          className="rounded-md border border-border/60 bg-white px-6 py-12 shadow-[0_10px_40px_-20px_hsl(var(--brand-navy)/0.18)] md:px-14 md:py-16 print:border-0 print:bg-transparent print:p-0 print:shadow-none"
          style={{ maxWidth: "72ch", margin: "0 auto" }}
        >
          {/* Header */}
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
          </header>

          <ChapterDivider num={1} {...ringkasanContent.chapters.siapaKamu} />

          {/* Refleksi Dirimu (2A) */}
          {surat.refleksiDiri.length > 0 && (
            <section className="mb-14">
              <SectionHeading>Refleksi Dirimu</SectionHeading>
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

          {/* Kompetensi (2B) */}
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

          {/* Jalan Bakti */}
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

          {/* Refleksi Sintesis */}
          {surat.refleksiSintesis && (
            <section className="mb-14">
              <SectionHeading>Refleksi Sintesis</SectionHeading>
              <div className="relative mt-5 border-l-2 border-[hsl(var(--torch-gold))]/60 pl-6 print:break-inside-avoid">
                <span
                  aria-hidden
                  className="absolute -left-1 -top-3 font-[Outfit] text-5xl leading-none text-[hsl(var(--torch-gold))]/70"
                >
                  &ldquo;
                </span>
                <p className="whitespace-pre-wrap text-[17px] italic leading-loose text-[hsl(var(--ink-deep))]/90">
                  {surat.refleksiSintesis}
                </p>
              </div>
            </section>
          )}

          {/* Catatanku — full, filterable, by source */}
          {allNotes.length > 0 && (
            <section className="mb-14">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <SectionHeading>Catatan dari Perjalananmu</SectionHeading>
                  <p className="mt-1 text-sm italic text-muted-foreground">
                    Semua yang kamu tandai sepanjang perjalanan — utuh, tidak dipotong.
                  </p>
                </div>
                <span className="text-xs text-muted-foreground print:hidden">
                  {visibleCount} dari {allNotes.length} catatan
                </span>
              </div>

              {/* Filter chips — hidden on print */}
              <div className="mt-4 flex flex-wrap items-center gap-2 print:hidden">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                {FILTERS.map((f) => {
                  const active = filter === f.id;
                  const n = counts[f.id];
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilter(f.id)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        active
                          ? "border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]/15 text-[hsl(var(--ink-deep))]"
                          : "border-border bg-background text-muted-foreground hover:border-[hsl(var(--torch-gold))]/50 hover:text-[hsl(var(--ink-deep))]",
                      )}
                    >
                      {f.label}
                      <span className="ml-1.5 tabular-nums opacity-70">{n}</span>
                    </button>
                  );
                })}
              </div>

              {/* Insight subgroup */}
              {(filter === "all" || filter === "insight") && (
                <div className="mt-8">
                  <Kicker>{SOURCE_SUBHEADING.insight}</Kicker>
                  {visibleInsight.length > 0 ? (
                    <NotesGroup notes={visibleInsight} />
                  ) : (
                    <p className="mt-3 text-sm italic text-muted-foreground">
                      Belum ada catatan di kategori ini.
                    </p>
                  )}
                </div>
              )}

              {/* Skillmap subgroup */}
              {(filter === "all" || filter === "skillmap") && (
                <div className="mt-10">
                  <Kicker>{SOURCE_SUBHEADING.skillmap}</Kicker>
                  {visibleSkillmap.length > 0 ? (
                    <NotesGroup notes={visibleSkillmap} />
                  ) : (
                    <p className="mt-3 text-sm italic text-muted-foreground">
                      Belum ada catatan di kategori ini.
                    </p>
                  )}
                </div>
              )}
            </section>
          )}

          <ChapterDivider num={2} {...ringkasanContent.chapters.jalanDepan} />

          {/* Rencana Aksi — Komitmen */}
          {surat.rencanaAksi.length > 0 && (
            <section className="mb-14">
              <SectionHeading>Komitmen</SectionHeading>

              {/* Keystone */}
              {keystoneItem && (
                <div className="mt-6 rounded-md border border-[hsl(var(--torch-gold))]/50 bg-[hsl(var(--torch-gold))]/8 p-5 shadow-[inset_3px_0_0_hsl(var(--torch-gold))] print:break-inside-avoid print:bg-transparent print:shadow-none">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[hsl(var(--torch-gold))]">
                    Keystone · 30 Hari
                  </p>
                  <p className="mt-2 font-[Outfit] text-base font-semibold text-[hsl(var(--ink-deep))]">
                    {keystoneItem.question}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-[17px] leading-loose text-[hsl(var(--ink-deep))]/90">
                    {keystoneItem.answer}
                  </p>
                </div>
              )}

              {/* Regular items */}
              {regularItems.length > 0 && (
                <div className="mt-6 space-y-6">
                  {regularItems.map((qa, i) => (
                    <div key={i} className="print:break-inside-avoid">
                      <p className="font-[Outfit] text-sm font-semibold leading-snug text-[hsl(var(--mid-blue))]">
                        {qa.question}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-[16px] leading-loose text-[hsl(var(--ink-deep))]/90">
                        {qa.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Soft items: niat & doa */}
              {softItems.length > 0 && (
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {softItems.map((qa, i) => (
                    <div
                      key={i}
                      className="rounded-md border border-border/60 bg-[hsl(var(--bg-scholarly))]/60 p-5 print:break-inside-avoid print:bg-transparent"
                    >
                      <Kicker>{qa.question}</Kicker>
                      <p className="mt-2 whitespace-pre-wrap text-[15px] italic leading-loose text-[hsl(var(--ink-deep))]/90">
                        {qa.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Jalur */}
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

          {/* Closing */}
          <footer className="mt-14 border-t border-border/60 pt-8 text-center print:break-inside-avoid">
            <div className="mx-auto mt-6 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[hsl(var(--torch-gold))]/50" />
              <span className="font-[Outfit] text-xs uppercase tracking-[0.32em] text-[hsl(var(--torch-gold))]">
                ~ Sulu
              </span>
              <span className="h-px w-10 bg-[hsl(var(--torch-gold))]/50" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{tanggalDisplay}</p>
          </footer>
        </article>

        {/* CTAs — di luar lembar */}
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
