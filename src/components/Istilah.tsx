import { useState, type ReactNode, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { glossaryCategories } from '@/data/glossaryContent';

/**
 * Inline glossary term. Wrap a difficult word so the reader can tap it and see
 * a nutshell definition in a popover (Wikipedia-style), without leaving the page.
 * The popover offers a "baca selengkapnya" deep-link into /glossary for depth.
 *
 * Tap/click (Popover), NOT hover — the actual users are MA/pesantren students on
 * phones, where hover does not exist. Mandated by Pak Evan for all difficult
 * terms (NEET included).
 *
 * Usage:
 *   <Istilah id="great-gloom-neet">NEET</Istilah>
 * `id` must exist in glossaryContent.ts. If `children` is omitted, the term's
 * canonical name is shown.
 */

// Flatten the nested glossary once at module load for O(1)-ish lookups.
const FLAT = glossaryCategories.flatMap((c) => c.entries);

export default function Istilah({ id, children }: { id: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const entry = FLAT.find((e) => e.id === id);

  if (!entry) {
    if (import.meta.env.DEV) {
      console.warn(`[Istilah] Unknown glossary id: "${id}" — check src/data/glossaryContent.ts`);
    }
    return <>{children}</>;
  }

  const label = children ?? entry.term;
  const body = entry.arti ?? entry.data ?? entry.navigasi ?? entry.padanan;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Arti: ${entry.term}`}
          className="inline border-b border-dashed border-accent/60 text-foreground hover:border-accent hover:text-accent transition-colors cursor-help"
        >
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 max-w-[88vw] text-sm p-4 space-y-2">
        <div>
          <p className="font-heading font-semibold text-foreground leading-tight">{entry.term}</p>
          {entry.padanan && <p className="text-xs text-muted-foreground mt-0.5">{entry.padanan}</p>}
        </div>
        <p className="text-foreground/85 leading-relaxed text-[13px]">{body}</p>
        <Link
          to="/glossary"
          onClick={() => setOpen(false)}
          className="inline-block text-xs text-primary underline underline-offset-4 hover:opacity-80"
        >
          Baca selengkapnya di Pusat Rujukan →
        </Link>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Parse a plain string containing [[id|label]] or [[id]] markers into an array
 * of React nodes, wrapping each marker in <Istilah>. Lets glossary popups be
 * authored inline in .ts content files without converting them to JSX.
 *
 * Example: richGlossary("Banyak pemuda jadi [[great-gloom-neet|NEET]] hari ini.")
 * Rollout (Pak Evan mandate: all difficult terms): mark up terms in content
 * files as [[glossary-id|tampilan]], then render with {richGlossary(text)}.
 */
const TOKEN = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;

export function richGlossary(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(<Fragment key={`t${k}`}>{text.slice(last, m.index)}</Fragment>);
    const [, id, label] = m;
    out.push(
      <Istilah key={`g${k}`} id={id}>
        {label ?? undefined}
      </Istilah>,
    );
    last = m.index + m[0].length;
    k++;
  }
  if (last < text.length) out.push(<Fragment key={`t${k}`}>{text.slice(last)}</Fragment>);
  return out;
}
