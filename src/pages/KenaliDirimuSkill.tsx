import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const LS_KEY = "sulu_phase2b";

type Rating = "belum" | "sedang" | "percaya";

type SkillData = {
  ratings: Record<string, Rating>;
  selected: string[];
  why: string;
  step: string;
};

const EMPTY: SkillData = { ratings: {}, selected: [], why: "", step: "" };

const COMPETENCIES: { id: string; name: string; desc: string }[] = [
  {
    id: "berpikir_kritis",
    name: "Berpikir Kritis",
    desc: "Mengenali dan merespons kebutuhan dengan memahami konteks situasi dan menganalisis informasi yang relevan secara logis.",
  },
  {
    id: "komunikasi",
    name: "Komunikasi",
    desc: "Bertukar informasi, gagasan, dan sudut pandang secara jelas dan efektif, menyampaikan dan mendengarkan, dengan orang di dalam maupun di luar lingkup kita.",
  },
  {
    id: "kerja_sama",
    name: "Kerja Sama Tim",
    desc: "Membangun hubungan kolaboratif untuk mencapai tujuan bersama, sambil menghargai perbedaan pandangan dan tanggung jawab bersama.",
  },
  {
    id: "literasi_teknologi",
    name: "Literasi Teknologi",
    desc: "Memahami dan memanfaatkan teknologi secara etis untuk meningkatkan efisiensi dan mencapai tujuan.",
  },
  {
    id: "kepemimpinan",
    name: "Kepemimpinan",
    desc: "Mengenali dan mengoptimalkan kekuatan diri dan tim untuk mencapai tujuan bersama.",
  },
  {
    id: "profesionalisme",
    name: "Profesionalisme",
    desc: "Menunjukkan kebiasaan kerja yang efektif dan bertanggung jawab, serta bertindak dengan integritas demi kepentingan bersama.",
  },
  {
    id: "pengembangan_diri",
    name: "Pengembangan Diri & Karier",
    desc: "Mengembangkan diri dan karier secara proaktif: belajar terus-menerus, mengenali kekuatan dan kelemahan diri, menjelajahi peluang, dan membangun jejaring.",
  },
];

const RATING_OPTIONS: { value: Rating; label: string }[] = [
  { value: "belum", label: "Belum banyak saya latih" },
  { value: "sedang", label: "Sedang saya kembangkan" },
  { value: "percaya", label: "Saya cukup percaya diri di sini" },
];

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

