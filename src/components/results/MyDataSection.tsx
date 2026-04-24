import { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { DimensionScores } from '@/lib/scoring';

interface MyDataSectionProps {
  scores: DimensionScores;
  hollandCode: string | null;
  sdsCounts: { R: number; I: number; A: number; S: number; E: number; C: number } | null;
}

const HEXACO_LABELS: Array<{ key: keyof DimensionScores; label: string }> = [
  { key: 'honesty', label: 'Kejujuran-Kerendahan Hati' },
  { key: 'emotionality', label: 'Emosionalitas' },
  { key: 'extraversion', label: 'Ekstroversi' },
  { key: 'agreeableness', label: 'Keramahan' },
  { key: 'conscientiousness', label: 'Kesungguhan' },
  { key: 'openness', label: 'Keterbukaan' },
];

const RIASEC_LABELS: Array<{ key: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'; label: string }> = [
  { key: 'R', label: 'Realistis' },
  { key: 'I', label: 'Investigatif' },
  { key: 'A', label: 'Artistik' },
  { key: 'S', label: 'Sosial' },
  { key: 'E', label: 'Wirausaha' },
  { key: 'C', label: 'Konvensional' },
];

const SDS_MAX = 36;

export function MyDataSection({ scores, hollandCode, sdsCounts }: MyDataSectionProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    const hex = HEXACO_LABELS
      .map(({ key, label }) => `${label}: ${scores[key].toFixed(1)}/5`)
      .join('\n');

    const ria = RIASEC_LABELS
      .map(({ key, label }) => {
        const count = sdsCounts ? sdsCounts[key] : 0;
        return `${label}: ${count}/${SDS_MAX}`;
      })
      .join('\n');

    const text = `=== Profil Minat & Kepribadian Saya (Sulu — IOU Indonesia) ===

HEXACO:
${hex}

RIASEC:
${ria}

Holland Code: ${hollandCode || '(tidak tersedia)'}

---
Kamu bisa tempel data ini ke ChatGPT atau AI lain untuk eksplorasi lebih lanjut.
Dihasilkan oleh Sulu — suluiou.lovable.app`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: 'Tersalin!', description: 'Data sudah ada di clipboard-mu.' });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        title: 'Gagal menyalin',
        description: 'Browser-mu tidak mengizinkan akses clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-12">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="w-full glass rounded-2xl px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        >
          <div>
            <p className="text-sm font-heading font-semibold text-foreground">
              Lihat data lengkapmu
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Skor HEXACO &amp; RIASEC mentah — untuk yang penasaran
            </p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="pt-4 grid md:grid-cols-2 gap-4">
          {/* Card kiri — HEXACO */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-4">
              HEXACO saya
            </p>
            <div className="space-y-3">
              {HEXACO_LABELS.map(({ key, label }) => {
                const value = scores[key];
                const pct = (value / 5) * 100;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-foreground/85">{label}</span>
                      <span className="text-xs font-semibold tabular-nums text-foreground">
                        {value.toFixed(1)}/5
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card kanan — RIASEC */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-4">
              RIASEC saya
            </p>
            <div className="space-y-3">
              {RIASEC_LABELS.map(({ key, label }) => {
                const count = sdsCounts ? sdsCounts[key] : 0;
                const pct = (count / SDS_MAX) * 100;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-foreground/85">{label}</span>
                      <span className="text-xs font-semibold tabular-nums text-foreground">
                        {count}/{SDS_MAX}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {hollandCode && (
              <p className="mt-4 text-xs text-muted-foreground">
                Holland Code: <span className="font-semibold text-foreground">{hollandCode}</span>
              </p>
            )}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full mt-4 gap-2"
          onClick={handleCopy}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Tersalin!' : 'Salin data saya'}
        </Button>
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          Data ini milikmu. Kamu bisa tempel ke AI lain untuk eksplorasi lebih lanjut.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
