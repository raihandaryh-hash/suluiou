import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

const CTASection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary" />

      <div className="container mx-auto relative z-10">
        <motion.div
          className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-accent" />

          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-white">
            Temukan <span className="text-accent">Jalanmu</span> Sekarang
          </h2>
          <p className="text-white/70 text-lg max-w-lg mx-auto mb-8">
            24 pertanyaan. 10 menit. Satu langkah yang bisa mengubah arah
            hidupmu.
          </p>

          <Button asChild size="lg" className="group text-lg px-10 py-6 bg-accent text-primary-foreground hover:bg-accent/90">
            <Link to="/assessment">
              Mulai Assessment Gratis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <p className="text-xs text-white/50 mt-6">
            Berbasis instrumen HEXACO & RIASEC — diakui secara internasional
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="container mx-auto mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <Logo variant="white" size="sm" linkTo="/" />
          <p>
            © 2025 Sulu × IOU Indonesia. Dibuat untuk generasi yang berani bermimpi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
