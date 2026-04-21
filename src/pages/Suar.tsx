import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const Suar = () => {
  const [slides, setSlides] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/suar-slides/manifest.json')
      .then((r) => r.json())
      .then((files: string[]) => setSlides(Array.isArray(files) ? files : []))
      .catch(() => setSlides([]));
  }, []);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(
    () => setCurrent((c) => Math.min(slides.length - 1, c + 1)),
    [slides.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <Logo size="sm" />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-10 max-w-5xl flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
            <span className="text-gradient">Suar</span>
          </h1>
          <p className="text-muted-foreground">
            Tayangan pembuka sebelum asesmen
          </p>
        </div>

        {slides.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="glass rounded-2xl p-12 text-center max-w-md">
              <p className="text-muted-foreground">
                Slide sedang disiapkan oleh tim IOU.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="glass rounded-2xl overflow-hidden mb-4 bg-card">
              <img
                src={`/suar-slides/${slides[current]}`}
                alt={`Slide ${current + 1}`}
                className="w-full h-auto object-contain max-h-[60vh] mx-auto"
              />
            </div>

            <div className="flex items-center justify-between gap-4 mb-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                disabled={current === 0}
                aria-label="Slide sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="text-sm text-muted-foreground tabular-nums">
                {current + 1} / {slides.length}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={next}
                disabled={current === slides.length - 1}
                aria-label="Slide berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="text-center pb-6">
          <Button
            size="lg"
            onClick={() => navigate('/assessment')}
            className="gap-2 glow-primary"
          >
            Mulai Asesmen
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Suar;
