import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { traitLabels } from '@/lib/scoring';
import type { Dimension } from '@/data/questions';
import { pathways } from '@/data/pathways';
import { Button } from '@/components/ui/button';
import { Flame, Sparkles, ArrowLeft, RefreshCw } from 'lucide-react';
import { getLeadPriority, priorityConfig } from '@/lib/leadScoring';

interface StoredResult {
  id: string;
  student_name: string | null;
  student_email: string | null;
  student_phone: string | null;
  school_name: string | null;
  scores: Record<string, number>;
  top_pathway_id: string;
  top_pathway_name: string;
  match_percentage: number;
  all_matches: Array<{ pathway: { id: string; name: string; icon: string }; matchPercentage: number }>;
  projection: string | null;
  lead_score: number;
  follow_up_status: string;
  submitted_at: string;
}

const AdminResultView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<StoredResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        navigate('/admin');
        return;
      }

      setResult({
        id: data.id,
        student_name: data.student_name,
        student_email: data.student_email,
        student_phone: data.student_phone,
        school_name: data.school_name,
        scores: (data.scores || {}) as Record<string, number>,
        top_pathway_id: data.top_pathway_id,
        top_pathway_name: data.top_pathway_name,
        match_percentage: data.match_percentage,
        all_matches: (data.all_matches || []) as StoredResult['all_matches'],
        projection: data.projection,
        lead_score: data.lead_score,
        follow_up_status: data.follow_up_status,
        submitted_at: data.submitted_at,
      });
      setLoading(false);
    };

    fetchResult();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!result) return null;

  const scores = result.scores;
  const priority = getLeadPriority(result.lead_score);
  const pConfig = priorityConfig[priority];

  const radarData = (Object.keys(traitLabels) as Dimension[]).map((key) => ({
    dimension: traitLabels[key],
    value: scores[key] || 0,
    fullMark: 5,
  }));

  const topMatch = result.all_matches[0];
  const topPathway = pathways.find((p) => p.id === result.top_pathway_id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-6 border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-primary font-heading font-bold text-xl"
          >
            <Flame className="w-5 h-5" />
            Sulu
          </Link>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Button>
        </div>
      </header>

      {/* Admin banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-2">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <p className="text-sm text-primary font-medium">
            👁️ Tampilan POV Peserta — {result.student_name || 'Anonim'}
          </p>
          <span className={`text-xs px-2 py-1 rounded-full border ${pConfig.bgColor}`}>
            {pConfig.label} — Skor {result.lead_score}
          </span>
        </div>
      </div>

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
            Berdasarkan analisis Kepribadian & Minat, inilah profil unikmu.
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
              <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
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
            Jalur yang Cocok
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {result.all_matches.slice(0, 3).map((match, index) => {
              const pw = pathways.find((p) => p.id === match.pathway.id);
              return (
                <motion.div
                  key={match.pathway.id}
                  className={`glass rounded-2xl p-6 relative overflow-hidden ${
                    index === 0 ? 'md:scale-105 glow-primary border-primary/30' : ''
                  }`}
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
                  {pw && (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">{pw.description}</p>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Karier Potensial
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {pw.careers.slice(0, 3).map((c) => (
                          <span key={c} className="text-xs text-muted-foreground">• {c}</span>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Projection */}
        {result.projection && (
          <motion.div
            className="relative glass rounded-2xl p-8 md:p-12 mb-12 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-torch-glow to-accent" />
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading font-bold">Dirimu di Tahun 2030</h2>
            </div>
            <p className="text-lg leading-relaxed text-foreground/90 italic">
              &ldquo;{result.projection}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground mt-6">
              * Proyeksi ini dibuat berdasarkan profil kepribadian dan minat peserta.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminResultView;
