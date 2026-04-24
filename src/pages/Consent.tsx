import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';
import LogoutButton from '@/components/LogoutButton';
import { useAssessment, isProfileComplete } from '@/context/AssessmentContext';
import { useEffect } from 'react';

const Consent = () => {
  const navigate = useNavigate();
  const { setConsent, studentProfile, hydrating, consentGiven, startHexaco } = useAssessment();
  const [checked, setChecked] = useState(consentGiven);

  // If user lands here without finishing Step 0, send them back.
  useEffect(() => {
    if (hydrating) return;
    if (!isProfileComplete(studentProfile)) {
      navigate('/profile', { replace: true });
    }
  }, [hydrating, studentProfile, navigate]);

  const handleStart = () => {
    if (!checked) return;
    setConsent(true);
    startHexaco();
    navigate('/assessment', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <LogoutButton />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-6">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs text-primary uppercase tracking-wider font-semibold">
                Langkah 2 dari 3
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground leading-snug">
              Persetujuan Mengikuti Asesmen
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sebelum memulai, bacalah informasi berikut.
            </p>
          </div>

          <article className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6 text-sm md:text-[15px] leading-relaxed text-foreground/90">
            <section>
              <h2 className="font-heading font-semibold text-base mb-2">Tentang asesmen ini</h2>
              <p>
                Kamu akan mengikuti asesmen minat dan kepribadian yang terdiri dari dua bagian:
                inventori kepribadian dan inventori minat karier. Asesmen ini dirancang untuk
                membantumu lebih mengenal dirimu sendiri — bukan untuk menilai benar atau salah,
                pintar atau tidak pintar.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-base mb-2">
                Apa yang terjadi dengan jawabanmu?
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Jawabanmu diolah otomatis untuk menghasilkan profil minat dan kepribadianmu</li>
                <li>
                  Nama lengkapmu tidak akan dikirimkan ke sistem kecerdasan buatan yang kami gunakan
                </li>
                <li>Data agregat tanpa nama dapat ditampilkan guru untuk diskusi kelas</li>
                <li>
                  Data pribadimu disimpan aman dan tidak dibagikan ke pihak ketiga di luar IOU Indonesia
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-base mb-2">Kesukarelaan</h2>
              <p>
                Keikutsertaanmu bersifat sukarela. Kamu boleh berhenti kapan saja. Tidak ada
                konsekuensi akademis.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-base mb-2">Waktu yang dibutuhkan</h2>
              <p>
                Sekitar 45–50 menit. Progresmu tersimpan otomatis — kamu bisa lanjutkan nanti dari
                perangkat manapun.
              </p>
            </section>

            <label
              htmlFor="consent-check"
              className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/40 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <Checkbox
                id="consent-check"
                checked={checked}
                onCheckedChange={(v) => setChecked(Boolean(v))}
                className="mt-0.5"
              />
              <span className="text-sm text-foreground">
                Saya telah membaca informasi di atas dan bersedia mengikuti asesmen ini secara
                sukarela.
              </span>
            </label>

            <Button
              type="button"
              size="lg"
              disabled={!checked}
              onClick={handleStart}
              className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
            >
              Mulai Asesmen
              <ArrowRight className="w-4 h-4" />
            </Button>
          </article>
        </motion.div>
      </div>
    </div>
  );
};

export default Consent;
