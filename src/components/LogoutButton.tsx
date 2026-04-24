import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { clearStudentSession, getStudentSession } from '@/lib/classSession';

interface LogoutButtonProps {
  /**
   * 'menu' (default): hamburger icon that opens a dropdown — ideal for the
   * assessment screens where space is tight and a full button collides with
   * the progress bar.
   * 'inline': renders a labeled button — used on the Results page.
   */
  mode?: 'menu' | 'inline';
  variant?: 'ghost' | 'outline';
  className?: string;
  label?: string;
}

const LogoutButton = ({
  mode = 'menu',
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

  if (mode === 'inline') {
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
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Menu"
          className={`h-9 w-9 rounded-full bg-card/80 backdrop-blur border border-border shadow-sm hover:bg-card ${className}`}
        >
          <Menu className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer">
          <LogOut className="w-4 h-4" />
          {label}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LogoutButton;
