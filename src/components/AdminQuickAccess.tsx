import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  /** "floating" = pojok kanan bawah (untuk landing). "inline" = card biasa. */
  variant?: 'floating' | 'inline';
}

/**
 * Tombol "Buka Dashboard Fasilitator" yang HANYA muncul kalau user
 * yang sedang login terdeteksi sebagai admin (via useAuth → isAdmin).
 * Tidak terlihat oleh siswa biasa atau guest.
 */
const AdminQuickAccess = ({ variant = 'floating' }: Props) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading || !user || !isAdmin) return null;

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-4"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/15 p-2">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Anda login sebagai Fasilitator
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Buka dashboard untuk memantau kelas dan siswa.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Buka Dashboard Fasilitator
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Link
        to="/admin"
        className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition"
      >
        <Shield className="w-4 h-4" />
        Buka Dashboard Fasilitator
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
};

export default AdminQuickAccess;
