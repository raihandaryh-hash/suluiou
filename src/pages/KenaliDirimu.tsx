import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useKenaliDirimuSession, OdysseyPlan, PossibleSelves } from "@/hooks/useKenaliDirimuSession";
import ValuesCardSort from "@/components/kenali/ValuesCardSort";

type Step = 0 | 1 | 2 | 3 | 4;

const LANE_META: Record<"A" | "B" | "C", { desc: string; tone: string }> = {
  A: { desc: "Yang sudah kamu bayangkan", tone: "bg-[hsl(var(--brand-navy))] text-white" },
  B: { desc: "Jika Lintasan A tidak ada atau tidak mungkin", tone: "bg-[hsl(var(--mid-blue))] text-white" },
  C: { desc: "Yang sebenarnya ingin kamu coba — yang mungkin belum pernah kamu ucapkan", tone: "bg-[hsl(var(--torch-gold))] text-[hsl(var(--ink-deep))]" },
};

export default function KenaliDirimu() {
  const { sessionId, session, loading, upsert } = useKenaliDirimuSession();
  const [step, setStep] = useState<Step>(0);

  // values
  const [valuesSorted, setValuesSorted] = useState<string[]>([]);
  const [savedTick, setSavedTick] = useState(false);
  const [waNumber, setWaNumber] = useState("");

  // possible selves
  const [ps, setPs] = useState<PossibleSelves>({});
  const [psSubStep, setPsSubStep] = useState<0 | 1 | 2>(0);

  // odyssey
  const [plans, setPlans] = useState<OdysseyPlan[]>([]);
  const [planSubStep, setPlanSubStep] = useState<0 | 1 | 2>(0);
  const [draftJudul, setDraftJudul] = useState("");
  const [draftGambaran, setDraftGambaran] = useState("");

  // result
  const [narrative, setNarrative] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string>("");

  // Hydrate from session
  useEffect(() => {
    if (!session) return;
    if (session.values_sorted) setValuesSorted(session.values_sorted);
    if (session.possible_selves) setPs(session.possible_selves);
    if (session.odyssey_plans) setPlans(session.odyssey_plans);
    if (session.wa_number) setWaNumber(session.wa_number);
    if (session.ai_narrative) setNarrative(session.ai_narrative);
  }, [session]);

  const hasIncomplete = !!session && !session.completed && (session.values_sorted?.length ?? 0) > 0;

  async function saveValues(sorted: string[]) {
    setValuesSorted(sorted);
    try { localStorage.setItem("kd_values", JSON.stringify(sorted)); } catch {}
    await upsert({ values_sorted: sorted });
    setSavedTick(true);
    window.setTimeout(() => setSavedTick(false), 1800);
  }

  async function savePs(next: PossibleSelves) {
    setPs(next);
    try { localStorage.setItem("kd_ps", JSON.stringify(next)); } catch {}
    await upsert({ possible_selves: next });
  }

  async function savePlans(next: OdysseyPlan[]) {
    setPlans(next);
    try { localStorage.setItem("kd_plans", JSON.stringify(next)); } catch {}
    await upsert({ odyssey_plans: next });
  }

  async function saveWa() {
    if (!waNumber.trim()) return;
    await upsert({ wa_number: waNumber.trim() });
  }

  async function generateReflection(finalPlans: OdysseyPlan[]) {
    setGenerating(true);
    setGenError("");
    try {
      const { data, error } = await supabase.functions.invoke("generate-reflection", {
        body: {
          session_id: sessionId,
          values_top3: valuesSorted.slice(0, 3),
          possible_selves: ps,
          odyssey_plans: finalPlans,
        },
      });
      if (error) throw error;
      const text = (data as any)?.narrative as string | undefined;
      if (text) {
        setNarrative(text);
      } else {
        setNarrative("Refleksimu sudah tersimpan. Untuk melihat ringkasan, coba muat ulang halaman ini.");
      }
    } catch (e: any) {
      console.error(e);
      setGenError("Gagal menyusun ringkasan. Refleksimu sudah tersimpan — coba muat ulang halaman.");
      setNarrative("Refleksimu sudah tersimpan. Untuk melihat ringkasan, coba muat ulang halaman ini.");
    } finally {
      setGenerating(false);
    }
  }

  const progressLabel = useMemo(() => {
    if (step === 1) return "Latihan 1 dari 3";
    if (step === 2) return "Latihan 2 dari 3";
    if (step === 3) return "Latihan 3 dari 3";
    return "";
  }, [step]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      {progressLabel && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {progressLabel}
        </p>
      )}

      {step === 0 && (
        <section>
          <h1 className="font-[Outfit] text-3xl font-bold text-[hsl(var(--ink-deep))] md:text-4xl">
            Kenali Dirimu
          </h1>
          <p className="mt-2 text-lg text-[hsl(var(--mid-blue))]">
            Tiga latihan refleksi. Tidak ada jawaban benar atau salah.
          </p>
          <p className="mt-6 text-base leading-relaxed text-foreground/80">
            Kamu akan diminta mengurutkan nilai-nilai hidupmu, menggambarkan dirimu di masa
            depan, dan membayangkan tiga lintasan hidup yang mungkin. Setiap jawabanmu tersimpan
            otomatis. Kamu bisa kembali melanjutkan kapan saja.
          </p>
          <div className="mt-6">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">± 15 menit</Badge>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => setStep(1)}>Mulai Refleksi</Button>
            {hasIncomplete && (
              <Button size="lg" variant="outline" onClick={() => {
                if (session?.odyssey_plans?.length) setStep(3);
                else if (session?.possible_selves) setStep(2);
                else setStep(1);
              }}>
                Lanjutkan dari terakhir
              </Button>
            )}
          </div>
          {hasIncomplete && (
            <p className="mt-3 text-sm text-muted-foreground">Lanjutkan refleksimu — kami menyimpan progresmu.</p>
          )}
        </section>
      )}

      {step === 1 && (
        <section>
          <h2 className="font-[Outfit] text-2xl font-bold text-[hsl(var(--ink-deep))] md:text-3xl">
            Apa yang paling penting bagimu?
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Urutkan kartu-kartu ini dari yang paling bermakna (atas) ke yang kurang bermakna (bawah).
          </p>
          <div className="mt-6">
            <ValuesCardSort initial={valuesSorted.length ? valuesSorted : null} onChange={saveValues} />
          </div>
          <div className="mt-3 h-5 text-right text-xs text-muted-foreground">
            {savedTick && <span className="inline-flex items-center gap-1"><Check size={12} /> Tersimpan</span>}
          </div>

          <div className="mt-8 rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-foreground/80">Mau diingatkan untuk melanjutkan?</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <Input
                inputMode="tel"
                placeholder="0812xxxx"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={saveWa}>Ingatkan saya via WA</Button>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={() => setStep(2)} disabled={valuesSorted.length === 0}>
              Lanjut ke Latihan 2 →
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <h2 className="font-[Outfit] text-2xl font-bold text-[hsl(var(--ink-deep))] md:text-3xl">
            Dirimu di 2030
          </h2>
          <p className="mt-2 text-base text-muted-foreground">Tulis dengan jujur. Tidak ada yang menilai.</p>

          {psSubStep === 0 && (
            <PsBlock
              label="Diri yang kuharapkan"
              placeholder="Diri yang kuharapkan di 2030: aku ingin menjadi..."
              helper="Tulis sebebas mungkin — impian, peran, kontribusi, cara hidupmu."
              value={ps.harapan || ""}
              onChange={(v) => setPs({ ...ps, harapan: v })}
              onNext={async () => { await savePs({ ...ps }); setPsSubStep(1); }}
            />
          )}
          {psSubStep === 1 && (
            <PsBlock
              label="Diri yang kukhawatirkan"
              placeholder="Diri yang kukhawatirkan di 2030: aku takut menjadi..."
              helper="Mengenali ketakutan bukan kelemahan — ini cara kita waspada."
              value={ps.kekhawatiran || ""}
              onChange={(v) => setPs({ ...ps, kekhawatiran: v })}
              onNext={async () => { await savePs({ ...ps }); setPsSubStep(2); }}
            />
          )}
          {psSubStep === 2 && (
            <PsBlock
              label="Diri yang kuharap-bisa"
              placeholder="Diri yang kuharap-bisa di 2030: seandainya aku bisa..."
              helper="Tuliskan yang selama ini belum pernah kamu ucapkan ke siapapun."
              value={ps.harap_bisa || ""}
              onChange={(v) => setPs({ ...ps, harap_bisa: v })}
              onNext={async () => { await savePs({ ...ps }); setStep(3); }}
              nextLabel="Lanjut ke Latihan 3 →"
            />
          )}
        </section>
      )}

      {step === 3 && (
        <section>
          <h2 className="font-[Outfit] text-2xl font-bold text-[hsl(var(--ink-deep))] md:text-3xl">
            Tiga Lintasan Hidupmu
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Bayangkan 3 lintasan hidup 5 tahun ke depan yang masuk akal bagimu.
          </p>

          {(["A", "B", "C"] as const).map((lane, idx) => {
            if (planSubStep !== idx) return null;
            const meta = LANE_META[lane];
            return (
              <div key={lane} className="mt-6">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${meta.tone}`}>
                    Lintasan {lane}
                  </span>
                  <span className="text-sm text-muted-foreground">{meta.desc}</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <Label htmlFor={`judul-${lane}`}>Judul</Label>
                    <Input
                      id={`judul-${lane}`}
                      placeholder="Satu kalimat yang menggambarkan lintasan ini"
                      value={draftJudul}
                      onChange={(e) => setDraftJudul(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`gambaran-${lane}`}>Gambaran</Label>
                    <Textarea
                      id={`gambaran-${lane}`}
                      placeholder="Ceritakan dalam 3-5 kalimat: kamu ada di mana, ngapain, hidup seperti apa"
                      value={draftGambaran}
                      onChange={(e) => setDraftGambaran(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    disabled={!draftJudul.trim() || !draftGambaran.trim()}
                    onClick={async () => {
                      const next: OdysseyPlan[] = [
                        ...plans.filter((p) => p.lintasan !== lane),
                        { lintasan: lane, judul: draftJudul.trim(), gambaran: draftGambaran.trim() },
                      ].sort((a, b) => a.lintasan.localeCompare(b.lintasan));
                      await savePlans(next);
                      setDraftJudul("");
                      setDraftGambaran("");
                      if (lane === "C") {
                        setStep(4);
                        generateReflection(next);
                      } else {
                        setPlanSubStep((idx + 1) as 0 | 1 | 2);
                      }
                    }}
                  >
                    {lane === "C" ? "Lihat Ringkasan Refleksiku →" : `Simpan Lintasan ${lane} →`}
                  </Button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {step === 4 && (
        <section>
          {generating ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Loader2 className="h-7 w-7 animate-spin text-[hsl(var(--brand-navy))]" />
              <p className="text-base text-foreground/80">Menyusun refleksimu...</p>
            </div>
          ) : (
            <>
              <h2 className="font-[Outfit] text-2xl font-bold text-[hsl(var(--ink-deep))] md:text-3xl">
                Refleksimu
              </h2>
              <p className="mt-2 text-base text-muted-foreground">
                Ini bukan penilaian — ini rangkuman dari apa yang kamu tuliskan sendiri.
              </p>
              {genError && <p className="mt-3 text-sm text-destructive">{genError}</p>}
              <article className="mt-6 whitespace-pre-wrap rounded-lg border border-border bg-card p-5 text-base leading-relaxed text-foreground/90">
                {narrative}
              </article>

              <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nilai teratas yang kamu pilih:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {valuesSorted.slice(0, 3).map((v) => (
                    <Badge key={v} variant="secondary" className="rounded-full px-3 py-1">{v}</Badge>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-xs italic text-muted-foreground">
                Teks di atas dihasilkan dari jawabanmu sendiri, bukan dari tes psikologi. Ini adalah
                titik awal refleksi, bukan kesimpulan tentang kepribadianmu.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/ringkasan">Buat ringkasan untuk orang tua →</Link>
                </Button>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button asChild variant="outline">
                    <Link to="/compass">Kembali ke Sulu</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      await upsert({ completed: true });
                    }}
                  >
                    Simpan & lanjutkan nanti
                  </Button>
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}

interface PsBlockProps {
  label: string;
  placeholder: string;
  helper: string;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void | Promise<void>;
  nextLabel?: string;
}

function PsBlock({ label, placeholder, helper, value, onChange, onNext, nextLabel = "Lanjut →" }: PsBlockProps) {
  const minChars = 100;
  const ok = value.trim().length >= minChars;
  return (
    <div className="mt-6">
      <Label className="text-base font-semibold text-[hsl(var(--ink-deep))]">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-[120px]"
      />
      <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
      <div className="mt-1 text-right text-xs text-muted-foreground">
        {value.trim().length}/{minChars}
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={() => onNext()} disabled={!ok}>{nextLabel}</Button>
      </div>
    </div>
  );
}
