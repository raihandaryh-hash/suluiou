import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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

interface Props {
  meta: ClassMeta;
  completed: number;
  enrolled: number;
  hollandDist: HollandRow[];
  hexacoData: HexacoRow[];
  onClose: () => void;
}

/**
 * Tampilan FULLSCREEN khusus untuk diproyeksikan ke layar kelas.
 * Optimasi: angka raksasa, kontras tinggi, terbaca dari 5–6 meter.
 * - Counter selesai/terdaftar SANGAT BESAR (kebutuhan polling utama)
 * - Distribusi Holland Code dominan (informasi paling actionable di kelas)
 * - HEXACO sebagai pendukung
 */
const ProjectorMode = ({
  meta,
  completed,
  enrolled,
  hollandDist,
  hexacoData,
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

  const pct = enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background overflow-auto"
    >
      {/* Tombol close — kecil, di pojok, tidak mengganggu */}
      <Button
        type="button"
        variant="ghost"
        size="lg"
        onClick={onClose}
        className="fixed top-4 right-4 z-10 gap-2 text-muted-foreground hover:text-foreground"
      >
        <X className="w-5 h-5" />
        Keluar (Esc)
      </Button>

      <div className="min-h-screen px-12 py-10 flex flex-col gap-10">
        {/* HEADER — nama kelas + kode JOIN besar */}
        <header className="flex items-end justify-between gap-8 border-b-4 border-primary pb-6">
          <div>
            <p className="text-2xl font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              {meta.school_name ?? 'Sulu Asesmen'}
            </p>
            <h1 className="text-6xl font-heading font-black text-foreground leading-tight">
              {meta.name}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Kode Kelas
            </p>
            <p className="text-7xl font-mono font-black text-primary tracking-widest">
              {meta.join_code}
            </p>
          </div>
        </header>

        {/* COUNTER RAKSASA — info utama untuk polling */}
        <section className="grid grid-cols-3 gap-6">
          <div className="col-span-2 rounded-3xl border-4 border-primary bg-primary/10 p-10 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold uppercase tracking-widest text-primary mb-4">
              Sudah Selesai
            </p>
            <div className="flex items-baseline gap-4">
              <span className="text-[12rem] leading-none font-heading font-black text-primary">
                {completed}
              </span>
              <span className="text-7xl font-heading font-bold text-muted-foreground">
                / {enrolled}
              </span>
            </div>
            <div className="mt-6 w-full max-w-2xl">
              <div className="h-6 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <p className="text-center text-3xl font-bold text-foreground mt-3">
                {pct}%
              </p>
            </div>
          </div>

          <div className="rounded-3xl border-4 border-border bg-card p-10 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Sisa
            </p>
            <span className="text-[10rem] leading-none font-heading font-black text-foreground">
              {Math.max(0, enrolled - completed)}
            </span>
            <p className="text-2xl font-semibold text-muted-foreground mt-4">
              siswa
            </p>
          </div>
        </section>

        {/* HOLLAND CODE — informasi paling actionable, tampil dominan */}
        {hollandDist.length > 0 && (
          <section className="rounded-3xl border-4 border-border bg-card p-10">
            <h2 className="text-4xl font-heading font-black text-foreground mb-8">
              Distribusi Tipe Minat (Holland Code)
            </h2>
            <div className="space-y-5">
              {hollandDist.slice(0, 8).map((d) => {
                const barPct = completed > 0 ? (d.count / completed) * 100 : 0;
                return (
                  <div key={d.code} className="flex items-center gap-6">
                    <span className="font-mono font-black text-5xl text-primary w-32 shrink-0">
                      {d.code}
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-12 overflow-hidden border-2 border-border">
                      <motion.div
                        className="h-full bg-accent flex items-center justify-end pr-4"
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-3xl font-bold text-foreground w-40 text-right">
                      {d.count}{' '}
                      <span className="text-xl text-muted-foreground">
                        ({barPct.toFixed(0)}%)
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* HEXACO — pendukung, font besar tapi tidak dominan */}
        {hexacoData.some((d) => d.value > 0) && (
          <section className="rounded-3xl border-4 border-border bg-card p-10">
            <h2 className="text-4xl font-heading font-black text-foreground mb-8">
              Karakter Rata-rata Kelas (HEXACO)
            </h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hexacoData}
                  layout="vertical"
                  margin={{ left: 80, right: 40, top: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    domain={[1, 5]}
                    stroke="hsl(var(--foreground))"
                    tick={{ fontSize: 20, fontWeight: 700 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={280}
                    stroke="hsl(var(--foreground))"
                    tick={{ fontSize: 18, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '2px solid hsl(var(--border))',
                      borderRadius: 12,
                      fontSize: 18,
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        <footer className="text-center text-xl text-muted-foreground pt-4">
          Sulu by IOU Indonesia · Layar diperbarui otomatis setiap 30 detik
        </footer>
      </div>
    </motion.div>
  );
};

export default ProjectorMode;
