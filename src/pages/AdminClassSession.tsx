import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ArrowLeft, Download, Loader2, RefreshCw } from 'lucide-react';

const HEXACO_LABELS: Record<string, string> = {
  honesty: 'H — Kejujuran & Kerendahan Hati',
  emotionality: 'E — Emosionalitas',
  extraversion: 'X — Ekstraversi',
  agreeableness: 'A — Keramahan',
  conscientiousness: 'C — Kehati-hatian',
  openness: 'O — Keterbukaan',
};
const HEXACO_KEYS = Object.keys(HEXACO_LABELS);

const RIASEC_KEYS = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'] as const;
const RIASEC_LETTER: Record<string, string> = {
  realistic: 'R',
  investigative: 'I',
  artistic: 'A',
  social: 'S',
  enterprising: 'E',
  conventional: 'C',
};

interface Row {
  id: string;
  scores: Record<string, number>;
  completed_at: string | null;
  submitted_at: string;
}

interface ClassMeta {
  id: string;
  name: string;
  school_name: string | null;
  join_code: string;
  session_closed: boolean;
}

const AdminClassSession = () => {
  const { classId } = useParams<{ classId: string }>();
  const { toast } = useToast();
  const [meta, setMeta] = useState<ClassMeta | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchAll = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    const [{ data: cls }, { data: results }, { count: enrCount }] = await Promise.all([
      supabase.from('classes').select('*').eq('id', classId).maybeSingle(),
      supabase
        .from('assessment_results')
        .select('id, scores, submitted_at, completed_at')
        .eq('class_id', classId),
      supabase
        .from('class_enrollments')
        .select('id', { count: 'exact', head: true })
        .eq('class_id', classId),
    ]);

    setMeta(cls as ClassMeta | null);
    setRows((results ?? []) as Row[]);
    setEnrolledCount(enrCount ?? 0);
    setLoading(false);
  }, [classId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Polling 30s while session not closed
  useEffect(() => {
    if (!meta || meta.session_closed) return;
    const t = setInterval(fetchAll, 30000);
    return () => clearInterval(t);
  }, [meta, fetchAll]);

  // Filter completed only
  const completed = useMemo(
    () => rows.filter((r) => r.completed_at != null || r.submitted_at != null),
    [rows]
  );

  const hexacoData = useMemo(() => {
    if (!completed.length) return HEXACO_KEYS.map((k) => ({ name: HEXACO_LABELS[k], value: 0 }));
    return HEXACO_KEYS.map((k) => {
      const sum = completed.reduce((acc, r) => acc + (Number(r.scores?.[k]) || 0), 0);
      return { name: HEXACO_LABELS[k], value: +(sum / completed.length).toFixed(2) };
    });
  }, [completed]);

  const hollandDist = useMemo(() => {
    const counts = new Map<string, number>();
    completed.forEach((r) => {
      const sds = RIASEC_KEYS.map((k) => ({ k, v: Number(r.scores?.[k]) || 0 }))
        .sort((a, b) => b.v - a.v)
        .slice(0, 3)
        .map((x) => RIASEC_LETTER[x.k])
        .join('');
      counts.set(sds, (counts.get(sds) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count);
  }, [completed]);

  const handleDownloadPdf = async () => {
    if (!reportRef.current || !meta) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      let w = pageW - 20;
      let h = w / ratio;
      if (h > pageH - 20) {
        h = pageH - 20;
        w = h * ratio;
      }
      pdf.addImage(img, 'PNG', (pageW - w) / 2, 10, w, h);
      pdf.save(`rekap-${meta.join_code}-${meta.name}.pdf`);
    } catch (err) {
      console.error(err);
      toast({ title: 'Gagal', description: 'PDF gagal dibuat.', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  if (!classId) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/admin/classes"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Daftar Kelas
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={fetchAll} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleDownloadPdf} disabled={exporting} className="gap-2">
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8" ref={reportRef}>
        {loading && !meta ? (
          <div className="text-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          </div>
        ) : !meta ? (
          <p className="text-center text-muted-foreground py-20">Kelas tidak ditemukan.</p>
        ) : (
          <div className="space-y-8">
            <div>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-heading font-bold text-foreground">
                    {meta.name}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {meta.school_name ?? 'Tanpa sekolah'} · Kode{' '}
                    <span className="font-mono font-bold text-primary">{meta.join_code}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {meta.session_closed ? (
                    <Badge variant="secondary">Sesi Ditutup</Badge>
                  ) : (
                    <Badge className="bg-accent text-accent-foreground">Sesi Aktif</Badge>
                  )}
                  <div className="text-right">
                    <p className="text-2xl font-heading font-bold text-foreground">
                      {completed.length}/{enrolledCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Selesai / Terdaftar</p>
                  </div>
                </div>
              </div>
            </div>

            {completed.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
                Belum ada siswa yang menyelesaikan asesmen.
              </div>
            ) : (
              <>
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-heading font-bold text-foreground mb-4">
                    Sebaran HEXACO (Rata-rata Kelas)
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hexacoData} layout="vertical" margin={{ left: 60, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" domain={[1, 5]} stroke="hsl(var(--muted-foreground))" />
                        <YAxis type="category" dataKey="name" width={200} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 8,
                          }}
                        />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-heading font-bold text-foreground mb-4">
                    Distribusi Holland Code
                  </h2>
                  <div className="space-y-2">
                    {hollandDist.map((d) => {
                      const pct = (d.count / completed.length) * 100;
                      return (
                        <div key={d.code} className="flex items-center gap-3">
                          <span className="font-mono font-bold text-primary w-12">{d.code}</span>
                          <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full bg-accent"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-16 text-right">
                            {d.count} ({pct.toFixed(0)}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClassSession;
