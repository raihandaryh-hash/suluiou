import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { rencanaAksiContent as R } from "@/data/rencanaAksiContent";

const LS_KEY = "sulu_phase5_action_plan";

type FormState = Record<string, string>;

function buildEmptyForm(): FormState {
  const f: FormState = { portfolioMoment: "" };
  R.form.gerak.forEach((g) => g.fields.forEach((fd) => (f[fd.key] = "")));
  return f;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>
    </div>
  );
}

function AyatBlock({
  arab,
  terjemah,
  rujukan,
  tone = "primary",
}: {
  arab: string;
  terjemah: string;
  rujukan: string;
  tone?: "primary" | "soft";
}) {
  return (
    <div
      className={
        tone === "primary"
          ? "rounded-xl border border-border bg-secondary/40 px-5 py-5 space-y-3"
          : "rounded-xl border border-border bg-secondary/30 px-5 py-5 space-y-3"
      }
    >
      <p dir="rtl" lang="ar" className="text-2xl leading-loose text-foreground text-right">
        {arab}
      </p>
      <p className="text-base italic text-foreground/90 leading-relaxed">{terjemah}</p>
      <p className="text-xs text-muted-foreground">{rujukan}</p>
    </div>
  );
}

export default function RencanaAksi() {
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState<FormState>(buildEmptyForm);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);

  // Echo flags (do not prefill)
  const [hasInventory, setHasInventory] = useState(false);
  const [hasSkills, setHasSkills] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      try {
        if (user) {
          const [p2a, p2b, p5] = await Promise.all([
            supabase.from("phase_2a_inventory").select("data").eq("user_id", user.id).maybeSingle(),
            supabase.from("phase_2b_skills").select("data").eq("user_id", user.id).maybeSingle(),
            supabase.from("phase_5_action_plan").select("data").eq("user_id", user.id).maybeSingle(),
          ]);
          const a = (p2a.data?.data ?? {}) as Record<string, string>;
          const b = (p2b.data?.data ?? {}) as { selected?: string[] };
          setHasInventory(Object.values(a).some((v) => (v ?? "").trim().length > 0));
          setHasSkills((b.selected ?? []).length > 0);
          const saved = (p5.data?.data ?? {}) as FormState;
          setForm({ ...buildEmptyForm(), ...saved });
        } else {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) setForm({ ...buildEmptyForm(), ...JSON.parse(raw) });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setHydrated(true);
      }
    })();
  }, [user, authLoading]);

  const aksi30Required = useMemo(
    () =>
      R.form.gerak
        .flatMap((g) => g.fields)
        .find((f) => (f as { key: string }).key === "aksi30"),
    [],
  );

  function update(key: string, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    if (!(form.aksi30 ?? "").trim()) {
      toast.error("Lengkapi dulu Rencana Aksi 30 Harimu");
      return;
    }
    setSaving(true);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(form));
      if (user) {
        const { error } = await supabase
          .from("phase_5_action_plan")
          .upsert(
            { user_id: user.id, data: form, updated_at: new Date().toISOString() },
            { onConflict: "user_id" },
          );
        if (error) throw error;
      }
      toast.success(R.ui.savedToast);
    } catch (e) {
      console.error(e);
      toast.error(R.ui.errorToast);
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

  const H = R.rumus.hilman;

  return (
    <main className="container mx-auto px-6 py-12 max-w-2xl">
      <h1 className="font-heading text-2xl font-bold text-foreground">{R.ui.pageTitle}</h1>

      <Separator className="my-8" />

      {/* ── PEMBUKA ── */}
      <section className="space-y-4">
        <SectionHeader title={R.ui.pembukaSectionTitle} />
        {R.pembuka.teks.split("\n\n").map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground/90">
            {p}
          </p>
        ))}
        <AyatBlock
          arab={R.pembuka.ayatArab}
          terjemah={R.pembuka.ayatTerjemah}
          rujukan={R.pembuka.ayatRujukan}
        />
        {R.pembuka.penutupTeks.split("\n\n").map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground/90">
            {p}
          </p>
        ))}
      </section>

      <Separator className="my-10" />

      {/* ── RUMUS ── */}
      <section className="space-y-4">
        <SectionHeader title={R.ui.rumusSectionTitle} />
        {R.rumus.pengantar.split("\n\n").map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground/90">
            {p}
          </p>
        ))}
        <AyatBlock
          arab={R.rumus.ayatArab}
          terjemah={R.rumus.ayatTerjemah}
          rujukan={R.rumus.ayatRujukan}
        />
        <div className="rounded-xl border border-border bg-secondary/40 px-5 py-4">
          <p className="text-base italic text-foreground/90 leading-relaxed">{R.rumus.tafsir}</p>
        </div>
        {R.rumus.portfolioFraming.map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground/90">
            {p}
          </p>
        ))}

        {/* Aside: Ust. Hilman */}
        <div className="rounded-xl border border-border bg-secondary/30 px-5 py-5 space-y-3 text-sm">
          <p className="text-foreground/90 leading-relaxed">{H.teks}</p>
          <p dir="rtl" lang="ar" className="text-xl leading-loose text-foreground text-right">
            {H.dalil1Arab}
          </p>
          <p className="italic text-foreground/90 leading-relaxed">{H.dalil1Terjemah}</p>
          <p className="text-foreground/90 leading-relaxed">{H.jembatan}</p>
          <p dir="rtl" lang="ar" className="text-xl leading-loose text-foreground text-right">
            {H.dalil2Arab}
          </p>
          <p className="italic text-foreground/90 leading-relaxed">{H.dalil2Terjemah}</p>
        </div>

        {/* Refleksi */}
        <div className="space-y-2 pt-2">
          <p className="text-base text-foreground/90 leading-relaxed">{R.rumus.refleksiPrompt}</p>
          <p className="text-sm text-muted-foreground">{R.rumus.refleksiHint}</p>
          <Textarea
            value={form.portfolioMoment}
            onChange={(e) => update("portfolioMoment", e.target.value)}
            placeholder="Tulis sebebasnya..."
            className="min-h-[120px]"
          />
        </div>
      </section>

      <Separator className="my-10" />

      {/* ── FORM ── */}
      <section className="space-y-6">
        <SectionHeader title={R.ui.formSectionTitle} />
        <p className="text-base leading-relaxed text-foreground/90">{R.form.pengantar}</p>

        {R.form.gerak.map((g, gi) => (
          <div key={gi} className="space-y-5 pt-2">
            <h3 className="font-heading text-base font-semibold text-foreground">{g.title}</h3>
            {g.fields.map((f) => {
              const fd = f as {
                key: string;
                label: string;
                prompt: string;
                hint?: string;
                framing?: string;
                keystone?: boolean;
                required?: boolean;
              };
              const showCue =
                (fd.key === "kesesuaian" || fd.key === "kembangkan") &&
                ((fd.key === "kesesuaian" && hasInventory) ||
                  (fd.key === "kembangkan" && hasSkills));
              return (
                <div
                  key={fd.key}
                  className={
                    fd.keystone
                      ? "space-y-2 rounded-xl border-2 border-[hsl(var(--torch-gold))] bg-secondary/40 p-4"
                      : "space-y-2"
                  }
                >
                  <label className="block">
                    <span className="font-medium text-foreground">
                      {fd.label}
                      {fd.required && (
                        <span className="ml-1 text-[hsl(var(--torch-gold))]">*</span>
                      )}
                    </span>
                    {fd.hint && (
                      <span className="block text-xs text-muted-foreground mt-0.5">{fd.hint}</span>
                    )}
                  </label>
                  <p className="text-sm text-muted-foreground">{fd.prompt}</p>
                  {showCue && (
                    <p className="text-xs italic text-muted-foreground">
                      Kamu sudah mengenali bekal & keterampilanmu di tahap sebelumnya.
                    </p>
                  )}
                  {fd.framing && (
                    <p className="text-sm italic text-muted-foreground">{fd.framing}</p>
                  )}
                  <Textarea
                    value={form[fd.key] ?? ""}
                    onChange={(e) => update(fd.key, e.target.value)}
                    placeholder="Tulis sebebasnya..."
                    className="min-h-[100px]"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </section>

      <Separator className="my-10" />

      {/* ── DOA ── */}
      <section className="space-y-4">
        <SectionHeader title={R.ui.doaSectionTitle} />
        <p className="text-base leading-relaxed text-foreground/90">{R.doa.pengantar}</p>
        <AyatBlock
          arab={R.doa.ayatArab}
          terjemah={R.doa.ayatTerjemah}
          rujukan={R.doa.ayatRujukan}
        />
        <p className="text-base leading-relaxed text-foreground/90">{R.doa.setelah}</p>
        <div className="rounded-xl border border-border bg-secondary/40 px-5 py-4">
          <p className="text-base text-foreground/90 leading-relaxed">{R.doa.istianah}</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">💡 {R.doa.khidmahNudge}</p>
      </section>

      {/* ── SAVE ── */}
      <div className="flex flex-col items-center gap-3 pt-8 pb-4">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {R.ui.saveLabel}
        </Button>
      </div>

      {/* ── CTA MAJU (placeholder) ── */}
      <div className="flex flex-col items-center gap-2 pb-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button variant="outline" size="lg" disabled>
                {R.ui.nextCtaLabel}
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{R.ui.nextCtaTooltip}</TooltipContent>
        </Tooltip>
      </div>
    </main>
  );
}
