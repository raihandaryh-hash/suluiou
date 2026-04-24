import { Button } from '@/components/ui/button';
import { Share2, MessageCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DownloadCardButton } from './DownloadCardButton';
import type { DimensionScores, TopSelection } from '@/lib/scoring';

interface ShareButtonsProps {
  scores: DimensionScores;
  topSelection: TopSelection;
}

export function ShareButtons({ scores, topSelection }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const programLabel = topSelection.pathwayName
    ? `program ${topSelection.pathwayName} di IOU`
    : 'program-program di IOU Indonesia';

  const shareText = `🔥 Aku baru selesai tes minat karier di Sulu by IOU Indonesia!\n\nAku jadi tertarik untuk eksplorasi ${programLabel}.\n\nCoba juga yuk 👉 ${window.location.origin}`;

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({ title: 'Tersalin!', description: 'Teks berhasil disalin ke clipboard.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Gagal menyalin', variant: 'destructive' });
    }
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Share2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-heading font-semibold">Bagikan Hasilmu</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Ajak temanmu ikut tes juga!
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
        <Button onClick={shareWhatsApp} className="gap-2 w-full sm:w-auto bg-[hsl(142,70%,40%)] hover:bg-[hsl(142,70%,35%)] text-white">
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </Button>
        <Button onClick={shareTwitter} variant="outline" className="gap-2 w-full sm:w-auto">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X / Twitter
        </Button>
        <Button onClick={copyToClipboard} variant="outline" className="gap-2 w-full sm:w-auto">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Tersalin!' : 'Salin Teks'}
        </Button>
        <DownloadCardButton scores={scores} topSelection={topSelection} />
      </div>
    </div>
  );
}
