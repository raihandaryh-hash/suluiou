import { useEffect, useState } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import BroadenRoles from "@/components/BroadenRoles";
import DesainLangkah from "@/components/DesainLangkah";
import KartuDaerah from "@/components/KartuDaerah";
import { KARTU_DAERAH_TERBUKA } from "@/data/flags";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProvince } from "@/hooks/useProvince";
import { api } from "@/services/api";
import { jalanBaktiContent as C } from "@/data/jalanBaktiContent";
import JalanBaktiOpening from "@/components/JalanBaktiOpening";
import { SuluCompanion } from "@/components/sulu/SuluCompanion";
import { keselamatanContent } from "@/data/keselamatanContent";
import { bacaFase, simpanFase } from "@/lib/perangkat";
import { ambilAdopsiJalanBakti } from "@/lib/claimGuestResult";

type ProvinceContext = {
  economic_sectors: string[];
  opportunities_2030: string | null;
  narrative_hooks: string[];
  fardhu_kifayah_gaps: string[];
  iou_program_relevance: string | null;
  key_questions: string[];
  data_verified: boolean;
  data_year: number | null;
};

const LS_KEY = "jalan_bakti_v1";

type JBData = {
  medan: string | null;
  /** Medan tambahan (KEPUTUSAN 18 Nov 15.47 "masa cuma satu? Foreclosure"). medan = yang pertama dipilih. */
  medanLain?: string[];
  /** Peran yang ditelusuri per medan; `roles` = gabungannya (dipakai Sintesis dan Surat). */
  rolesByMedan?: Record<string, string[]>;
  /** Peran yang dipakai di Desain Langkah bila lebih dari satu ditelusuri. */
  peranDesain?: string;
  langkahByPeran?: Record<string, string>;
  rumusanByMedan?: Record<string, { siapa: string; masalah: string; bangun: string }>;
  sdgTags: string[];
  subPicks: string[];
  peduliPicks: string[];
  roles: string[];
  langkah: string;
  refleksi: string;
};

const EMPTY: JBData = {
  medan: null,
  medanLain: [],
  rolesByMedan: {},
  peranDesain: "",
  langkahByPeran: {},
  rumusanByMedan: {},
  sdgTags: [],
  subPicks: [],
  peduliPicks: [],
  roles: [],
  langkah: "",
  refleksi: "",
};

// Peran yang sedang dirancang langkahnya: pilihan siswa bila masih ada, selain itu peran pertama.
function peranAktif(p: JBData): string {
  return p.peranDesain && p.roles.includes(p.peranDesain) ? p.peranDesain : p.roles[0] ?? "";
}

// Medan pemilik sebuah peran (untuk nama medan di langkah dan permintaan jembatan).
function medanPemilik(p: JBData, peran: string): string | null {
  const hit = Object.entries(p.rolesByMedan ?? {}).find(([, rs]) => rs.includes(peran));
  return hit?.[0] ?? p.medan;
}

// Ganti peran aktif: langkah peran lama disimpan, langkah peran baru dipulihkan (atau kosong),
// supaya baris langkah tidak membawa nama peran lain dan batas dua langkah tetap per peran.
function pindahLangkah(p: JBData, lama: string): JBData {
  const tujuan = peranAktif(p);
  if (lama === tujuan) return p;
  const simpan = { ...(p.langkahByPeran ?? {}) };
  // Langkah yang ditulis sebelum ada peran ikut ke peran pertama yang dipilih.
  if (!lama) return { ...p, langkah: simpan[tujuan] ?? p.langkah };
  if (p.langkah) simpan[lama] = p.langkah;
  return { ...p, langkahByPeran: simpan, langkah: simpan[tujuan] ?? "" };
}

function gantiPeranAktif(p: JBData, next: string): JBData {
  return pindahLangkah({ ...p, peranDesain: next }, peranAktif(p));
}

// Susun ulang daftar peran dari peran per medan (tanpa duplikat), jaga langkah bila peran aktif berubah.
function aturPeran(p: JBData, byMedan: Record<string, string[]>): JBData {
  const roles = [...new Set(Object.values(byMedan).flat())];
  const peranDesain = roles.includes(p.peranDesain ?? "") ? p.peranDesain : "";
  return pindahLangkah({ ...p, rolesByMedan: byMedan, roles, peranDesain }, peranAktif(p));
}

