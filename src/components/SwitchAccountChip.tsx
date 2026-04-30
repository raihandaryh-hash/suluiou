import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { clearStudentSession, getStudentSession } from '@/lib/classSession';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * Floating chip that lets a student on a shared device switch accounts
 * mid-flow. Shown on profile/consent/assessment screens.
 *
 * Confirms before clearing — leaving mid-assessment loses local UI state
 * (DB progress is keyed to the previous identifier and stays safe).
 */
const SwitchAccountChip = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const session = getStudentSession();
  if (!session) return null;

  const label =
    session.kind === 'google'
      ? session.displayName || session.email
      : session.name;

  const handleSwitch = async () => {
    clearStudentSession();
    if (session.kind === 'google') {
      try { await supabase.auth.signOut(); } catch { /* ignore */ }
    }
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2 rounded-full border border-border bg-card/90 backdrop-blur px-3 py-2 shadow-md hover:shadow-lg hover:bg-card transition text-xs"
          aria-label="Bukan kamu? Ganti akun"
        >
          <span className="text-muted-foreground hidden sm:inline">Bukan kamu?</span>
          <span className="font-medium text-foreground max-w-[120px] truncate">
            {label}
          </span>
          <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
        </button>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ganti akun?</AlertDialogTitle>
            <AlertDialogDescription>
              Sesi <span className="font-medium text-foreground">{label}</span> akan
              ditutup di perangkat ini. Progres yang sudah tersimpan tetap aman dan
              bisa dilanjutkan saat masuk lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleSwitch} className="gap-2">
              <LogOut className="w-4 h-4" />
              Ya, ganti akun
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SwitchAccountChip;
