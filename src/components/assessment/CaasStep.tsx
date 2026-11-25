import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAssessment } from '@/context/AssessmentContext';
import { useToast } from '@/hooks/use-toast';
import { caasQuestions, caasLabels, instrumenAdaptasi } from '@/data/caasQuestions';

// Bagian 3: kemampuan adaptasi karier (CAAS versi Indonesia, 24 butir, skala 1-5).
const CaasStep = () => {
  const { hexacoAnswers, setHexacoAnswer, startSds, completeAssessment } = useAssessment();
  const navigate = useNavigate();
  const { toast } = useToast();

  const terjawab = caasQuestions.filter((q) => hexacoAnswers[q.id] !== undefined).length;
  const total = caasQuestions.length;
  const lengkap = terjawab === total;

  const selesai = () => {
    if (!lengkap) {
      const pertama = caasQuestions.find((q) => hexacoAnswers[q.id] === undefined);
      if (pertama) document.getElementById(`caas-${pertama.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    // Skor dihitung seketika; /results memicu narasi AI sesudah tampil.
    if (completeAssessment()) navigate('/results');
    else toast({ title: 'Bagian 1 belum lengkap', description: 'Lengkapi dulu pertanyaan kepribadian yang terlewat.' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <Logo size="sm" />
            <span className="text-xs text-muted-foreground">Bagian 3 dari 3</span>
          </div>
          <Progress value={(terjawab / total) * 100} className="h-1.5" />
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 sm:px-6 py-6 max-w-2xl">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-3">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs text-primary uppercase tracking-wider font-semibold">{instrumenAdaptasi.nama}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2 leading-snug">
            Kemampuan menyesuaikan diri dalam karier
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{instrumenAdaptasi.petunjuk}</p>
        </div>

        <ol className="space-y-4">
          {caasQuestions.map((q, i) => (
            <li key={q.id} id={`caas-${q.id}`} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground mb-3">
                {i + 1}. {q.text}
              </p>
              <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label={q.text}>
                {caasLabels.map((label, idx) => {
                  const nilai = idx + 1;
                  const aktif = hexacoAnswers[q.id] === nilai;
                  return (
                    <button
                      key={label}
                      type="button"
                      role="radio"
                      aria-checked={aktif}
                      onClick={() => setHexacoAnswer(q.id, nilai)}
                      className={`rounded-lg border px-1 py-2 text-[11px] leading-tight transition-colors ${
                        aktif
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {terjawab} dari {total} terjawab
        </p>
        <p className="text-center text-[11px] text-muted-foreground/80 mt-2">{instrumenAdaptasi.atribusi}</p>
      </div>

      <footer className="bg-card border-t border-border sticky bottom-0">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 max-w-2xl">
          <Button variant="outline" onClick={startSds} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Bagian 2</span>
          </Button>
          <Button onClick={selesai} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            {lengkap ? 'Lihat Hasil' : `Jawab ${total - terjawab} lagi`}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CaasStep;
