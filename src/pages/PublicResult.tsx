import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { traitLabels, type DimensionScores } from '@/lib/scoring';
import type { Dimension } from '@/data/questions';

interface PublicResultRow {
  id: string;
  student_name: string | null;
  scores: DimensionScores;
  top_pathway_id: string | null;
  top_pathway_name: string | null;
  match_percentage: number | null;
  all_matches: unknown;
  selected_pathways: unknown;
  layer1_text: string | null;
  submitted_at: string;
}

const PublicResult = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const [data, setData] = useState<PublicResultRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!resultId) {
        setError('Tautan tidak valid.');
        setLoading(false);
        return;
      }
      const { data: rows, error: rpcErr } = await supabase.rpc('get_public_result', {
        result_id: resultId,
      });
      if (!alive) return;
      if (rpcErr) {
        setError('Tidak bisa memuat hasil.');
      } else if (!rows || (Array.isArray(rows) && rows.length === 0)) {
        setError('Hasil tidak ditemukan atau sudah dihapus.');
      } else {
        const row = (Array.isArray(rows) ? rows[0] : rows) as PublicResultRow;
        setData(row);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [resultId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-heading font-bold mb-3">Hasil tidak tersedia</h1>
          <p className="text-muted-foreground mb-6">{error ?? 'Silakan periksa kembali tautan kamu.'}</p>
          <Button asChild>
            <Link to="/">Kembali ke Sulu</Link>
          </Button>
        </div>
      </div>
    );
  }

  const radarData = (Object.keys(traitLabels) as Dimension[]).map((key) => ({
    trait: traitLabels[key],
    value: data.scores?.[key] ?? 0,
  }));

  const firstName = (data.student_name ?? '').split(' ')[0] || 'Teman';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <Button asChild size="sm" variant="outline">
            <Link to="/">Coba Sulu</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Hasil Asesmen Sulu
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Profil {firstName}
          </h1>
          <p className="text-muted-foreground">
            Hasil tes minat & kepribadian di Sulu by IOU Indonesia.
          </p>
        </motion.div>

        {data.top_pathway_name && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-6 md:p-8 mb-8 text-center"
          >
            <p className="text-sm text-muted-foreground mb-2">Program yang dilirik</p>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">
              {data.top_pathway_name}
            </h2>
            {data.match_percentage !== null && (
              <p className="text-sm text-muted-foreground">
                Kecocokan {data.match_percentage}%
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-2xl p-6 md:p-8 mb-8"
        >
          <h3 className="text-lg font-heading font-semibold mb-4 text-center">
            Dimensi Kepribadian & Minat
          </h3>
          <div className="w-full h-[320px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={false} axisLine={false} />
                <Radar
                  name="Skor"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {data.layer1_text && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass rounded-2xl p-6 md:p-8 mb-8"
          >
            <h3 className="text-lg font-heading font-semibold mb-3">Cermin Diri</h3>
            <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-line">
              {data.layer1_text}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center py-8"
        >
          <p className="text-muted-foreground mb-4">
            Penasaran sama profil minat & kepribadianmu sendiri?
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              Coba Sulu Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default PublicResult;
