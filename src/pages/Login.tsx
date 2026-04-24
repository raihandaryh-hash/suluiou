import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { lovable } from '@/integrations/lovable/index';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, ArrowRight, Loader2, LogOut } from 'lucide-react';
import Logo from '@/components/Logo';
import {
  setStudentSession,
  makeGuestIdentifier,
  clearStudentSession,
  getStudentSession,
  type StudentSession,
} from '@/lib/classSession';
import { routeAfterAuth } from '@/lib/authRouter';

const guestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Nama minimal 2 karakter.' })
    .max(80, { message: 'Nama terlalu panjang.' }),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10,13}$/, { message: 'Nomor WhatsApp 10–13 digit angka.' }),
  joinCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{4}$/, { message: 'Kode kelas 4 karakter.' }),
});

const Login = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState<'google' | 'guest'>('google');
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const [existing, setExisting] = useState<StudentSession | null>(null);
  const [checking, setChecking] = useState(true);

  // Detect existing session (Google or guest) without redirecting.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // 1) Guest session in storage
        const cur = getStudentSession();
        if (cur) {
          if (active) setExisting(cur);
          return;
        }
        // 2) Google user via Supabase
        const { data } = await supabase.auth.getUser();
        if (!active) return;
        const u = data.user;
        if (u) {
          const session: StudentSession = {
            kind: 'google',
            userId: u.id,
            email: u.email ?? '',
            displayName:
              (u.user_metadata?.full_name as string | undefined) ??
              (u.user_metadata?.name as string | undefined) ??
              null,
            classId: null,
            className: null,
          };
          setStudentSession(session);
          setExisting(session);
        }
      } finally {
        if (active) setChecking(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleContinue = async () => {
    if (!existing) return;
    setContinueLoading(true);
    const next = await routeAfterAuth(existing);
    navigate(next, { replace: true });
  };

  const handleSwitchAccount = async () => {
    clearStudentSession();
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
    setExisting(null);
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin + '/login',
    });
    if (result.error) {
      setError(result.error.message || 'Gagal masuk dengan Google.');
      setGoogleLoading(false);
    }
    // if redirected, browser navigates away
  };

  const handleGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsed = guestSchema.safeParse({ name, phone, joinCode });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setGuestLoading(true);

    const code = parsed.data.joinCode;
    const { data: cls, error: clsErr } = await supabase
      .from('classes')
      .select('id, name, school_name, session_closed')
      .eq('join_code', code)
      .maybeSingle();

    if (clsErr || !cls) {
      setError('Kode tidak valid. Tanyakan ke gurumu.');
      setGuestLoading(false);
      return;
    }
    if (cls.session_closed) {
      setError('Sesi kelas ini sudah ditutup.');
      setGuestLoading(false);
      return;
    }

    const guestIdentifier = makeGuestIdentifier(parsed.data.phone, code);

    clearStudentSession();
    const { error: enrErr } = await supabase.from('class_enrollments').insert({
      class_id: cls.id,
      guest_identifier: guestIdentifier,
      guest_name: parsed.data.name,
      guest_phone: parsed.data.phone,
    });

    if (enrErr && !enrErr.message.toLowerCase().includes('duplicate')) {
      setError('Gagal mendaftar ke kelas. Coba lagi.');
      setGuestLoading(false);
      return;
    }

    const session: StudentSession = {
      kind: 'guest',
      guestIdentifier,
      name: parsed.data.name,
      phone: parsed.data.phone,
      classId: cls.id,
      className: cls.name,
    };
    setStudentSession(session);

    const next = await routeAfterAuth(session);
    navigate(next, { replace: true });
  };

  const displayLabel =
    existing?.kind === 'google'
      ? existing.displayName || existing.email
      : existing?.kind === 'guest'
      ? existing.name
      : '';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="flex items-center justify-center mb-8">
          <Logo size="md" />
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h1 className="text-xl font-heading font-bold text-center text-foreground mb-1">
            Masuk untuk Mulai Asesmen
          </h1>
          <p className="text-sm text-center text-muted-foreground mb-6">
            Pilih cara masuk yang paling mudah untukmu.
          </p>

          {checking ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
          ) : existing ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
                  Sesi tersimpan
                </p>
                <p className="text-sm font-medium text-foreground break-all">{displayLabel}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {existing.kind === 'google' ? 'Akun Google' : 'Tamu (tanpa Google)'}
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                disabled={continueLoading}
                onClick={handleContinue}
                className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {continueLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Lanjutkan sebagai {displayLabel}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full gap-2"
                onClick={handleSwitchAccount}
                disabled={continueLoading}
              >
                <LogOut className="w-4 h-4" />
                Ganti akun
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-muted rounded-lg">
                <button
                  type="button"
                  onClick={() => setTab('google')}
                  className={`text-sm font-medium py-2 rounded-md transition ${
                    tab === 'google'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  Akun Google
                </button>
                <button
                  type="button"
                  onClick={() => setTab('guest')}
                  className={`text-sm font-medium py-2 rounded-md transition ${
                    tab === 'guest'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  Tanpa Google
                </button>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-destructive text-sm p-3 rounded-lg bg-destructive/10 mb-4">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {tab === 'google' ? (
                <div className="space-y-4">
                  <Button
                    type="button"
                    className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={googleLoading}
                    onClick={handleGoogle}
                  >
                    {googleLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                    Masuk dengan Google
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Hasilmu tersimpan di akun Google jadi bisa dilihat lagi nanti.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleGuest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="g-name">Nama Lengkap</Label>
                    <Input
                      id="g-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Misal: Andi Pratama"
                      maxLength={80}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="g-phone">Nomor WhatsApp</Label>
                    <Input
                      id="g-phone"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="08xxxxxxxxxx"
                      maxLength={13}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Dipakai untuk kembali melanjutkan jika browser tertutup.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="g-code">Kode Kelas</Label>
                    <Input
                      id="g-code"
                      value={joinCode}
                      onChange={(e) =>
                        setJoinCode(e.target.value.toUpperCase().slice(0, 4))
                      }
                      placeholder="ABCD"
                      maxLength={4}
                      className="uppercase tracking-widest font-mono text-center text-lg"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      4 karakter dari gurumu.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={guestLoading}
                  >
                    {guestLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    Lanjut
                  </Button>
                </form>
              )}
            </>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Sulu by IOU Indonesia · Asesmen ini gratis dan rahasia.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
