import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { sintesisContent as S } from "@/data/sintesisContent";
import { jalanBaktiContent as JB } from "@/data/jalanBaktiContent";

const LS_KEY = "sulu_phase4_sintesis";

// ── NACE competency labels (mirror of KenaliDirimuSkill) ──
const COMPETENCY_LABELS: Record<string, string> = {
  berpikir_kritis: "Berpikir Kritis",
  komunikasi: "Komunikasi",
  kerja_sama: "Kerja Sama Tim",
  literasi_teknologi: "Literasi Teknologi",
  kepemimpinan: "Kepemimpinan",
  profesionalisme: "Profesionalisme",
  pengembangan_diri: "Pengembangan Diri & Karier",
};

// ── Fondasi Keimanan question labels (mirror of KenaliDirimu PROMPT_LABELS) ──
const FONDASI_LABELS: Record<string, string> = {
  d1_q1: "Ayat/doa yang menenangkan",
  d1_q2: "Nilai Islam yang membimbing",
  d1_q3: "Rutinitas amal",
};
const FONDASI_KEYS = ["d1_q1", "d1_q2", "d1_q3"] as const;

// ── Resolvers for JalanBakti picks ──
function resolveSdgLabels(ids: string[]): string[] {
  const map = new Map(JB.sdg.items.map((s) => [s.id, s.label]));
  return ids.map((id) => map.get(id) ?? id);
}

function resolveSubLabels(ids: string[]): string[] {
  const map = new Map<string, string>();
  JB.klaster.forEach((k) =>
    k.subTantangan.forEach((s) => map.set(s.id, `${s.label} (${k.nama})`)),
  );
  return ids.map((id) => map.get(id) ?? id);
}

function resolvePeduliLabels(ids: string[]): string[] {
  const map = new Map<string, string>();
  JB.lensaKepedulian.tier1Items.forEach((i) => map.set(i.id, i.label));
  JB.lensaKepedulian.tier2Wajah.forEach((i) => map.set(i.id, i.label));
  return ids.map((id) => map.get(id) ?? id);
}

type SintesisData = { refleksi: string };
const EMPTY: SintesisData = { refleksi: "" };

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]/10 px-3 py-1.5 text-sm text-foreground font-medium">
      {children}
    </span>
  );
}

