import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';
import type { StudentProfile } from '@/context/AssessmentContext';

const PROVINCES = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Sumatera Selatan',
  'Bangka Belitung',
  'Bengkulu',
  'Lampung',
  'DKI Jakarta',
  'Banten',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Gorontalo',
  'Sulawesi Tengah',
  'Sulawesi Barat',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
  'Papua Barat Daya',
  'Papua Tengah',
  'Papua Pegunungan',
  'Papua Selatan',
];

const FAMILY_OPTIONS = [
  'Keluargaku sebagian besar petani atau nelayan',
  'Keluargaku bekerja sebagai karyawan atau pegawai',
  'Keluargaku punya usaha sendiri',
  'Beragam / tidak spesifik',
];

interface ProfileStepProps {
  onComplete: (profile: StudentProfile) => void;
}

const ProfileStep = ({ onComplete }: ProfileStepProps) => {
  const [name, setName] = useState('');
  const [province, setProvince] = useState('');
  const [familyBackground, setFamilyBackground] = useState('');
  const [aspiration, setAspiration] = useState('');

  const canSubmit = province && familyBackground && aspiration.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onComplete({
      name: name.trim(),
      province,
      familyBackground,
      aspiration: aspiration.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            Profil Awal
          </span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-6">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs text-primary uppercase tracking-wider font-semibold">
                Langkah 1 dari 2
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3 leading-snug">
              Sebelum mulai, cerita sedikit tentang kamu
            </h1>
            <p className="text-sm text-muted-foreground">
              Data ini membantu kami memberikan rekomendasi yang lebih relevan untukmu.
            </p>
          </div>

          <div className="space-y-6 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nama panggilan <span className="text-muted-foreground font-normal">(opsional)</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mis. Rara"
                maxLength={50}
              />
            </div>

            {/* Province */}
            <div className="space-y-2">
              <Label htmlFor="province">Provinsi</Label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger id="province">
                  <SelectValue placeholder="Pilih provinsi tempat tinggalmu" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {PROVINCES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Family background */}
            <div className="space-y-3">
              <Label>Latar belakang keluarga</Label>
              <RadioGroup
                value={familyBackground}
                onValueChange={setFamilyBackground}
                className="space-y-2"
              >
                {FAMILY_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    htmlFor={opt}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/40 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <RadioGroupItem value={opt} id={opt} className="mt-0.5" />
                    <span className="text-sm text-foreground">{opt}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Aspiration */}
            <div className="space-y-2">
              <Label htmlFor="aspiration">Di masa depan, saya ingin...</Label>
              <Textarea
                id="aspiration"
                value={aspiration}
                onChange={(e) => setAspiration(e.target.value.slice(0, 150))}
                placeholder="Ceritakan impian atau hal yang ingin kamu wujudkan..."
                rows={3}
                maxLength={150}
              />
              <p className="text-xs text-muted-foreground text-right">
                {aspiration.length}/150
              </p>
            </div>

            <Button
              type="submit"
              disabled={!canSubmit}
              size="lg"
              className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
            >
              Mulai Asesmen
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ProfileStep;
