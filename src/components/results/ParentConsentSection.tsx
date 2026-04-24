import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Heart, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?62\d{8,12}$/, {
    message: 'Format +62 dengan total 10–13 digit angka.',
  });

interface ParentConsentSectionProps {
  /** Assessment result row id — required to attach parent info. */
  resultId: string | null;
}

export function ParentConsentSection({ resultId }: ParentConsentSectionProps) {
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(false);
  const [phone, setPhone] = useState('+62');
  const [parentName, setParentName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 md:p-8 mb-12 border border-primary/20"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-heading font-bold mb-1">Tersimpan</h3>
            <p className="text-sm text-muted-foreground">
              Tim IOU akan menghubungi orang tuamu untuk berbagi ringkasan hasil dan informasi
              program. Terima kasih sudah mempercayai kami.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (skipped) return null;

  const normalizePhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    // Convert 0xxx → 62xxx
    if (digits.startsWith('0')) return '+62' + digits.slice(1);
    if (digits.startsWith('62')) return '+' + digits;
    if (digits.startsWith('8')) return '+62' + digits;
    return '+' + digits;
  };

  const handleSubmit = async () => {
    if (!agreed) {
      toast({
        title: 'Belum disetujui',
        description: 'Centang persetujuan terlebih dahulu.',
        variant: 'destructive',
      });
      return;
    }
    if (!resultId) {
      toast({
        title: 'Hasil belum tersimpan',
        description: 'Lengkapi form data dirimu di atas dulu.',
        variant: 'destructive',
      });
      return;
    }

    const normalized = normalizePhone(phone);
    const parsed = phoneSchema.safeParse(normalized);
    if (!parsed.success) {
      toast({
        title: 'Nomor belum valid',
        description: parsed.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase
      .from('assessment_results')
      .update({
        parent_consent: true,
        parent_phone: parsed.data,
        parent_name: parentName.trim() || null,
      })
      .eq('id', resultId);
    setSubmitting(false);

    if (error) {
      toast({
        title: 'Gagal menyimpan',
        description: 'Coba lagi sebentar lagi.',
        variant: 'destructive',
      });
      return;
    }
    setDone(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 md:p-8 mb-12 border border-border"
    >
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-5 h-5 text-accent" />
        <h3 className="text-xl font-heading font-bold">
          Bagikan Hasil ke Orang Tuamu{' '}
          <span className="text-sm font-normal text-muted-foreground">(opsional)</span>
        </h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Ingin orang tuamu tahu tentang hasil asesmenmu? Kami bisa mengirimkan ringkasan hasil dan
        informasi program IOU langsung ke WhatsApp orang tuamu.
      </p>

      <div className="rounded-lg bg-muted/40 p-4 text-sm space-y-2 mb-4">
        <p className="font-semibold text-foreground">Yang akan dikirimkan:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Ringkasan profil minat dan kepribadianmu</li>
          <li>Informasi singkat program-program yang relevan di IOU Indonesia</li>
          <li>Cara orang tuamu menghubungi kami jika ada pertanyaan</li>
        </ul>
        <p className="font-semibold text-foreground pt-2">Yang tidak dikirimkan:</p>
        <p className="text-muted-foreground">
          jawaban detail asesmen, informasi akun Google, atau data pribadimu.
        </p>
      </div>

      <p className="text-xs text-muted-foreground mb-5">
        Nomor yang kamu berikan hanya digunakan untuk keperluan ini. Kami tidak akan menghubungi
        lebih dari satu kali tanpa persetujuan tambahan.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="parent-phone">Nomor WhatsApp orang tua</Label>
          <Input
            id="parent-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+6281234567890"
            maxLength={16}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parent-name">
            Nama orang tua <span className="text-muted-foreground font-normal">(opsional)</span>
          </Label>
          <Input
            id="parent-name"
            value={parentName}
            onChange={(e) => setParentName(e.target.value.slice(0, 100))}
            placeholder="Misal: Ibu Sari"
            maxLength={100}
          />
        </div>

        <label
          htmlFor="parent-agree"
          className="flex items-start gap-3 p-3 rounded-lg border border-border cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
        >
          <Checkbox
            id="parent-agree"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(Boolean(v))}
            className="mt-0.5"
          />
          <span className="text-sm text-foreground">
            Saya mengizinkan IOU Indonesia menghubungi orang tua saya di nomor ini untuk berbagi
            ringkasan hasil asesmen dan informasi program.
          </span>
        </label>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            size="lg"
            onClick={handleSubmit}
            disabled={!agreed || submitting}
            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
            Kirim ke Orang Tua
          </Button>
          <Button
            type="button"
            size="lg"
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => setSkipped(true)}
            disabled={submitting}
          >
            Lewati →
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