function DimensionCard({
  label,
  cue,
  items,
  emptyText,
  textBlocks,
}: {
  label: string;
  cue: string;
  items?: string[];
  emptyText: string;
  textBlocks?: { q: string; a: string }[];
}) {
  const hasItems = items && items.length > 0;
  const hasText = textBlocks && textBlocks.length > 0;
  const isEmpty = !hasItems && !hasText;
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div>
        <p className="font-heading text-base font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{cue}</p>
      </div>
      {isEmpty ? (
        <p className="text-sm italic text-muted-foreground">{emptyText}</p>
      ) : hasItems ? (
        <div className="flex flex-wrap gap-2">
          {items!.map((label, i) => (
            <Chip key={i}>{label}</Chip>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {textBlocks!.map((b, i) => (
            <div key={i} className="border-l-2 border-border pl-3">
              <p className="text-xs text-muted-foreground">{b.q}</p>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {b.a}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sintesis() {
  const { user, loading: authLoading } = useAuth();
  const [d, setD] = useState<SintesisData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);

  // Prior data
  const [sdgTags, setSdgTags] = useState<string[]>([]);
  const [subPicks, setSubPicks] = useState<string[]>([]);
  const [peduliPicks, setPeduliPicks] = useState<string[]>([]);
  const [skillSelected, setSkillSelected] = useState<string[]>([]);
  const [fondasi, setFondasi] = useState<Record<string, string>>({});

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      try {
        if (user) {
          const [p2a, p2b, p3, p4] = await Promise.all([
            supabase.from("phase_2a_inventory").select("data").eq("user_id", user.id).maybeSingle(),
            supabase.from("phase_2b_skills").select("data").eq("user_id", user.id).maybeSingle(),
            supabase.from("phase_3_jalan_bakti").select("data").eq("user_id", user.id).maybeSingle(),
            supabase.from("phase_4_sintesis").select("data").eq("user_id", user.id).maybeSingle(),
          ]);
          const a = (p2a.data?.data ?? {}) as Record<string, string>;
          const b = (p2b.data?.data ?? {}) as { selected?: string[] };
          const j = (p3.data?.data ?? {}) as {
            sdgTags?: string[];
            subPicks?: string[];
            peduliPicks?: string[];
          };
          const f = (p4.data?.data ?? {}) as SintesisData;
          setFondasi(a);
          setSkillSelected(b.selected ?? []);
          setSdgTags(j.sdgTags ?? []);
          setSubPicks(j.subPicks ?? []);
          setPeduliPicks(j.peduliPicks ?? []);
          setD({ ...EMPTY, ...f });
        } else {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) setD({ ...EMPTY, ...JSON.parse(raw) });
          // Mirror local fallbacks used by prior phases
          const phase3Raw = localStorage.getItem("jalan_bakti_v1");
          if (phase3Raw) {
            const j = JSON.parse(phase3Raw);
            setSdgTags(j.sdgTags ?? []);
            setSubPicks(j.subPicks ?? []);
            setPeduliPicks(j.peduliPicks ?? []);
          }
          const phase2bRaw = localStorage.getItem("sulu_phase2b");
          if (phase2bRaw) setSkillSelected(JSON.parse(phase2bRaw).selected ?? []);
          const phase2aRaw = localStorage.getItem("sulu_phase2a_inventory");
          if (phase2aRaw) setFondasi(JSON.parse(phase2aRaw));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setHydrated(true);
      }
    })();
  }, [user, authLoading]);

  const minatItems = useMemo(() => resolveSdgLabels(sdgTags), [sdgTags]);
  const kemampuanItems = useMemo(
    () => skillSelected.map((id) => COMPETENCY_LABELS[id] ?? id),
    [skillSelected],
  );
  const baktiItems = useMemo(
    () => [...resolveSubLabels(subPicks), ...resolvePeduliLabels(peduliPicks)],
    [subPicks, peduliPicks],
  );
  const nilaiBlocks = useMemo(() => {
    const blocks: { q: string; a: string }[] = [];
    for (const k of FONDASI_KEYS) {
      const v = (fondasi?.[k] ?? "").trim();
      if (v) blocks.push({ q: FONDASI_LABELS[k], a: v });
      if (blocks.length >= 2) break;
    }
    return blocks;
  }, [fondasi]);

  async function handleSave() {
    setSaving(true);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(d));
      if (user) {
        const { error } = await supabase
          .from("phase_4_sintesis")
          .upsert(
            { user_id: user.id, data: d, updated_at: new Date().toISOString() },
            { onConflict: "user_id" },
          );
        if (error) throw error;
      }
      toast.success(S.ui.savedToast);
    } catch (e) {
      console.error(e);
      toast.error(S.ui.errorToast);
    } finally {
      setSaving(false);
    }
  }

  if (!hydrated) {
    return (
      <main className="container mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  const T = S.triangle;

  return (
    <main className="container mx-auto px-6 py-12 max-w-2xl">
      {/* ── PEMBUKA ── */}
      <section className="space-y-4">
        <h1 className="font-heading text-2xl font-bold text-foreground">{S.ui.pageTitle}</h1>
        {S.pembuka.split("\n\n").map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground/90">
            {p}
          </p>
        ))}
      </section>

      <Separator className="my-10" />

      {/* ── TITIK TEMU ── */}
      <section className="space-y-5">
        <SectionHeader title={S.ui.triangleSectionTitle} />
        <div className="space-y-4">
          {T.framing.split("\n\n").map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <DimensionCard
            label={T.dimensi.minat.label}
            cue={T.dimensi.minat.cue}
            items={minatItems}
            emptyText={T.emptyState.minat}
          />
          <DimensionCard
            label={T.dimensi.kemampuan.label}
            cue={T.dimensi.kemampuan.cue}
            items={kemampuanItems}
            emptyText={T.emptyState.kemampuan}
          />
          <DimensionCard
            label={T.dimensi.nilai.label}
            cue={T.dimensi.nilai.cue}
            textBlocks={nilaiBlocks}
            emptyText={T.emptyState.nilai}
          />
          <DimensionCard
            label={T.dimensi.bakti.label}
            cue={T.dimensi.bakti.cue}
            items={baktiItems}
            emptyText={T.emptyState.bakti}
          />
        </div>
      </section>

      <Separator className="my-10" />

      {/* ── SATU PERTANYAAN TERAKHIR ── */}
      <section className="space-y-4">
        <SectionHeader title={S.ui.refleksiSectionTitle} />
        <p className="text-base leading-relaxed text-foreground/90">{S.refleksiLima}</p>
        <Textarea
          value={d.refleksi}
          onChange={(e) => setD((p) => ({ ...p, refleksi: e.target.value }))}
          placeholder={S.refleksiPlaceholder}
          className="min-h-[140px]"
        />
      </section>

      <Separator className="my-10" />

      {/* ── PENUTUP ── */}
      <section className="space-y-5">
        <SectionHeader title={S.ui.penutupSectionTitle} />
        {S.penutup.teks.split("\n\n").map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground/90">
            {p}
          </p>
        ))}
        <div className="rounded-xl border border-border bg-secondary/40 px-5 py-5 space-y-3 mt-2">
          <p dir="rtl" lang="ar" className="text-2xl leading-loose text-foreground text-right">
            {S.penutup.ayatArab}
          </p>
          <p className="text-base italic text-foreground/90 leading-relaxed">
            {S.penutup.ayatTerjemah}
          </p>
          <p className="text-xs text-muted-foreground">{S.penutup.ayatRujukan}</p>
        </div>
      </section>

      {/* ── SAVE ── */}
      <div className="flex flex-col items-center gap-3 pt-8 pb-12">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {S.ui.saveLabel}
        </Button>
      </div>
    </main>
  );
}
