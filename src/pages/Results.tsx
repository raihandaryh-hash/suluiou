import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { useAssessment } from '@/context/AssessmentContext';
import { traitLabels, type DimensionScores } from '@/lib/scoring';
import type { Dimension } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Flame, Sparkles, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StudentInfoForm } from '@/components/results/StudentInfoForm';
import { supabase } from '@/integrations/supabase/client';
import { calculateLeadScore } from '@/lib/leadScoring';
import { useToast } from '@/hooks/use-toast';
import { CareerChatbot } from '@/components/results/CareerChatbot';

const Results = () => {
  const { scores, pathwayMatches, projection, isComplete, resetAssessment, generatingProjection } =
    useAssessment();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isComplete) {
      navigate('/assessment');
    }
  }, [isComplete, navigate]);

  if (!scores || !pathwayMatches || !projection) return null;

  const topMatch = pathwayMatches[0];

  const handleSaveStudent = async (info: { name: string; email: string; phone: string; school: string }) => {
    const leadScore = calculateLeadScore({
      student_name: info.name || null,
      student_email: info.email || null,
      student_phone: info.phone || null,
      school_name: info.school || null,
      match_percentage: topMatch.matchPercentage,
      scores: scores as Record<string, number>,
    });

    const insertData = {
      student_name: info.name || null,
      student_email: info.email || null,
      student_phone: info.phone || null,
      school_name: info.school || null,
      scores: scores as unknown as import('@/integrations/supabase/types').Json,
      top_pathway_id: topMatch.pathway.id,
      top_pathway_name: topMatch.pathway.name,
      match_percentage: topMatch.matchPercentage,
      all_matches: pathwayMatches.map((m) => ({
        pathway: { id: m.pathway.id, name: m.pathway.name, icon: m.pathway.icon },
        matchPercentage: m.matchPercentage,
      })) as unknown as import('@/integrations/supabase/types').Json,
      projection,
      lead_score: leadScore,
    };

    const { error } = await supabase
      .from('assessment_results')
      .insert(insertData);

    if (error) {
      toast({
        title: 'Oops',
        description: 'Gagal menyimpan. Coba lagi nanti.',
        variant: 'destructive',
      });
      return;
    }

    setSaved(true);
    toast({ title: 'Tersimpan!', description: 'Tim IOU akan segera menghubungimu.' });
  };

  const radarData = (Object.keys(traitLabels) as Dimension[]).map((key) => ({
    dimension: traitLabels[key],
    value: scores[key],
    fullMark: 5,
  }));

  return (
    <>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-6 border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary font-heading font-bold text-xl"
          >
            <Flame className="w-5 h-5" />
            Sulu
          </Link>
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => {
              resetAssessment();
              navigate('/');
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Mulai Ulang
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Ini Adalah <span className="text-gradient">Cerminmu</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Berdasarkan analisis HEXACO & RIASEC, inilah profil unikmu.
          </p>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          className="glass rounded-2xl p-6 md:p-8 mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-heading font-bold mb-6 text-center">
            Profil Dimensi
          </h2>
          <ResponsiveContainer width="100%" height={380}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(225, 20%, 18%)" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: 'hsl(220, 15%, 55%)', fontSize: 11 }}
              />
              <PolarRadiusAxis
                domain={[0, 5]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Skor"
                dataKey="value"
                stroke="hsl(38, 92%, 50%)"
                fill="hsl(38, 92%, 50%)"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Pathways */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-heading font-bold mb-6 text-center">
            Jalur yang Cocok Untukmu
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pathwayMatches.slice(0, 3).map((match, index) => (
              <motion.div
                key={match.pathway.id}
                className={cn(
                  'glass rounded-2xl p-6 relative overflow-hidden',
                  index === 0 && 'md:scale-105 glow-primary border-primary/30'
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
              >
                {index === 0 && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-torch-glow to-accent" />
                )}

                <div className="text-4xl mb-3">{match.pathway.icon}</div>
                <div className="text-3xl font-heading font-bold text-primary mb-1">
                  {match.matchPercentage}%
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  {match.pathway.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {match.pathway.description}
                </p>

                {/* Traits */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {match.topTraits.map((trait) => (
                    <span
                      key={trait}
                      className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {trait}
                    </span>
                  ))}
                </div>

                {/* Careers */}
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Karier Potensial
                </h4>
                <div className="flex flex-wrap gap-1">
                  {match.pathway.careers.slice(0, 3).map((career) => (
                    <span
                      key={career}
                      className="text-xs text-muted-foreground"
                    >
                      • {career}
                    </span>
                  ))}
                </div>

                {/* Local industries */}
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3 mb-2">
                  Industri Lokal
                </h4>
                <div className="flex flex-wrap gap-1">
                  {match.pathway.localIndustries.slice(0, 3).map((ind) => (
                    <span key={ind} className="text-xs text-muted-foreground">
                      • {ind}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Parallel Self Projection */}
        <motion.div
          className="relative glass rounded-2xl p-8 md:p-12 mb-12 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-torch-glow to-accent" />
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-heading font-bold">
              Dirimu di Tahun 2030
            </h2>
          </div>
          {generatingProjection ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI sedang menulis narasimu...</span>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <>
              <p className="text-lg leading-relaxed text-foreground/90 italic">
                &ldquo;{projection}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground mt-6">
                * Proyeksi ini dibuat oleh AI berdasarkan profil kepribadian dan minatmu.
                Masa depan ada di tanganmu.
              </p>
            </>
          )}
        </motion.div>

        {/* Student Info Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <StudentInfoForm onSubmit={handleSaveStudent} saved={saved} />
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h2 className="text-2xl font-heading font-bold mb-4">
            Siap Memulai Perjalanan?
          </h2>
          <p className="text-muted-foreground mb-8">
            Ambil langkah pertama menuju masa depanmu bersama IOU Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-6 glow-primary gap-2">
              Daftar di IOU Indonesia
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 gap-2"
            >
              Konsultasi via WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    </div>

    {/* Career Chatbot */}
    <CareerChatbot scores={scores} topMatch={topMatch} />
    </>
  );
};

export default Results;