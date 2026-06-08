import { Link, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Step = {
  num: number;
  label: string;
  href: string;
  disabled?: boolean;
};

const steps: Step[] = [
  { num: 1, label: 'Kenali Dunia', href: '/insight' },
  { num: 2, label: 'Kenali Dirimu', href: '/kenali-dirimu', disabled: true },
  { num: 3, label: 'Kenali Jalan Baktimu', href: '/jalan-bakti', disabled: true },
  { num: 4, label: 'Sintesis', href: '/sintesis', disabled: true },
  { num: 5, label: 'Rencana Baktimu', href: '/action-plan', disabled: true },
];

export default function JourneyBar() {
  const { pathname } = useLocation();

  return (
    <TooltipProvider delayDuration={200}>
      <nav
        aria-label="Journey progress"
        className="sticky top-0 z-30 h-12 border-b border-border/60 bg-background/75 backdrop-blur-md"
      >
        <ol className="container mx-auto flex h-full items-center justify-start sm:justify-center gap-1 px-4 sm:gap-2 overflow-x-auto whitespace-nowrap">
          {steps.map((s, i) => {
            const active = !s.disabled && pathname === s.href;
            const numBadge = (
              <span
                className={cn(
                  'inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs tabular-nums transition-colors shrink-0',
                  active
                    ? 'border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]/10'
                    : 'border-border bg-secondary/40 group-hover:border-foreground/40',
                )}
              >
                {s.num}
              </span>
            );

            const labelEl = (
              <span
                className={cn(
                  'hidden sm:inline items-center gap-1',
                  active && 'border-b-2 border-[hsl(var(--torch-gold))] pb-0.5',
                )}
              >
                {s.label}
                {s.disabled && (
                  <Lock className="inline-block w-3 h-3 ml-1 -mt-0.5" aria-hidden />
                )}
              </span>
            );

            const itemClass = cn(
              'group flex items-center gap-2 rounded-md px-2 py-1 font-heading text-sm transition-colors shrink-0',
              s.disabled
                ? 'text-muted-foreground/70 opacity-50 pointer-events-none cursor-not-allowed'
                : active
                  ? 'text-[hsl(var(--torch-gold))] font-semibold'
                  : 'text-muted-foreground hover:text-foreground',
            );

            const content = s.disabled ? (
              <span aria-disabled className={itemClass} title="Segera hadir">
                {numBadge}
                {labelEl}
              </span>
            ) : (
              <Link
                to={s.href}
                aria-current={active ? 'page' : undefined}
                title={s.label}
                className={itemClass}
              >
                {numBadge}
                {labelEl}
              </Link>
            );

            return (
              <li key={s.href} className="flex items-center gap-1 sm:gap-2 shrink-0">
                {s.disabled ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* wrapper enables tooltip on a non-interactive element */}
                      <span className="inline-flex pointer-events-auto">{content}</span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Segera hadir</TooltipContent>
                  </Tooltip>
                ) : (
                  content
                )}
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
    </TooltipProvider>
  );
}
