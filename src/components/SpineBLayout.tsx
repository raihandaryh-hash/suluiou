import { Outlet, Link, useLocation } from 'react-router-dom';
import JourneyBar from '@/components/JourneyBar';
import RequireAuth from '@/components/RequireAuth';
import { cn } from '@/lib/utils';

type Phase = { num: number; label: string; href: string };

// Same order/data as JourneyBar
const phases: Phase[] = [
  { num: 1, label: 'Kenali Dunia', href: '/insight' },
  { num: 2, label: 'Kenali Dirimu', href: '/kenali-dirimu' },
  { num: 3, label: 'Kenali Jalan Baktimu', href: '/jalan-bakti' },
  { num: 4, label: 'Sintesis', href: '/sintesis' },
  { num: 5, label: 'Rencana Baktimu', href: '/rencana-aksi' },
];

function JourneyMap() {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Peta Perjalanan" className="text-sm">
      <p className="mb-4 font-[Outfit] text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Peta Perjalanan
      </p>
      <ol className="space-y-1">
        {phases.map((p) => {
          const active = pathname === p.href;
          return (
            <li key={p.href}>
              <Link
                to={p.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group flex items-start gap-3 rounded-md py-2 pl-3 pr-2 transition-colors',
                  active
                    ? 'border-l-2 border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]/5 text-[hsl(var(--ink-deep))]'
                    : 'border-l-2 border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] tabular-nums',
                    active
                      ? 'border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]/15 text-[hsl(var(--ink-deep))]'
                      : 'border-border bg-background',
                  )}
                >
                  {p.num}
                </span>
                <span
                  className={cn(
                    'font-[Outfit] leading-tight',
                    active ? 'font-semibold' : 'font-normal',
                  )}
                >
                  {p.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function SpineBLayout() {
  return (
    <RequireAuth>
      {/* Mobile/tablet: keep existing JourneyBar at top */}
      <div className="lg:hidden">
        <JourneyBar />
        <Outlet />
      </div>

      {/* Desktop: 3-zone reading shell */}
      <div className="hidden lg:grid mx-auto w-full max-w-[1280px] grid-cols-[220px_minmax(0,1fr)_220px] gap-10 px-8 py-10">
        <aside className="sticky top-10 self-start">
          <JourneyMap />
        </aside>

        <main className="min-w-0">
          <div className="measure mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Right column reserved for future notebook — intentionally empty */}
        <aside aria-hidden className="sticky top-10 self-start" />
      </div>
    </RequireAuth>
  );
}
