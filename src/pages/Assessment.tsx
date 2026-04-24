import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment, isProfileComplete } from '@/context/AssessmentContext';
import HexacoStep from '@/components/assessment/HexacoStep';
import SdsStep from '@/components/assessment/SdsStep';
import Logo from '@/components/Logo';
import LogoutButton from '@/components/LogoutButton';
import { Loader2 } from 'lucide-react';
import { getStudentSession } from '@/lib/classSession';

const Assessment = () => {
  const navigate = useNavigate();
  const { stage, hydrating, studentProfile, consentGiven, isComplete } = useAssessment();

  // Gating after hydration: enforce session → profile → consent → assessment.
  useEffect(() => {
    if (hydrating) return;
    if (isComplete) return; // 'submitting' state — let it through
    const session = getStudentSession();
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }
    if (!isProfileComplete(studentProfile)) {
      navigate('/profile', { replace: true });
      return;
    }
    if (!consentGiven) {
      navigate('/consent', { replace: true });
      return;
    }
  }, [hydrating, studentProfile, consentGiven, isComplete, navigate]);

  if (hydrating) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Logo size="md" />
        <Loader2 className="w-6 h-6 text-primary animate-spin mt-8" />
        <p className="text-sm text-muted-foreground mt-3">Memuat progres…</p>
      </div>
    );
  }

  const Header = (
    <header className="absolute top-0 right-0 p-4 z-10">
      <LogoutButton />
    </header>
  );

  if (stage === 'sds') {
    return (
      <div className="relative">
        {Header}
        <SdsStep />
      </div>
    );
  }

  if (stage === 'submitting') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Logo size="md" />
        <Loader2 className="w-8 h-8 text-primary animate-spin mt-8" />
        <p className="text-sm text-muted-foreground mt-4">Menyiapkan hasilmu…</p>
      </div>
    );
  }

  // Default: HEXACO. The 'profile' stage is no longer rendered here; it lives at /profile.
  return (
    <div className="relative">
      {Header}
      <HexacoStep />
    </div>
  );
};

export default Assessment;
