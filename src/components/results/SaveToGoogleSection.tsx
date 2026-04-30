import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Loader2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { lovable } from '@/integrations/lovable';
import { getStudentSession } from '@/lib/classSession';
import { setPendingClaim } from '@/lib/claimGuestResult';

interface SaveToGoogleSectionProps {
  resultId: string | null;
}

/**
 * Shown only to guest users on the Results page. Lets them attach the result
 * to their Google account so they can revisit it from any device. Triggers a
 * Google OAuth redirect after stashing a "pending claim" payload in localStorage,
 * which Login picks up after callback to UPDATE the row's user_id.
 */
export function SaveToGoogleSection({ resultId }: SaveToGoogleSectionProps) {
  const session = getStudentSession();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  // Hide entirely for Google users — already saved to their account.
  if (!session || session.kind !== 'google' && session.kind !== 'guest') return null;
  if (session.kind === 'google') return null;

  const handleSave = async () => {
    if (busy) return;
    setBusy(true);

    // Stash the claim so we can finish the link-up after OAuth callback.
    setPendingClaim({
      resultId,
      guestIdentifier: session.guestIdentifier,
      studentName: session.name,
      classId: session.classId,
      className: session.className,
    });

    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin + '/login',
    });

    if (result.error) {
      toast({
        title: 'Gagal',
        description: result.error.message || 'Tidak bisa membuka login Google.',
        variant: 'destructive',
      });
      setBusy(false);
    }
    // If redirected, browser navigates away — no further action needed here.
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 mb-12">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <LogIn className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-heading font-semibold mb-1">
            Simpan hasil ke akun Google-mu
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Supaya kamu bisa kembali lihat hasil ini kapan saja dari device manapun.
            Tanpa ini, hasil hanya bisa diakses dari device ini selama 1 jam ke depan.
          </p>
          <Button onClick={handleSave} disabled={busy} className="gap-2">
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengarahkan ke Google…
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Simpan ke Google
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
