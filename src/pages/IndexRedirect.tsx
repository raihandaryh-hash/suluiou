import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getStudentSession } from '@/lib/classSession';

const IndexRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    (async () => {
      // 1) Google user logged in?
      const { data } = await supabase.auth.getUser();
      const u = data.user;

      if (u) {
        // a) Finished assessment?
        const { data: done } = await supabase
          .from('assessment_results')
          .select('id')
          .eq('user_id', u.id)
          .not('completed_at', 'is', null)
          .limit(1)
          .maybeSingle();
        if (!active) return;
        if (done) return navigate('/results', { replace: true });

        // b) In-progress?
        const { data: prog } = await supabase
          .from('assessment_progress')
          .select('id')
          .eq('user_id', u.id)
          .is('completed_at', null)
          .limit(1)
          .maybeSingle();
        if (!active) return;
        if (prog) return navigate('/assessment', { replace: true });

        // c) Enrolled?
        const { data: enr } = await supabase
          .from('class_enrollments')
          .select('class_id')
          .eq('user_id', u.id)
          .limit(1)
          .maybeSingle();
        if (!active) return;
        if (enr?.class_id) return navigate('/assessment', { replace: true });

        return navigate('/join', { replace: true });
      }

      // 2) Guest session?
      const guest = getStudentSession();
      if (guest && guest.kind === 'guest' && guest.classId) {
        return navigate('/assessment', { replace: true });
      }

      // 3) Not authenticated → /login
      navigate('/login', { replace: true });
    })();

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Flame className="w-8 h-8 text-primary animate-pulse" />
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    </div>
  );
};

export default IndexRedirect;
