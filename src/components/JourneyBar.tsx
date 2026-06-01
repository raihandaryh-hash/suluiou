import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const steps = [
  { num: 1, label: 'Dunia', href: '/insight' },
  { num: 2, label: 'Peta Skill', href: '/skill-map' },
  { num: 3, label: 'Cermin Dirimu', href: '/compass' },
] as const;

export default function JourneyBar() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Journey progress"
      className="sticky top-0 z-30 h-12 border-b border-border/60 bg-background/75 backdrop-blur-md"
    >
      <ol className="container mx-auto flex h-full items-center justify-center gap-1 px-4 sm:gap-2">
        {steps.map((s, i) => {
          const active = pathname === s.href;
          return (
            <li key={s.href} className="flex items-center gap-1 sm:gap-2">
              <Link
                to={s.href}
                aria-current={active ? 'page' : undefined}
                title={s.label}
                className={cn(
                  'group flex items-center gap-2 rounded-md px-2 py-1 font-heading text-sm transition-colors',
                  active
                    ? 'text-[hsl(var(--torch-gold))] font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs tabular-nums transition-colors',
                    active
                      ? 'border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]/10'
                      : 'border-border bg-secondary/40 group-hover:border-foreground/40',
                  )}
                >
                  {s.num}
                </span>
                <span
                  className={cn(
                    'hidden sm:inline',
                    active && 'border-b-2 border-[hsl(var(--torch-gold))] pb-0.5',
                  )}
                >
                  {s.label}
                </span>
              </Link>
              {i < steps.length - 1 && (
                <span aria-hidden className="text-muted-foreground/40 text-xs">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
