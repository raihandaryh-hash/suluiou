import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Logo from '@/components/Logo';
import { track } from '@/lib/track';

type JalurId = 'mandiri_ptn' | 'um_ptkin' | 'pbsb' | 'kip_kuliah' | 'iou' | 'gap_year';

interface PathwayCard {
  name: string;
  badge: string;
  badgeVariant: 'warning' | 'success' | 'muted';
  description: string;
  deadline: string;
  ctaText: string;
  ctaLink: string;
  jalur: JalurId;
  extraBullets?: string[];
  smallNote?: string;
}

const pathways: PathwayCard[] = [
  {
    name: 'PTN Jalur Mandiri',
    badge: 'Masih Buka',
    badgeVariant: 'success',
    description:
      'Sebagian besar PTN membuka jalur mandiri Juli–Agustus 2026. Periksa langsung website PTN yang kamu tuju.',
    deadline: 'Cek website PTN masing-masing',
    ctaText: 'Cara cek jadwal mandiri →',
    ctaLink: 'https://snpmb.bppp.kemdikbud.go.id',
    jalur: 'mandiri_ptn',
  },
  {
    name: 'UM-PTKIN',
    badge: 'Segera Tutup',
    badgeVariant: 'warning',
    description:
      'Ujian Masuk Perguruan Tinggi Keagamaan Islam Negeri — untuk UIN, IAIN, STAIN. Diselenggarakan Kemenag.',
    deadline: 'Pendaftaran: cek spmb-ptkin.ac.id',
    ctaText: 'Info UM-PTKIN →',
    ctaLink: 'https://spmb-ptkin.ac.id',
    jalur: 'um_ptkin',
  },
  {
    name: 'PBSB Kemenag',
    badge: 'Untuk Santri',
    badgeVariant: 'muted',
    description:
      'Program Beasiswa Santri Berprestasi — beasiswa penuh ke PTN pilihan untuk lulusan pesantren.',
    deadline: 'Cek jadwal di website Kemenag',
    ctaText: 'Info PBSB →',
    ctaLink: 'https://pbsb.kemenag.go.id',
    jalur: 'pbsb',
  },
  {
    name: 'KIP Kuliah',
    badge: 'Beasiswa',
    badgeVariant: 'muted',
    description:
      'Kartu Indonesia Pintar Kuliah — bantuan biaya kuliah dan biaya hidup untuk keluarga kurang mampu. Bisa diajukan ke PTN maupun PTS terakreditasi.',
    deadline: 'Daftar: Feb–Okt 2026 (cek kip-kuliah.kemdikbud.go.id)',
    ctaText: 'Info KIP Kuliah →',
    ctaLink: 'https://kip-kuliah.kemdikbud.go.id',
    jalur: 'kip_kuliah',
  },
  {
    name: 'IOU Indonesia',
    badge: 'Kuliah Online',
    badgeVariant: 'muted',
    description:
      'International Open University Indonesia — kuliah Islam berbasis online, dari rumah, dengan jadwal yang fleksibel. Ijazah setara Kemendikbud RI.',
    deadline: '',
    ctaText: 'Pelajari IOU →',
    ctaLink: 'https://bahasa.iou.edu.gm',
    jalur: 'iou',
    extraBullets: [
      'Biaya: Rp 1,5–2,4 juta per semester',
      'Pendaftaran: gratis, sepanjang tahun',
      'Program: BBA, Psikologi, BAIS, ALS, Pendidikan',
    ],
    smallNote: 'IOU adalah mitra penyelenggara platform Sulu.',
  },
  {
    name: 'Gap Year & Mandiri',
    badge: 'Jalur Lain',
    badgeVariant: 'muted',
    description:
      'Bekerja, magang, atau membangun keahlian dulu sebelum kuliah bukan kekalahan — ini strategi yang diambil banyak yang akhirnya masuk jalur terbaik mereka.',
    deadline: '(tidak ada deadline)',
    ctaText: 'Sumber gap year →',
    ctaLink: 'https://kampusgratis.id',
    jalur: 'gap_year',
  },
];

const badgeClasses: Record<PathwayCard['badgeVariant'], string> = {
  warning:
    'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100',
  success:
    'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100',
  muted:
    'bg-navy/5 text-navy/70 border-navy/10 hover:bg-navy/5',
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

const Programs = () => {
  useEffect(() => {
    track('programs_viewed');
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo variant="default" size="md" linkTo="/" />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-ink-muted hover:text-navy"
          >
            <a href="/">← Kembali</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-12 pb-8 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.h1
            className="font-heading font-semibold text-3xl md:text-4xl text-navy mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Jalurmu lebih dari satu.
          </motion.h1>
          <motion.p
            className="text-sm md:text-base text-ink-muted max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Perjalananmu tidak berhenti di pengumuman PTN. Ini semua jalur yang tersedia — informasi, bukan tekanan.
          </motion.p>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="pb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {pathways.map((p) => (
              <motion.div
                key={p.name}
                variants={cardVariants}
                className="rounded-xl border border-border bg-card p-6 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-heading font-semibold text-lg text-ink leading-tight">
                    {p.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${badgeClasses[p.badgeVariant]}`}
                  >
                    {p.badge}
                  </Badge>
                </div>

                <p className="text-sm text-ink-muted leading-relaxed mb-4 flex-grow">
                  {p.description}
                </p>

                {p.extraBullets && (
                  <ul className="space-y-1.5 mb-4">
                    {p.extraBullets.map((bullet) => (
                      <li key={bullet} className="text-sm text-ink-muted flex items-start gap-2">
                        <span className="text-torch-gold mt-0.5">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}

                {p.smallNote && (
                  <p className="text-xs text-ink-muted italic mb-4">
                    {p.smallNote}
                  </p>
                )}

                {p.deadline && (
                  <p className="text-xs text-ink-muted/80 mb-4">
                    {p.deadline}
                  </p>
                )}

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-fit px-0 text-navy hover:text-mid-blue hover:bg-transparent group text-sm font-medium"
                >
                  <a
                    href={p.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('program_cta_clicked', { jalur: p.jalur })}
                  >
                    {p.ctaText}
                    <ExternalLink className="ml-1.5 w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="pb-12 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-xs text-ink-muted/70">
            Informasi di halaman ini diperbarui per Juni 2026. Selalu cek website resmi masing-masing program untuk jadwal terkini.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Programs;
