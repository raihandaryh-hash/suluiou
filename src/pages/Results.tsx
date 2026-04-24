import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from 'recharts';
import { useAssessment } from '@/context/AssessmentContext';
import { traitLabels, type DimensionScores, type TopSelection } from '@/lib/scoring';
import type { Dimension } from '@/data/questions';
import { pathways, getPathwayName } from '@/data/pathways';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight, RotateCcw, Loader2, ExternalLink, Check } from 'lucide-react';
import Logo from '@/components/Logo';
import LogoutButton from '@/components/LogoutButton';
import { Skeleton } from '@/components/ui/skeleton';
import { StudentInfoForm } from '@/components/results/StudentInfoForm';
import { api } from '@/services/api';
import { calculateLeadScore } from '@/lib/leadScoring';
import { useToast } from '@/hooks/use-toast';
import { CareerChatbot } from '@/components/results/CareerChatbot';
import { ShareButtons } from '@/components/results/ShareButtons';
import { ParentConsentSection } from '@/components/results/ParentConsentSection';
import {
  IOU_WA_NUMBER_IKHWAN,
  IOU_WA_NUMBER_AKHWAT,
  IOU_REGISTRATION_URL,
  IOU_WA_TEMPLATES,
  buildWaUrl,
} from '@/lib/constants';
import { getStudentSession } from '@/lib/classSession';

