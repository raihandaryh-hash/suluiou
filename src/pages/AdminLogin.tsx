import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flame, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const { user, isAdmin, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);

    if (!email || !password) {
      setError('Email dan password harus diisi.');
      setSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      setSubmitting(false);
      return;
    }

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Email atau password salah.');
          } else if (error.message.includes('Email not confirmed')) {
            setError('Email belum dikonfirmasi. Cek inbox email Anda.');
          } else {
            setError(error.message);
          }
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes('already registered')) {
            setError('Email sudah terdaftar. Silakan login.');
          } else {
            setError(error.message);
          }
        } else {
          setInfo(
            'Pendaftaran berhasil! Cek email Anda untuk konfirmasi. Setelah konfirmasi, minta administrator untuk memberikan akses admin.'
          );
        }
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Flame className="w-8 h-8 text-primary" />
          <span className="text-2xl font-heading font-bold text-foreground">
            Sulu <span className="text-primary">Admin</span>
          </span>
        </Link>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-xl font-heading font-bold text-center mb-6">
            {mode === 'login' ? 'Masuk ke Dashboard' : 'Buat Akun Admin'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama lengkap"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@iou.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-destructive text-sm p-3 rounded-lg bg-destructive/10">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {info && (
              <div className="flex items-start gap-2 text-green-400 text-sm p-3 rounded-lg bg-green-500/10">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{info}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={submitting}
            >
              {submitting ? (
                'Memproses...'
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" /> Masuk
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Daftar
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
                setInfo('');
              }}
            >
              {mode === 'login'
                ? 'Belum punya akun? Daftar'
                : 'Sudah punya akun? Masuk'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
