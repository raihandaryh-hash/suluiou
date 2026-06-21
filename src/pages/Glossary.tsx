import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { glossaryIntro, glossaryCategories, type GlossaryEntry } from "@/data/glossaryContent";
import { references } from "@/data/references";

const FIELD_LABELS: { key: keyof GlossaryEntry; label: string }[] = [
  { key: "arti", label: "Apa artinya" },
  { key: "indonesia", label: "Yang sedang terjadi" },
  { key: "data", label: "Data" },
  { key: "konsekuensi", label: "Konsekuensi untuk kamu" },
  { key: "navigasi", label: "Cara navigasi" },
];

function matchesQuery(e: GlossaryEntry, q: string): boolean {
  if (!q) return true;
  const hay = [e.term, e.padanan, e.arti, e.indonesia, e.data, e.konsekuensi, e.navigasi]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function EntryCard({ entry, open, onToggle }: { entry: GlossaryEntry; open: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left">
        <div>
          <h3 className="font-semibold text-base text-foreground leading-tight">{entry.term}</h3>
          {entry.padanan && <p className="text-sm text-muted-foreground mt-0.5">{entry.padanan}</p>}
        </div>
        <ChevronDown className={cn("w-4 h-4 shrink-0 mt-1 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-3 border-t border-border/60 pt-4">
          {FIELD_LABELS.map(({ key, label }) => {
            const val = entry[key];
            if (!val) return null;
            return (
              <div key={key}>
                <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">{label}</p>
                <p className="text-sm leading-relaxed text-foreground/85">{val}</p>
              </div>
            );
          })}
          {entry.sumber && (
            <p className="text-xs text-muted-foreground/80 pt-1 border-t border-border/40 mt-2">
              <span className="font-semibold">Sumber:</span> {entry.sumber}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

type Numbered = { ref: (typeof references)[number]; n: number };

function groupByCategory(items: Numbered[]): [string, Numbered[]][] {
  const map = new Map<string, Numbered[]>();
  items.forEach((item) => {
    const cat = item.ref.category;
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(item);
  });
  return Array.from(map.entries());
}

function DataTab({ query }: { query: string }) {
  const q = query.trim().toLowerCase();

  // ScrollToTop (global) resets scroll to top on every route change, which
  // would cancel the browser's hash-anchor scroll. Override here so
  // /glossary?tab=data#ref-xyz lands on the right entry.
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, []);

  const numbered: Numbered[] = useMemo(() => references.map((ref, i) => ({ ref, n: i + 1 })), []);
  const filtered = useMemo(
    () => numbered.filter(({ ref }) => !q || ref.label.toLowerCase().includes(q) || ref.category.toLowerCase().includes(q)),
    [numbered, q]
  );
  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  return (
    <div className="mt-8 space-y-10">
      <p className="text-sm text-muted-foreground -mt-2">
        Data mendalam dunia kerja (NEET, mismatch, kondisi pasar, dll.) akan pindah ke sini secara bertahap.
        Untuk sekarang, ini daftar rujukan bernomor yang dipakai di seluruh Sulu — tanda kecil{' '}
        <span className="text-accent font-semibold">[1]</span> di halaman mana pun mengarah ke sini.
      </p>
      {grouped.length === 0 && (
        <p className="text-sm text-muted-foreground">Tidak ada sumber yang cocok dengan "{query}".</p>
      )}
      {grouped.map(([cat, items]) => (
        <section key={cat}>
          <h2 className="text-lg font-bold text-foreground">{cat}</h2>
          <ol className="mt-4 space-y-3">
            {items.map(({ ref, n }) => (
              <li
                key={ref.id}
                id={`ref-${ref.id}`}
                className="flex gap-3 rounded-xl border border-border bg-card px-4 py-3 scroll-mt-24"
              >
                <span className="font-heading text-sm font-semibold text-accent tabular-nums shrink-0">[{n}]</span>
                <span className="text-sm text-foreground/85 leading-relaxed">{ref.label}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

export default function Glossary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'data' ? 'data' : 'istilah';
  const [tab, setTab] = useState<'istilah' | 'data'>(initialTab);
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const q = query.trim().toLowerCase();

  const switchTab = (t: 'istilah' | 'data') => {
    setTab(t);
    setQuery('');
    setSearchParams(t === 'data' ? { tab: 'data' } : {}, { replace: true });
  };

  const filtered = useMemo(
    () =>
      glossaryCategories
        .map((cat) => ({ ...cat, entries: cat.entries.filter((e) => matchesQuery(e, q)) }))
        .filter((cat) => cat.entries.length > 0),
    [q]
  );

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const isOpen = (id: string) => openIds.has(id) || q.length > 0;

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/insight" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <Logo />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Pusat Rujukan</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          {tab === 'istilah' ? glossaryIntro.subtitle : 'Data dan sumber di balik setiap angka yang kamu temui di Sulu.'}
        </p>

        <div className="flex gap-2 mt-5">
          <button
            onClick={() => switchTab('istilah')}
            className={cn('px-4 py-2 rounded-full text-sm border transition-colors', tab === 'istilah' ? 'bg-foreground text-background border-foreground' : 'bg-secondary/40 text-muted-foreground border-border hover:bg-secondary')}
          >
            Istilah
          </button>
          <button
            onClick={() => switchTab('data')}
            className={cn('px-4 py-2 rounded-full text-sm border transition-colors', tab === 'data' ? 'bg-foreground text-background border-foreground' : 'bg-secondary/40 text-muted-foreground border-border hover:bg-secondary')}
          >
            Data & Sumber
          </button>
        </div>

        <div className="relative mt-5 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === 'istilah' ? 'Cari istilah...' : 'Cari sumber...'}
            className="w-full pl-9 pr-3 py-2 rounded-full border border-border bg-background text-sm outline-none focus:border-primary/60"
          />
        </div>

        {tab === 'istilah' ? (
          <>
            <div className="mt-8 space-y-10">
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground">Tidak ada istilah yang cocok dengan "{query}".</p>
              )}
              {filtered.map((cat) => (
                <section key={cat.id}>
                  <h2 className="text-lg font-bold text-foreground">{cat.title}</h2>
                  {cat.subtitle && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{cat.subtitle}</p>}
                  <div className="mt-4 space-y-3">
                    {cat.entries.map((e) => (
                      <EntryCard key={e.id} entry={e} open={isOpen(e.id)} onToggle={() => toggle(e.id)} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/80 mt-10 italic">{glossaryIntro.note}</p>
          </>
        ) : (
          <DataTab query={query} />
        )}
      </div>
    </div>
  );
}

