import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { StatsCards } from '@/components/admin/StatsCards';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { Button } from '@/components/ui/button';
import { calculateLeadScore, getLeadPriority, type FollowUpStatus } from '@/lib/leadScoring';
import { Flame, LogOut, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeadResult {
  id: string;
  student_name: string | null;
  student_email: string | null;
  student_phone: string | null;
  school_name: string | null;
  student_class: string | null;
  student_province: string | null;
  province: string | null;
  family_background: string | null;
  aspiration: string | null;
  scores: Record<string, number>;
  top_pathway_id: string;
  top_pathway_name: string;
  match_percentage: number;
  all_matches: Array<{ pathway: { id: string; name: string; icon: string }; matchPercentage: number }>;
  projection: string | null;
  lead_score: number;
  follow_up_status: string;
  notes: string | null;
  submitted_at: string;
  lm_name: string | null;
  lm_id: string | null;
}

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<LeadResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data leads.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const typed = (data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      student_name: row.student_name as string | null,
      student_email: row.student_email as string | null,
      student_phone: row.student_phone as string | null,
      school_name: row.school_name as string | null,
      student_class: row.student_class as string | null,
      student_province: row.student_province as string | null,
      province: row.province as string | null,
      family_background: row.family_background as string | null,
      aspiration: row.aspiration as string | null,
      scores: (row.scores || {}) as Record<string, number>,
      top_pathway_id: row.top_pathway_id as string,
      top_pathway_name: row.top_pathway_name as string,
      match_percentage: row.match_percentage as number,
      all_matches: (row.all_matches || []) as LeadResult['all_matches'],
      projection: row.projection as string | null,
      lead_score: row.lead_score as number,
      follow_up_status: row.follow_up_status as string,
      notes: row.notes as string | null,
      submitted_at: row.submitted_at as string,
    }));

    setLeads(typed);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleUpdateLead = async (id: string, status: FollowUpStatus, notes: string) => {
    const { error } = await supabase
      .from('assessment_results')
      .update({ follow_up_status: status, notes } as Record<string, unknown>)
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyimpan perubahan.',
        variant: 'destructive',
      });
      return;
    }

    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, follow_up_status: status, notes } : l
      )
    );

    toast({ title: 'Berhasil', description: 'Data lead diperbarui.' });
  };

  // Stats
  const hotLeads = leads.filter((l) => getLeadPriority(l.lead_score) === 'hot').length;
  const contacted = leads.filter((l) =>
    ['contacted', 'interested'].includes(l.follow_up_status)
  ).length;
  const enrolled = leads.filter((l) => l.follow_up_status === 'enrolled').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary font-heading font-bold text-xl"
          >
            <Flame className="w-5 h-5" />
            Sulu <span className="text-foreground/60 font-normal text-sm ml-1">Partnership Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchLeads}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-heading font-bold">
            Lead <span className="text-gradient">Scoring</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Prioritaskan calon mahasiswa yang paling match untuk di-follow up secara personal.
          </p>
        </div>

        {/* Stats */}
        <StatsCards
          totalLeads={leads.length}
          hotLeads={hotLeads}
          contacted={contacted}
          enrolled={enrolled}
        />

        {/* Leads Table */}
        {loading ? (
          <div className="glass rounded-xl p-12 text-center">
            <RefreshCw className="w-6 h-6 text-primary animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">Memuat data leads...</p>
          </div>
        ) : (
          <LeadsTable leads={leads} onUpdate={handleUpdateLead} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
