import { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Share, Instagram, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResultCard } from './ResultCard';
import type { DimensionScores, PathwayMatch } from '@/lib/scoring';

interface DownloadCardButtonProps {
  scores: DimensionScores;
  topMatch: PathwayMatch;
  allMatches: PathwayMatch[];
}

export function DownloadCardButton({ scores, topMatch, allMatches }: DownloadCardButtonProps) {
  const [generating, setGenerating] = useState(false);
  const [shareTarget, setShareTarget] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const generateCanvas = useCallback(async () => {
    if (!cardRef.current) return null;
    return html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });
  }, []);

  const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
    new Promise((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Blob failed'))), 'image/png');
    });

  const handleDownload = useCallback(async () => {
    setGenerating(true);
    setShareTarget('download');
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `sulu-hasil-${topMatch.pathway.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: 'Berhasil!', description: 'Kartu hasil berhasil di-download.' });
    } catch {
      toast({ title: 'Gagal', description: 'Tidak bisa generate gambar.', variant: 'destructive' });
    } finally {
      setGenerating(false);
      setShareTarget(null);
    }
  }, [topMatch, toast, generateCanvas]);

  const handleNativeShare = useCallback(async (target: string) => {
    setGenerating(true);
    setShareTarget(target);
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;
      const blob = await canvasToBlob(canvas);
      const file = new File([blob], `sulu-hasil-${topMatch.pathway.id}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Hasil Assessment Sulu',
          text: `🔥 Jalur ${topMatch.pathway.name} cocok ${topMatch.matchPercentage}% sama aku! Coba juga yuk 👉 ${window.location.origin}`,
          files: [file],
        });
        toast({ title: 'Berhasil!', description: 'Kartu berhasil di-share.' });
      } else {
        // Fallback: download the image
        const link = document.createElement('a');
        link.download = `sulu-hasil-${topMatch.pathway.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast({
          title: 'Share tidak didukung',
          description: 'Gambar telah di-download. Kamu bisa upload manual ke Instagram/WhatsApp.',
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      toast({ title: 'Gagal', description: 'Tidak bisa share gambar.', variant: 'destructive' });
    } finally {
      setGenerating(false);
      setShareTarget(null);
    }
  }, [topMatch, toast, generateCanvas]);

  const isActive = (target: string) => generating && shareTarget === target;

  return (
    <>
      {/* Hidden card for capture */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }} aria-hidden="true">
        <ResultCard ref={cardRef} scores={scores} topMatch={topMatch} allMatches={allMatches} />
      </div>

      <Button onClick={handleDownload} disabled={generating} variant="outline" className="gap-2 w-full sm:w-auto">
        {isActive('download') ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {isActive('download') ? 'Generating...' : 'Download Kartu'}
      </Button>
      <Button
        onClick={() => handleNativeShare('instagram')}
        disabled={generating}
        variant="outline"
        className="gap-2 w-full sm:w-auto"
      >
        {isActive('instagram') ? <Loader2 className="w-4 h-4 animate-spin" /> : <Instagram className="w-4 h-4" />}
        {isActive('instagram') ? 'Sharing...' : 'IG Stories'}
      </Button>
      <Button
        onClick={() => handleNativeShare('whatsapp-status')}
        disabled={generating}
        className="gap-2 w-full sm:w-auto bg-[hsl(142,70%,40%)] hover:bg-[hsl(142,70%,35%)] text-white"
      >
        {isActive('whatsapp-status') ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
        {isActive('whatsapp-status') ? 'Sharing...' : 'WA Status'}
      </Button>
    </>
  );
}
