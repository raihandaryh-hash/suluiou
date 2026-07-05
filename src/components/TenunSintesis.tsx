import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sintesisContent as S } from "@/data/sintesisContent";

type Payload = {
  fondasi: { q: string; a: string }[];
  skills: string[];
  bakti: string[];
  siapa: string[];
  roles: string[];
  langkah: string;
};

type Props = {
  payload: Payload;
  enough: boolean;
  initialTenun?: string[];
  initialCatatan?: string;
  onResult?: (tenun: string[], catatan: string) => void;
};

export default function TenunSintesis({
  payload,
  enough,
  initialTenun = [],
  initialCatatan = "",
  onResult,
}: Props) {
  const C = S.tenunan;
  const hasInitial = initialTenun.length > 0;
  const [phase, setPhase] = useState<"idle" | "loading" | "done" | "error">(
    hasInitial ? "done" : "idle"
  );
  const [tenun, setTenun] = useState<string[]>(initialTenun);
  const [catatan, setCatatan] = useState(initialCatatan);
  const [errorMsg, setErrorMsg] = useState("");

  async function run() {
    setPhase("loading");
    setErrorMsg("");
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.functions.invoke("generate-sintesis", {
        body: payload,
      });
      if (error || !data || data.error || !Array.isArray(data.tenun) || !data.tenun.length) {
        throw new Error(data?.error || error?.message || "empty");
      }
      const t = data.tenun as string[];
      const c = typeof data.catatan === "string" ? data.catatan : "";
      setTenun(t);
      setCatatan(c);
      onResult?.(t, c);
      setPhase("done");
    } catch {
      setErrorMsg(C.errorText);
      setPhase("error");
    }
  }

  if (!enough) {
    return <p className="text-sm italic text-muted-foreground">{C.emptyGate}</p>;
  }

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <Button onClick={run} size="lg" className="torch-glow bg-torch-gradient text-white hover:opacity-95">
          {C.buttonLabel}
        </Button>
        <p className="text-sm text-muted-foreground max-w-md">{C.intro}</p>
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
        <p className="text-sm text-muted-foreground">{C.loadingText}</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-6">
        <p className="text-sm text-foreground/80">{errorMsg}</p>
        <Button onClick={run} variant="outline" size="sm">
          {C.retryLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[hsl(var(--torch-gold))]/40 bg-card p-6 space-y-4">
        {tenun.map((p, i) => (
          <p key={`tenun-${i}`} className="text-base leading-[1.75] text-foreground/90">
            {p}
          </p>
        ))}
        {catatan && (
          <p className="text-sm italic leading-relaxed text-muted-foreground">{catatan}</p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{C.mirrorNote}</p>
      <div>
        <Button onClick={run} variant="ghost" size="sm">
          {C.regenerateLabel}
        </Button>
      </div>
    </div>
  );
}
