import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import html2canvas from 'html2canvas';
import ShareCard, { type ShareCardProps } from '@/components/ShareCard';

type ShareResult =
  | { ok: true; method: 'web-share' | 'download' | 'clipboard' }
  | { ok: false; error: string };

/**
 * Programmatically renders ShareCard off-screen, captures to PNG blob,
 * then either uses Web Share API (mobile) or triggers a download.
 * Falls back to clipboard text if both image paths fail.
 */
export function useShareCard() {
  const [isSharing, setIsSharing] = useState(false);

  const shareCard = useCallback(async (props: ShareCardProps): Promise<ShareResult> => {
    setIsSharing(true);

    // Build off-screen mount container at native 1080x1920 so html2canvas
    // captures exact pixels regardless of viewport.
    const host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.top = '0';
    host.style.left = '-99999px';
    host.style.width = '1080px';
    host.style.height = '1920px';
    host.style.pointerEvents = 'none';
    host.style.zIndex = '-1';
    document.body.appendChild(host);

    const root = createRoot(host);

    try {
      // Render and wait for layout/paint before capture.
      await new Promise<void>((resolve) => {
        root.render(createElement(ShareCard, props));
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      const target = host.firstElementChild as HTMLElement;
      if (!target) throw new Error('ShareCard mount failed');

      const canvas = await html2canvas(target, {
        scale: 1, // already 1080x1920 in DOM; scale:1 keeps target px
        useCORS: true,
        backgroundColor: null,
        logging: false,
        width: 1080,
        height: 1920,
      });

      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
          'image/png',
          0.95,
        ),
      );

      const filename = `sulu-${props.persona}-${Date.now()}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      // Try Web Share API with files (mobile: iOS Safari 15+, Android Chrome)
      const navAny = navigator as Navigator & {
        canShare?: (data: { files?: File[] }) => boolean;
        share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
      };

      if (navAny.share && navAny.canShare && navAny.canShare({ files: [file] })) {
        try {
          await navAny.share({
            files: [file],
            title: 'Sulu — Data yang perlu kamu tahu',
            text: `${props.value} — ${props.label}\n\nLihat lebih lengkap: https://suluiou.lovable.app/insight`,
          });
          return { ok: true, method: 'web-share' };
        } catch (err) {
          // user cancelled or share failed — fall through to download
          if ((err as Error).name === 'AbortError') {
            return { ok: true, method: 'web-share' };
          }
        }
      }

      // Desktop / fallback: trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      return { ok: true, method: 'download' };
    } catch (err) {
      // Minimal clipboard fallback
      try {
        await navigator.clipboard.writeText(
          `${props.value} — ${props.label}\n\nArtinya: ${props.artinya}\n\nSumber: ${props.source}\nhttps://suluiou.lovable.app/insight`,
        );
        return { ok: true, method: 'clipboard' };
      } catch {
        return { ok: false, error: (err as Error).message };
      }
    } finally {
      try {
        root.unmount();
      } catch {
        // ignore
      }
      if (host.parentNode) host.parentNode.removeChild(host);
      setIsSharing(false);
    }
  }, []);

  return { shareCard, isSharing };
}
