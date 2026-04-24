import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Radio, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClassMeta {
  name: string;
  school_name: string | null;
  join_code: string;
  session_closed: boolean;
}

interface HollandRow {
  code: string;
  count: number;
}

interface HexacoRow {
  name: string;
  value: number;
}

interface ProvinceRow {
  name: string;
  count: number;
}

interface Props {
  meta: ClassMeta;
  completed: number;
  enrolled: number;
  inProgress: number;
  notStarted: number;
  avgMinutes: number;
  hollandDist: HollandRow[];
  hexacoData: HexacoRow[];
  provinceDist: ProvinceRow[];
  insight: string;
  onClose: () => void;
}

const HOLLAND_LABEL: Record<string, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
};

/**
 * Layar proyektor 4-section untuk live class session.
 * Optimasi: terbaca dari 5–6 meter, kontras tinggi, refresh otomatis.
 *
 *   ┌─ HEADER: kelas, fasilitator, jam, indikator live ─┐
 *   ├─ STAT ROW: 4 metric cards ────────────────────────┤
 *   ├─ GRID 2 KOL: Holland | HEXACO ────────────────────┤
 *   └─ BOTTOM: insight | provinsi ──────────────────────┘
 */
const ProjectorMode = ({
  meta,
  completed,
  enrolled,
  inProgress,
  notStarted,
  avgMinutes,
  hollandDist,
  hexacoData,
  provinceDist,
  insight,
  onClose,
}: Props) => {
  // Esc untuk keluar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Jam berdetak (mis. 14.32) + indikator pulse
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const maxHolland = Math.max(...hollandDist.map((d) => d.count), 1);
  const maxProv = Math.max(...provinceDist.map((d) => d.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background overflow-auto"
    >
      <Button
        type="button"
        variant="ghost"
        size="lg"
        onClick={onClose}
        className="fixed top-4 right-4 z-10 gap-2 text-base text-muted-foreground hover:text-foreground"
      >
        <X className="w-5 h-5" />
        Keluar (Esc)
      </Button>

      <div className="min-h-screen px-10 py-8 flex flex-col gap-6">
        {/* ── 1. HEADER ─────────────────────────────────────────── */}
        <header className="flex items-end justify-between gap-8 border-b-4 border-primary pb-5">
          <div>
            <p className="text-xl font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              {meta.school_name ?? 'Sulu Asesmen'}
            </p>
            <h1 className="text-5xl font-heading font-black text-foreground leading-tight">
              {meta.name}
            </h1>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Kode
              </p>
              <p className="text-5xl font-mono font-black text-primary tracking-widest">
                {meta.join_code}
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Waktu
              </p>
              <p className="text-5xl font-heading font-black text-foreground tabular-nums">
                {time}
              </p>
            </div>
            {!meta.session_closed && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-full border-4 border-accent bg-accent/10">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-accent" />
                </span>
                <Radio className="w-5 h-5 text-accent" />
                <span className="text-xl font-bold uppercase tracking-wider text-accent">
                  Live
                </span>
              </div>
            )}
          </div>
        </header>

        {/* ── 2. STAT ROW: 4 metric cards ───────────────────────── */}
        <section className="grid grid-cols-4 gap-5">
          <StatCard
            label="Selesai"
            value={completed}
            tone="primary"
            sub={enrolled > 0 ? `dari ${enrolled} terdaftar` : undefined}
          />
          <StatCard
            label="Sedang Mengerjakan"
            value={inProgress}
            tone="accent"
          />
          <StatCard
            label="Belum Mulai"
            value={notStarted}
            tone="muted"
          />
          <StatCard
            label="Rata-rata Menit"
            value={avgMinutes}
            tone="default"
            icon={<Clock className="w-8 h-8" />}
            sub="per siswa"
          />
        </section>

        {/* ── 3. GRID 2-KOL: Holland | HEXACO ───────────────────── */}
        <section className="grid grid-cols-2 gap-5 flex-1">
          {/* KIRI: Distribusi Holland Code R/I/A/S/E/C */}
          <div className="rounded-3xl border-4 border-border bg-card p-7 flex flex-col">
            <h2 className="text-2xl font-heading font-black text-foreground mb-5">
              Distribusi Tipe Minat (Holland)
            </h2>
            <div className="space-y-3 flex-1">
              {hollandDist.map((d) => {
                const barPct = (d.count / maxHolland) * 100;
                return (
                  <div key={d.code} className="flex items-center gap-4">
                    <div className="w-44 shrink-0">
                      <div className="font-mono font-black text-3xl text-primary leading-none">
                        {d.code}
                      </div>
                      <div className="text-base font-semibold text-muted-foreground mt-0.5">
                        {HOLLAND_LABEL[d.code]}
                      </div>
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-10 overflow-hidden border-2 border-border">
                      <motion.div
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-3xl font-black text-foreground w-16 text-right tabular-nums">
                      {d.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* KANAN: HEXACO horizontal bars */}
          <div className="rounded-3xl border-4 border-border bg-card p-7 flex flex-col">
            <h2 className="text-2xl font-heading font-black text-foreground mb-5">
              Karakter Rata-rata (HEXACO)
            </h2>
            <div className="space-y-3 flex-1">
              {hexacoData.map((d) => {
                const barPct = (d.value / 5) * 100;
                return (
                  <div key={d.name} className="flex items-center gap-4">
                    <div className="w-72 shrink-0 text-base font-bold text-foreground">
                      {d.name}
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-10 overflow-hidden border-2 border-border relative">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-3xl font-black text-primary w-16 text-right tabular-nums">
                      {d.value.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 4. BOTTOM: Insight | Provinsi ─────────────────────── */}
        <section className="grid grid-cols-2 gap-5">
          <div className="rounded-3xl border-4 border-primary bg-primary/10 p-7">
            <h2 className="text-xl font-heading font-black uppercase tracking-widest text-primary mb-3">
              Insight Otomatis
            </h2>
            <p className="text-2xl leading-relaxed text-foreground font-semibold">
              {insight || 'Insight akan muncul setelah ada siswa yang menyelesaikan asesmen.'}
            </p>
          </div>
          <div className="rounded-3xl border-4 border-border bg-card p-7">
            <h2 className="text-xl font-heading font-black uppercase tracking-widest text-foreground mb-3">
              Asal Provinsi
            </h2>
            {provinceDist.length === 0 ? (
              <p className="text-lg text-muted-foreground">Belum ada data.</p>
            ) : (
              <div className="space-y-2">
                {provinceDist.slice(0, 5).map((p) => {
                  const barPct = (p.count / maxProv) * 100;
                  return (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="w-44 text-lg font-bold text-foreground truncate">
                        {p.name}
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-7 overflow-hidden border-2 border-border">
                        <motion.div
                          className="h-full bg-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${barPct}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                      <span className="text-2xl font-black text-foreground w-12 text-right tabular-nums">
                        {p.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <footer className="text-center text-base text-muted-foreground">
          Sulu by IOU Indonesia · Layar diperbarui otomatis setiap 30 detik · Tekan Esc untuk keluar
        </footer>
      </div>
    </motion.div>
  );
};

/* ── Komponen kartu metrik ──────────────────────────────────── */
const StatCard = ({
  label,
  value,
  tone,
  sub,
  icon,
}: {
  label: string;
  value: number;
  tone: 'primary' | 'accent' | 'muted' | 'default';
  sub?: string;
  icon?: React.ReactNode;
}) => {
  const toneClass =
    tone === 'primary'
      ? 'border-primary bg-primary/10 text-primary'
      : tone === 'accent'
      ? 'border-accent bg-accent/10 text-accent'
      : tone === 'muted'
      ? 'border-border bg-muted/40 text-muted-foreground'
      : 'border-border bg-card text-foreground';

  const valueClass =
    tone === 'primary'
      ? 'text-primary'
      : tone === 'accent'
      ? 'text-accent'
      : tone === 'muted'
      ? 'text-foreground'
      : 'text-foreground';

  return (
    <div className={`rounded-3xl border-4 p-6 flex flex-col ${toneClass}`}>
      <div className="flex items-center justify-between mb-2">
        <p className={`text-lg font-bold uppercase tracking-widest ${valueClass}`}>
          {label}
        </p>
        {icon && <span className={valueClass}>{icon}</span>}
      </div>
      <p className={`text-7xl font-heading font-black leading-none tabular-nums ${valueClass}`}>
        {value}
      </p>
      {sub && (
        <p className="text-base font-semibold text-muted-foreground mt-2">{sub}</p>
      )}
    </div>
  );
};

export default ProjectorMode;
