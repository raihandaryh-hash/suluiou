import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import Logo from '@/components/Logo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { mukadimahContent as M } from '@/data/mukadimahContent';

const Hero = () => {
  const [open, setOpen] = useState(false);

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
            {M.hook}
          </motion.h1>

          <motion.p
            className="measure mx-auto text-base md:text-lg text-muted-foreground leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {M.sub}
          </motion.p>

          <motion.div
            className="measure mx-auto space-y-5 text-left text-foreground/85 text-base md:text-[17px] leading-[1.75] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {M.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <Button asChild size="lg" className="group">
              <Link to={M.ctaTo}>
                {M.ctaLabel}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-sm text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  <BookOpen className="w-4 h-4" />
                  {M.depthLabel}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-heading text-xl">
                    {M.depthLabel}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-5 pt-2">
                  {M.dalil.map((d, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-secondary/40 px-5 py-4 space-y-2 text-left"
                    >
                      {d.arab && (
                        <p
                          dir="rtl"
                          lang="ar"
                          className="text-xl leading-loose text-foreground text-right"
                        >
                          {d.arab}
                        </p>
                      )}
                      <p className="text-sm italic text-foreground/90 leading-relaxed">
                        {d.terjemah}
                      </p>
                      <p className="text-xs text-muted-foreground">{d.ref}</p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
