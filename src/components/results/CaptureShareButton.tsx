import { useState } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Camera, Download, MessageCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CaptureShareButtonProps {
  /** id of the DOM element to capture */
  targetId: string;
  fileSlug?: string;
}

export function CaptureShareButton({ targetId, fileSlug = 'sulu-hasil' }: CaptureShareButtonProps) {
  const [busy, setBusy] = useState<null | 'download' | 'wa'>(null);
  const { toast } = useToast();

  const capture = async (): Promise<HTMLCanvasElement | null> => {
    const el = document.getElementById(targetId);
    if (!el) {
      toast({ title: 'Gagal', description: 'Section tidak ditemukan.', variant: 'destructive' });
      return null;
    }
    return html2canvas(el, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
  };

  const handleDownload = async () => {
    setBusy('download');
    try {
      const canvas = await capture();
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `${fileSlug}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: 'Berhasil!', description: 'Gambar hasil telah di-download.' });
    } catch {
      toast({ title: 'Gagal', description: 'Tidak bisa membuat gambar.', variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const handleWhatsApp = () => {
    const text = `Lihat hasil asesmen minat dan kepribadianku di Sulu — ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 text-center mb-12">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Camera className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-heading font-semibold">Unduh / Bagikan Hasil</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Simpan hasilmu sebagai gambar atau bagikan tautan ke WhatsApp.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button onClick={handleDownload} disabled={busy !== null} variant="outline" className="gap-2 w-full sm:w-auto">
          {busy === 'download' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {busy === 'download' ? 'Memproses...' : 'Unduh Gambar'}
        </Button>
        <Button
          onClick={handleWhatsApp}
          className="gap-2 w-full sm:w-auto bg-[hsl(142,70%,40%)] hover:bg-[hsl(142,70%,35%)] text-white"
        >
          <MessageCircle className="w-4 h-4" />
          Bagikan ke WhatsApp
        </Button>
      </div>
    </div>
  );
}
