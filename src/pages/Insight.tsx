import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

// ---------- Helpers ----------
function useCountdownTo(targetIso: string) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  return useMemo(() => {
    const target = new Date(targetIso);
    const diffMs = target.getTime() - now.getTime();
    const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const years = Math.max(0, target.getFullYear() - now.getFullYear() - (
      (now.getMonth() > target.getMonth() ||
        (now.getMonth() === target.getMonth() && now.getDate() > target.getDate())) ? 1 : 0
    ));
    const totalMonths = Math.max(
      0,
      (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
    );
    return { years, months: totalMonths, days: totalDays };
  }, [now, targetIso]);
}

// ---------- Stat Card (collapsible) ----------
type Tone = 'negative' | 'positive' | 'neutral';

interface StatCardProps {
  value: string;
  label: string;
  detail: string;
  source: string;
  tone?: Tone;
}

function StatCard({ value, label, detail, source, tone = 'neutral' }: StatCardProps) {
  const [open, setOpen] = useState(false);
  const valueColor =
    tone === 'negative' ? 'text-destructive' :
    tone === 'positive' ? 'text-primary' :
    'text-foreground';

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={cn(
        'group text-left w-full bg-secondary/60 hover:bg-secondary',
        'border border-border rounded-2xl p-6 transition-all',
        'focus:outline-none focus:ring-2 focus:ring-ring'
      )}
      aria-expanded={open}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className={cn('font-heading font-medium tracking-tight text-3xl md:text-4xl', valueColor)}>
            {value}
          </div>
          <div className="text-sm text-muted-foreground leading-snug">{label}</div>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform',
            open && 'rotate-180'
          )}
        />
      </div>
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          open ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-foreground/80 leading-relaxed">{detail}</p>
          <p className="text-xs text-muted-foreground mt-3 italic">Sumber: {source}</p>
        </div>
      </div>
    </button>
  );
}

// ---------- Data ----------
const indonesiaCards: StatCardProps[] = [
  {
    value: '19,44%',
    label: 'pemuda Indonesia berstatus NEET',
    detail:
      'Tidak bekerja, tidak sekolah, tidak pelatihan. Setara lebih dari 9 juta anak muda yang terputus dari jalur pengembangan diri — di tengah puncak bonus demografi. Kesenjangan gender tajam: perempuan 35,77% vs laki-laki 16,38%.',
    source: 'BPS Sakernas 2025',
    tone: 'negative',
  },
  {
    value: '87%',
    label: 'mahasiswa mengaku salah jurusan',
    detail:
      'Bukan kebetulan — ini akibat sistem bimbingan karir yang hampir tidak ada. Rasio guru BK di madrasah: 1:150. Dampaknya: 43% mengalami gangguan mental health, 26% nilai akademik turun drastis.',
    source: 'Survei nasional IDF 2023–2024; OECD',
    tone: 'negative',
  },
  {
    value: '17,32%',
    label: 'tingkat pengangguran pemuda usia 15–24',
    detail:
      'Lebih dari 3× lipat rata-rata nasional (4,76%). Ironinya: lulusan SMK — yang dirancang siap kerja — justru penganggurannya paling tinggi (9,01%). Hanya 35,4% bekerja sesuai keahlian.',
    source: 'BPS Sakernas Agustus 2024',
    tone: 'negative',
  },
  {
    value: '20%',
    label: 'penurunan posisi entry-level di sektor terpapar AI',
    detail:
      '"Junior Squeeze" — AI mengambil alih tugas yang biasanya diberikan ke karyawan junior. Yang survive bukan yang sekadar terampil teknis, tapi yang punya judgment manusia + nilai yang tidak bisa direplikasi mesin.',
    source: 'Stanford AI Index 2026',
    tone: 'negative',
  },
];

const worldCards: StatCardProps[] = [
  {
    value: '+78 juta',
    label: 'pertumbuhan neto lapangan kerja global',
    detail:
      '170 juta pekerjaan baru tercipta, 92 juta hilang. Tapi tidak merata — negara berkembang seperti Indonesia menghadapi instabilitas lebih besar karena ketergantungan pada sektor yang mudah diotomasi. 59 dari 100 pekerja butuh pelatihan ulang sebelum 2030.',
    source: 'WEF Future of Jobs Report 2025',
    tone: 'neutral',
  },
  {
    value: '39%',
    label: 'skill inti hari ini akan usang pada 2030',
    detail:
      'Yang bertahan: analytical thinking, kreativitas, resiliensi, literasi AI, kepemimpinan — semua human-core skills yang tidak bisa direplikasi mesin.',
    source: 'WEF Future of Jobs Report 2025',
    tone: 'negative',
  },
  {
    value: '47,27%',
    label: 'kontribusi sektor halal ke PDB Indonesia',
    detail:
      '~Rp10.600 triliun pada 2024. Indonesia #1 dunia modest fashion, #2 halal tourism. Masalahnya: SDM yang paham fiqh muamalah sekaligus bisnis modern sangat langka.',
    source: 'KNEKS 2024, SGIE Report 2024/2025',
    tone: 'positive',
  },
  {
    value: '1:150',
    label: 'rasio guru BK di madrasah Indonesia',
    detail:
      'OECD membuktikan: bimbingan karir usia 15 berkorelasi kuat dengan outcome kerja usia 25. Kebutuhan nyata yang hampir tidak ada supplainya — ini peluang, bukan sekadar masalah.',
    source: 'OECD Education at a Glance; data Kemendikbud',
    tone: 'neutral',
  },
];

