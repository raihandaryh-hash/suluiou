import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Payung = {
  readonly id: string;
  readonly judul: string;
  readonly ajakan: string;
  readonly ekstrovert: string;
  readonly introvert: string;
  readonly langkahDefault: string;
};

type Gerakan3 = {
  readonly payung: readonly Payung[];
  readonly pitchJudul: string;
  readonly pitch: string;
  readonly queriesJudul: string;
  readonly queries: readonly string[];
  readonly aiPromptJudul: string;
  readonly aiPrompt: string;
  readonly bridge: string;
  readonly langkahNudge: string;
  readonly langkahPlaceholder: string;
  readonly bridgeAksi: string;
};

type Props = {
  content: Gerakan3;
  medanNama: string;
  role: string | null;
  initialLangkah: string;
  onLangkahChange: (l: string) => void;
  userId: string | null;
  province: string | null;
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

// "Minta dijembatani" — Jembatan Manusia MVP (spec 1, §3). Admin-mediated:
// request masuk antrean bridge_requests, admin match manual ke narasumber.
// Guest (tanpa akun Google) tidak bisa submit — pola sama dengan handleSave
// JalanBakti.tsx (data guest tidak dipersist ke Supabase sama sekali).
function BridgeRequestForm({
  userId,
  medanNama,
  province,
}: {
  userId: string | null;
  medanNama: string;
  province: string | null;
}) {
  const [roleText, setRoleText] = useState(medanNama || "");
  const [questionText, setQuestionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  if (!userId) {
    return (
      <p className="text-xs text-muted-foreground italic">
        Masuk dengan Google untuk minta dijembatani ke narasumber.
      </p>
    );
  }

  if (sent) {
    return (
      <p className="text-sm text-foreground/90">
        Permintaanmu sudah masuk antrean. Tim akan menghubungkan kamu lewat WhatsApp kalau ada narasumber yang cocok.
      </p>
    );
  }

  const handleSubmit = async () => {
    if (!roleText.trim() || !questionText.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("bridge_requests").insert({
        user_id: userId,
        role_text: roleText.trim(),
        question_text: questionText.trim(),
        province,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Permintaan terkirim");
    } catch (e) {
      console.error(e);
      toast.error("Gagal mengirim, coba lagi sebentar lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-2 pt-1">
      <Input
        value={roleText}
        onChange={(e) => setRoleText(e.target.value)}
        placeholder="Peran/bidang yang kamu jajaki"
        maxLength={80}
      />
      <Textarea
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Pertanyaan yang ingin kamu tanyakan ke narasumber"
        className="min-h-[70px]"
        maxLength={500}
      />
      <Button
        type="button"
        size="sm"
        disabled={submitting || !roleText.trim() || !questionText.trim()}
        onClick={handleSubmit}
      >
        {submitting ? "Mengirim..." : "Minta dijembatani"}
      </Button>
    </div>
  );
}

export default function DesainLangkah({
  content,
  medanNama,
  role,
  initialLangkah,
  onLangkahChange,
  userId,
  province,
}: Props) {
  const [langkah, setLangkah] = useState(initialLangkah || "");
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const MAX_STEPS = 2;

  const sub = (t: string) =>
    t.replace(/\{peran\}/g, role || "peran ini").replace(/\{medan\}/g, medanNama || "medan ini");

  const lineOf = (p: Payung) => sub(p.langkahDefault).trim();
  const currentLines = () =>
    langkah
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  const isActive = (p: Payung) => currentLines().includes(lineOf(p));
  const activeCount = content.payung.filter(isActive).length;

  function setStep(next: string) {
    setLangkah(next);
    onLangkahChange(next);
  }

  function togglePayung(p: Payung) {
    const line = lineOf(p);
    const lines = currentLines();
    if (lines.includes(line)) {
      setStep(lines.filter((l) => l !== line).join("\n"));
    } else {
      if (activeCount >= MAX_STEPS) return;
      setStep([...lines, line].join("\n"));
      setTimeout(() => boxRef.current?.focus(), 50);
    }
  }

  return (
    <div className="space-y-4">
      {content.payung.map((p) => {
        const isTemui = p.id === "temui";
        const isSelami = p.id === "selami";
        return (
          <div
            key={p.id}
            className={cn(
              "rounded-xl border bg-card p-5 space-y-3 transition-colors",
              isActive(p)
                ? "border-[hsl(var(--torch-gold))] ring-1 ring-[hsl(var(--torch-gold))]/40"
                : "border-border",
            )}
          >
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
                <div className="border-t border-border pt-3 mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Atau, minta dijembatani langsung
                  </p>
                  <BridgeRequestForm userId={userId} medanNama={medanNama} province={province} />
                </div>
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
              variant={isActive(p) ? "default" : "ghost"}
              size="sm"
              className={isActive(p) ? "" : "text-primary"}
              disabled={!isActive(p) && activeCount >= MAX_STEPS}
              onClick={() => togglePayung(p)}
            >
              {isActive(p) ? "Terpilih ✓" : "Jadikan langkahku →"}
            </Button>
          </div>
        );
      })}

      <div className="rounded-xl border border-[hsl(var(--torch-gold))]/40 bg-card p-5 space-y-3">
        <p className="text-base leading-relaxed text-foreground/90">{content.bridge}</p>
        <p className="text-sm text-muted-foreground">{content.langkahNudge}</p>
        <Textarea
          ref={boxRef}
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
