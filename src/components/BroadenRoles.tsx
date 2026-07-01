import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildSuluContext } from "@/lib/buildSuluContext";

type Role = {
  title: string;
  whatTheyDo: string;
  demandsMost: string;
  whyUnexpected: string;
  pathwayHint: string;
  unexpected: boolean;
};

type Props = {
  medan: { id: string; nama: string };
  subPicks: string[];
  siapa: string[];
  province: string | null;
  initialPicked?: string[];
  onPickedChange?: (picked: string[]) => void;
};

const MAX_PICK = 2;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export default function BroadenRoles({
  medan,
  subPicks,
  siapa,
  province,
  initialPicked = [],
  onPickedChange,
}: Props) {
  const [phase, setPhase] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [roles, setRoles] = useState<Role[]>([]);
  const [note, setNote] = useState("");
  const [revealed, setRevealed] = useState(0);
  const [picked, setPicked] = useState<string[]>(initialPicked);
  const [errorMsg, setErrorMsg] = useState("");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => timers.current.forEach((t) => clearTimeout(t));
  }, []);

  function reveal(count: number) {
    if (prefersReducedMotion()) {
      setRevealed(count);
      return;
    }
    setRevealed(0);
    for (let i = 1; i <= count; i++) {
      const t = window.setTimeout(() => setRevealed(i), i * 150);
      timers.current.push(t);
    }
  }

  async function run() {
    setPhase("loading");
    setErrorMsg("");
    try {
      const ctx = buildSuluContext(province);
      const personSide = {
        skills: ctx.reflection.phase2b || "",
        values: ctx.reflection.phase2a || "",
      };
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.functions.invoke("broaden-roles", {
        body: { medan, subPicks, siapa, province, personSide },
      });
      if (error || !data || data.error || !Array.isArray(data.roles) || !data.roles.length) {
        throw new Error(data?.error || error?.message || "empty");
      }
      setRoles(data.roles as Role[]);
      setPicked([]);
      onPickedChange?.([]);
      setNote(typeof data.note === "string" ? data.note : "");
      setPhase("done");
      reveal(data.roles.length);
    } catch {
      setErrorMsg("Belum berhasil menyalakan peran. Coba lagi sebentar.");
      setPhase("error");
    }
  }

  function togglePick(title: string) {
    setPicked((prev) => {
      let next: string[];
      if (prev.includes(title)) {
        next = prev.filter((t) => t !== title);
      } else {
        if (prev.length >= MAX_PICK) return prev;
        next = [...prev, title];
      }
      onPickedChange?.(next);
      return next;
    });
  }

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <Button
          onClick={run}
          size="lg"
          className="torch-glow bg-torch-gradient text-white hover:opacity-95"
        >
          Nyalakan peran yang belum terlihat
        </Button>
        <p className="text-sm text-muted-foreground max-w-md">
          Sulu akan membuka beberapa peran nyata di medan ini, termasuk yang jarang terpikirkan.
        </p>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <span
          className="h-3 w-3 rounded-full bg-[hsl(var(--torch-gold))] torch-glow motion-safe:animate-pulse"
          aria-hidden
        />
        <p className="text-sm text-muted-foreground">
          Sedang menyalakan peran yang belum terlihat...
        </p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-6">
        <p className="text-sm text-foreground/80">{errorMsg}</p>
        <Button onClick={run} variant="outline" size="sm">
          Coba lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {roles.map((r, i) => {
          const shown = i < revealed;
          const isPicked = picked.includes(r.title);
          return (
            <div
              key={`${r.title}-${i}`}
              className={cn(
                "rounded-xl border bg-card p-5 space-y-3 transition-all duration-500 ease-out",
                shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                r.unexpected ? "border-[hsl(var(--torch-gold))]/45" : "border-border",
                isPicked && "ring-2 ring-[hsl(var(--torch-gold))]"
              )}
            >
              {r.unexpected && (
                <span className="inline-block text-xs font-semibold uppercase tracking-wide text-[hsl(var(--torch-gold))]">
                  Jarang terlihat
                </span>
              )}
              <h4 className="font-heading text-lg font-semibold text-foreground">{r.title}</h4>
              <p className="text-sm leading-relaxed text-foreground/85">{r.whatTheyDo}</p>
              <p className="text-sm text-foreground/90">
                <span className="text-muted-foreground">Paling menuntut: </span>
                {r.demandsMost}
              </p>
              {r.whyUnexpected && (
                <p className="text-sm italic leading-relaxed text-muted-foreground">
                  {r.whyUnexpected}
                </p>
              )}
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-primary marker:content-['']">
                  <span className="group-open:hidden">Lihat jalur ke sana</span>
                  <span className="hidden group-open:inline">Tutup</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80 border-l-2 border-border pl-3">
                  {r.pathwayHint}
                </p>
              </details>
              <div className="pt-1">
                <Button
                  onClick={() => togglePick(r.title)}
                  variant={isPicked ? "default" : "outline"}
                  size="sm"
                  disabled={!isPicked && picked.length >= MAX_PICK}
                >
                  {isPicked ? "Ditelusuri ✓" : "Telusuri ini"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {revealed >= roles.length && (
        <div className="pt-2 space-y-2">
          <p className="text-sm text-muted-foreground">
            Pilih satu atau dua peran yang paling ingin kamu telusuri lebih jauh
            {picked.length > 0 ? ` (${picked.length}/${MAX_PICK} dipilih)` : ""}.
          </p>
          {note && (
            <p className="text-base leading-relaxed text-foreground/90 border-l-4 border-[hsl(var(--torch-gold))] pl-4">
              {note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
