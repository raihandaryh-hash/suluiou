import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flame } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-primary/8 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-torch-glow to-accent" />

          <Flame className="w-10 h-10 text-primary mx-auto mb-6" />

          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            Temukan <span className="text-gradient">Jalanmu</span> Sekarang
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
            24 pertanyaan. 10 menit. Satu langkah yang bisa mengubah arah
            hidupmu.
          </p>

          <Button asChild size="lg" className="group text-lg px-10 py-6 glow-primary">
            <Link to="/assessment">
              Mulai Assessment Gratis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground mt-6">
            Berbasis instrumen HEXACO & RIASEC — diakui secara internasional
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="container mx-auto mt-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary" />
            <span className="font-heading font-bold text-foreground">Sulu</span>
            <span>× IOU Indonesia</span>
          </div>
          <p>
            © 2025 Sulu. Dibuat untuk generasi yang berani bermimpi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;