import { useNavigate } from 'react-router-dom';
import ProfileStep from '@/components/assessment/ProfileStep';
import LogoutButton from '@/components/LogoutButton';
import { useAssessment, type StudentProfile } from '@/context/AssessmentContext';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { setStudentProfile, hydrating } = useAssessment();

  const handleComplete = (profile: StudentProfile) => {
    setStudentProfile(profile);
    navigate('/consent', { replace: true });
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

  return (
    <div className="relative">
      <header className="absolute top-0 right-0 p-4 z-10">
        <LogoutButton />
      </header>
      <ProfileStep onComplete={handleComplete} />
    </div>
  );
};

export default ProfilePage;
