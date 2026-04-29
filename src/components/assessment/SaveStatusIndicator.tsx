import { useEffect, useState } from 'react';
import { Cloud, CloudOff, Loader2, Check } from 'lucide-react';
import { subscribeSaveStatus, type SaveStatus } from '@/lib/progress';
import { cn } from '@/lib/utils';

/** Tiny inline indicator for HEXACO/SDS headers.
 *  States: idle (hidden), saving, saved, local-only. */
export default function SaveStatusIndicator({ className }: { className?: string }) {
  const [status, setStatus] = useState<SaveStatus>('idle');

  useEffect(() => subscribeSaveStatus(setStatus), []);

  if (status === 'idle') return null;

  const map: Record<Exclude<SaveStatus, 'idle'>, { icon: JSX.Element; text: string; color: string }> = {
    saving: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      text: 'Menyimpan…',
      color: 'text-muted-foreground',
    },
    saved: {
      icon: <Check className="w-3 h-3" />,
      text: 'Tersimpan',
      color: 'text-[hsl(142,70%,40%)]',
    },
    local: {
      icon: <CloudOff className="w-3 h-3" />,
      text: 'Tersimpan lokal',
      color: 'text-amber-600',
    },
  };

  const { icon, text, color } = map[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-medium',
        color,
        className,
      )}
      aria-live="polite"
      title={status === 'local' ? 'Tersimpan di perangkat. Akan disinkronkan saat online.' : undefined}
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </span>
  );
}
