import { Link } from 'react-router-dom';
import { references } from '@/data/references';

/**
 * Numbered citation marker. Looks up `id` in the references registry and
 * renders a small clickable [n] linking to /data#ref-{id}.
 *
 * Citation NUMBERS are never hardcoded — they're the registry's array
 * index at render time, so reordering references.ts re-numbers every
 * <Cite> site automatically.
 */
export default function Cite({ id }: { id: string }) {
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
    <Link
      to={`/data#ref-${ref.id}`}
      title={ref.label}
      aria-label={`Sumber ${n}: ${ref.label}`}
      className="inline-block align-super text-[0.65em] font-semibold text-accent leading-none mx-0.5 hover:underline"
    >
      [{n}]
    </Link>
  );
}
