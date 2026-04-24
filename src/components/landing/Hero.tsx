import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, BarChart3, ShieldCheck } from 'lucide-react';
import heroImage from '@/assets/hero-sulu.jpg';
import Logo from '@/components/Logo';

const previewScores = [
  { label: 'Kejujuran & Kerendahan Hati (H)', value: 85 },
  { label: 'Emosionalitas (E)', value: 62 },
  { label: 'Ekstraversi (X)', value: 78 },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background image with scholarly overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        {/* Signature torch gradient overlay (navy → mid-blue → subtle gold) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--brand-navy) / 0.97) 0%, hsl(var(--mid-blue) / 0.90) 60%, hsl(var(--torch-gold) / 0.20) 100%)',
          }}
        />
        {/* Scholarly bottom fade into page background */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* Top nav */}
      <header className="absolute top-0 left-0 right-0 z-20 py-5">
        <div className="container mx-auto flex items-center justify-between px-6">
          <Logo variant="white" size="md" linkTo="/" />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-white/40 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm"
          >
            <a href="#data-insights">Lihat Data</a>
          </Button>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 lg:pt-24 lg:pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: Headline + CTA */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/30 mb-7"
            >
              <Sparkles className="w-3 h-3 text-torch-gold" strokeWidth={2} />
              <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-white/85">
                Didukung oleh IOU Indonesia
              </span>
            </motion.div>

            <motion.h1
              className="font-heading font-bold leading-[1.08] tracking-tight text-white text-5xl md:text-5xl lg:text-6xl mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              Masa Depanmu
              <br />
              Bukan Kebetulan.
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Temukan arah karier yang tepat dengan panduan berbasis data.
              Menggunakan metodologi <span className="text-white font-medium">HEXACO &amp; RIASEC</span>{' '}
              yang divalidasi oleh institusi akademik terkemuka.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
            >
              <Button
                asChild
                size="lg"
                className="group text-base px-7 py-6 bg-torch-gold hover:bg-torch-gold/90 text-navy-deep font-semibold glow-accent shadow-lg"
              >
                <Link to="/login">
                  Mulai Assessment
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-7 py-6 border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm"
              >
                <Link to="/suar">Pelajari Metodologi</Link>
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 mt-10 text-xs text-white/75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['AR', 'NS', 'FK'].map((initials) => (
                    <div
                      key={initials}
                      className="w-8 h-8 rounded-full bg-white/15 border-2 border-navy-deep/40 backdrop-blur-sm flex items-center justify-center text-[10px] font-semibold text-white/90"
                    >
                      {initials}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-torch-gold border-2 border-navy-deep/40 flex items-center justify-center text-[10px] font-bold text-navy-deep">
                    +5k
                  </div>
                </div>
                <span className="text-white/80">
                  <span className="font-semibold text-white">5,000+ siswa</span> telah menemukan arahnya
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-torch-gold" strokeWidth={1.75} />
                <span>Instrumen Tervalidasi</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Floating glass preview card */}
          <motion.div
            className="lg:col-span-5 hidden lg:block"
            initial={{ opacity: 0, x: 40, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
          >
            <div className="relative">
              <div className="relative glass rounded-2xl p-7 shadow-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-navy" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-ink text-base leading-tight">
                      Validasi Akademik
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      HEXACO Personality Inventory
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {previewScores.map((s, i) => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-ink/80">{s.label}</span>
                        <span className="text-xs font-semibold text-navy tabular-nums">
                          {s.value}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-navy/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-navy"
                          initial={{ width: 0 }}
                          animate={{ width: `${s.value}%` }}
                          transition={{ duration: 1.1, delay: 0.9 + i * 0.15, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
