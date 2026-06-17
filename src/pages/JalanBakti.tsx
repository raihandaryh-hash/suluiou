import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProvince } from "@/hooks/useProvince";
import { api } from "@/services/api";
import { jalanBaktiContent as C } from "@/data/jalanBaktiContent";
import { SuluCompanion } from "@/components/sulu/SuluCompanion";

type ProvinceContext = {
  economic_sectors: string[];
  opportunities_2030: string | null;
  narrative_hooks: string[];
};

const LS_KEY = "jalan_bakti_v1";

type JBData = {
  sdgTags: string[];
  subPicks: string[];
  peduliPicks: string[];
  refleksi: string;
};

const EMPTY: JBData = { sdgTags: [], subPicks: [], peduliPicks: [], refleksi: "" };

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

function Touchpoint({ ayat, rujukan, framing }: { ayat: string; rujukan: string; framing: string }) {
  return (
    <div className="border-l-4 border-[hsl(var(--torch-gold))] bg-secondary/40 px-4 py-3 italic text-foreground/90">
      <p>{ayat}</p>
      <p className="not-italic text-xs text-muted-foreground mt-1">{rujukan}</p>
      <p className="not-italic text-sm text-muted-foreground mt-2">{framing}</p>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors text-left",
        active
          ? "border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]/10 text-foreground font-medium"
          : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40",
      )}
    >
      {children}
    </button>
  );
}

