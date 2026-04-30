import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProfileStep from '@/components/assessment/ProfileStep';
import LogoutButton from '@/components/LogoutButton';
import SwitchAccountChip from '@/components/SwitchAccountChip';
import { useAssessment, type StudentProfile } from '@/context/AssessmentContext';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import {
  getStudentSession,
  patchStudentSession,
} from '@/lib/classSession';
import { clearPendingClassCode } from '@/lib/pendingClassCode';
import { toast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { setStudentProfile, hydrating } = useAssessment();
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async (profile: StudentProfile, classCode: string | null) => {
    setSubmitting(true);
    try {
      // If a class code was provided and the session isn't already bound to a
      // class, validate + enroll before persisting the profile.
      if (classCode) {
        const session = getStudentSession();
        if (session && !session.classId) {
          const { data: cls, error: clsErr } = await supabase
            .from('classes')
            .select('id, name, session_closed')
            .eq('join_code', classCode)
            .maybeSingle();

          if (clsErr || !cls) {
            toast({
              title: 'Kode kelas tidak valid',
              description: 'Periksa lagi kode dari gurumu, atau kosongkan untuk lanjut tanpa kelas.',
              variant: 'destructive',
            });
            setSubmitting(false);
            return;
          }
          if (cls.session_closed) {
            toast({
              title: 'Sesi kelas sudah ditutup',
              description: 'Kamu masih bisa lanjut tanpa kode kelas.',
              variant: 'destructive',
            });
            setSubmitting(false);
            return;
          }

          const enrollment =
            session.kind === 'google'
              ? { class_id: cls.id, user_id: session.userId }
              : {
                  class_id: cls.id,
                  guest_identifier: session.guestIdentifier,
                  guest_name: session.name,
                  guest_phone: session.phone,
                };

          const { error: enrErr } = await supabase
            .from('class_enrollments')
            .insert(enrollment);

          if (enrErr && !enrErr.message.toLowerCase().includes('duplicate')) {
            toast({
              title: 'Gagal mendaftar ke kelas',
              description: 'Coba lagi sebentar lagi.',
              variant: 'destructive',
            });
            setSubmitting(false);
            return;
          }

          patchStudentSession({ classId: cls.id, className: cls.name });
          clearPendingClassCode();
        }
      }

      setStudentProfile(profile);
      navigate('/consent', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (hydrating) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Logo size="md" />
        <Loader2 className="w-6 h-6 text-primary animate-spin mt-8" />
        <p className="text-sm text-muted-foreground mt-3">Memuat profil…</p>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Logo size="md" />
        <Loader2 className="w-6 h-6 text-primary animate-spin mt-8" />
        <p className="text-sm text-muted-foreground mt-3">Menyimpan…</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <header className="absolute top-0 right-0 p-4 z-10">
        <LogoutButton />
      </header>
      <ProfileStep onComplete={handleComplete} />
      <SwitchAccountChip />
    </div>
  );
};

export default ProfilePage;
