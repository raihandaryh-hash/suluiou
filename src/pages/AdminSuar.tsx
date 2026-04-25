import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const BUCKET = 'suar-slides';

const AdminSuar = () => {
  const [slides, setSlides] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string>('');

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list('', { limit: 200, sortBy: { column: 'name', order: 'asc' } });
    if (error) {
      toast({ title: 'Gagal memuat slide', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }
    const items = (data || [])
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      .map((f) => ({
        name: f.name,
        url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      }));
    setSlides(items);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const clearAllSlides = async (): Promise<boolean> => {
    const { data } = await supabase.storage.from(BUCKET).list('', { limit: 500 });
    const names = (data || []).map((f) => f.name);
    if (names.length === 0) return true;
    const { error } = await supabase.storage.from(BUCKET).remove(names);
    if (error) {
      toast({ title: 'Gagal menghapus slide lama', description: error.message, variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handlePdfUpload = async (file: File) => {
    if (!file.type.includes('pdf')) {
      toast({ title: 'Format salah', description: 'Mohon unggah file PDF.', variant: 'destructive' });
      return;
    }
    setUploading(true);
    setProgress('Membaca PDF...');
    try {
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const total = pdf.numPages;

      setProgress('Menghapus slide lama...');
      const cleared = await clearAllSlides();
      if (!cleared) {
        setUploading(false);
        return;
      }

      for (let p = 1; p <= total; p++) {
        setProgress(`Memproses slide ${p} / ${total}...`);
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: 1.6 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas tidak tersedia');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

        const blob: Blob = await new Promise((resolve, reject) =>
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Gagal encode'))), 'image/jpeg', 0.85),
        );
        const filename = `slide-${String(p).padStart(2, '0')}.jpg`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(filename, blob, { contentType: 'image/jpeg', upsert: true });
        if (upErr) throw upErr;
      }

      toast({ title: 'Berhasil', description: `${total} slide berhasil diunggah.` });
      setProgress('');
      await refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      toast({ title: 'Upload gagal', description: msg, variant: 'destructive' });
    } finally {
      setUploading(false);
      setProgress('');
    }
  };

  const handleDeleteOne = async (name: string) => {
    if (!confirm(`Hapus ${name}?`)) return;
    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    if (error) {
      toast({ title: 'Gagal hapus', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Terhapus', description: name });
    refresh();
  };

  const handleDeleteAll = async () => {
    if (!confirm('Hapus SEMUA slide Suar? Tindakan ini tidak bisa dibatalkan.')) return;
    setUploading(true);
    const ok = await clearAllSlides();
    setUploading(false);
    if (ok) {
      toast({ title: 'Semua slide dihapus' });
      refresh();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
          <Link to="/suar" className="text-sm text-primary hover:underline">
            Lihat halaman Suar →
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Kelola Suar</h1>
          <p className="text-muted-foreground">
            Unggah PDF deck Suar — sistem akan otomatis memecah jadi slide gambar dan mengganti yang lama.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold mb-1">Unggah PDF baru</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Format: PDF. Setiap halaman akan jadi satu slide. Slide lama akan dihapus.
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handlePdfUpload(f);
                    e.target.value = '';
                  }}
                />
                <span
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    uploading
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> {progress || 'Mengunggah...'}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Pilih PDF
                    </>
                  )}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Slide saat ini {slides.length > 0 && <span className="text-muted-foreground">({slides.length})</span>}
          </h2>
          {slides.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleDeleteAll} disabled={uploading}>
              <Trash2 className="w-4 h-4" /> Hapus semua
            </Button>
          )}
        </div>

        {loading ? (
          <p className="text-muted-foreground">Memuat...</p>
        ) : slides.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Belum ada slide. Unggah PDF di atas untuk memulai.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {slides.map((s, i) => (
              <div key={s.name} className="group relative rounded-lg border border-border overflow-hidden bg-card">
                <img src={s.url} alt={s.name} className="w-full h-auto" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex items-center justify-between">
                  <span className="text-xs text-white font-medium">#{i + 1}</span>
                  <button
                    onClick={() => handleDeleteOne(s.name)}
                    className="rounded p-1 bg-white/10 hover:bg-destructive text-white transition opacity-0 group-hover:opacity-100"
                    aria-label={`Hapus ${s.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSuar;
