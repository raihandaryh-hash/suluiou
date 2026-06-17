import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { kenaliDirimuContent as C, type Prompt } from "@/data/kenaliDirimuContent";

const LS_KEY = "sulu_phase2a";

type Answers = Record<string, string>;

// ─── Reusable components ──────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

// Pembagi kelompok (kicker + heading + garis pengantar)
function GroupHeading({ kicker, heading, line }: { kicker: string; heading: string; line: string }) {
  return (
    <div className="mt-12 mb-6">
      <p className="text-xs font-medium tracking-[0.2em] uppercase text-[hsl(var(--torch-gold))]">{kicker}</p>
      <h2 className="mt-1 font-heading text-2xl font-bold text-foreground">{heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{line}</p>
    </div>
  );
}

function JournalingPrompt({
  question,
  starter,
  value,
  onChange,
  minH = "min-h-[100px]",
}: {
  question: string;
  starter?: string;
  value: string;
  onChange: (v: string) => void;
  minH?: string;
}) {
  return (
    <div>
      <p className="text-base text-foreground leading-relaxed">{question}</p>
      {starter && <p className="text-sm text-muted-foreground italic mt-1">{starter}</p>}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tuliskan di sini ..."
        className={`mt-2 ${minH}`}
      />
    </div>
  );
}

// ─── Prompt registry (id → label for share summary) ──────────────
const PROMPT_LABELS: Record<string, string> = {
  d1_q1: "Fondasi Keimanan — Ayat/doa yang menenangkan",
  d1_q2: "Fondasi Keimanan — Nilai Islam yang membimbing",
  d1_q3: "Fondasi Keimanan — Rutinitas amal",
  d2_q1: "Karakter — Momen 'ini saya banget'",
  d2_q2: "Karakter — Yang orang lain perhatikan",
  d2_q3: "Karakter — Peran yang cocok",
  d3_q1: "Modal Relasional — Komentar positif",
  d3_q2: "Modal Relasional — Penyadaran baru",
  d3_q3: "Modal Relasional — Manfaat ke komunitas",
  d4_q1: "Adaptabilitas — 5 tahun mendatang",
  d4_q2: "Adaptabilitas — Yang ingin dihindari",
  d4_q3: "Adaptabilitas — Sumber keyakinan",
  free_nikmat: "Nikmat lainnya",
  ach_q1: "Pengalaman & peran",
  ach_q2: "Memberi manfaat nyata",
  ach_q3: "Pengalaman sulit yang berbuah baik",
  abu_q1: "Yang paling jelas terlihat",
  ge_gap: "Yang masih ingin dikuatkan",
  ge_mitigasi: "Cara menumbuhkannya",
  final_free: "Catatan tambahan",
};

const DOMAIN_KEYS = {
  d1: ["d1_q1", "d1_q2", "d1_q3"],
  d2: ["d2_q1", "d2_q2", "d2_q3"],
  d3: ["d3_q1", "d3_q2", "d3_q3"],
  d4: ["d4_q1", "d4_q2", "d4_q3"],
};

export default function KenaliDirimu() {
  const { user, loading: authLoading } = useAuth();
  const [a, setA] = useState<Answers>({});
  const [showAchOpt, setShowAchOpt] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const set = (k: string) => (v: string) => setA((prev) => ({ ...prev, [k]: v }));

  // Hydrate
  useEffect(() => {
    if (authLoading) return;
    (async () => {
      try {
        if (user) {
          const { data } = await supabase
            .from("phase_2a_inventory")
            .select("data")
            .eq("user_id", user.id)
            .maybeSingle();
          if (data?.data) {
            setA(data.data as Answers);
            try { localStorage.setItem(LS_KEY, JSON.stringify(data.data)); } catch {}
          }
        } else {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) setA(JSON.parse(raw));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setHydrated(true);
      }
    })();
  }, [user, authLoading]);

  // Auto-show optional achievement if it has content
  useEffect(() => {
    if (a.ach_q3 && a.ach_q3.trim()) setShowAchOpt(true);
  }, [a.ach_q3]);

  const domainsDone = useMemo(() => {
    return (Object.values(DOMAIN_KEYS) as string[][]).filter((keys) =>
      keys.some((k) => (a[k] || "").trim().length > 0),
    ).length;
  }, [a]);

  async function handleSave() {
    setSaving(true);
    try {
      // Mirror ke localStorage untuk SEMUA user: Surat Perjalanan (compileSurat) berbasis localStorage.
      localStorage.setItem(LS_KEY, JSON.stringify(a));
      if (user) {
        const { error } = await supabase
          .from("phase_2a_inventory")
          .upsert(
            { user_id: user.id, data: a, updated_at: new Date().toISOString() },
            { onConflict: "user_id" },
          );
        if (error) throw error;
      }
      toast.success("Catatan tersimpan ✓");
    } catch (e) {
      console.error(e);
      toast.error("Gagal menyimpan, coba lagi");
    } finally {
      setSaving(false);
    }
  }

  function handleShareWA() {
    const lines: string[] = ["Hai, ini catatan refleksi diri saya dari platform Sulu IOU:", ""];
    Object.entries(PROMPT_LABELS).forEach(([k, label]) => {
      const v = (a[k] || "").trim();
      if (v) lines.push(`${label}:\n${v}\n`);
    });
    const summary = lines.join("\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, "_blank");
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
      {/* Sticky progress */}
      <div className="sticky top-12 z-20 -mx-6 mb-6 border-b border-border bg-background/85 px-6 py-2 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {domainsDone} {C.progressSuffix}
        </p>
      </div>

      {/* ── NARASI PEMBUKA SYUKUR ── */}
      <section className="prose-sm space-y-4">
        <p className="text-base leading-relaxed text-foreground/90">{C.pembuka.ayatLead}</p>
        <blockquote className="border-l-4 border-[hsl(var(--torch-gold))] bg-secondary/40 px-4 py-3 italic text-foreground/90">
          {C.pembuka.ayat}
          <span className="not-italic block mt-1 text-sm text-muted-foreground">{C.pembuka.ayatRef}</span>
        </blockquote>
        <p className="text-base leading-relaxed text-foreground/90">{C.pembuka.intro}</p>
        <h1 className="font-heading text-2xl font-bold text-foreground mt-8">{C.pembuka.h1}</h1>
        <p className="text-sm text-muted-foreground mt-2">{C.pembuka.h1sub}</p>
      </section>

      {/* ── UST. HILMAN TOUCHPOINT ── */}
      <div className="border-l-4 border-[hsl(var(--torch-gold))] bg-secondary/40 px-4 py-3 mt-6 italic text-foreground/90">
        {C.hilman}
      </div>

      {/* ── INTI: 4 DOMAIN ── */}
      <GroupHeading {...C.domainsGroup} />
      {C.domains.map((d) => (
        <section key={d.id} className="rounded-xl border border-border bg-card p-6 mb-6">
          <SectionHeader title={d.title} subtitle={d.subtitle} />
          <div className="space-y-6">
            {d.prompts.map((p) => (
              <JournalingPrompt
                key={p.id}
                question={p.question}
                starter={p.starter}
                minH={p.minH}
                value={a[p.id] || ""}
                onChange={set(p.id)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* ── PELENGKAP DIRI ── */}
      <GroupHeading {...C.pelengkapGroup} />

      {/* Nikmat lainnya */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground">{C.nikmatLain.label}</label>
        <p className="text-sm text-muted-foreground mb-2">{C.nikmatLain.helper}</p>
        <Textarea
          value={a[C.nikmatLain.id] || ""}
          onChange={(e) => set(C.nikmatLain.id)(e.target.value)}
          placeholder={C.nikmatLain.placeholder}
          className="min-h-[80px]"
        />
      </div>

      {/* Achievement Log */}
      <section className="rounded-xl border border-border bg-card p-6 mb-6">
        <SectionHeader title={C.achievement.title} subtitle={C.achievement.subtitle} />
        <div className="space-y-6">
          {C.achievement.prompts.map((p) => (
            <JournalingPrompt
              key={p.id}
              question={p.question}
              starter={p.starter}
              minH={p.minH}
              value={a[p.id] || ""}
              onChange={set(p.id)}
            />
          ))}
          {!showAchOpt ? (
            <button
              type="button"
              onClick={() => setShowAchOpt(true)}
              className="text-sm text-[hsl(var(--torch-gold))] underline-offset-4 hover:underline"
            >
              {C.achievement.optional.toggleLabel}
            </button>
          ) : (
            <JournalingPrompt
              question={C.achievement.optional.prompt.question}
              starter={C.achievement.optional.prompt.starter}
              value={a[C.achievement.optional.prompt.id] || ""}
              onChange={set(C.achievement.optional.prompt.id)}
            />
          )}
        </div>
      </section>

      {/* ── CERMIN DARI LUAR ── */}
      <GroupHeading {...C.cerminGroup} />

      {/* Zaid bin Tsabit */}
      <section className="rounded-2xl bg-secondary/60 p-6 mb-6">
        <p className="text-base leading-relaxed text-foreground/90">
          {C.zaid.body} <em>{C.zaid.ask}</em>
        </p>
        <Button variant="outline" className="mt-4" onClick={handleShareWA}>
          <Share2 className="mr-2 h-4 w-4" />
          {C.zaid.shareLabel}
        </Button>
      </section>

      {/* Abu Mahdzurah */}
      <section className="rounded-xl border border-border bg-card p-6 mb-6">
        <SectionHeader title={C.abu.title} />
        <JournalingPrompt
          question={C.abu.prompt.question}
          starter={C.abu.prompt.starter}
          value={a[C.abu.prompt.id] || ""}
          onChange={set(C.abu.prompt.id)}
        />
      </section>

      {/* Free text final */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground">{C.finalFree.label}</label>
        <p className="text-sm text-muted-foreground mb-2">{C.finalFree.helper}</p>
        <Textarea
          value={a[C.finalFree.id] || ""}
          onChange={(e) => set(C.finalFree.id)(e.target.value)}
          placeholder={C.finalFree.placeholder}
          className="min-h-[100px]"
        />
      </div>

      {/* ── GROWTH EDGE (beat baru) ── */}
      <Separator className="my-10" />
      <section className="rounded-xl border border-border bg-card p-6 mb-6">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[hsl(var(--torch-gold))]">{C.growthEdge.kicker}</p>
        <h2 className="mt-1 mb-3 font-heading text-xl font-semibold text-foreground">{C.growthEdge.heading}</h2>
        <p className="text-base leading-relaxed text-foreground/90 mb-6">{C.growthEdge.intro}</p>
        <div className="space-y-6">
          <div>
            <JournalingPrompt
              question={C.growthEdge.gap.label}
              starter={C.growthEdge.gap.starter}
              value={a[C.growthEdge.gap.id] || ""}
              onChange={set(C.growthEdge.gap.id)}
            />
            <p className="mt-1 text-xs text-muted-foreground italic">{C.growthEdge.gap.helper}</p>
          </div>
          <JournalingPrompt
            question={C.growthEdge.mitigasi.label}
            starter={C.growthEdge.mitigasi.starter}
            value={a[C.growthEdge.mitigasi.id] || ""}
            onChange={set(C.growthEdge.mitigasi.id)}
          />
        </div>
        <p className="mt-6 text-sm leading-relaxed text-foreground/80">{C.growthEdge.closing}</p>
      </section>

      <Separator className="my-10" />

      {/* ── PENUTUP SYUKUR (dalil verbatim, inline) ── */}
      <section className="rounded-xl bg-secondary/40 p-6 mb-10 space-y-4 text-foreground/90 leading-relaxed text-justify">
        <p>Semua yang baru saja kamu kenali adalah amanah, dan modal gerakmu.</p>
        <p>
          Nikmat Allah bukan untuk disimpan, tapi untuk dipergunakan di jalan-Nya. Ibnul Qayyim
          menjelaskan, bahwa hakikat syukur adalah{" "}
          <em>"Mengucap pujian atas nikmat yang diterima, mencintainya, dan memanfaatkannya di jalan ketaatan."</em>{" "}
          (Thariqul Hijratain, 508)
        </p>
        <p>
          Inilah yang dimaksud dengan syukur di ayat{" "}
          <em>"Sesungguhnya jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu..."</em>{" "}
          (QS Ibrahim: 7)
        </p>
        <p>
          Bukan sekadar mengucap alhamdulillah, tapi memanfaatkannya untuk beramal saleh, untuk
          memberi manfaat pada agama dan sesama.
        </p>
        <p>Sebagian kita mungkin tak punya harta, tapi punya tenaga; manfaatkanlah!</p>
        <p>Atau, tak punya kecerdasan, tapi kuat dalam kegigihan; gunakanlah di jalan Allah!</p>
        <p>
          Niscaya, Ia akan menjaga segala yang telah kau miliki, dan menambahkan apa yang belum kau
          kuasai.
        </p>
      </section>

      {/* ── SAVE + CTA ── */}
      <div className="flex flex-col gap-4">
        <Button variant="secondary" onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {C.save.saving}
            </>
          ) : (
            C.save.button
          )}
        </Button>

        <p className="text-base text-foreground/90 leading-relaxed mt-4">{C.save.ctaBody}</p>
        <Button
          asChild
          className="w-full sm:w-auto bg-[hsl(var(--torch-gold))] text-[hsl(var(--ink-deep))] hover:bg-[hsl(var(--torch-gold))]/90"
        >
          <Link to="/kenali-dirimu/skill">{C.save.ctaLabel}</Link>
        </Button>
      </div>
    </main>
  );
}
