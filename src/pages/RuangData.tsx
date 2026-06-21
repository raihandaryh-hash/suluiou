import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import Logo from '@/components/Logo';
import { references } from '@/data/references';

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

export default function RuangData() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  // ScrollToTop (global) forces window scroll to (0,0) on every route change,
  // which would otherwise cancel the browser's hash-anchor scroll. Override
  // it here, after mount, so /data#ref-xyz lands on the right entry.
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, []);

  const numbered: Numbered[] = useMemo(
    () => references.map((ref, i) => ({ ref, n: i + 1 })),
    []
  );

  const filtered = useMemo(
    () =>
      numbered.filter(
        ({ ref }) => !q || ref.label.toLowerCase().includes(q) || ref.category.toLowerCase().includes(q)
      ),
    [numbered, q]
  );

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ruang Data</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Setiap angka di Sulu bisa ditelusuri sampai sumbernya. Tanda kecil seperti{' '}
          <span className="text-accent font-semibold">[1]</span> di halaman mana pun mengarah ke daftar ini.
        </p>

        <div className="relative mt-5 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari sumber..."
            className="w-full pl-9 pr-3 py-2 rounded-full border border-border bg-background text-sm outline-none focus:border-primary/60"
          />
        </div>

        <div className="mt-8 space-y-10">
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
                    <span className="font-heading text-sm font-semibold text-accent tabular-nums shrink-0">
                      [{n}]
                    </span>
                    <span className="text-sm text-foreground/85 leading-relaxed">{ref.label}</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/80 mt-10 italic">
          Daftar ini akan terus bertambah seiring konten Sulu berkembang.
        </p>
      </div>
    </div>
  );
}
