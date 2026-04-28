import { useAssessment } from '@/context/AssessmentContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';

const HexacoDoneStep = () => {
  const { startSds } = useAssessment();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Logo size="sm" />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl text-center"
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-accent/15 border-2 border-accent flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Bagian 1 selesai ✓
          </h1>

          <p className="text-base md:text-lg text-muted-foreground mb-2">
            Kamu sudah menyelesaikan <span className="font-semibold text-foreground">60 pertanyaan</span> tentang kepribadian.
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-10">
            Sekarang lanjut ke <span className="font-semibold text-foreground">bagian 2 dari 2</span> — minat & aktivitas.
          </p>

          <Button
            size="lg"
            onClick={startSds}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8"
          >
            Lanjut ke Bagian 2
            <ArrowRight className="w-5 h-5" />
          </Button>

          <p className="text-xs text-muted-foreground mt-6">
            Bagian 2 berisi 216 item singkat — kamu cukup centang yang sesuai.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HexacoDoneStep;