function SkillRating({
  name,
  desc,
  value,
  onChange,
}: {
  name: string;
  desc: string;
  value?: Rating;
  onChange: (v: Rating) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        {RATING_OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex-1 rounded-md border px-3 py-2 text-sm transition-colors text-left sm:text-center",
                active
                  ? "border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]/10 text-foreground font-medium"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40",
              )}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function KenaliDirimuSkill() {
  const { user, loading: authLoading } = useAuth();
  const [d, setD] = useState<SkillData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      try {
        if (user) {
          const { data } = await supabase
            .from("phase_2b_skills")
            .select("data")
            .eq("user_id", user.id)
            .maybeSingle();
          if (data?.data) setD({ ...EMPTY, ...(data.data as SkillData) });
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

  function setRating(id: string, v: Rating) {
    setD((prev) => ({ ...prev, ratings: { ...prev.ratings, [id]: v } }));
  }

  function toggleSelected(id: string, checked: boolean) {
    setD((prev) => {
      const exists = prev.selected.includes(id);
      if (checked && !exists) {
        if (prev.selected.length >= 3) {
          toast.info("Maksimal 3 kompetensi.");
          return prev;
        }
        return { ...prev, selected: [...prev.selected, id] };
      }
      if (!checked && exists) {
        return { ...prev, selected: prev.selected.filter((x) => x !== id) };
      }
      return prev;
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(d));
      if (user) {
        const { error } = await supabase
          .from("phase_2b_skills")
          .upsert(
            { user_id: user.id, data: d, updated_at: new Date().toISOString() },
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

  if (!hydrated) {
    return (
      <main className="container mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12 max-w-2xl">
      {/* ── NARASI PEMBUKA ── */}
      <section className="prose-sm space-y-4">
        <h1 className="font-heading text-2xl font-bold text-foreground">Kenali Kompetensimu</h1>
        <p className="text-base leading-relaxed text-foreground/90">
          Setelah mengenali apa yang sudah ada dalam dirimu, saatnya bertanya lebih jauh: kompetensi
          apa yang perlu dibangun?
        </p>
        <p className="text-base leading-relaxed text-foreground/90">
          Suatu ketika, putri Nabi Syu'aib berkata tentang Musa 'alaihissalam:{" "}
          <em>
            "Sesungguhnya orang yang paling baik yang engkau ambil sebagai pekerja ialah orang yang
            kuat lagi dapat dipercaya."
          </em>{" "}
          (QS Al-Qasas: 26)
        </p>
        <p className="text-base leading-relaxed text-foreground/90">
          Dua kualitas itu, <em>Al-Qawiyy</em> dan <em>Al-Amin</em>, adalah standar yang berlaku di
          setiap zaman. <em>Al-Qawiyy</em> adalah kapasitas: kekuatan dan kemampuan untuk mengerjakan
          apa yang ditugaskan. <em>Al-Amin</em> adalah karakter: kejujuran dan amanah dalam
          menjalankannya tanpa khianat.
        </p>
        <p className="text-base leading-relaxed text-foreground/90">
          Keduanya bukan bawaan lahir. Keduanya bisa dilatih dan dibangun.
        </p>
        <p className="text-base leading-relaxed text-foreground/90">
          Di sini, kamu akan mengenal kompetensi-kompetensi yang relevan dan memilih mana yang ingin
          kamu mulai kembangkan.
        </p>
      </section>

      <Separator className="my-10" />

      {/* ── UST. HILMAN TOUCHPOINT ── */}
      <div className="border-l-4 border-[hsl(var(--torch-gold))] bg-secondary/40 px-4 py-3 mb-8 italic text-foreground/90">
        <p>
          "Katakanlah, 'Setiap orang berbuat sesuai dengan pembawaannya masing-masing.'" (QS
          Al-Isra': 84)
        </p>
        <p className="not-italic text-sm text-muted-foreground mt-2">
          Cara kerjamu yang khas bukan kebetulan; itu adalah pembawaan yang Allah ciptakan dalam
          dirimu.
        </p>
      </div>

      {/* ── INTRO ASESMEN ── */}
      <p className="text-base leading-relaxed text-foreground/90 mb-8">
        Tujuh kompetensi berikut adalah bekal yang relevan di dunia kerja masa kini. Kamu tidak
        perlu menguasai semuanya sekarang. Tandai sejujurnya di mana posisimu pada masing-masing.
        Ini bukan ujian dan tidak ada jawaban yang salah, hanya cermin untuk tahu dari mana baik
        mulai.
      </p>

      {/* ── TUJUH KOMPETENSI ── */}
      <section className="rounded-xl border border-border bg-card p-6 mb-8">
        <SectionHeader title="Tujuh Kompetensi" />
        <div className="space-y-8">
          {COMPETENCIES.map((c) => (
            <SkillRating
              key={c.id}
              name={c.name}
              desc={c.desc}
              value={d.ratings[c.id]}
              onChange={(v) => setRating(c.id, v)}
            />
          ))}
        </div>
      </section>

      {/* ── SKILL REFLECTION ── */}
      <section className="rounded-xl border border-border bg-card p-6 mb-8">
        <SectionHeader title="Refleksi Pilihanmu" />

        <div className="space-y-6">
          <div>
            <p className="text-base text-foreground leading-relaxed">
              Dari 7 kompetensi di atas, pilih 1 sampai 3 yang paling ingin kamu kembangkan dalam
              2–3 tahun ke depan.
            </p>
            <div className="mt-3 space-y-2">
              {COMPETENCIES.map((c) => {
                const checked = d.selected.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={cn(
                      "flex items-start gap-3 rounded-md border px-3 py-2 cursor-pointer transition-colors",
                      checked
                        ? "border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))]/10"
                        : "border-border hover:border-foreground/40",
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(val) => toggleSelected(c.id, val === true)}
                      className="mt-1"
                    />
                    <span className="text-sm text-foreground">{c.name}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {d.selected.length} dari 3 dipilih
            </p>
          </div>

          <div>
            <p className="text-base text-foreground leading-relaxed">
              Mengapa kamu memilih kompetensi ini? Dalam situasi apa kamu paling merasa
              membutuhkannya?
            </p>
            <Textarea
              value={d.why}
              onChange={(e) => setD((p) => ({ ...p, why: e.target.value }))}
              placeholder="Saya memilih ini karena..."
              className="mt-2 min-h-[100px]"
            />
          </div>

          <div>
            <p className="text-base text-foreground leading-relaxed">
              Apa satu langkah konkret yang bisa kamu lakukan dalam 30 hari ke depan untuk mulai
              mengembangkan kompetensi ini?
            </p>
            <Textarea
              value={d.step}
              onChange={(e) => setD((p) => ({ ...p, step: e.target.value }))}
              placeholder="Langkah pertama yang bisa saya lakukan adalah..."
              className="mt-2 min-h-[100px]"
            />
          </div>
        </div>
      </section>

      {/* ── SAVE + COMING SOON ── */}
      <div className="flex flex-col items-center gap-3 pt-2 pb-12">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Simpan
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Langkah berikutnya, Jalan Bakti, segera hadir.
        </p>
      </div>
    </main>
  );
}
