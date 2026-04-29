import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
import { ArrowRight, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import { useAssessment, type StudentProfile } from '@/context/AssessmentContext';
import { PROVINCES } from '@/lib/constants';
import { getStudentSession } from '@/lib/classSession';
import { getPendingClassCode } from '@/lib/pendingClassCode';

const FAMILY_OPTIONS = [
  'Keluarga petani, nelayan, atau peternak',
  'Keluarga pedagang atau wirausaha',
  'Keluarga karyawan swasta atau buruh',
  'Keluarga pegawai negeri, TNI, atau Polri',
  'Keluarga profesional (dokter, guru, insinyur, dll)',
  'Keluarga pengusaha atau wiraswasta besar',
  'Keluarga pendakwah, ustadz, atau ulama',
  'Lainnya',
  'Tidak ingin berbagi',
];

const LEARNING_OPTIONS = [
  'Belajar sendiri',
  'Belajar bersama orang lain',
  'Campuran keduanya',
];

const CERTAINTY_OPTIONS = [
  'Sudah tahu mau ke mana',
  'Masih bingung',
  'Belum kepikiran sama sekali',
];

const CONTRIBUTION_OPTIONS = [
  'Keluarga dan orang-orang terdekat',
  'Komunitas atau lingkungan sekitar',
  'Masyarakat luas',
  'Belum tahu',
];

const EDUCATION_OPTIONS = ['D3 (Diploma 3)', 'S1 (Sarjana)', 'Belum tahu'];

interface ProfileStepProps {
  onComplete: (profile: StudentProfile, classCode: string | null) => void;
}

interface RadioCardGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}

const RadioCardGroup = ({ label, options, value, onChange, name }: RadioCardGroupProps) => (
  <div className="space-y-3">
    <Label>{label}</Label>
    <RadioGroup value={value} onValueChange={onChange} className="space-y-2">
      {options.map((opt) => {
        const id = `${name}-${opt}`;
        return (
          <label
            key={opt}
            htmlFor={id}
            className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/40 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
          >
            <RadioGroupItem value={opt} id={id} className="mt-0.5" />
            <span className="text-sm text-foreground">{opt}</span>
          </label>
        );
      })}
    </RadioGroup>
  </div>
);