export default function JalanBakti() {
  const { user, loading: authLoading } = useAuth();
  const province = useProvince();
  const navigate = useNavigate();
  const [d, setD] = useState<JBData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [provinceCtx, setProvinceCtx] = useState<ProvinceContext | null>(null);

  useEffect(() => {
    let active = true;
    if (!province) {
      setProvinceCtx(null);
      return;
    }
    api.getProvinceContext(province).then((ctx) => {
      if (active) setProvinceCtx(ctx);
    });
    return () => {
      active = false;
    };
  }, [province]);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      try {
        if (user) {
          const { data } = await supabase
            .from("phase_3_jalan_bakti")
            .select("data")
            .eq("user_id", user.id)
            .maybeSingle();
          if (data?.data) {
            const merged = { ...EMPTY, ...(data.data as JBData) };
            setD(merged);
            // Mirror to localStorage so compileSurat() can read it.
            localStorage.setItem(LS_KEY, JSON.stringify(merged));
          }
        } else {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) setD({ ...EMPTY, ...JSON.parse(raw) });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setHydrated(true);
      }
    })();
  }, [user, authLoading]);

  function toggleSdg(id: string) {
    setD((p) => ({
      ...p,
      sdgTags: p.sdgTags.includes(id) ? p.sdgTags.filter((x) => x !== id) : [...p.sdgTags, id],
    }));
  }

  function toggleSub(id: string) {
    setD((p) => ({
      ...p,
      subPicks: p.subPicks.includes(id) ? p.subPicks.filter((x) => x !== id) : [...p.subPicks, id],
    }));
  }

  function togglePeduli(id: string) {
    setD((p) => ({
      ...p,
      peduliPicks: p.peduliPicks.includes(id)
        ? p.peduliPicks.filter((x) => x !== id)
        : [...p.peduliPicks, id],
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(d));
      if (user) {
        const { error } = await supabase
          .from("phase_3_jalan_bakti")
          .upsert(
            { user_id: user.id, data: d, updated_at: new Date().toISOString() },
            { onConflict: "user_id" },
          );
        if (error) throw error;
      }
      toast.success(C.ui.savedToast);
    } catch (e) {
      console.error(e);
      toast.error(C.ui.errorToast);
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

  return (
    <main className="container mx-auto px-6 py-12 max-w-2xl">
      {/* ── OPENER ── */}
      <section className="space-y-4">
        <h1 className="font-heading text-2xl font-bold text-foreground">{C.ui.pageTitle}</h1>
        {C.opener.paragraphs.map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground/90">
            {p}
          </p>
        ))}
      </section>

      <Separator className="my-10" />

      {/* ── TP HUD 61 ── */}
      <Touchpoint
        ayat={C.tpHud61.ayat}
        rujukan={C.tpHud61.rujukan}
        framing={C.tpHud61.framing}
      />

      <Separator className="my-10" />

      {/* ── SDGs ── */}
      <section className="space-y-5">
        <SectionHeader title={C.ui.sdgSectionTitle} />
        <Touchpoint
          ayat={C.sdg.tpAyat}
          rujukan={C.sdg.tpRujukan}
          framing={C.sdg.tpFraming}
        />

        <div className="space-y-4">
          {C.sdg.sejarah.map((p, i) => (
            <p key={`sj-${i}`} className="text-base leading-relaxed text-foreground/90">{p}</p>
          ))}
        </div>
        <Separator className="my-2 opacity-60" />
        <div className="space-y-4">
          {C.sdg.urgensi.map((p, i) => (
            <p key={`ur-${i}`} className="text-base leading-relaxed text-foreground/90">{p}</p>
          ))}
        </div>
        <Separator className="my-2 opacity-60" />
        <div className="space-y-4">
          {C.sdg.agensi.map((p, i) => (
            <p key={`ag-${i}`} className="text-base leading-relaxed text-foreground/90">{p}</p>
          ))}
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="pasca-2030" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
              {C.sdg.pascaExpand.title}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground/85">
                {C.sdg.pascaExpand.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-foreground/90">{C.sdg.pascaExpand.closer}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <p className="text-sm text-muted-foreground pt-2">{C.sdg.chipPrompt}</p>
        <div className="flex flex-wrap gap-2">
          {C.sdg.items.map((s) => (
            <Chip key={s.id} active={d.sdgTags.includes(s.id)} onClick={() => toggleSdg(s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>

        <p className="text-base font-medium text-foreground/90 pt-4">{C.sdg.transisiIndonesia}</p>
      </section>

      <Separator className="my-10" />

      {/* ── GAMBARAN ARAH DAERAH ── */}
      {province && provinceCtx &&
        (provinceCtx.narrative_hooks.length > 0 ||
          provinceCtx.economic_sectors.length > 0 ||
          provinceCtx.opportunities_2030) && (
        <>
          <section className="space-y-5 rounded-xl border border-border bg-secondary/30 p-5">
            <SectionHeader title={`Gambaran arah daerahmu — ${province}`} />

            {provinceCtx.narrative_hooks.length > 0 && (
              <ul className="space-y-2 list-disc pl-5 text-base leading-relaxed text-foreground/90">
                {provinceCtx.narrative_hooks.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}

            {provinceCtx.economic_sectors.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {provinceCtx.economic_sectors.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/85"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {provinceCtx.opportunities_2030 && (
              <div className="rounded-lg border border-[hsl(var(--torch-gold))]/40 bg-[hsl(var(--torch-gold))]/5 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Arah yang sedang tumbuh
                </p>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {provinceCtx.opportunities_2030}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground italic">
              Ini gambaran umum sebagai titik awal, bukan data resmi atau vonis.
            </p>
          </section>

          <Separator className="my-10" />
        </>
      )}


      {/* ── 6 KLASTER ── */}
      <section className="space-y-6">
        <SectionHeader title={C.ui.klasterSectionTitle} subtitle={C.klasterIntro} />
        <div className="space-y-8">
          {C.klaster.map((k) => (
            <div key={k.id} className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="font-heading text-lg font-semibold text-foreground">{k.nama}</h3>
              <p className="text-sm leading-relaxed text-foreground/85">{k.bridge}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {k.subTantangan.map((s) => {
                  const active = d.subPicks.includes(s.id);
                  return (
                    <div key={s.id} className="w-full">
                      <Chip active={active} onClick={() => toggleSub(s.id)}>
                        {s.label}
                      </Chip>
                      {active && "detail" in s && s.detail && (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground border-l-2 border-border pl-3">
                          {s.detail}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      {/* ── LENSA KEPEDULIAN ── */}
      {(() => {
        const L = C.lensaKepedulian;
        return (
          <section className="space-y-5">
            <SectionHeader title={C.ui.lensaSectionTitle} />
            <p className="text-base leading-relaxed text-foreground/90">{L.pivot}</p>

            <Touchpoint ayat={L.hadith.teks} rujukan={L.hadith.rujukan} framing={L.hadith.framing} />

            <p className="text-base font-medium text-foreground/90 pt-2">{L.elicitation}</p>

            {/* Tier 1: Ashnaf */}
            <p className="text-sm text-muted-foreground">{L.tier1Title}</p>
            <div className="flex flex-wrap gap-2">
              {L.tier1Items.map((s) => {
                const active = d.peduliPicks.includes(s.id);
                return (
                  <Chip key={s.id} active={active} onClick={() => togglePeduli(s.id)}>
                    <span className="font-medium">{s.label}</span>
                    <span className="ml-1.5 text-xs text-muted-foreground">— {s.desc}</span>
                  </Chip>
                );
              })}
            </div>

            {/* Tier 2: PPKS */}
            <p className="text-sm text-foreground/85 leading-relaxed pt-2">{L.tier2Intro}</p>
            <div className="flex flex-wrap gap-2">
              {L.tier2Wajah.map((s) => {
                const active = d.peduliPicks.includes(s.id);
                return (
                  <Chip key={s.id} active={active} onClick={() => togglePeduli(s.id)}>
                    {s.label}
                  </Chip>
                );
              })}
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ppks-26" className="border border-border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                  {L.tier2ExpandTitle}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                    {L.tier2Kategori.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <p className="text-sm text-muted-foreground pt-2">{L.routeback}</p>
            <p className="text-base leading-relaxed text-foreground/90 pt-2">{L.penutup}</p>
          </section>
        );
      })()}

      <Separator className="my-10" />

      {/* ── CLOSING ── */}
      <section className="space-y-4">
        <SectionHeader title={C.ui.closingSectionTitle} />
        <p className="text-base leading-relaxed text-foreground/90">{C.closing.intro}</p>

        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <p className="text-sm font-medium text-foreground/80">{C.closing.scaffoldTitle}</p>
          <ul className="space-y-2.5">
            {C.closing.scaffold.map((s, i) => (
              <li key={i} className="leading-relaxed">
                <span className="font-medium text-foreground">{s.q}</span>
                <span className="text-sm text-muted-foreground"> — {s.cue}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-base text-foreground/90 pt-2">{C.closing.prompt}</p>
        <Textarea
          value={d.refleksi}
          onChange={(e) => setD((p) => ({ ...p, refleksi: e.target.value }))}
          placeholder={C.closing.placeholder}
          className="min-h-[140px]"
        />
      </section>


      {/* ── SAVE ── */}
      <div className="flex flex-col items-center gap-3 pt-8 pb-12">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {C.ui.saveLabel}
        </Button>
        <Button variant="outline" size="lg" onClick={() => navigate("/sintesis")}>
          Lanjut: Satukan Semuanya →
        </Button>
      </div>
      <SuluCompanion />
    </main>
  );
}
