import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildSuluContext } from "@/lib/buildSuluContext";
import RujukanDistress from "@/components/RujukanDistress";
import { periksaDistressNilai, type TingkatDistress } from "@/lib/distress";
import { rumuskanSendiriContent as rs } from "@/data/jalanBaktiContent";
import { masukDenganGoogle } from "@/lib/masukGoogle";

type Role = {
  title: string;
  whatTheyDo: string;
  demandsMost: string;
  whyUnexpected: string;
  pathwayHint: string;
  unexpected: boolean;
};

type Props = {
  medan: { id: string; nama: string };
  subPicks: string[];
  siapa: string[];
  province: string | null;
  initialPicked?: string[];
  onPickedChange?: (picked: string[]) => void;
  initialRumusan?: Rumusan;
  onRumusanChange?: (r: Rumusan) => void;
};

export type Rumusan = { siapa: string; masalah: string; bangun: string };

const MAX_PICK = 2;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export default function BroadenRoles({
  medan,
  subPicks,
  siapa,
  province,
  initialPicked = [],
  onPickedChange,
  initialRumusan,
  onRumusanChange,
}: Props) {
  const [masukGagal, setMasukGagal] = useState(false);
  const [phase, setPhase] = useState<"idle" | "loading" | "done" | "error" | "masuk">("idle");
  const [roles, setRoles] = useState<Role[]>([]);
  const [note, setNote] = useState("");
  const [revealed, setRevealed] = useState(0);
  const [picked, setPicked] = useState<string[]>(initialPicked);
  const [errorMsg, setErrorMsg] = useState("");
  const [distress, setDistress] = useState<TingkatDistress | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => timers.current.forEach((t) => clearTimeout(t));
  }, []);

  function reveal(count: number) {
    if (prefersReducedMotion()) {
      setRevealed(count);
      return;
    }
    setRevealed(0);
    for (let i = 1; i <= count; i++) {
      const t = window.setTimeout(() => setRevealed(i), i * 150);
      timers.current.push(t);
    }
  }

  async function run() {
    // B3a/B7: pemeriksa distress di klien atas teks bebas siswa, sebelum panggilan AI.
    const ctx = buildSuluContext(province);
    const personSide = {
      skills: ctx.reflection.phase2b || "",
      values: ctx.reflection.phase2a || "",
    };
    const cek = periksaDistressNilai(personSide.skills, personSide.values);
    if (cek.cocok) {
      setDistress(cek.tingkat);
      return;
    }
    setPhase("loading");
    setErrorMsg("");
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.functions.invoke("broaden-roles", {
        body: { medan, subPicks, siapa, province, personSide },
      });
      if (data?.distress) {
        setDistress(data.tingkat === "bahaya_langsung" ? "bahaya_langsung" : "tanda_berat");
        setPhase("idle");
        return;
      }
      const status = (error as { context?: { status?: number } } | null)?.context?.status;
      if (status === 401) {
        setPhase("masuk");
        return;
      }
      if (error || !data || data.error || !Array.isArray(data.roles) || !data.roles.length) {
        throw new Error(data?.error || error?.message || "empty");
      }
      setRoles(data.roles as Role[]);
      // Nyalakan ulang: pilihan dari kartu AI lama dibuang, peran rumusan sendiri dipertahankan.
      const tetap = picked.filter((t) => t.startsWith(`${rs.awalanJudul}:`));
      setPicked(tetap);
      onPickedChange?.(tetap);
      setNote(typeof data.note === "string" ? data.note : "");
      setPhase("done");
      reveal(data.roles.length);
    } catch {
      setErrorMsg("Belum berhasil menyalakan peran. Coba lagi sebentar.");
      setPhase("error");
    }
  }

  function togglePick(title: string) {
    let next: string[];
    if (picked.includes(title)) {
      next = picked.filter((t) => t !== title);
    } else {
      if (picked.length >= MAX_PICK) return;
      next = [...picked, title];
    }
    setPicked(next);
    onPickedChange?.(next);
  }

  if (distress) {
    return <RujukanDistress tingkat={distress} onTutup={() => setDistress(null)} />;
  }

  // Pilihan yang tidak punya kartu di layar (rumusan sendiri, atau sesudah muat ulang) tetap terlihat dan bisa dilepas.
  const judulKartu = new Set(roles.map((r) => r.title));
  const tanpaKartu = picked.filter((t) => !judulKartu.has(t));
  const barisPilihan = tanpaKartu.length > 0 && (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
      <span className="text-muted-foreground">{rs.pilihanmu}</span>
      {tanpaKartu.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1">
          {t}
          <button type="button" className="text-muted-foreground hover:text-foreground" aria-label={`${rs.lepas} ${t}`} onClick={() => togglePick(t)}>
            ✕
          </button>
        </span>
      ))}
    </div>
  );

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-2">
        {barisPilihan}
        <Button
          onClick={run}
          size="lg"
          className="torch-glow bg-torch-gradient text-white hover:opacity-95"
        >
          Nyalakan peran yang belum terlihat
        </Button>
        <p className="text-sm text-muted-foreground max-w-md">
          Sulu akan membuka beberapa peran nyata di medan ini, termasuk yang jarang terpikirkan.
        </p>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <span
          className="h-3 w-3 rounded-full bg-[hsl(var(--torch-gold))] torch-glow motion-safe:animate-pulse"
          aria-hidden
        />
        <p className="text-sm text-muted-foreground">
          Sedang menyalakan peran yang belum terlihat...
        </p>
      </div>
    );
  }

  if (phase === "masuk") {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-6">
        <p className="text-sm text-foreground/85 max-w-md">{rs.masukIsi}</p>
        <Button
          size="sm"
          onClick={async () => {
            setMasukGagal(false);
            const r = await masukDenganGoogle("/jalan-bakti");
            if (r.error) setMasukGagal(true);
          }}
        >
          {rs.masukTombol}
        </Button>
        {masukGagal && <p className="text-xs text-muted-foreground">{rs.masukGagal}</p>}
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-6">
        <p className="text-sm text-foreground/80">{errorMsg}</p>
        <Button onClick={run} variant="outline" size="sm">
          Coba lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {siapa.length > 0 && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Peran-peran ini dinyalakan dengan mempertimbangkan siapa yang tadi kamu tandai:{" "}
          <span className="text-foreground/85">{siapa.join(", ")}</span>. Pilihanmu tidak hilang,
          ia ikut membentuk apa yang kamu lihat sekarang.
        </p>
      )}
      <div className="space-y-4">
        {roles.map((r, i) => {
          const shown = i < revealed;
          const isPicked = picked.includes(r.title);
          return (
            <div
              key={`${r.title}-${i}`}
              className={cn(
                "rounded-xl border bg-card p-5 space-y-3 transition-all duration-500 ease-out",
                shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                r.unexpected ? "border-[hsl(var(--torch-gold))]/45" : "border-border",
                isPicked && "ring-2 ring-[hsl(var(--torch-gold))]"
              )}
            >
              {r.unexpected && (
                <span className="inline-block text-xs font-semibold uppercase tracking-wide text-[hsl(var(--torch-gold))]">
                  Jarang terlihat
                </span>
              )}
              <h4 className="font-heading text-lg font-semibold text-foreground">{r.title}</h4>
              <p className="text-sm leading-relaxed text-foreground/85">{r.whatTheyDo}</p>
              <p className="text-sm text-foreground/90">
                <span className="text-muted-foreground">Paling menuntut: </span>
                {r.demandsMost}
              </p>
              {r.whyUnexpected && (
                <p className="text-sm italic leading-relaxed text-muted-foreground">
                  {r.whyUnexpected}
                </p>
              )}
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-primary marker:content-['']">
                  <span className="group-open:hidden">Lihat jalur ke sana</span>
                  <span className="hidden group-open:inline">Tutup</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80 border-l-2 border-border pl-3">
                  {r.pathwayHint}
                </p>
              </details>
              <div className="pt-1">
                <Button
                  onClick={() => togglePick(r.title)}
                  variant={isPicked ? "default" : "outline"}
                  size="sm"
                  disabled={!isPicked && picked.length >= MAX_PICK}
                >
                  {isPicked ? "Ditelusuri ✓" : "Telusuri ini"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {revealed >= roles.length && (
        <RumuskanSendiri
          picked={picked}
          awal={initialRumusan}
          onUbah={onRumusanChange}
          onLepas={(judul) => { if (picked.includes(judul)) togglePick(judul); }}
          onPakai={(judul, r) => {
            // Isian bebas diperiksa pagar distress di perangkat sebelum dipakai (lapis 1b di server ikut memeriksa).
            const cek = periksaDistressNilai(r.siapa, r.masalah, r.bangun);
            if (cek.cocok) { setDistress(cek.tingkat); return; }
            if (!picked.includes(judul) && picked.length < MAX_PICK) togglePick(judul);
          }}
        />
      )}

      {revealed >= roles.length && barisPilihan}

      {revealed >= roles.length && (
        <div className="pt-2 space-y-2">
          <p className="text-sm text-muted-foreground">
            Pilih satu atau dua peran yang paling ingin kamu telusuri lebih jauh
            {picked.length > 0 ? ` (${picked.length}/${MAX_PICK} dipilih)` : ""}.
          </p>
          {note && (
            <p className="text-base leading-relaxed text-foreground/90 border-l-4 border-[hsl(var(--torch-gold))] pl-4">
              {note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function RumuskanSendiri({
  picked,
  onPakai,
  awal,
  onUbah,
  onLepas,
}: {
  picked: string[];
  onPakai: (judul: string, r: Rumusan) => void;
  awal?: Rumusan;
  onUbah?: (r: Rumusan) => void;
  onLepas?: (judul: string) => void;
}) {
  const [siapa, setSiapaRaw] = useState(awal?.siapa ?? "");
  const [masalah, setMasalahRaw] = useState(awal?.masalah ?? "");
  const [bangun, setBangunRaw] = useState(awal?.bangun ?? "");
  const ubah = (r: Rumusan) => onUbah?.(r);
  const setSiapa = (v: string) => { setSiapaRaw(v); ubah({ siapa: v, masalah, bangun }); };
  const setMasalah = (v: string) => { setMasalahRaw(v); ubah({ siapa, masalah: v, bangun }); };
  // Rumusan yang sudah dipakai lalu diubah: judul lama dilepas supaya peran terpilih selalu sama dengan isian.
  const setBangun = (v: string) => {
    const lama = bangun.trim() ? `${rs.awalanJudul}: ${bangun.trim()}` : "";
    if (lama && lama !== (v.trim() ? `${rs.awalanJudul}: ${v.trim()}` : "")) onLepas?.(lama);
    setBangunRaw(v);
    ubah({ siapa, masalah, bangun: v });
  };
  const judul = bangun.trim() ? `${rs.awalanJudul}: ${bangun.trim()}` : "";
  const sudah = judul !== "" && picked.includes(judul);
  const penuh = picked.length >= MAX_PICK && !sudah;
  const kolom = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";
  return (
    <div className="rounded-xl border border-dashed border-[hsl(var(--torch-gold))]/60 bg-card p-5 space-y-3">
      <p className="text-sm text-muted-foreground">{rs.pengantar}</p>
      <h4 className="font-heading text-lg font-semibold text-foreground">{rs.judul}</h4>
      <p className="text-sm leading-relaxed text-foreground/85">{rs.isi}</p>
      <label className="block space-y-1 text-sm">
        <span className="text-foreground/90">{rs.label1}</span>
        <input className={kolom} value={siapa} maxLength={120} onChange={(e) => setSiapa(e.target.value)} />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-foreground/90">{rs.label2}</span>
        <input className={kolom} value={masalah} maxLength={160} onChange={(e) => setMasalah(e.target.value)} />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-foreground/90">{rs.label3}</span>
        <input className={kolom} value={bangun} maxLength={80} placeholder={rs.contoh3} onChange={(e) => setBangun(e.target.value)} />
      </label>
      <Button size="sm" variant={sudah ? "default" : "outline"} disabled={!judul || sudah || penuh} onClick={() => onPakai(judul, { siapa, masalah, bangun })}>
        {sudah ? "Ditelusuri ✓" : rs.tombol}
      </Button>
    </div>
  );
}