const ProfileStep = ({ onComplete }: ProfileStepProps) => {
  const { studentProfile } = useAssessment();

  // Pre-fill dari progress yang sudah ada atau dari session (untuk name).
  const session = getStudentSession();
  const sessionName =
    session?.kind === 'google'
      ? session.displayName ?? session.email ?? ''
      : session?.kind === 'guest'
      ? session.name
      : '';

  // Class binding state. If session already has a classId we lock the field.
  // Otherwise we offer an optional input, prefilled from any captured ?kode=.
  const alreadyBoundToClass = Boolean(session?.classId);
  const pendingFromUrl = getPendingClassCode();
  const [classCode, setClassCode] = useState<string>(
    alreadyBoundToClass ? '' : pendingFromUrl ?? '',
  );
  const codeLocked = alreadyBoundToClass || Boolean(pendingFromUrl);

  const [province, setProvince] = useState(studentProfile?.province ?? '');
  const [familyBackground, setFamilyBackground] = useState(studentProfile?.familyBackground ?? '');
  const [learningStyle, setLearningStyle] = useState(studentProfile?.learningStyle ?? '');
  const [careerCertainty, setCareerCertainty] = useState(studentProfile?.careerCertainty ?? '');
  const [contributionGoal, setContributionGoal] = useState(studentProfile?.contributionGoal ?? '');
  const [educationPlan, setEducationPlan] = useState(studentProfile?.educationPlan ?? '');
  const [aspiration, setAspiration] = useState(studentProfile?.aspiration ?? '');

  // Jika studentProfile berubah (mis. selesai hydrate), refresh field yang masih kosong.
  useEffect(() => {
    if (!studentProfile) return;
    setProvince((v) => v || studentProfile.province || '');
    setFamilyBackground((v) => v || studentProfile.familyBackground || '');
    setLearningStyle((v) => v || studentProfile.learningStyle || '');
    setCareerCertainty((v) => v || studentProfile.careerCertainty || '');
    setContributionGoal((v) => v || studentProfile.contributionGoal || '');
    setEducationPlan((v) => v || studentProfile.educationPlan || '');
    setAspiration((v) => v || studentProfile.aspiration || '');
  }, [studentProfile]);

  const canSubmit =
    province && familyBackground && learningStyle && careerCertainty && contributionGoal && educationPlan;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const code = alreadyBoundToClass
      ? null
      : classCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) || null;
    onComplete(
      {
        name: studentProfile?.name || sessionName || '',
        province,
        familyBackground,
        learningStyle,
        careerCertainty,
        contributionGoal,
        educationPlan,
        aspiration: aspiration.trim(),
      },
      code,
    );
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
                Langkah 1 dari 3
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3 leading-snug">
              Sebelum mulai, cerita sedikit tentang kamu
            </h1>
            <p className="text-sm text-muted-foreground">
              Jawabanmu membantu kami memberikan rekomendasi yang lebih relevan.
            </p>
          </div>

          <div className="space-y-6 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            {/* 0. Kode Kelas — opsional, hanya tampil jika belum terdaftar di kelas. */}
            {!alreadyBoundToClass && (
              <div className="space-y-2">
                <Label htmlFor="class-code">
                  Kode Kelas{' '}
                  <span className="text-muted-foreground font-normal">(opsional)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="class-code"
                    value={classCode}
                    onChange={(e) =>
                      setClassCode(
                        e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4),
                      )
                    }
                    placeholder="ABCD"
                    maxLength={4}
                    disabled={codeLocked && Boolean(classCode)}
                    className="uppercase tracking-widest font-mono text-center text-lg pr-9"
                  />
                  {codeLocked && classCode && (
                    <Lock className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {codeLocked && classCode
                    ? 'Kode kelas sudah terisi otomatis dari tautan yang kamu buka.'
                    : 'Isi kalau dapat kode dari gurumu. Kosongkan kalau ikut sendiri.'}
                </p>
              </div>
            )}

            {/* 1. Provinsi */}
            <div className="space-y-2">
              <Label htmlFor="province">Kamu tinggal di provinsi mana?</Label>
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

            {/* 2. Latar keluarga */}
            <RadioCardGroup
              label="Latar belakang keluargamu?"
              name="family"
              options={FAMILY_OPTIONS}
              value={familyBackground}
              onChange={setFamilyBackground}
            />

            {/* 3. Cara belajar */}
            <RadioCardGroup
              label="Kamu paling nyaman belajar dengan cara apa?"
              name="learning"
              options={LEARNING_OPTIONS}
              value={learningStyle}
              onChange={setLearningStyle}
            />

            {/* 4. Keyakinan pilihan studi */}
            <RadioCardGroup
              label="Seberapa yakin kamu dengan pilihan studi setelah lulus nanti?"
              name="certainty"
              options={CERTAINTY_OPTIONS}
              value={careerCertainty}
              onChange={setCareerCertainty}
            />

            {/* 5. Tujuan kontribusi */}
            <RadioCardGroup
              label="Lewat pekerjaanmu nanti, kamu paling ingin berkontribusi untuk siapa?"
              name="contribution"
              options={CONTRIBUTION_OPTIONS}
              value={contributionGoal}
              onChange={setContributionGoal}
            />

            {/* 6. Jenjang pendidikan */}
            <RadioCardGroup
              label="Setelah SMA/SMK/MA, kamu berencana melanjutkan ke mana?"
              name="education"
              options={EDUCATION_OPTIONS}
              value={educationPlan}
              onChange={setEducationPlan}
            />

            {/* 7. Aspirasi (opsional) */}
            <div className="space-y-2">
              <Label htmlFor="aspiration">
                Apa cita-cita atau bayangan masa depanmu?{' '}
                <span className="text-muted-foreground font-normal">(opsional)</span>
              </Label>
              <Textarea
                id="aspiration"
                value={aspiration}
                onChange={(e) => setAspiration(e.target.value.slice(0, 300))}
                placeholder="Tidak ada jawaban yang salah. Boleh tulis 'belum tahu' juga."
                rows={3}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground text-right">
                {aspiration.length}/300
              </p>
            </div>

            <Button
              type="submit"
              disabled={!canSubmit}
              size="lg"
              className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
            >
              Lanjut
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ProfileStep;
