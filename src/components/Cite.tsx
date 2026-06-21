import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { references } from '@/data/references';

/**
 * Numbered citation marker. Looks up `id` in the references registry and
 * renders a small [n] that opens an INLINE popover with the source text —
 * does NOT navigate away (reading flow stays intact). The popover offers an
 * optional deep-link to /data for readers who want the full reference list.
 *
 * Citation NUMBERS are never hardcoded — they're the registry's array
 * index at render time, so reordering references.ts re-numbers every
 * <Cite> site automatically.
 */
export default function Cite({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const idx = references.findIndex((r) => r.id === id);

  if (idx === -1) {
    if (import.meta.env.DEV) {
      console.warn(`[Cite] Unknown reference id: "${id}" — check src/data/references.ts`);
    }
    return null;
  }

  const n = idx + 1;
  const ref = references[idx];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Sumber ${n}: ${ref.label}`}
          className="inline-block align-super text-[0.65em] font-semibold text-accent leading-none mx-0.5 hover:underline"
        >
          [{n}]
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 text-sm p-3 space-y-2">
        <p className="text-foreground/85 leading-relaxed">{ref.label}</p>
        <Link
          to={`/glossary?tab=data#ref-${ref.id}`}
          onClick={() => setOpen(false)}
          className="inline-block text-xs text-primary underline underline-offset-4 hover:opacity-80"
        >
          Lihat di Pusat Rujukan →
        </Link>
      </PopoverContent>
    </Popover>
  );
}

