import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';
import {
  getStudentSession,
  patchStudentSession,
  setStudentSession,
} from '@/lib/classSession';

const JoinClass = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState<boolean>(false);

  useEffect(() => {
    // Bootstrap student session from current Google user if needed
    (async () => {
      const cur = getStudentSession();
      if (cur) {
        setHasSession(true);
        return;
      }
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      if (u) {
        setStudentSession({
          kind: 'google',
          userId: u.id,
          email: u.email ?? '',
          displayName:
            (u.user_metadata?.full_name as string | undefined) ?? null,
          classId: null,
          className: null,
        });
        setHasSession(true);
      } else {
        navigate('/login');
      }
    })();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (code.length !== 4) {
      setError('Kode kelas 4 karakter.');
      return;
    }
    setLoading(true);

    const { data: cls, error: clsErr } = await supabase
      .from('classes')
      .select('id, name, school_name, session_closed')
      .eq('join_code', code)
      .maybeSingle();

    if (clsErr || !cls) {
      setError('Kode tidak valid. Tanyakan ke gurumu.');
      setLoading(false);
      return;
    }
    if (cls.session_closed) {
      setError('Sesi kelas ini sudah ditutup.');
      setLoading(false);
      return;
    }

    const session = getStudentSession();
    if (!session || session.kind !== 'google') {
      setError('Sesi tidak valid. Silakan masuk lagi.');
      setLoading(false);
      navigate('/login');
      return;
    }

    const { error: enrErr } = await supabase.from('class_enrollments').insert({
      class_id: cls.id,
      user_id: session.userId,
    });

    if (enrErr && !enrErr.message.toLowerCase().includes('duplicate')) {
      setError('Gagal mendaftar ke kelas. Coba lagi.');
      setLoading(false);
      return;
    }

    patchStudentSession({ classId: cls.id, className: cls.name });
    navigate('/assessment');
  };

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h1 className="text-xl font-heading font-bold text-center text-foreground mb-2">
            Masukkan Kode Kelas
          </h1>
          <p className="text-sm text-center text-muted-foreground mb-6">
            Tanyakan ke gurumu kode 4 karakter untuk kelas ini.
          </p>

          {error && (
            <div className="flex items-start gap-2 text-destructive text-sm p-3 rounded-lg bg-destructive/10 mb-4">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="sr-only">
                Kode Kelas
              </Label>
              <Input
                id="code"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.toUpperCase().slice(0, 4))
                }
                placeholder="ABCD"
                maxLength={4}
                className="uppercase tracking-widest font-mono text-center text-3xl h-16"
                autoFocus
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={loading || code.length !== 4}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              Gabung Kelas
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinClass;