// Data lama (sebelum multi-medan): peran tersimpan di `roles` tanpa rolesByMedan.
function migrasiData(p: JBData): JBData {
  if (p.medan && p.roles.length && !Object.keys(p.rolesByMedan ?? {}).length) {
    return { ...p, rolesByMedan: { [p.medan]: p.roles } };
  }
  return p;
}

// ── STEPPER: 4 langkah. currentStep TIDAK dipersist — reload = mulai dari
// step 1, jawaban (objek `d`) tetap persist di localStorage/Supabase seperti semula.
const TOTAL_STEPS = 4;
type StepId = 1 | 2 | 3 | 4;

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
    <div className="border-l-4 border-[hsl(var(--torch-gold))] bg-secondary/40 px-4 py-3 text-foreground/90">
      <p>{ayat}</p>
      <p className="text-xs text-muted-foreground mt-1">{rujukan}</p>
      <p className="text-sm text-muted-foreground mt-2">{framing}</p>
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

// ── STEPPER CHROME (mekanis, bukan copy Fable — label 🔲 diisi dari C.ui) ──
function StepProgress({ step }: { step: StepId }) {
  // 🔲 C.ui.stepLabels — label per-step untuk progress bar; menunggu isi Fable.
  const labels = C.ui.stepLabels;
  return (
    <div className="sticky top-12 z-20 -mx-6 mb-8 border-b border-border bg-background/85 px-6 py-3 backdrop-blur">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        {([1, 2, 3, 4] as StepId[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px]",
                s === step
                  ? "border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))] text-[hsl(var(--ink-deep))] font-semibold"
                  : s < step
                    ? "border-[hsl(var(--torch-gold))]/50 bg-[hsl(var(--torch-gold))]/10 text-foreground/70"
                    : "border-border text-muted-foreground/60",
              )}
            >
              {s}
            </span>
            <span className={cn("hidden sm:inline truncate", s === step && "text-foreground font-semibold")}>
              {labels[s]}
            </span>
            {i < 3 && <span className="flex-1 h-px bg-border mx-1" aria-hidden />}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepNav({
  step,
  onBack,
  onNext,
  nextDisabled,
}: {
  step: StepId;
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-10 pb-4">
      {step > 1 ? (
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          {/* 🔲 C.ui.stepKembaliLabel */}
          {C.ui.stepKembaliLabel}
        </Button>
      ) : (
        <span />
      )}
      {step < TOTAL_STEPS && (
        <Button onClick={onNext} disabled={nextDisabled}>
          {/* 🔲 C.ui.stepLanjutLabel */}
          {C.ui.stepLanjutLabel}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
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
  const [step, setStep] = useState<StepId>(1);

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
          // Baru masuk dari ajakan "Masuk dengan Google" sebagai tamu: isian tamu di perangkat ini yang dilanjutkan,
          // termasuk bila akun sudah punya isian lama di server (siswa menekan Simpan untuk menimpanya).
          // Tanpa penanda itu, isian perangkat tidak pernah dibaca untuk akun Google (perangkat bersama).
          const adopsi = ambilAdopsiJalanBakti(user.id);
          const raw = adopsi ? localStorage.getItem(LS_KEY) : null;
          if (raw) {
            const diadopsi = migrasiData({ ...EMPTY, ...JSON.parse(raw) });
            setD(diadopsi);
            // Langsung disimpan ke akun, supaya muat ulang atau pindah halaman tidak memulihkan isian lama dari server.
            const { error } = await simpanFase("phase_3_jalan_bakti", user.id, diadopsi);
            if (error) console.error(error);
          } else {
            const { data } = await bacaFase("phase_3_jalan_bakti", user.id);
            if (data?.data) {
              const merged = migrasiData({ ...EMPTY, ...(data.data as JBData) });
              setD(merged);
              // Mirror to localStorage so compileSurat() can read it.
              localStorage.setItem(LS_KEY, JSON.stringify(merged));
            } else {
              // Akun tanpa isian: mulai kosong, jangan bawa isian akun lain yang masih ada di layar.
              setD(EMPTY);
            }
          }
        } else {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) setD(migrasiData({ ...EMPTY, ...JSON.parse(raw) }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setHydrated(true);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- hidrasi per akun, bukan per objek user (TOKEN_REFRESHED)
  }, [user?.id, authLoading]);

  // Simpan otomatis di perangkat, khusus tamu: isian tidak hilang saat tamu pindah ke halaman masuk lalu kembali.
  // Akun Google menyimpan lewat tombol Simpan ke server.
  useEffect(() => {
    if (!hydrated || user) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch { /* abaikan */ }
  }, [d, hydrated, user]);

  function toggleSdg(id: string) {
    setD((p) => ({
      ...p,
      sdgTags: p.sdgTags.includes(id) ? p.sdgTags.filter((x) => x !== id) : [...p.sdgTags, id],
    }));
  }

  function selectMedan(id: string) {
    setD((p) => {
      const lain = p.medanLain ?? [];
      const terpilih = [p.medan, ...lain].filter(Boolean) as string[];
      const byMedan = { ...(p.rolesByMedan ?? {}) };
      if (terpilih.includes(id)) {
        // lepas medan ini: buang sub-tantangan dan peran miliknya
        const k = C.klaster.find((x) => x.id === id);
        const subIds = new Set((k?.subTantangan ?? []).map((x) => x.id));
        delete byMedan[id];
        const sisa = terpilih.filter((x) => x !== id);
        const rumusan = { ...(p.rumusanByMedan ?? {}) };
        delete rumusan[id];
        return aturPeran(
          { ...p, medan: sisa[0] ?? null, medanLain: sisa.slice(1), subPicks: p.subPicks.filter((x) => !subIds.has(x)), rumusanByMedan: rumusan },
          byMedan,
        );
      }
      if (!p.medan) return { ...p, medan: id };
      return { ...p, medanLain: [...lain, id] };
    });
  }

  function setPeranMedan(medanId: string, picked: string[]) {
    setD((p) => aturPeran(p, { ...(p.rolesByMedan ?? {}), [medanId]: picked }));
  }

  function pilihPeranDesain(r: string) {
    setD((p) => gantiPeranAktif(p, r));
  }

  const medanTerpilih = [d.medan, ...(d.medanLain ?? [])].filter(Boolean) as string[];

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
        const { error } = await simpanFase("phase_3_jalan_bakti", user.id, d);
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

  function goNext() {
    setStep((s) => (s < TOTAL_STEPS ? ((s + 1) as StepId) : s));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((s) => (s > 1 ? ((s - 1) as StepId) : s));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!hydrated) {
    return (
      <main className="container mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-6">
        <div role="status" className="flex flex-col items-center gap-3 text-sm text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" aria-hidden />{keselamatanContent.memuatHalaman}</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12 max-w-2xl">
      <StepProgress step={step} />

      {/* ══════════════ STEP 1 — G1 DENGAR ══════════════ */}
      {step === 1 && (
        <>
          {/* ── OPENER BARU: bomb riset + doa Sulaiman + framework 3 gerakan ── */}
          <section className="space-y-4 mb-4">
            <h1 className="font-heading text-2xl font-bold text-foreground">{C.ui.pageTitle}</h1>
          </section>
          <JalanBaktiOpening />

          <Separator className="my-10" />

          {/* ── MURAJAAH (full-circle): recall perjalanan + namai dilema + hook posisi ── */}
          <section className="space-y-4">
            {C.murajaah.paragraphs.map((p, i) => (
              <p key={`mj-${i}`} className="text-base leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}
          </section>

          <Separator className="my-10" />

          {/* ── Opener lama (narasi bakti) — kini jadi pembuka Gerakan 1: Dengar ── */}
          <section className="space-y-4">
            {C.opener.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}
          </section>

          <Separator className="my-10" />

          {/* ── TP HUD 61 (jawaban atas "mau melihat lebih jauh?", kesimpulan murajaah) ── */}
          <p className="text-base leading-relaxed text-foreground/90 mb-5">{C.tpHud61.lead}</p>
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

            <p className="text-sm text-muted-foreground pt-4">{C.sdg.lensNote}</p>
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

          <StepNav step={step} onBack={goBack} onNext={goNext} />
        </>
      )}

      {/* ══════════════ STEP 2 — G2 PAHAMI (provinsi dipindah ke sini) ══════════════ */}
      {step === 2 && (
        <>
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

                {/* Fardhu kifayah — pilot Jawa Barat, blueprint Raihan 6 Jul */}
                {provinceCtx.fardhu_kifayah_gaps.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Yang masih kosong di daerahmu
                      </p>
                      <span className="text-[10px] rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-muted-foreground">
                        {keselamatanContent.gambaranAwal}
                      </span>
                    </div>
                    <ul className="space-y-2 list-disc pl-5 text-sm leading-relaxed text-foreground/85">
                      {provinceCtx.fardhu_kifayah_gaps.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                    {provinceCtx.key_questions.length > 0 && (
                      <div className="rounded-lg border border-[hsl(var(--torch-gold))]/40 bg-[hsl(var(--torch-gold))]/5 p-4 space-y-2">
                        {provinceCtx.key_questions.map((q, i) => (
                          <p key={i} className="text-sm leading-relaxed text-foreground/90 italic">
                            {q}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>

              <Separator className="my-10" />
            </>
          )}

          {/* ── KARTU KEBUTUHAN DAERAH (Tonggak 2b A1): di samping blok di atas, tidak menggantikannya ── */}
          {KARTU_DAERAH_TERBUKA && province && (
            <>
              <KartuDaerah province={province} />
              <Separator className="my-10" />
            </>
          )}

          {/* ── 6 KLASTER — pilih SATU medan (reversible); sub-tantangan multi di dalamnya ── */}
          <section className="space-y-6">
            <SectionHeader title={C.ui.klasterSectionTitle} subtitle={C.klasterIntro} />
            <div className="space-y-4">
              {C.klaster.map((k) => {
                const selected = medanTerpilih.includes(k.id);
                return (
                  <div
                    key={k.id}
                    className={cn(
                      "rounded-xl border bg-card p-5 space-y-3 transition-colors",
                      selected
                        ? "border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]/5"
                        : "border-border",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => selectMedan(k.id)}
                      aria-pressed={selected}
                      className="w-full text-left flex items-start gap-3"
                    >
                      <span
                        className={cn(
                          "mt-1 h-4 w-4 shrink-0 rounded-full border-2 transition-colors",
                          selected
                            ? "border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]"
                            : "border-muted-foreground/40",
                        )}
                      />
                      <span className="space-y-1">
                        <span className="block font-heading text-lg font-semibold text-foreground">{k.nama}</span>
                        <span className="block text-sm leading-relaxed text-foreground/85">{k.bridge}</span>
                      </span>
                    </button>

                    {selected && (
                      <div className="flex flex-wrap gap-2 pt-2 pl-7">
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
                    )}
                  </div>
                );
              })}
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

          {/* ── GERAKAN 2 · PAHAMI — tampar 10-jobs + reveal peran (muncul setelah medan dipilih) ── */}
          {d.medan &&
            (() => {
              const siapaLabels = [
                ...C.lensaKepedulian.tier1Items,
                ...C.lensaKepedulian.tier2Wajah,
              ]
                .filter((x) => d.peduliPicks.includes(x.id))
                .map((x) => x.label);
              return (
                <>
                  <Separator className="my-10" />
                  <section className="space-y-5">
                    <SectionHeader title={C.gerakan2.sectionTitle} />
                    {C.gerakan2.tampar.map((p, i) => (
                      <p key={`g2-${i}`} className="text-base leading-relaxed text-foreground/90">
                        {p}
                      </p>
                    ))}
                    {medanTerpilih.map((mid) => {
                      const medanObj = C.klaster.find((k) => k.id === mid);
                      const subLabels = medanObj
                        ? medanObj.subTantangan.filter((s) => d.subPicks.includes(s.id)).map((s) => s.label)
                        : [];
                      const awal = d.rolesByMedan?.[mid] ?? [];
                      return (
                        <div key={`br-${mid}`} className="space-y-3">
                          {medanTerpilih.length > 1 && (
                            <h4 className="font-heading text-base font-semibold text-foreground">{medanObj?.nama}</h4>
                          )}
                          <BroadenRoles
                            medan={{ id: mid, nama: medanObj?.nama || "" }}
                            subPicks={subLabels}
                            siapa={siapaLabels}
                            province={province}
                            initialPicked={awal}
                            onPickedChange={(picked) => setPeranMedan(mid, picked)}
                            initialRumusan={d.rumusanByMedan?.[mid]}
                            onRumusanChange={(r) => setD((p) => ({ ...p, rumusanByMedan: { ...(p.rumusanByMedan ?? {}), [mid]: r } }))}
                          />
                        </div>
                      );
                    })}
                  </section>
                </>
              );
            })()}

          <StepNav step={step} onBack={goBack} onNext={goNext} nextDisabled={!d.medan} />
        </>
      )}

      {/* ══════════════ STEP 3 — G3 DESAIN ══════════════ */}
      {step === 3 && (
        <>
          {/* ── GERAKAN 3 · DESAIN — rancang langkah pertama (mengganti free-write lama; refleksi tak dipakai Surat) ── */}
          <section className="space-y-5">
            <SectionHeader title={C.gerakan3.sectionTitle} />
            {C.gerakan3.intro.map((p, i) => (
              <p key={`g3i-${i}`} className="text-base leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}
            {d.roles.length > 1 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{C.ui.pilihPeranDesain}</p>
                <div className="flex flex-wrap gap-2">
                  {d.roles.map((r) => (
                    <Chip key={r} active={peranAktif(d) === r} onClick={() => pilihPeranDesain(r)}>
                      {r}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
            {d.medan ? (
              <DesainLangkah
                content={C.gerakan3}
                medanNama={C.klaster.find((k) => k.id === medanPemilik(d, peranAktif(d)))?.nama || ""}
                key={peranAktif(d) || "tanpa-peran"}
                role={peranAktif(d) || null}
                initialLangkah={d.langkah}
                onLangkahChange={(l) => setD((p) => ({ ...p, langkah: l }))}
                userId={user?.id ?? null}
                province={province ?? null}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Pilih dulu satu medan di atas untuk merancang langkah pertamamu.
              </p>
            )}
          </section>

          <StepNav step={step} onBack={goBack} onNext={goNext} />
        </>
      )}

      {/* ══════════════ STEP 4 — TUNTASKAN (panen-mini) ══════════════ */}
      {step === 4 && (
        <>
          <section className="space-y-5">
            <SectionHeader title={C.ui.tuntaskanSectionTitle} />
            <p className="text-base leading-relaxed text-foreground/90">{C.tuntaskan.intro}</p>
            {(() => {
              const medanNama = medanTerpilih.map((m) => C.klaster.find((k) => k.id === m)?.nama).filter(Boolean).join(", ");
              const siapaNames = [...C.lensaKepedulian.tier1Items, ...C.lensaKepedulian.tier2Wajah]
                .filter((x) => d.peduliPicks.includes(x.id))
                .map((x) => x.label);
              const rows: { label: string; value: string }[] = [
                { label: C.tuntaskan.labelMedan, value: medanNama },
                { label: C.tuntaskan.labelSiapa, value: siapaNames.join(", ") },
                { label: C.tuntaskan.labelPeran, value: d.roles.join(", ") },
                { label: C.tuntaskan.labelLangkah, value: d.langkah.trim() },
              ];
              return (
                <div className="rounded-2xl border border-border bg-secondary/40 p-6 space-y-4">
                  {rows.map((r) => (
                    <div key={r.label}>
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                        {r.label}
                      </p>
                      <p className={`text-base leading-relaxed ${r.value ? "text-foreground" : "text-muted-foreground italic"}`}>
                        {r.value || C.tuntaskan.kosong}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })()}
            <p className="text-base leading-relaxed text-foreground/90">{C.tuntaskan.bridge}</p>
          </section>

          <StepNav step={step} onBack={goBack} onNext={goNext} />

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
        </>
      )}

      <SuluCompanion />
    </main>
  );
}
