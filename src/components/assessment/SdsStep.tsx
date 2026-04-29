import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/context/AssessmentContext';
import {
  sdsQuestions,
  sdsSectionMeta,
  riasecLabels,
  type SdsSection,
  type RiasecCategory,
} from '@/data/sdsQuestions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import Logo from '@/components/Logo';
import SaveStatusIndicator from '@/components/assessment/SaveStatusIndicator';

const CATEGORIES: RiasecCategory[] = ['R', 'I', 'A', 'S', 'E', 'C'];

const SdsStep = () => {
  const {
    sdsAnswers,
    sdsSection,
    toggleSds,
    goToSdsSection,
    completeAssessment,
  } = useAssessment();
  const navigate = useNavigate();

  const meta = sdsSectionMeta[sdsSection];

  const sectionQuestions = useMemo(
    () => sdsQuestions.filter((q) => q.section === sdsSection),
    [sdsSection]
  );

  const grouped = useMemo(() => {
    const map: Record<RiasecCategory, typeof sectionQuestions> = {
      R: [], I: [], A: [], S: [], E: [], C: [],
    };
    sectionQuestions.forEach((q) => map[q.category].push(q));
    return map;
  }, [sectionQuestions]);

  const totalAll = sdsQuestions.length;
  const answeredAll = Object.keys(sdsAnswers).length;
  const progress = ((sdsSection - 1) / 3) * 100; // section-based

  const handleNext = async () => {
    if (sdsSection < 3) {
      goToSdsSection((sdsSection + 1) as SdsSection);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      // Sync: compute scores instantly, then jump to results.
      // /results triggers the AI projection itself after first paint.
      completeAssessment();
      navigate('/results');
    }
  };

  const handlePrev = () => {
    if (sdsSection > 1) {
      goToSdsSection((sdsSection - 1) as SdsSection);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <Logo size="sm" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                Bagian 2 dari 2 · Minat
              </span>
              <span className="text-sm font-heading font-bold text-primary">
                {sdsSection}/3
              </span>
              <SaveStatusIndicator />
            </div>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 sm:px-6 py-6 max-w-2xl">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-3">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs text-primary uppercase tracking-wider font-semibold">
              SDS-Holland
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2 leading-snug">
            {meta.title}
          </h2>
          <p className="text-sm text-muted-foreground">{meta.instruction}</p>
          <p className="text-xs text-muted-foreground mt-2">
            <span className="font-semibold text-foreground">Tap</span> untuk pilih · biarkan kosong jika {meta.negative.toLowerCase()}.
          </p>
        </div>

        {CATEGORIES.map((cat) => {
          const items = grouped[cat];
          const selectedCount = items.filter((q) => sdsAnswers[q.id]).length;
          return (
            <section key={cat} className="mb-6">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-heading font-semibold text-foreground">
                  {riasecLabels[cat]}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {selectedCount}/{items.length}
                </span>
              </div>
              <ul className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
                {items.map((q) => {
                  const checked = !!sdsAnswers[q.id];
                  return (
                    <li key={q.id}>
                      <button
                        type="button"
                        onClick={() => toggleSds(q.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                          checked
                            ? 'bg-primary/8'
                            : 'hover:bg-muted/40 active:bg-muted/60'
                        )}
                      >
                        <span
                          className={cn(
                            'w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center',
                            checked
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background'
                          )}
                        >
                          {checked && <Check className="w-4 h-4" />}
                        </span>
                        <span
                          className={cn(
                            'text-sm leading-snug',
                            checked ? 'text-foreground font-medium' : 'text-foreground/80'
                          )}
                        >
                          {q.text}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <div className="text-center text-xs text-muted-foreground mb-4">
          Total dipilih: {answeredAll} dari {totalAll}
        </div>
      </div>

      <footer className="bg-card border-t border-border sticky bottom-0">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={sdsSection === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </Button>

          <Button
            onClick={handleNext}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {sdsSection < 3 ? 'Lanjut Bagian Berikutnya' : 'Lihat Hasil'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default SdsStep;
