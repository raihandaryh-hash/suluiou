import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface NavSection { id: string; label: string; }

// Rail anchor intra-halaman dengan scrollspy (IntersectionObserver).
// Beda lapisan dari JourneyBar (antar-fase) — ini antar-babak DALAM halaman Insight.
// Desktop saja; di mobile disembunyikan (ruang sempit, JourneyBar sudah menangani navigasi fase).
export default function InsightNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <nav className="hidden 2xl:block fixed left-6 top-1/2 -translate-y-1/2 z-30" aria-label="Navigasi babak">
      <ul className="space-y-3">
        {sections.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <button onClick={() => go(s.id)} className="group flex items-center gap-3 text-left">
                <span
                  className={cn(
                    "h-px transition-all duration-300",
                    on ? "w-8 bg-foreground" : "w-4 bg-border group-hover:bg-foreground/50"
                  )}
                />
                <span
                  className={cn(
                    "text-xs transition-colors",
                    on ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground/70"
                  )}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