const neetData = [
  { country: 'Indonesia', value: 19.44, color: 'bg-destructive' },
  { country: 'Malaysia', value: 13.63, color: 'bg-amber-500' },
  { country: 'Vietnam', value: 10.82, color: 'bg-amber-500' },
  { country: 'Singapura', value: 4.1, color: 'bg-primary' },
];

const opportunities = [
  {
    title: 'Agritech & ketahanan pangan',
    body:
      'Indonesia masih impor gandum, kedelai, bawang putih. Infrastruktur sedang dibangun, SDM belum ada.',
  },
  {
    title: 'Keuangan syariah',
    body:
      'Aset tumbuh 33,92% tapi mismatch SDM akut. Dibutuhkan analis yang paham keduanya.',
  },
  {
    title: 'Konten digital Islam',
    body:
      'Pasar besar, sangat kekurangan kreator yang punya otoritas keagamaan sekaligus keterampilan media digital.',
  },
  {
    title: 'Bimbingan karir berbasis nilai',
    body:
      'Rasio 1:150 di madrasah. Kebutuhan nyata yang hampir tidak ada supplainya.',
  },
];

// ---------- Page ----------
const Insight = () => {
  const { years, months } = useCountdownTo('2030-01-01');

  return (
    <main className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="border-b border-border sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" linkTo="/" />
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
          </Button>
        </div>
      </header>

      {/* SECTION 1 — Hero */}
      <section className="container mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-heading font-semibold tracking-tight text-3xl md:text-5xl leading-[1.1] text-foreground"
        >
          Dunia yang akan kamu masuki
          <br />
          <span className="text-muted-foreground">sudah berubah sebelum kamu siap.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-sm md:text-base text-muted-foreground mt-6 max-w-xl"
        >
          Bukan untuk menakut-nakuti. Tapi karena kamu berhak tahu.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <div className="bg-secondary/60 border border-border rounded-full px-4 py-2 text-sm">
            <span className="font-semibold text-foreground">{years}</span>{' '}
            <span className="text-muted-foreground">tahun tersisa menuju 2030</span>
          </div>
          <div className="bg-secondary/60 border border-border rounded-full px-4 py-2 text-sm">
            <span className="font-semibold text-foreground">{months}</span>{' '}
            <span className="text-muted-foreground">bulan untuk bergerak</span>
          </div>
          <div className="bg-secondary/60 border border-border rounded-full px-4 py-2 text-sm">
            <span className="font-semibold text-foreground">208 juta</span>{' '}
            <span className="text-muted-foreground">jiwa produktif pada puncak bonus demografi</span>
          </div>
        </motion.div>

        <div className="mt-10">
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              Kenali profilmu sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* SECTION 2 — Indonesia hari ini */}
      <section className="container mx-auto px-6 py-16 max-w-6xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-6">
          INDONESIA HARI INI
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {indonesiaCards.map((c) => (
            <StatCard key={c.label} {...c} />
          ))}
        </div>
      </section>

      {/* SECTION 3 — NEET ASEAN bar chart */}
      <section className="container mx-auto px-6 py-16 max-w-4xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-6">
          NEET INDONESIA VS ASEAN
        </p>
        <div className="bg-secondary/60 border border-border rounded-2xl p-6 md:p-8 space-y-5">
          {neetData.map((row) => (
            <div key={row.country}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{row.country}</span>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {row.value.toString().replace('.', ',')}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-background overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full', row.color)}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(row.value / 25) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground italic pt-2">
            Sumber: BPS Sakernas 2025; ASEAN Statistical Yearbook 2024.
          </p>
        </div>
      </section>

      {/* SECTION 4 — Dunia yang sedang berubah */}
      <section className="container mx-auto px-6 py-16 max-w-6xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-6">
          DUNIA YANG SEDANG BERUBAH — 2025–2030
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {worldCards.map((c) => (
            <StatCard key={c.label} {...c} />
          ))}
        </div>
      </section>

      {/* SECTION 5 — Peluang yang belum diisi */}
      <section className="container mx-auto px-6 py-16 max-w-6xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-6">
          PELUANG YANG BELUM DIISI — SHORTAGE SDM 2030
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {opportunities.map((o, i) => (
            <div
              key={o.title}
              className="bg-secondary/60 border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors"
            >
              <div className="text-xs font-semibold text-primary tabular-nums mb-3">
                0{i + 1}
              </div>
              <h3 className="font-heading font-semibold text-base md:text-lg text-foreground leading-snug mb-3">
                {o.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 — CTA */}
      <section className="container mx-auto px-6 py-20 md:py-28 max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-semibold text-3xl md:text-4xl tracking-tight leading-[1.15]"
        >
          Kamu sudah tahu kondisinya.
          <br />
          <span className="text-primary">Sekarang, kenali dirimu.</span>
        </motion.h2>
        <div className="mt-8">
          <Button asChild size="lg" className="gap-2 text-base">
            <Link to="/">
              Mulai asesmen Sulu — gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-16 pt-10 border-t border-border max-w-xl mx-auto">
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Mendampingi siswa menentukan arah?
            <br />
            Sulu membantu membuka percakapan yang bermakna.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/">Pelajari lebih lanjut</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Insight;
