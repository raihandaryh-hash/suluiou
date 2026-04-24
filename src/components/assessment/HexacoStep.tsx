import { useCallback } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { hexacoQuestions, hexacoLikertLabels } from '@/data/hexacoQuestions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';

const HexacoStep = () => {
  const {
    hexacoAnswers,
    hexacoIndex,
    setHexacoAnswer,
    nextHexaco,
    prevHexaco,
    startSds,
  } = useAssessment();

  const question = hexacoQuestions[hexacoIndex];
  const answeredCount = Object.keys(hexacoAnswers).length;
  const total = hexacoQuestions.length;
  const progress = (answeredCount / total) * 100;
  const currentAnswer = hexacoAnswers[question.id];
  const allAnswered = answeredCount === total;

  const handleAnswer = useCallback(
    (value: number) => {
      setHexacoAnswer(question.id, value);
      // satset: pindah otomatis tanpa delay/animasi besar
      if (hexacoIndex < total - 1) {
        // small microtask to let state commit
        requestAnimationFrame(() => nextHexaco());
      }
    },
    [question.id, hexacoIndex, total, setHexacoAnswer, nextHexaco]
  );

  const handleProceed = () => {
    if (!allAnswered) return;
    startSds();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <Logo size="sm" />
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                Bagian 1 dari 2 · Kepribadian
              </span>
              <span className="text-sm font-heading font-bold text-primary">
                {hexacoIndex + 1}/{total}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-8">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs text-primary uppercase tracking-wider font-semibold">
              HEXACO-PIR
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-10 leading-snug px-2">
            {question.text}
          </h2>

          <div className="flex flex-col gap-2.5 max-w-xl mx-auto">
            {hexacoLikertLabels.map((label, i) => {
              const value = i + 1;
              const isSelected = currentAnswer === value;
              return (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={cn(
                    'w-full py-3.5 px-5 rounded-xl border-2 text-left font-medium transition-colors',
                    isSelected
                      ? 'bg-primary/10 border-primary text-foreground'
                      : 'bg-card border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        'w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-muted-foreground'
                      )}
                    >
                      {isSelected ? <CheckCircle2 className="w-4 h-4" /> : value}
                    </span>
                    <span className="text-sm md:text-base">{label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={prevHexaco}
            disabled={hexacoIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </Button>

          <span className="text-xs text-muted-foreground">
            {answeredCount}/{total} dijawab
          </span>

          {allAnswered ? (
            <Button
              onClick={handleProceed}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Lanjut ke Bagian 2
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={nextHexaco}
              disabled={hexacoIndex === total - 1}
              className="gap-2"
            >
              <span className="hidden sm:inline">Lewati</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default HexacoStep;
