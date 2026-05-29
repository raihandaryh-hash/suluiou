import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// The /insight page was rebuilt to be persona-aware (siswa / orang tua / guru BK).
// Content now lives in src/data/insightContent.ts and is edited by developers,
// not via a database-backed form. This page is kept as a stub to preserve the route.
const AdminInsight = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke dashboard
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-6 py-16 max-w-2xl">
        <h1 className="font-heading font-semibold text-3xl mb-4">Edit konten Insight</h1>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Halaman Insight kini bersifat persona-aware (siswa, orang tua, guru BK). Semua teks
          ada di file <code className="px-1.5 py-0.5 rounded bg-secondary text-foreground text-sm">src/data/insightContent.ts</code>{' '}
          dan diubah langsung di kode agar versinya konsisten dengan rilis.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Untuk waitlist asesmen, data terkumpul di tabel <code className="px-1.5 py-0.5 rounded bg-secondary text-foreground text-sm">waitlist_sulu</code>.
        </p>
        <Button asChild variant="outline">
          <Link to="/insight">Lihat halaman Insight</Link>
        </Button>
      </main>
    </div>
  );
};

export default AdminInsight;
