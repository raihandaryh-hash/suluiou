import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { clearStudentSession, getStudentSession } from '@/lib/classSession';

interface LogoutButtonProps {
  variant?: 'ghost' | 'outline';
  className?: string;
  label?: string;
}

const LogoutButton = ({
  variant = 'ghost',
  className = '',
  label = 'Keluar',
}: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const session = getStudentSession();
    clearStudentSession();
    if (session?.kind === 'google') {
      await supabase.auth.signOut();
    }
    navigate('/login', { replace: true });
  };

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={handleLogout}
      className={`gap-2 ${className}`}
    >
      <LogOut className="w-4 h-4" />
      {label}
    </Button>
  );
};

export default LogoutButton;
