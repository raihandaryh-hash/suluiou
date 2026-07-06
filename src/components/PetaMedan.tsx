import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Rumpun = { readonly id: string; readonly label: string; readonly klasterIds: readonly string[] };
type Klaster = { readonly id: string; readonly nama: string };

type Props = {
  rumpun: readonly Rumpun[];
  klaster: readonly Klaster[];
  instruksi: string;
  provinsiLabel: string;
  ctaLabel: string;
  selectedMedan: string | null;
  onSelectMedan: (id: string) => void;
};

// Peta Medan — funnel Dunia(4 rumpun)→Indonesia(7 klaster). Padanan skill-map
// untuk sisi masalah (spec 3-SPEC-peta-medan.md, ACC Raihan 6 Jul 2026).
// Lapis Provinsi SENGAJA belum aktif — province_contexts schema belum
// defensible (gate keras di spec). Ditaruh SEBAGAI LAPIS EKSPLORASI di atas
// grid klaster existing, bukan pengganti mekanisme pilih medan (ACC Raihan).
export default function PetaMedan({
  rumpun,
  klaster,
  instruksi,
  provinsiLabel,
  ctaLabel,
  selectedMedan,
  onSelectMedan,
}: Props) {
  const [activeRumpun, setActiveRumpun] = useState<string | null>(null);

  const active = rumpun.find((r) => r.id === activeRumpun) ?? null;
  const connectedKlasterIds = active?.klasterIds ?? [];

  return (
    <div className="space-y-6">
      {/* Lapis 1 — Dunia (4 rumpun) */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{instruksi}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rumpun.map((r) => {
            const isActive = r.id === activeRumpun;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRumpun(isActive ? null : r.id)}
                aria-pressed={isActive}
                className={cn(
                  "text-left rounded-xl border p-4 text-sm transition-colors",
                  isActive
                    ? "border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]/10 font-medium text-foreground"
                    : "border-border bg-secondary/40 text-foreground/80 hover:border-foreground/30",
                )}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lapis 2 — Indonesia (7 klaster, highlight kalau terhubung) */}
      <div className="flex flex-wrap gap-2">
        {klaster.map((k) => {
          const connected = active ? connectedKlasterIds.includes(k.id) : true;
          const selected = selectedMedan === k.id;
          return (
            <div
              key={k.id}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-opacity",
                selected
                  ? "border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]/15 font-medium"
                  : "border-border bg-secondary/30",
                active && !connected && "opacity-30",
              )}
            >
              {k.nama}
              {active && connected && !selected && (
                <button
                  type="button"
                  onClick={() => onSelectMedan(k.id)}
                  className="ml-2 text-[hsl(var(--torch-gold))] underline underline-offset-2"
                >
                  {ctaLabel}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Lapis 3 — Provinsi (segera, gate province_contexts schema) */}
      <p className="text-xs text-muted-foreground italic">{provinsiLabel}</p>
    </div>
  );
}
