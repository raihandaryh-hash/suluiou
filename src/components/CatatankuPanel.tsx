// src/components/CatatankuPanel.tsx
// Panel READ-ONLY "Catatanku" — dipakai SpineBLayout (kolom kanan desktop & FAB mobile).
import { useEffect, useMemo, useState } from "react";
import { getAllNotes, type SuluNote, type NoteSource } from "@/lib/notes";
import { cn } from "@/lib/utils";
import { ChevronDown, NotebookPen } from "lucide-react";

const SOURCE_LABEL: Record<NoteSource, string> = {
  insight: "Kenali Dunia",
  skillmap: "Peta Keahlian",
};

function useLiveNotes() {
  const [notes, setNotes] = useState<SuluNote[]>(() => getAllNotes());
  useEffect(() => {
    const refresh = () => setNotes(getAllNotes());
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "sulu_notes_v1") refresh();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return notes;
}

function NoteItem({ note }: { note: SuluNote }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="rounded-md border border-border/60 bg-background/60 transition-colors hover:border-[hsl(var(--torch-gold))]/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-2 px-3 py-2.5 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="rounded-sm border border-[hsl(var(--torch-gold))]/40 px-1.5 py-px text-[9px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--torch-gold))]">
              {SOURCE_LABEL[note.source]}
            </span>
          </div>
          <p className="mt-1 truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--mid-blue))]/80">
            {note.label}
          </p>
          <p
            className={cn(
              "mt-1 whitespace-pre-wrap text-[12.5px] leading-snug text-[hsl(var(--ink-deep))]/85",
              !open && "line-clamp-2",
            )}
          >
            {note.text}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
    </li>
  );
}

export function CatatankuPanel({ className }: { className?: string }) {
  const notes = useLiveNotes();
  const total = notes.length;
  const list = useMemo(() => notes, [notes]);

  return (
    <div className={cn("flex h-full flex-col text-sm", className)}>
      <header className="mb-3 flex items-baseline justify-between">
        <p className="font-[Outfit] text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Catatanku
        </p>
        <span className="text-[11px] tabular-nums text-muted-foreground">{total}</span>
      </header>

      {total === 0 ? (
        <p className="text-[12.5px] italic leading-relaxed text-muted-foreground">
          Catatanmu akan muncul di sini saat kamu menandai sesuatu sepanjang perjalanan.
        </p>
      ) : (
        <ul className="space-y-2 overflow-y-auto pr-1">
          {list.map((n) => (
            <NoteItem key={n.id} note={n} />
          ))}
        </ul>
      )}
    </div>
  );
}

/** Mobile FAB + bottom-sheet drawer */
export function CatatankuFab() {
  const [open, setOpen] = useState(false);
  const notes = useLiveNotes();
  const total = notes.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-background/95 px-3.5 py-2 text-xs font-medium text-[hsl(var(--ink-deep))] shadow-lg backdrop-blur transition-colors hover:border-[hsl(var(--torch-gold))]/60 lg:hidden"
        aria-label="Buka Catatanku"
      >
        <NotebookPen className="h-3.5 w-3.5" aria-hidden />
        Catatanku
        {total > 0 && (
          <span className="ml-0.5 rounded-full bg-[hsl(var(--torch-gold))]/20 px-1.5 py-0.5 text-[10px] tabular-nums text-[hsl(var(--ink-deep))]">
            {total}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] rounded-t-2xl border-t border-border bg-background p-4 shadow-xl">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" aria-hidden />
            <div className="max-h-[70vh] overflow-y-auto">
              <CatatankuPanel />
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 w-full rounded-md border border-border py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
