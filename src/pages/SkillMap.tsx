import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeftRight, X, ChevronDown, ArrowLeft, Search, Network, List, Maximize2 } from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { LAYERS, AI_RISK, NODES, ISTILAH_BRIDGE, CONNECTION_MAP, type SkillNode } from "@/data/skillMapContent";
import { getNote, upsertNote } from "@/lib/notes";

type NodeType = SkillNode;

// ─────────────────────────────────────────────────────────────
// Catatanku — tangkap catatan-baca per node. Mengalir ke Surat Perjalanan (D).
// ─────────────────────────────────────────────────────────────
function Catatanku({ anchor, label }: { anchor: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const n = getNote("skillmap", anchor);
    setText(n?.text ?? "");
    setOpen(!!n?.text);
  }, [anchor]);

  function save() {
    upsertNote("skillmap", anchor, label, text);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="text-base leading-none">+</span> Catatanku tentang skill ini
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3">
      <p className="text-xs font-bold tracking-widest uppercase mb-2 text-muted-foreground">Catatanku</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Apa yang menarik buatmu di sini? Tulis sebelum lupa — ini akan terkumpul di Surat Perjalananmu nanti."
        className="w-full min-h-[72px] rounded-lg border border-border bg-background p-2 text-sm leading-relaxed outline-none focus:border-primary/60"
      />
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={save}
          className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Simpan
        </button>
        {saved && <span className="text-xs text-green-600">Tersimpan ✓</span>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NodePill — chip di view Daftar
// ─────────────────────────────────────────────────────────────
function NodePill({ node, isActive, isConnected, isJembatanHighlighted, dimmed, onClick }: { node: NodeType; isActive: boolean; isConnected: boolean; isJembatanHighlighted: boolean; dimmed: boolean; onClick: () => void }) {
  const colors = LAYERS[node.layer].colors;
  let style: React.CSSProperties = { opacity: dimmed ? 0.3 : 1, borderWidth: 1.5 };
  let className = "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border shrink-0 transition-all bg-background border-border text-muted-foreground";
  if (isActive) {
    style = { backgroundColor: colors.bg, borderColor: colors.dot, color: colors.text, boxShadow: `0 0 0 2px ${colors.ring}`, opacity: 1, borderWidth: 1.5 };
    className = "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border shrink-0 transition-all";
  } else if (isConnected) {
    style = { backgroundColor: "#FFFBEB", borderColor: "#FCD34D", color: "#78350F", opacity: 1, borderWidth: 1.5 };
    className = "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border shrink-0 transition-all";
  } else if (isJembatanHighlighted) {
    style = { backgroundColor: "#FFFBEB", borderColor: "#FCD34D", color: "#78350F", boxShadow: "0 0 0 2px #FCD34D", opacity: 1, borderWidth: 1.5 };
    className = "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border shrink-0 transition-all";
  }
  const sectorDot = node.sectorStatus === "growing" ? "#22C55E" : node.sectorStatus === "vulnerable" ? "#EF4444" : null;
  return (
    <button id={`node-${node.id}`} onClick={onClick} className={className} style={style}>
      {sectorDot && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sectorDot }} />}
      <span>{node.name}</span>
      {node.isProvenCausal && <span className="text-violet-500 text-xs font-bold ml-0.5">★</span>}
    </button>
  );
}

function DataBox({ colorKey, label, children }: { colorKey: string; label: string; children: React.ReactNode }) {
  const map: Record<string, { bg: string; lc: string; tc: string }> = {
    amber: { bg: "#FFFBEB", lc: "#D97706", tc: "#92400E" },
    blue: { bg: "#EFF6FF", lc: "#2563EB", tc: "#1E3A5F" },
    violet: { bg: "#F5F3FF", lc: "#7C3AED", tc: "#3B0764" },
  };
  const c = map[colorKey] || map.amber;
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: c.bg }}>
      <p className="text-xs font-bold mb-1" style={{ color: c.lc }}>{label}</p>
      <p className="text-sm leading-relaxed" style={{ color: c.tc }}>{children}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NodeDetail — panel detail (dipakai di Peta & Daftar). Kini + Catatanku.
