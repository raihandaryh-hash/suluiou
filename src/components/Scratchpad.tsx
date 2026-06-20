import { useEffect, useState } from "react";
import { PencilLine } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";

const KEY = "sulu_scratchpad_v1";

// Corat-coret bebas yang menemani sepanjang sesi. Tanpa anchor, tanpa kategori.
function useScratchpad() {
  const [text, setText] = useState<string>(() => {
    try {
      return localStorage.getItem(KEY) ?? "";
    } catch {
      return "";
    }
  });

  const update = (v: string) => {
    setText(v);
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* noop */
    }
  };

  // Sinkron ulang saat tab/instance lain mengubah isinya.
  useEffect(() => {
    const resync = () => {
      try {
        setText(localStorage.getItem(KEY) ?? "");
      } catch {
        /* noop */
      }
    };
    window.addEventListener("focus", resync);
    return () => window.removeEventListener("focus", resync);
  }, []);

  return { text, update };
}

const TEXTAREA_CLASS =
  "flex-1 resize-none rounded-md border border-border bg-card/50 p-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-[hsl(var(--torch-gold))]/50";

// Desktop: panel inline di kolom kanan SpineBLayout.
export function ScratchpadPanel() {
  const { text, update } = useScratchpad();
  return (
    <div className="flex h-full max-h-[calc(100vh-7rem)] flex-col">
      <p className="mb-3 font-[Outfit] text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Coretan
      </p>
      <textarea
        value={text}
        onChange={(e) => update(e.target.value)}
        placeholder="Tulis apa pun di sini sepanjang perjalanan..."
        className={`min-h-[240px] ${TEXTAREA_CLASS}`}
      />
    </div>
  );
}

// Mobile: tombol di kiri-bawah (jauh dari "Tanya Sulu" di kanan-bawah) → bottom-sheet.
export function ScratchpadFab() {
  const { text, update } = useScratchpad();
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label="Coretan"
          className="fixed bottom-6 left-6 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-lg"
        >
          <PencilLine className="h-4 w-4" />
          Coretan
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col p-4 pb-8">
          <DrawerTitle className="mb-3 font-[Outfit] text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Coretan
          </DrawerTitle>
          <textarea
            value={text}
            onChange={(e) => update(e.target.value)}
            placeholder="Tulis apa pun di sini sepanjang perjalanan..."
            className={`h-[42vh] ${TEXTAREA_CLASS}`}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
