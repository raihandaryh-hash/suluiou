import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col bg-background">
      {/* Top nav */}
      <header className="py-5">
        <div className="container mx-auto flex items-center justify-between px-6">
          <Logo size="md" linkTo="/" />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/insight">Mengapa ini penting? →</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/insight">Lihat Data</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-6 py-16 md:py-24 max-w-2xl text-center">
          <motion.h1
            className="font-heading font-semibold tracking-tight text-3xl md:text-5xl leading-[1.15] text-foreground mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Kamu sedang berada di titik yang sangat penting.
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Bonus demografi hanya datang sekali.
          </motion.p>

          <motion.div
            className="space-y-5 text-left md:text-center text-foreground/85 text-base md:text-[17px] leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p>
              Kamu lahir di masa yang tepat. Tahun 2030 nanti, 68 juta Gen Z akan
              menjadi mayoritas penduduk produktif Indonesia. Namun banyak di antara
              kita yang masih bingung arah.
            </p>
            <p>Kamu tidak sendiri dalam kebingungan ini.</p>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <Button asChild size="lg" className="group">
              <Link to="/insight">
                Kenali Duniamu Dulu
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          <motion.p
            className="text-sm text-muted-foreground mt-8 max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Platform ini dirancang untuk membantu kamu menjelajahi diri, memahami
            dunia, dan menemukan arah kontribusimu.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