// ─────────────────────────────────────────────────────────────
function NodeDetail({ node, onClose, onNavigate }: { node: NodeType; onClose: () => void; onNavigate: (n: NodeType) => void }) {
  const [showSrc, setShowSrc] = useState(false);
  const ai = AI_RISK[node.aiRisk];
  const lc = LAYERS[node.layer].colors;
  return (
    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden mt-3" style={{ borderColor: lc.border }}>
      <div className="px-5 pt-4 pb-3" style={{ backgroundColor: lc.bg }}>
        <div className="flex justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h3 className="font-bold text-base leading-tight" style={{ color: lc.text }}>{node.name}</h3>
              {node.isProvenCausal && <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-violet-100 text-violet-700">★ Relasi kausal terbukti secara eksperimental</span>}
            </div>
            <p className="text-xs font-mono text-muted-foreground">{node.techName}</p>
          </div>
          <button onClick={onClose} aria-label="Tutup"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: ai.bg, color: ai.text }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ai.dot }} />{ai.label}
          </span>
          {node.sectorStatus && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: node.sectorStatus === "growing" ? "#DCFCE7" : "#FEE2E2", color: node.sectorStatus === "growing" ? "#166534" : "#991B1B" }}>
              {node.sectorStatus === "growing" ? "↑ Tumbuh" : "↓ Rentan otomasi"}
            </span>
          )}
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        <p className="text-sm leading-relaxed text-foreground/80">{node.description}</p>
        {node.aiNote && <DataBox colorKey="amber" label="Posisi terhadap AI">{node.aiNote}</DataBox>}
        {node.wefData && <DataBox colorKey="blue" label="Data WEF Future of Jobs 2025">{node.wefData}</DataBox>}
        {node.indonesiaData && <DataBox colorKey="violet" label="Data Indonesia">{node.indonesiaData}</DataBox>}
        {node.localContextExample && (
          <div className="rounded-xl p-3 border border-border bg-muted/40">
            <p className="text-xs font-bold tracking-widest uppercase mb-1 text-muted-foreground">Contoh nyata</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{node.localContextExample}</p>
          </div>
        )}
        {node.causal && node.causal.length > 0 && (
          <div className="rounded-xl p-4 border border-violet-200 bg-violet-50">
            <p className="text-xs font-bold text-violet-700 mb-3">Relasi kausal yang terbukti secara eksperimental — bukan hanya korelasi</p>
            {node.causal.map((c, i) => {
              const tgt = NODES.find(n => n.id === c.to);
              return (
                <div key={i} className="mb-2">
                  <div className="flex items-center gap-2 text-violet-800 mb-1">
                    {c.direction === "bidirectional" ? <ArrowLeftRight className="w-4 h-4 shrink-0" /> : c.direction === "to" ? <ArrowRight className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0 rotate-180" />}
                    <button onClick={() => tgt && onNavigate(tgt)} className="font-medium text-sm underline underline-offset-2">{tgt?.name}</button>
                  </div>
                  <p className="text-xs text-violet-600 italic ml-6 leading-relaxed">{c.citation}</p>
                </div>
              );
            })}
          </div>
        )}
        {node.connections && node.connections.length > 0 && (
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2 text-muted-foreground">Terhubung ke</p>
            <div className="flex flex-wrap gap-2">
              {node.connections.map(cid => {
                const cn = NODES.find(n => n.id === cid); if (!cn) return null;
                const cl = LAYERS[cn.layer].colors;
                return <button key={cid} onClick={() => onNavigate(cn)} className="text-xs px-3 py-1 rounded-full border hover:opacity-70 transition-opacity" style={{ backgroundColor: cl.pill, borderColor: cl.pillBorder, color: cl.pillText }}>{cn.name}</button>;
              })}
            </div>
          </div>
        )}
        <Catatanku anchor={node.id} label={node.name} />
        <div>
          <button onClick={() => setShowSrc(v => !v)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSrc ? "rotate-180" : ""}`} />
            {showSrc ? "Sembunyikan sumber" : "Lihat sumber"}
          </button>
          {showSrc && <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{node.source}</p>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PETA VIEW — graph: 4 lane, node berposisi deterministik, garis SVG.
// Strategi anti-spaghetti: garis kausal-terbukti SELALU tampil (khusus);
// garis koneksi biasa hanya tampil untuk node aktif. Posisi DIHITUNG, bukan diukur DOM.
// ─────────────────────────────────────────────────────────────
const VBW = 1000;        // lebar viewBox (unit)
const LANE_H = 132;      // tinggi tiap lane (px = unit y)
const VBH = LANE_H * LAYERS.length;

function computePositions() {
  const pos: Record<string, { xu: number; yu: number; xPct: number }> = {};
  LAYERS.forEach((layer, li) => {
    const inLayer = NODES.filter(n => n.layer === layer.id);
    inLayer.forEach((n, i) => {
      const xu = ((i + 0.5) / inLayer.length) * VBW;
      const yu = (li + 0.5) * LANE_H;
      pos[n.id] = { xu, yu, xPct: (xu / VBW) * 100 };
    });
  });
  return pos;
}
const POS = computePositions();

// daftar pasangan kausal-terbukti (selalu digambar khusus), dedup arah
const CAUSAL_EDGES = (() => {
  const seen = new Set<string>();
  const out: { a: string; b: string; bidir: boolean }[] = [];
  NODES.forEach(n => (n.causal || []).forEach(c => {
    const key = [n.id, c.to].sort().join("|");
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ a: n.id, b: c.to, bidir: c.direction === "bidirectional" });
  }));
  return out;
})();

function PetaView({ activeId, filteredIds, isFiltering, onSelect }: { activeId: string | null; filteredIds: Set<string>; isFiltering: boolean; onSelect: (n: NodeType) => void }) {
  const activeConns = activeId ? Array.from(CONNECTION_MAP[activeId] || []) : [];

  function dimmed(id: string) {
    if (isFiltering && !filteredIds.has(id)) return true;
    if (activeId && id !== activeId && !activeConns.includes(id)) return true;
    return false;
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="relative mx-auto" style={{ minWidth: 640, height: VBH }}>
        {/* lane backgrounds + labels */}
        {LAYERS.map((layer, li) => (
          <div
            key={layer.id}
            className="absolute left-0 right-0 flex items-center"
            style={{ top: li * LANE_H, height: LANE_H, backgroundColor: li % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}
          >
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded" style={{ color: layer.colors.text, backgroundColor: layer.colors.bg }}>
              L{layer.id} · {layer.name}
            </span>
          </div>
        ))}

        {/* SVG edges (di belakang node) */}
        <svg className="absolute inset-0 w-full pointer-events-none" height={VBH} viewBox={`0 0 ${VBW} ${VBH}`} preserveAspectRatio="none">
          {/* koneksi node aktif (tampil hanya saat ada yang dipilih) */}
          {activeId && activeConns.map(cid => {
            const a = POS[activeId], b = POS[cid];
            if (!a || !b) return null;
            return <line key={`act-${cid}`} x1={a.xu} y1={a.yu} x2={b.xu} y2={b.yu} stroke="#F59E0B" strokeWidth={2} strokeOpacity={0.7} vectorEffect="non-scaling-stroke" />;
          })}
          {/* relasi kausal terbukti — SELALU tampil, khusus (violet, tebal) */}
          {CAUSAL_EDGES.map((e, i) => {
            const a = POS[e.a], b = POS[e.b];
            if (!a || !b) return null;
            const faded = activeId && activeId !== e.a && activeId !== e.b;
            return (
              <line key={`cau-${i}`} x1={a.xu} y1={a.yu} x2={b.xu} y2={b.yu}
                stroke="#7C3AED" strokeWidth={3} strokeOpacity={faded ? 0.25 : 0.85}
                strokeDasharray="1 0" vectorEffect="non-scaling-stroke" />
            );
          })}
        </svg>

        {/* node overlay */}
        {NODES.map(node => {
          const p = POS[node.id];
          if (!p) return null;
          const colors = LAYERS[node.layer].colors;
          const isActive = activeId === node.id;
          const isConn = activeId ? activeConns.includes(node.id) : false;
          const sectorDot = node.sectorStatus === "growing" ? "#22C55E" : node.sectorStatus === "vulnerable" ? "#EF4444" : null;
          return (
            <button
              key={node.id}
              onClick={() => onSelect(node)}
              title={node.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full border text-xs px-2.5 py-1 transition-all max-w-[150px]"
              style={{
                left: `${p.xPct}%`,
                top: p.yu,
                borderWidth: 1.5,
                backgroundColor: isActive ? colors.bg : isConn ? "#FFFBEB" : "#FFFFFF",
                borderColor: isActive ? colors.dot : isConn ? "#FCD34D" : colors.pillBorder,
                color: isActive ? colors.text : isConn ? "#78350F" : colors.pillText,
                boxShadow: isActive ? `0 0 0 2px ${colors.ring}` : "0 1px 2px rgba(0,0,0,0.05)",
                opacity: dimmed(node.id) ? 0.28 : 1,
                zIndex: isActive ? 20 : 10,
              }}
            >
              {sectorDot && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: sectorDot }} />}
              <span className="truncate">{node.name}</span>
              {node.isProvenCausal && <span className="text-violet-500 font-bold shrink-0">★</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Jembatan Istilah (sama seperti sebelumnya, dari skillMapContent)
// ─────────────────────────────────────────────────────────────
function JembatanIstilah({ onNavigate }: { onNavigate: (nodeIds: string[]) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const visibleItems = expanded ? ISTILAH_BRIDGE : ISTILAH_BRIDGE.slice(0, 5);

  function handleChip(item: typeof ISTILAH_BRIDGE[0]) {
    setActiveChip(item.popular === activeChip ? null : item.popular);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-5 md:px-8">
      <div className="bg-secondary/40 border border-border rounded-2xl p-5">
        <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase mb-1">Jembatan Istilah</p>
        <p className="text-sm text-foreground/80 mb-4">Sering dengar kata-kata ini di sekolah atau media? Temukan di mana letaknya di peta.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {visibleItems.map((item) => (
            <button
              key={item.popular}
              onClick={() => handleChip(item)}
              className={cn(
                "text-sm px-3 py-1.5 rounded-full border transition-all",
                activeChip === item.popular
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground/80 hover:border-primary/50"
              )}
            >
              {item.popular}
            </button>
          ))}
          {ISTILAH_BRIDGE.length > 5 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-sm px-3 py-1.5 rounded-full border border-dashed border-border text-muted-foreground hover:border-primary/50 transition-all"
            >
              {expanded ? "Lebih sedikit ↑" : `+ ${ISTILAH_BRIDGE.length - 5} lainnya`}
            </button>
          )}
        </div>
        {activeChip && (() => {
          const item = ISTILAH_BRIDGE.find((i) => i.popular === activeChip);
          if (!item) return null;
          const navigableIds = item.nodes.map((n) => n.id).filter((id): id is string => !!id);
          return (
            <div className="rounded-xl border border-border bg-background/60 p-4 mt-2">
              <p className="text-xs text-muted-foreground mb-2">{item.popular} <span className="opacity-60">· {item.layer}</span></p>
              <div className="flex flex-wrap gap-2 mb-2">
                {item.nodes.map((n) => (
                  <span key={n.label} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-foreground/80">
                    {n.label}{n.note ? ` ${n.note}` : ""}
                  </span>
                ))}
              </div>
              {item.note && <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.note}</p>}
              {navigableIds.length > 0 && (
                <button onClick={() => onNavigate(navigableIds)} className="text-xs font-medium text-primary underline underline-offset-2">
                  Sorot di peta →
                </button>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

const FILTERS: { id: "all" | "growing" | "safe" | "layer0"; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "safe", label: "Aman dari AI" },
  { id: "growing", label: "Sektor tumbuh" },
  { id: "layer0", label: "Fondasi (Layer 0)" },
];

// ─────────────────────────────────────────────────────────────
// SkillMapView — inti yang bisa dipakai standalone (/skill-map) & embed (Insight Babak 3)
// ─────────────────────────────────────────────────────────────
export function SkillMapView({ embedded = false }: { embedded?: boolean }) {
  const [view, setView] = useState<"peta" | "daftar">(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? "daftar" : "peta"
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "growing" | "safe" | "layer0">("all");
  const [expandedLayers, setExpandedLayers] = useState<Set<number>>(new Set([0, 1, 2, 3]));
  const [jembatanHighlightIds, setJembatanHighlightIds] = useState<Set<string>>(new Set());

  const activeNode = useMemo(() => NODES.find(n => n.id === activeId) || null, [activeId]);
  const connectedIds = useMemo(() => (activeId ? (CONNECTION_MAP[activeId] || new Set<string>()) : new Set<string>()), [activeId]);

  const filteredNodes = useMemo(() => {
    return NODES.filter(node => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || node.name.toLowerCase().includes(q) || node.techName.toLowerCase().includes(q);
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "growing" && node.sectorStatus === "growing") ||
        (activeFilter === "safe" && node.aiRisk === "safe") ||
        (activeFilter === "layer0" && node.layer === 0);
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);
  const filteredIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);
  const isFiltering = searchQuery.trim().length > 0 || activeFilter !== "all";

  function handleSelect(node: NodeType) {
    setActiveId(prev => (prev === node.id ? null : node.id));
    setJembatanHighlightIds(new Set());
  }
  function handleNavigate(node: NodeType) {
    setActiveId(node.id);
    const el = document.getElementById(`node-${node.id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function handleJembatanNavigate(ids: string[]) {
    setJembatanHighlightIds(new Set(ids));
    setActiveFilter("all");
    setSearchQuery("");
    if (ids.length === 1) setActiveId(ids[0]);
    if (view === "daftar") setExpandedLayers(new Set([0, 1, 2, 3]));
  }
  function toggleLayer(id: number) {
    setExpandedLayers(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  const hasActive = !!activeId;

  return (
    <div>
      {!embedded && (
        <div className="mb-4">
          <JembatanIstilah onNavigate={handleJembatanNavigate} />
        </div>
      )}
      {/* Toolbar */}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="inline-flex rounded-full border border-border p-0.5 bg-background">
            <button
              onClick={() => setView("peta")}
              className={cn("flex items-center gap-1.5 text-sm px-3 py-1 rounded-full transition-all", view === "peta" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            >
              <Network className="w-3.5 h-3.5" /> Peta
            </button>
            <button
              onClick={() => setView("daftar")}
              className={cn("flex items-center gap-1.5 text-sm px-3 py-1 rounded-full transition-all", view === "daftar" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            >
              <List className="w-3.5 h-3.5" /> Daftar
            </button>
          </div>
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari skill..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full border border-border bg-background text-sm outline-none focus:border-primary/60"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn("text-xs px-3 py-1 rounded-full border transition-all", activeFilter === f.id ? "bg-foreground text-background border-foreground" : "bg-background border-border text-muted-foreground hover:border-primary/50")}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-4">
        {view === "peta" ? (
          <>
            <PetaView activeId={activeId} filteredIds={filteredIds} isFiltering={isFiltering} onSelect={handleSelect} />
            <p className="text-xs text-muted-foreground mt-1">
              Ketuk skill untuk melihat keterkaitannya. Garis <span className="text-violet-600 font-semibold">ungu tebal</span> = hubungan sebab-akibat yang terbukti lewat eksperimen, bukan sekadar mirip.
            </p>
          </>
        ) : (
          <div className="space-y-3">
            {LAYERS.map(layer => {
              const layerNodes = filteredNodes.filter(n => n.layer === layer.id);
              if (isFiltering && layerNodes.length === 0) return null;
              const open = expandedLayers.has(layer.id);
              return (
                <div key={layer.id} className="rounded-2xl border" style={{ borderColor: layer.colors.border }}>
                  <button onClick={() => toggleLayer(layer.id)} className="w-full flex items-start justify-between gap-3 px-5 py-3 text-left" style={{ backgroundColor: layer.colors.bg }}>
                    <div>
                      <p className="font-bold text-sm" style={{ color: layer.colors.text }}>Layer {layer.id} · {layer.name}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: layer.colors.text, opacity: 0.85 }}>{layer.subtitle}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 shrink-0 mt-0.5 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: layer.colors.text }} />
                  </button>
                  {open && (
                    <div className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {layerNodes.map(node => (
                          <NodePill
                            key={node.id}
                            node={node as NodeType}
                            isActive={activeId === node.id}
                            isConnected={connectedIds.has(node.id)}
                            isJembatanHighlighted={jembatanHighlightIds.has(node.id)}
                            dimmed={hasActive && activeId !== node.id && !connectedIds.has(node.id)}
                            onClick={() => handleSelect(node as NodeType)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Detail panel */}
        {activeNode && <NodeDetail node={activeNode} onClose={() => setActiveId(null)} onNavigate={handleNavigate} />}

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mt-5">
          {(Object.entries(AI_RISK) as [string, typeof AI_RISK[keyof typeof AI_RISK]][]).map(([key, val]) => (
            <div key={key} className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: val.dot }} />
              <p className="text-xs text-muted-foreground leading-relaxed"><span className="font-semibold text-foreground/80">{val.label}</span> — {val.sublabel}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA ke peta penuh (hanya saat embedded) */}
      {embedded && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 mt-5">
          <Link to="/skill-map" className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-2">
            <Maximize2 className="w-4 h-4" /> Telusuri peta ini lebih dalam
          </Link>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Halaman penuh /skill-map
// ─────────────────────────────────────────────────────────────
export default function SkillMap() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/insight" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <Logo />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Peta Bekal</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Skill apa yang membuatmu tetap dibutuhkan? Empat lapis, dari akar yang membentuk dirimu sampai sektor yang sedang tumbuh. Ketuk mana saja untuk melihat keterkaitannya.
        </p>
      </div>

      <SkillMapView />
    </div>
  );
}
