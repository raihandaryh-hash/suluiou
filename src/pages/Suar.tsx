import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Suar = () => {
  const [slides, setSlides] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetch('/suar-slides/manifest.json')
      .then((r) => r.json())
      .then((files: string[]) => {
        setSlides(Array.isArray(files) ? files : []);
        setIsLoading(false);
      })
      .catch(() => {
        setSlides([]);
        setIsLoading(false);
      });
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
      if (e.key === 'Enter') {
        if (current === slides.length - 1) {
          navigate('/assessment');
        } else {
          next();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, current, slides.length, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" aria-label="Kembali ke beranda">
            <Logo size="sm" />
          </Link>
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

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="glass rounded-2xl p-12 text-center max-w-md">
              <p className="text-muted-foreground">Memuat tayangan...</p>
            </div>
          </div>
        ) : slides.length === 0 ? (
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

            <div className="flex items-center justify-between gap-4 mb-4">
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

            <div className="flex items-center justify-center gap-2 mb-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    i === current
                      ? 'bg-primary w-4'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/60',
                  )}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
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
