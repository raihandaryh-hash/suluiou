import { useAssessment } from '@/context/AssessmentContext';
import ProfileStep from '@/components/assessment/ProfileStep';
import HexacoStep from '@/components/assessment/HexacoStep';
import SdsStep from '@/components/assessment/SdsStep';
import Logo from '@/components/Logo';
import { Loader2 } from 'lucide-react';

const Assessment = () => {
  const { stage, setStudentProfile, hydrating } = useAssessment();

  if (hydrating) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Logo size="md" />
        <Loader2 className="w-6 h-6 text-primary animate-spin mt-8" />
        <p className="text-sm text-muted-foreground mt-3">Memuat progres…</p>
      </div>
    );
  }

  if (stage === 'profile') {
    return <ProfileStep onComplete={setStudentProfile} />;
  }

  if (stage === 'hexaco') {
    return <HexacoStep />;
  }

  if (stage === 'sds') {
    return <SdsStep />;
  }

  // submitting
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Logo size="md" />
      <Loader2 className="w-8 h-8 text-primary animate-spin mt-8" />
      <p className="text-sm text-muted-foreground mt-4">Menyiapkan hasilmu…</p>
    </div>
  );
};

export default Assessment;
