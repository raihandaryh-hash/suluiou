import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Payung = {
  id: string;
  judul: string;
  ajakan: string;
  ekstrovert: string;
  introvert: string;
  langkahDefault: string;
};

type Gerakan3 = {
  payung: Payung[];
  pitchJudul: string;
  pitch: string;
  queriesJudul: string;
  queries: string[];
  aiPromptJudul: string;
  aiPrompt: string;
  bridge: string;
  langkahPlaceholder: string;
  bridgeAksi: string;
};

type Props = {
  content: Gerakan3;
  medanNama: string;
  role: string | null;
  initialLangkah: string;
  onLangkahChange: (l: string) => void;
};

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard tidak tersedia */
        }
      }}
    >
      {done ? "Tersalin ✓" : "Salin"}
    </Button>
  );
}

export default function DesainLangkah({
  content,
  medanNama,
  role,
  initialLangkah,
  onLangkahChange,
}: Props) {
  const [langkah, setLangkah] = useState(initialLangkah || "");

  const sub = (t: string) =>
    t.replace(/\{peran\}/g, role || "peran ini").replace(/\{medan\}/g, medanNama || "medan ini");

  function setStep(next: string) {
    setLangkah(next);
    onLangkahChange(next);
  }

  return (
    <div className="space-y-4">
      {content.payung.map((p) => {
        const isTemui = p.id === "temui";
        const isSelami = p.id === "selami";
        return (
          <div key={p.id} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h4 className="font-heading text-lg font-semibold text-foreground">{p.judul}</h4>
            <p className="text-sm leading-relaxed text-foreground/85">{sub(p.ajakan)}</p>
            <div className="space-y-1.5 text-sm">
              <p className="text-foreground/80">
                <span className="text-muted-foreground">Suka menyapa: </span>
                {p.ekstrovert}
              </p>
              <p className="text-foreground/80">
                <span className="text-muted-foreground">Suka menyelami sendiri: </span>
                {p.introvert}
              </p>
            </div>

            {isTemui && (
              <div className="rounded-lg bg-muted/60 p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {content.pitchJudul}
                </p>
                <p className="text-sm leading-relaxed text-foreground/90">{sub(content.pitch)}</p>
                <CopyButton text={sub(content.pitch)} />
              </div>
            )}

            {isSelami && (
              <div className="rounded-lg bg-muted/60 p-4 space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {content.queriesJudul}
                  </p>
                  {content.queries.map((q, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <code className="text-sm text-foreground/90">{sub(q)}</code>
                      <CopyButton text={sub(q)} />
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {content.aiPromptJudul}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {sub(content.aiPrompt)}
                  </p>
                  <CopyButton text={sub(content.aiPrompt)} />
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => setStep(sub(p.langkahDefault))}
            >
              Jadikan langkahku →
            </Button>
          </div>
        );
      })}

      <div className="rounded-xl border border-[hsl(var(--torch-gold))]/40 bg-card p-5 space-y-3">
        <p className="text-base leading-relaxed text-foreground/90">{content.bridge}</p>
        <Textarea
          value={langkah}
          onChange={(e) => setStep(e.target.value)}
          placeholder={content.langkahPlaceholder}
          className="min-h-[90px]"
        />
        <p className="text-sm text-muted-foreground">{content.bridgeAksi}</p>
      </div>
    </div>
  );
}
