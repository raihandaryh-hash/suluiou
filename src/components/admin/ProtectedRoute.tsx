import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Flame } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Flame className="w-8 h-8 text-primary animate-pulse" />
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">
            Akses Ditolak
          </h2>
          <p className="text-muted-foreground">
            Anda tidak memiliki akses admin. Hubungi administrator untuk mendapatkan akses.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
