import { tautanUntuk } from "@/data/tautanSumber";

/** Teks sumber + tautan primer bila tercatat di tautanSumber.ts. Tanpa tautan: teks saja, seperti sebelumnya. */
export default function SumberTeks({ teks, simpul }: { teks?: string | null; simpul?: string | null }) {
  const tautan = tautanUntuk(teks, simpul);
  return (
    <>
      {teks}
      {tautan.map((u, i) => (
        <a
          key={u}
          href={u}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 underline underline-offset-2 hover:text-primary not-italic"
          aria-label={`Buka sumber ${i + 1}`}
        >
          ↗{tautan.length > 1 ? i + 1 : ""}
        </a>
      ))}
    </>
  );
}
