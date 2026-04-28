import { useCallback, useState, useEffect } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { hexacoQuestions, hexacoLikertLabels } from '@/data/hexacoQuestions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from '@/components/Logo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const HexacoStep = () => {
  const {
    hexacoAnswers,
    hexacoIndex,
    setHexacoAnswer,
    nextHexaco,
    prevHexaco,
    jumpToHexaco,
    finishHexaco,
  } = useAssessment();

  const question = hexacoQuestions[hexacoIndex];
  const answeredCount = Object.keys(hexacoAnswers).length;
  const total = hexacoQuestions.length;
  const progress = (answeredCount / total) * 100;
  const currentAnswer = hexacoAnswers[question.id];
  const allAnswered = answeredCount === total;
  const currentAnswered = currentAnswer !== undefined;

  const [shake, setShake] = useState(false);
  useEffect(() => {
    if (currentAnswered && shake) setShake(false);
  }, [currentAnswered, shake]);

  /**
   * Skip-aware: cari item ter-skip pertama di antara index 0..hexacoIndex.
   * Return -1 kalau tidak ada item yang ter-skip di belakang/sebelum index aktif.
   */
  const findSkippedBefore = useCallback(
    (fromIndex: number): number => {
      for (let i = 0; i < fromIndex; i++) {
        if (hexacoAnswers[hexacoQuestions[i].id] === undefined) return i;
      }
      return -1;
    },
    [hexacoAnswers]
  );

  const advance = useCallback(() => {
    // 1) Kalau ada skip di antara 0..(hexacoIndex), lompat ke skip pertama.
    const skipped = findSkippedBefore(hexacoIndex);
    if (skipped !== -1) {
      jumpToHexaco(skipped);
      return;
    }
    // 2) Tidak ada skip di belakang → lanjut ke item berikutnya.
    if (hexacoIndex < total - 1) {
      nextHexaco();
    }
  }, [findSkippedBefore, hexacoIndex, jumpToHexaco, nextHexaco, total]);

  const handleAnswer = useCallback(
    (value: number) => {
      setHexacoAnswer(question.id, value);
      // Auto-advance dengan logika skip-aware.
      requestAnimationFrame(() => {
        // Hitung skip menggunakan state baru (asumsi item aktif baru saja terjawab).
        let nextSkipped = -1;
        for (let i = 0; i < hexacoIndex; i++) {
          if (hexacoAnswers[hexacoQuestions[i].id] === undefined) {
            nextSkipped = i;
            break;
          }
        }
        if (nextSkipped !== -1) {
          jumpToHexaco(nextSkipped);
        } else if (hexacoIndex < total - 1) {
          nextHexaco();
        }
      });
    },
    [question.id, hexacoIndex, total, setHexacoAnswer, nextHexaco, jumpToHexaco, hexacoAnswers]
  );

  const handleNext = () => {
    if (!currentAnswered) {
      setShake(true);
      return;
    }
    advance();
  };

  const handleProceed = () => {
    if (!allAnswered) {
      const firstUnansweredIdx = hexacoQuestions.findIndex(
        (q) => hexacoAnswers[q.id] === undefined
      );
      if (firstUnansweredIdx !== -1) {
        jumpToHexaco(firstUnansweredIdx);
        setShake(true);
      }
      return;
    }
    finishHexaco();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <Logo size="sm" />
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                Bagian 1 dari 2 · Kepribadian
              </span>
              <span className="text-xs font-semibold text-foreground bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                {answeredCount} dari {total} pertanyaan terjawab
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

          <div
            className={cn(
              'flex flex-col gap-2.5 max-w-xl mx-auto rounded-2xl transition-all',
              shake && !currentAnswered && 'ring-2 ring-destructive ring-offset-4 ring-offset-background animate-pulse p-2'
            )}
          >
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
                      : shake && !currentAnswered
                        ? 'bg-card border-destructive/60 text-foreground hover:border-destructive'
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

          {shake && !currentAnswered && (
            <p className="mt-4 text-sm text-destructive flex items-center justify-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4" />
              Pertanyaan ini wajib dijawab sebelum lanjut.
            </p>
          )}
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

          {hexacoIndex === total - 1 && allAnswered ? (
            <Button
              onClick={handleProceed}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Lanjut ke Bagian 2
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : hexacoIndex === total - 1 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      onClick={handleProceed}
                      disabled={!allAnswered}
                      className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
                    >
                      Lanjut ke Bagian 2
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Masih ada {total - answeredCount} pertanyaan yang belum dijawab.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip open={!currentAnswered ? undefined : false}>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="default"
                      onClick={handleNext}
                      disabled={!currentAnswered}
                      className="gap-2 disabled:opacity-50"
                    >
                      <span className="hidden sm:inline">Lanjut</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                {!currentAnswered && (
                  <TooltipContent>
                    <p>Pilih salah satu jawaban dulu.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </footer>
    </div>
  );
};

export default HexacoStep;