const Results = () => {
  const {
    scores,
    topTraits,
    selectedPathways,
    togglePathway,
    projection,
    isComplete,
    resetAssessment,
    generatingProjection,
    studentProfile,
    triggerProjection,
    layer1,
    generatingLayer1,
    triggerLayer1,
  } = useAssessment();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);
  const [savedRowId, setSavedRowId] = useState<string | null>(null);
  const [layer1PersistedFor, setLayer1PersistedFor] = useState<string | null>(null);
  const [provinceUsed, setProvinceUsed] = useState<{ value: string; source: 'form' | 'profile' | 'none' } | null>(null);
  const [showProjection, setShowProjection] = useState(false);

  useEffect(() => {
    if (!isComplete) navigate('/assessment');
  }, [isComplete, navigate]);

  useEffect(() => {
    if (!isComplete || !scores) return;
    void triggerLayer1();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  useEffect(() => {
    if (!savedRowId || !layer1) return;
    if (layer1PersistedFor === layer1) return;
    void api.updateLayer1(savedRowId, layer1).then(({ error }) => {
      if (!error) setLayer1PersistedFor(layer1);
      else console.warn('updateLayer1 failed:', error.message);
    });
  }, [savedRowId, layer1, layer1PersistedFor]);

  const handleRevealProjection = () => {
    if (selectedPathways.length === 0) {
      toast({
        title: 'Pilih dulu',
        description: 'Pilih minimal 1 program yang menarik untukmu.',
        variant: 'destructive',
      });
      return;
    }
    setShowProjection(true);
    void triggerProjection();
  };

  if (!scores) return null;

  // Top selection: first picked program (or empty if none).
  const topSelection: TopSelection = {
    pathwayId: selectedPathways[0] ?? '',
    pathwayName: selectedPathways[0] ? getPathwayName(selectedPathways[0]) : '',
    topTraits,
  };

  const handleSaveStudent = async (info: { name: string; email: string; phone: string; school: string; student_class: string; province: string }) => {
    const formProvince = info.province?.trim() ?? '';
    const profileProvince = studentProfile?.province?.trim() ?? '';
    const resolvedProvince = formProvince || profileProvince || '';
    const provinceSource: 'form' | 'profile' | 'none' = formProvince ? 'form' : profileProvince ? 'profile' : 'none';

    const leadScore = calculateLeadScore({
      student_name: info.name || studentProfile?.name || null,
      student_email: info.email || null,
      student_phone: info.phone || null,
      school_name: info.school || null,
      match_percentage: 0,
      scores: scores as Record<string, number>,
    });

    const session = getStudentSession();
    const insertData: Parameters<typeof api.saveResult>[0] = {
      student_name: info.name || studentProfile?.name || (session?.kind === 'guest' ? session.name : null),
      student_email: info.email || (session?.kind === 'google' ? session.email : null),
      student_phone: info.phone || (session?.kind === 'guest' ? session.phone : null),
      student_class: info.student_class || (session?.className ?? null),
      school_name: info.school || null,
      student_province: resolvedProvince || null,
      province: resolvedProvince || null,
      family_background: studentProfile?.familyBackground || null,
      aspiration: studentProfile?.aspiration || null,
      scores: scores as Record<string, number>,
      // No matching anymore — store the student's first picked program (or '-' if none).
      top_pathway_id: selectedPathways[0] ?? 'none',
      top_pathway_name: selectedPathways[0] ? getPathwayName(selectedPathways[0]) : '-',
      match_percentage: 0,
      all_matches: selectedPathways.map((id) => ({
        pathway: { id, name: getPathwayName(id) },
      })),
      selected_pathways: selectedPathways,
      projection: projection ?? '',
      lead_score: leadScore,
      layer1_text: layer1 ?? null,
    };

    // user_id / class_id / etc.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extra: any = {
      class_id: session?.classId ?? null,
      guest_identifier: session?.kind === 'guest' ? session.guestIdentifier : null,
      user_id: session?.kind === 'google' ? session.userId : null,
      completed_at: new Date().toISOString(),
    };

    const { error, id } = await api.saveResult({ ...insertData, ...extra });

    if (error) {
      toast({ title: 'Oops', description: 'Gagal menyimpan. Coba lagi nanti.', variant: 'destructive' });
      return;
    }

    setProvinceUsed({ value: resolvedProvince, source: provinceSource });
    setSaved(true);
    if (id) {
      setSavedRowId(id);
      if (layer1) setLayer1PersistedFor(layer1);
    }
    toast({ title: 'Tersimpan!', description: 'Tim IOU akan segera menghubungimu.' });

    window.open(
      'https://wa.me/' + IOU_WA_NUMBER + '?text=' + encodeURIComponent(IOU_WA_TEMPLATES.afterAssessment),
      '_blank'
    );
  };

  const radarData = (Object.keys(traitLabels) as Dimension[]).map((key) => ({
    dimension: traitLabels[key],
    value: scores[key],
    fullMark: 5,
  }));

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="p-6 border-b border-border">
          <div className="container mx-auto flex items-center justify-between">
            <Logo size="sm" />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => { resetAssessment(); navigate('/'); }}>
                <RotateCcw className="w-4 h-4" />
                Mulai Ulang
              </Button>
              <LogoutButton mode="inline" />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-12 max-w-5xl">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Ini Adalah <span className="text-gradient">Cerminmu</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Berdasarkan analisis Kepribadian & Minat, inilah profil unikmu.
            </p>
          </motion.div>

          {/* Section 1: Profil Psikologismu */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Profil Psikologismu
              </span>
            </div>
          </div>

          <motion.div className="glass rounded-2xl p-6 md:p-8 mb-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h2 className="text-2xl font-heading font-bold mb-6 text-center">Profil Dimensi</h2>
            <ResponsiveContainer width="100%" height={300} className="md:!h-[380px]">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(225, 20%, 18%)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: 'hsl(220, 15%, 55%)', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                <Radar name="Skor" dataKey="value" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          <p className="text-xs text-muted-foreground text-center mb-6">
            Profil ini berlaku secara umum, terlepas dari program studi manapun.
          </p>

          {/* Cermin Dirimu (Layer 1) */}
          <motion.div className="glass rounded-2xl p-6 md:p-8 mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <h2 className="text-2xl font-heading font-bold mb-4">Cermin Dirimu</h2>
            {generatingLayer1 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sedang membaca profilmu...</span>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-base md:text-lg leading-relaxed text-foreground/90 whitespace-pre-line">
                {layer1 ?? 'Profil kepribadian dan minatmu sudah terekam.'}
              </p>
            )}
          </motion.div>

          {/* Section 2: Program-Program di IOU Indonesia */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                Program-Program di IOU Indonesia
              </span>
            </div>
          </div>

          <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <h2 className="text-2xl font-heading font-bold mb-3 text-center">
              Program-Program di IOU Indonesia
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Pilih 1–2 program yang paling menarik buatmu. Pilihanmu akan membantu menyesuaikan proyeksi 2030.
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              {pathways.map((p) => {
                const isSelected = selectedPathways.includes(p.id);
                const disabled = !isSelected && selectedPathways.length >= 2;
                return (
                  <motion.button
                    type="button"
                    key={p.id}
                    onClick={() => togglePathway(p.id)}
                    disabled={disabled}
                    className={cn(
                      'glass rounded-2xl p-6 text-left transition-all relative overflow-hidden',
                      'border-2',
                      isSelected
                        ? 'border-primary glow-primary'
                        : 'border-transparent hover:border-primary/30',
                      disabled && 'opacity-50 cursor-not-allowed',
                    )}
                    whileHover={!disabled ? { y: -2 } : undefined}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-xl font-heading font-bold text-foreground pr-8">
                        {p.name}
                      </h3>
                      <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full border',
                        p.degree === 'S2'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-primary/10 text-primary border-primary/30',
                      )}>
                        {p.degree}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{p.fullName}</p>
                    {'degreeNote' in p && p.degreeNote && (
                      <p className="text-xs italic text-muted-foreground mb-2">{p.degreeNote}</p>
                    )}

                    <p className="text-sm text-foreground/85 leading-relaxed mt-3 mb-4">
                      {p.description}
                    </p>

                    <div className="border-l-2 border-primary/40 pl-3 mb-4">
                      <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
                        Yang Khas dari IOU
                      </p>
                      <p className="text-sm italic text-foreground/75 leading-relaxed">
                        {p.iouUniqueness}
                      </p>
                    </div>

                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                    >
                      Pelajari lebih lanjut
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </motion.button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              {selectedPathways.length === 0
                ? 'Belum ada yang dipilih.'
                : `Dipilih: ${selectedPathways.length}/2`}
            </p>
          </motion.div>

          {/* Student Info Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.75 }} className="mb-12">
            <StudentInfoForm
              onSubmit={handleSaveStudent}
              saved={saved}
              defaultProvince={studentProfile?.province}
              provinceUsed={provinceUsed}
            />
          </motion.div>

          {/* Layer 3 */}
          <motion.div className="relative glass rounded-2xl p-8 md:p-12 mb-12 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-torch-glow to-accent" />
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading font-bold">Dirimu di Tahun 2030</h2>
            </div>

            {!showProjection ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedPathways.length === 0
                    ? 'Pilih minimal 1 program di atas untuk melihat proyeksi yang dipersonalisasi.'
                    : 'Siap melihat gambaran dirimu beberapa tahun ke depan?'}
                </p>
                <Button
                  size="lg"
                  className="gap-2 glow-primary"
                  disabled={generatingLayer1 || selectedPathways.length === 0}
                  onClick={handleRevealProjection}
                >
                  <Sparkles className="w-4 h-4" />
                  {generatingLayer1 ? 'Sedang disiapkan...' : 'Lihat Proyeksi 2030-mu'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ) : generatingProjection || !projection ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sedang menyusun proyeksimu di tahun 2030...</span>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <>
                <p className="text-lg leading-relaxed text-foreground/90 italic whitespace-pre-line">
                  {projection}
                </p>
                <p className="text-xs text-muted-foreground mt-6">
                  * Proyeksi ini dibuat oleh AI berdasarkan profil kepribadian, minatmu, dan program yang kamu pilih.
                </p>
              </>
            )}
          </motion.div>

          <ParentConsentSection resultId={savedRowId} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.95 }} className="mb-12">
            <ShareButtons scores={scores} topSelection={topSelection} />
          </motion.div>

          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }}>
            <h2 className="text-2xl font-heading font-bold mb-4">Siap Memulai Perjalanan?</h2>
            <p className="text-muted-foreground mb-8">
              Ambil langkah pertama menuju masa depanmu bersama IOU Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 glow-primary gap-2"
                onClick={() => window.open(IOU_REGISTRATION_URL, '_blank')}
              >
                Daftar di IOU Indonesia
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 gap-2"
                onClick={() => window.open('https://wa.me/' + IOU_WA_NUMBER + '?text=' + encodeURIComponent(IOU_WA_TEMPLATES.afterAssessment), '_blank')}
              >
                Konsultasi via WhatsApp
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Konsultasi langsung dengan konselor tersedia segera. Coming soon.
            </p>
          </motion.div>
        </div>
      </div>

      <CareerChatbot scores={scores} topSelection={topSelection} />
    </>
  );
};

export default Results;
