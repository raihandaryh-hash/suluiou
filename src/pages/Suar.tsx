import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Maximize,
  Minimize,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const BUCKET = 'suar-slides';

const Suar = () => {
  const [slideUrls, setSlideUrls] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Sync state with browser fullscreen changes (e.g. user presses Esc)
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await stageRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      // 1. Try Supabase Storage (so admin uploads reflect without redeploy)
      try {
        const { data, error } = await supabase.storage
          .from(BUCKET)
          .list('', { limit: 200, sortBy: { column: 'name', order: 'asc' } });
        if (!error && data && data.length > 0) {
          const files = data
            .filter((f) => /\.(jpe?g|png|webp)$/i.test(f.name))
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
          if (files.length > 0) {
            const urls = files.map(
              (f) => supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
            );
            if (!cancelled) {
              setSlideUrls(urls);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch {
        // fall through to manifest
      }
      // 2. Fallback to bundled manifest
      try {
        const res = await fetch('/suar-slides/manifest.json');
        const files: string[] = await res.json();
        if (!cancelled) {
          setSlideUrls(
            Array.isArray(files) ? files.map((f) => `/suar-slides/${f}`) : [],
          );
        }
      } catch {
        if (!cancelled) setSlideUrls([]);
      }
      if (!cancelled) setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(
    () => setCurrent((c) => Math.min(slideUrls.length - 1, c + 1)),
    [slideUrls.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Enter') {
        if (current === slideUrls.length - 1) {
          navigate('/assessment');
        } else {
          next();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, current, slideUrls.length, navigate]);

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
        ) : slideUrls.length === 0 ? (
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
                src={slideUrls[current]}
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
                {current + 1} / {slideUrls.length}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={next}
                disabled={current === slideUrls.length - 1}
                aria-label="Slide berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
              {slideUrls.map((_, i) => (
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
