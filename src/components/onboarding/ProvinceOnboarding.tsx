import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROVINCES } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProvinceOnboardingProps {
  onDone: (province: string) => void | Promise<void>;
}

/**
 * One-step onboarding shown right after a Google sign-in when the user has
 * not yet set a home province. The value is persisted to Supabase Auth
 * `user_metadata.province` so it travels with the account.
 */
export default function ProvinceOnboarding({ onDone }: ProvinceOnboardingProps) {
  const { toast } = useToast();
  const [province, setProvince] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!province) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { province } });
    if (error) {
      toast({
        title: 'Gagal menyimpan',
        description: error.message || 'Coba lagi sebentar lagi.',
        variant: 'destructive',
      });
      setSaving(false);
      return;
    }
    await onDone(province);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10">
        <MapPin className="w-5 h-5 text-primary" />
      </div>
      <div className="text-center space-y-1">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Kamu tinggal di provinsi mana?
        </h2>
        <p className="text-sm text-muted-foreground">
          Cukup sekali isi, dipakai untuk menyesuaikan konten dengan daerahmu.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="province">Provinsi</Label>
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger id="province">
            <SelectValue placeholder="Pilih provinsi" />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
        disabled={!province || saving}
        onClick={handleSave}
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        Lanjut
      </Button>
    </motion.div>
  );
}
