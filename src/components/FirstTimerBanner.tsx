import { useEffect, useState } from "react";
import { X } from "lucide-react";

const KEY = "sulu_visited";

export default function FirstTimerBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (!v) {
        setShow(true);
        localStorage.setItem(KEY, "true");
      }
    } catch {}
  }, []);

  if (!show) return null;

  return (
    <div className="w-full border-b border-[hsl(var(--brand-navy))]/15 bg-[hsl(var(--brand-navy))]/5 print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 text-sm">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-foreground/80">
          <span className="font-medium text-[hsl(var(--ink-deep))]">
            Baru di sini? Sulu punya 3 halaman yang saling terhubung:
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-[hsl(var(--brand-navy))] ring-1 ring-[hsl(var(--brand-navy))]/20">Dunia</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-[hsl(var(--brand-navy))] ring-1 ring-[hsl(var(--brand-navy))]/20">Peta Skill</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-[hsl(var(--brand-navy))] ring-1 ring-[hsl(var(--brand-navy))]/20">Cermin Dirimu</span>
          </span>
        </div>
        <button
          aria-label="Tutup"
          onClick={() => setShow(false)}
          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-background hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
