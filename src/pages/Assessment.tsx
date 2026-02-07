import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAssessment } from '@/context/AssessmentContext';
import { questions, likertLabels } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft, Flame } from 'lucide-react';

const Assessment = () => {
  const {
    answers,
    currentQuestion,
    setAnswer,
    nextQuestion,
    prevQuestion,
    completeAssessment,
  } = useAssessment();
  const navigate = useNavigate();

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;
  const currentAnswer = answers[question.id];
  const allAnswered = answeredCount === questions.length;

  const handleAnswer = useCallback(
    (value: number) => {
      setAnswer(question.id, value);
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          nextQuestion();
        }
      }, 350);
    },
    [question.id, currentQuestion, setAnswer, nextQuestion]
  );

  const handleComplete = () => {
    completeAssessment();
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-primary font-heading font-bold text-xl"
            >
              <Flame className="w-5 h-5" />
              Sulu
            </Link>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="text-center"
            >
              {/* Framework badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <span className="text-xs text-primary uppercase tracking-wider font-medium">
                  {question.framework === 'hexaco'
                    ? 'Kepribadian'
                    : 'Minat Karier'}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-12 leading-snug">
                {question.text}
              </h2>

              {/* Likert scale */}
              <div className="flex flex-col gap-3">
                {likertLabels.map((label, index) => {
                  const value = index + 1;
                  const isSelected = currentAnswer === value;
                  return (
                    <button
                      key={value}
                      onClick={() => handleAnswer(value)}
                      className={cn(
                        'w-full py-4 px-6 rounded-xl border transition-all duration-200 text-left font-medium',
                        isSelected
                          ? 'bg-primary/15 border-primary text-foreground glow-primary'
                          : 'bg-card/50 border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors',
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border text-muted-foreground'
                          )}
                        >
                          {value}
                        </span>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <footer className="p-6 border-t border-border">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          {allAnswered ? (
            <Button onClick={handleComplete} className="gap-2 glow-primary">
              Lihat Hasil
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={nextQuestion}
              disabled={currentQuestion === questions.length - 1}
              className="gap-2"
            >
              Lewati
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Assessment;