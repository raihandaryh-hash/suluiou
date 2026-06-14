import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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
          if (data?.data) setA(data.data as Answers);
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
      if (user) {
        const { error } = await supabase
          .from("phase_2a_inventory")
          .upsert(
            { user_id: user.id, data: a, updated_at: new Date().toISOString() },
            { onConflict: "user_id" },
          );
        if (error) throw error;
      } else {
        localStorage.setItem(LS_KEY, JSON.stringify(a));
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
          {domainsDone} dari 4 domain selesai
        </p>
      </div>

      {/* ── NARASI PEMBUKA SYUKUR ── */}
      <section className="prose-sm space-y-4">
        <p className="text-base leading-relaxed text-foreground/90">
          Allah berjanji:
        </p>
        <blockquote className="border-l-4 border-[hsl(var(--torch-gold))] bg-secondary/40 px-4 py-3 italic text-foreground/90">
          "Sesungguhnya jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu..."
          <span className="not-italic block mt-1 text-sm text-muted-foreground">— QS Ibrahim: 7</span>
        </blockquote>
        <p className="text-base leading-relaxed text-foreground/90">
          Mensyukuri dimulai dari mengenali. Barangkali ada nikmat yang belum kamu sadari sepenuhnya.
          Di sini, mari kita ingat dan petakan bersama.
        </p>
        <h1 className="font-heading text-2xl font-bold text-foreground mt-8">Kenali Yang Sudah Ada</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Bukan untuk menilai dirimu. Tapi, untuk mensyukuri modal yang sudah Allah titipkan untuk
          jalan gerakmu ke depan.
        </p>
      </section>

      <Separator className="my-10" />

      {/* ── UST. HILMAN TOUCHPOINT ── */}
      <div className="border-l-4 border-[hsl(var(--torch-gold))] bg-secondary/40 px-4 py-3 mb-6 italic text-foreground/90">
        "Rasulullah ﷺ mengingatkan: di dalam tubuh ada segumpal daging. Bila ia baik, baiklah
        seluruh tubuh. Dari sana kita mulai."
      </div>

      {/* ── DOMAIN 1 ── */}
      <section className="rounded-xl border border-border bg-card p-6 mb-6">
        <SectionHeader
          title="Fondasi Keimanan"
          subtitle="Fondasi imanmu adalah nikmat yang paling mendasar. Di sini kamu mengingat apa yang sudah ada: ayat yang menguatkan, pemahaman yang membimbing, dan kebiasaan yang menopang."
        />
        <div className="space-y-6">
          <JournalingPrompt
            question="Ayat, doa, atau momen ibadah mana yang paling sering membawa ketenangan saat hatimu terasa berat?"
            starter="Yang paling sering membawa ketenangan bagi saya adalah..."
            value={a.d1_q1 || ""}
            onChange={set("d1_q1")}
          />
          <JournalingPrompt
            question="Pemahaman atau nilai dalam Islam mana yang paling melekat dalam dirimu — yang memberi arah ketika kamu bimbang, atau kekuatan ketika kamu hampir menyerah?"
            starter="Pemahaman atau nilai dalam Islam yang paling melekat dan membimbing saya adalah..."
            value={a.d1_q2 || ""}
            onChange={set("d1_q2")}
          />
          <JournalingPrompt
            question="Rutinitas amal apa yang biasanya memberi kamu ketenangan dan kekuatan di hari-hari biasa?"
            starter="Rutinitas amal yang biasanya memberi saya ketenangan dan kekuatan adalah..."
            value={a.d1_q3 || ""}
            onChange={set("d1_q3")}
          />
        </div>
      </section>

      {/* ── DOMAIN 2 ── */}
      <section className="rounded-xl border border-border bg-card p-6 mb-6">
        <SectionHeader
          title="Karakter dan Keterampilan Latent"
          subtitle="Setiap orang diciptakan dengan kekuatan dan cara kerja yang unik. Di sini kamu akan mengenali pola yang sudah ada dalam dirimu."
        />
        <div className="space-y-6">
          <JournalingPrompt
            question="Pernahkah kamu mengerjakan sesuatu yang terasa mudah, mengalir, dan merasa 'ini saya banget' — sangat cocok dan terasa benar? Apa yang sedang kamu lakukan saat itu, dan kenapa rasanya begitu?"
            starter="Momen ketika saya merasa 'ini saya banget' dan semuanya terasa mengalir adalah..."
            value={a.d2_q1 || ""}
            onChange={set("d2_q1")}
          />
          <JournalingPrompt
            question="Hal apa yang sering orang lain perhatikan atau komentari tentang cara kamu bekerja atau berinteraksi — bahkan orang yang baru saja mengenalmu?"
            starter="Yang sering orang perhatikan tentang saya, bahkan yang baru mengenal saya, adalah..."
            value={a.d2_q2 || ""}
            onChange={set("d2_q2")}
          />
          <JournalingPrompt
            question="Di sekolah, ekskul, atau komunitas, peran atau tugas apa yang paling cocok dengan cara kamu biasanya bekerja?"
            starter="Peran atau tugas yang paling cocok dengan cara kerja saya adalah..."
            value={a.d2_q3 || ""}
            onChange={set("d2_q3")}
          />
        </div>
      </section>

      {/* ── DOMAIN 3 ── */}
      <section className="rounded-xl border border-border bg-card p-6 mb-6">
        <SectionHeader
          title="Modal Relasional"
          subtitle="Orang tua, guru, dan sahabat sering melihat kekuatanmu lebih jelas dari yang kamu rasakan sendiri. Mereka adalah cermin yang sudah Allah hadirkan dalam hidupmu."
        />
        <div className="space-y-6">
          <JournalingPrompt
            question="Siapa yang pernah mengatakan sesuatu positif tentang cara kerjamu atau kemampuanmu? Ceritakan apa yang mereka katakan."
            starter="Yang pernah memberi komentar tentang kemampuan atau cara kerja saya adalah... dan mereka mengatakan..."
            value={a.d3_q1 || ""}
            onChange={set("d3_q1")}
          />
          <JournalingPrompt
            question="Pernahkah seseorang mengatakan sesuatu tentang kemampuanmu yang membuatmu menyadari sesuatu tentang dirimu yang belum pernah terpikir sebelumnya?"
            starter="Yang membuat saya menyadari sesuatu baru tentang diri saya adalah..."
            value={a.d3_q2 || ""}
            onChange={set("d3_q2")}
          />
          <JournalingPrompt
            question="Bagaimana kamu biasanya memberi manfaat kepada keluarga atau komunitas lewat hal-hal yang kamu kuasai?"
            starter="Saya biasanya memberi manfaat kepada keluarga atau komunitas dengan..."
            value={a.d3_q3 || ""}
            onChange={set("d3_q3")}
          />
        </div>
      </section>

      {/* ── DOMAIN 4 ── */}
      <section className="rounded-xl border border-border bg-card p-6 mb-6">
        <SectionHeader
          title="Adaptabilitas Karier"
          subtitle="Allah menjanjikan bahwa bersama setiap kesulitan ada kemudahan. Kamu akan menuliskan masa depan yang kamu impikan sekaligus yang ingin kamu hindari. Keduanya akan membantumu lebih terarah dan yakin."
        />
        <div className="space-y-6">
          <JournalingPrompt
            question="Bayangkan lima tahun mendatang. Kehidupan seperti apa yang ingin kamu bangun bersama keluarga dan komunitas?"
            starter="Lima tahun mendatang, yang ingin saya bangun bersama keluarga dan komunitas adalah..."
            value={a.d4_q1 || ""}
            onChange={set("d4_q1")}
          />
          <JournalingPrompt
            question="Hal apa yang ingin kamu hindari di masa depan agar tetap selaras dengan nilai dan tanggung jawabmu?"
            starter="Yang ingin saya hindari di masa depan adalah..."
            value={a.d4_q2 || ""}
            onChange={set("d4_q2")}
          />
          <JournalingPrompt
            question="Ketika kamu menghadapi ketidakpastian tentang masa depan, apa yang biasanya memberimu keyakinan untuk tetap bergerak?"
            starter="Yang biasanya memberi saya keyakinan untuk tetap bergerak menghadapi ketidakpastian adalah..."
            value={a.d4_q3 || ""}
            onChange={set("d4_q3")}
          />
        </div>
      </section>

      {/* ── FREE FIELD: NIKMAT LAINNYA ── */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground">Nikmat lain yang ingin kamu catat</label>
        <p className="text-sm text-muted-foreground mb-2">
          Ada nikmat lain yang kamu sadari yang belum tercakup di atas? Semuanya adalah nikmat
          karunia-Nya.
        </p>
        <Textarea
          value={a.free_nikmat || ""}
          onChange={(e) => set("free_nikmat")(e.target.value)}
          placeholder="Nikmat lain yang saya syukuri adalah..."
          className="min-h-[80px]"
        />
      </div>

      <Separator className="my-10" />

      {/* ── ACHIEVEMENT LOG ── */}
      <section className="rounded-xl border border-border bg-card p-6 mb-6">
        <SectionHeader
          title="Catatan Perjalananmu"
          subtitle="Setiap pengalaman yang pernah kamu jalani — dalam organisasi, kegiatan, tugas harian, atau momen membantu orang lain — adalah bagian dari perjalananmu. Catat semuanya di sini, besar atau kecil, peran yang keren maupun yang tidak. Tuliskan sebanyak yang kamu ingat — ini akan menjadi arsip pribadimu dan bahan nyata untuk kariermu ke depan."
        />
        <div className="space-y-6">
          <JournalingPrompt
            question="Pengalaman atau kegiatan apa saja yang pernah kamu jalani — di sekolah, komunitas, keluarga, atau di mana saja? Ceritakan peranmu dan apa yang kamu lakukan."
            starter="Pengalaman atau kegiatan yang pernah saya jalani adalah..."
            value={a.ach_q1 || ""}
            onChange={set("ach_q1")}
            minH="min-h-[140px]"
          />
          <JournalingPrompt
            question="Pernahkah kamu melakukan sesuatu — sekecil apapun — dan merasakan bahwa itu memberi manfaat nyata bagi orang lain? Ceritakan."
            starter="Momen ketika saya merasa memberi manfaat nyata adalah..."
            value={a.ach_q2 || ""}
            onChange={set("ach_q2")}
          />
          {!showAchOpt ? (
            <button
              type="button"
              onClick={() => setShowAchOpt(true)}
              className="text-sm text-[hsl(var(--torch-gold))] underline-offset-4 hover:underline"
            >
              Ada pengalaman sulit yang ternyata mengandung kebaikan? (opsional)
            </button>
          ) : (
            <JournalingPrompt
              question="Pernahkah kamu melewati pengalaman yang terasa berat atau tidak kamu inginkan, tapi belakangan kamu sadari ada kebaikan atau pelajaran di baliknya?"
              starter="Pengalaman yang awalnya terasa berat tapi belakangan saya syukuri adalah..."
              value={a.ach_q3 || ""}
              onChange={set("ach_q3")}
            />
          )}
        </div>
      </section>

      {/* ── TANYAKAN ORANG TERDEKAT (ZAID) ── */}
      <section className="rounded-2xl bg-secondary/60 p-6 mb-6">
        <p className="text-base leading-relaxed text-foreground/90">
          Zaid bin Tsabit pun awalnya tidak tahu kemana bakatnya, sampai keluarganya yang
          mengarahkannya — hingga menjadi sekretaris wahyu Rasulullah ﷺ. Sekarang, coba tunjukkan
          jawaban-jawabanmu kepada orang tua, guru, atau sahabat dekatmu. Tanyakan:{" "}
          <em>"Apa yang kamu lihat sebagai keunggulanku yang mungkin belum aku sadari?"</em>
        </p>
        <Button variant="outline" className="mt-4" onClick={handleShareWA}>
          <Share2 className="mr-2 h-4 w-4" />
          Bagikan ke Orang Tua / Guru
        </Button>
      </section>

      {/* ── ABU MAHDZURAH ── */}
      <section className="rounded-xl border border-border bg-card p-6 mb-6">
        <SectionHeader title="Yang Paling Jelas Terlihat" />
        <JournalingPrompt
          question="Apa yang sering orang lain perhatikan atau komentari tentang dirimu — hal yang langsung terlihat, bahkan sebelum mereka mengenalmu lebih dalam?"
          starter="Yang langsung terlihat dari diri saya bahkan sebelum orang mengenal saya lebih dalam adalah..."
          value={a.abu_q1 || ""}
          onChange={set("abu_q1")}
        />
      </section>

      {/* ── FREE TEXT FINAL ── */}
      <div className="mb-10">
        <label className="text-sm font-medium text-foreground">Ada yang ingin kamu tambahkan?</label>
        <p className="text-sm text-muted-foreground mb-2">
          Ada hal lain tentang dirimu yang belum terjawab di atas? Ini bisa menjadi bahan diskusi
          dengan orang tua, guru, atau konselor.
        </p>
        <Textarea
          value={a.final_free || ""}
          onChange={(e) => set("final_free")(e.target.value)}
          placeholder="Tuliskan di sini..."
          className="min-h-[100px]"
        />
      </div>

      <Separator className="my-10" />

      {/* ── PENUTUP SYUKUR ── */}
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
              Menyimpan...
            </>
          ) : (
            "Simpan Catatanku"
          )}
        </Button>

        <p className="text-base text-foreground/90 leading-relaxed mt-4">
          Kamu sudah mengenali apa yang sudah ada. Langkah berikutnya: kenali kompetensi yang ingin
          kamu bangun.
        </p>
        <Button
          asChild
          className="w-full sm:w-auto bg-[hsl(var(--torch-gold))] text-[hsl(var(--ink-deep))] hover:bg-[hsl(var(--torch-gold))]/90"
        >
          <Link to="/kenali-dirimu/skill">Lanjut: Kenali Kompetensimu →</Link>
        </Button>
      </div>
    </main>
  );
}
