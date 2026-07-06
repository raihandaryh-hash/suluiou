import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, GraduationCap, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserTrack = 'siswa' | 'mahasiswa_iou';

interface RoleOnboardingProps {
  onDone: (track: UserTrack) => void | Promise<void>;
}

/**
 * Step KEDUA setelah ProvinceOnboarding, khusus jalur Google (Fork Dua-Pintu,
 * ACC 6 Jul 2026). Guest tetap default 'siswa' tanpa gate ini — lihat
 * catatan di Login.tsx.
 *
 * Sengaja dipisah dari ProvinceOnboarding (bukan digabung satu form) supaya
 * tidak menyentuh logic auth routing PendingProvince yang sudah kompleks.
 * Value dipersist ke user_metadata.user_track, pola persis province.
 */
export default function RoleOnboarding({ onDone }: RoleOnboardingProps) {
  const { toast } = useToast();
  const [track, setTrack] = useState<UserTrack | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (selected: UserTrack) => {
    setTrack(selected);
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { user_track: selected } });
    if (error) {
      toast({
        title: 'Gagal menyimpan',
        description: error.message || 'Coba lagi sebentar lagi.',
        variant: 'destructive',
      });
      setSaving(false);
      setTrack(null);
      return;
    }
    await onDone(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10">
        <School className="w-5 h-5 text-primary" />
      </div>
      <div className="text-center space-y-1">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Kamu datang sebagai siapa?
        </h2>
        <p className="text-sm text-muted-foreground">
          Supaya perjalananmu di Sulu disesuaikan.
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave('siswa')}
          className="w-full flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:opacity-60"
        >
          <School className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Siswa / baru lulus sekolah</p>
            <p className="text-xs text-muted-foreground">Aku sedang menjajaki arah.</p>
          </div>
          {saving && track === 'siswa' && (
            <Loader2 className="w-4 h-4 animate-spin ml-auto text-primary" />
          )}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave('mahasiswa_iou')}
          className="w-full flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:opacity-60"
        >
          <GraduationCap className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Mahasiswa IOU</p>
            <p className="text-xs text-muted-foreground">Aku ingin mengarahkan jam baktiku.</p>
          </div>
          {saving && track === 'mahasiswa_iou' && (
            <Loader2 className="w-4 h-4 animate-spin ml-auto text-primary" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
