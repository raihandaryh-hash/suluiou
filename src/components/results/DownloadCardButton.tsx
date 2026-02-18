import { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `sulu-hasil-${topMatch.pathway.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: 'Berhasil!', description: 'Kartu hasil berhasil di-download.' });
    } catch {
      toast({ title: 'Gagal', description: 'Tidak bisa generate gambar.', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  }, [topMatch, toast]);

  return (
    <>
      {/* Hidden card for capture */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }} aria-hidden="true">
        <ResultCard ref={cardRef} scores={scores} topMatch={topMatch} allMatches={allMatches} />
      </div>

      <Button onClick={handleDownload} disabled={generating} variant="outline" className="gap-2 w-full sm:w-auto">
        {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {generating ? 'Generating...' : 'Download Kartu'}
      </Button>
    </>
  );
}
