import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Share2, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import Cite from '@/components/Cite';
import DilloNarasi from '@/components/DilloNarasi';
import SetelahPeta from '@/components/SetelahPeta';
import MismatchMukadimah from '@/components/MismatchMukadimah';
import FirstTimerBanner from '@/components/FirstTimerBanner';
import { supabase } from '@/integrations/supabase/client';
import { track } from '@/lib/track';
import { useShareCard } from '@/hooks/useShareCard';
import {
  hero,
  personaTeaserSection,
  personaShortLabel,
  skillSection,
  roiSection,
  bkSection,
  opportunitySection,
  worldLayerSection,
  personaCallout,
  ctaSection,
  dataSources,
  dataSourcesLabel,
  sourcePrefix,
  penamparSection,
  faktorPenghambatSection,
  maadinSection,
  evanInsights,
  stepperSection,
  type Persona,
  type ContentPersona,
  type Tone,
  type PenamparCard,
} from '@/data/insightContent';
import { SkillMapView } from '@/pages/SkillMap';
import { getNote, upsertNote, removeNote } from '@/lib/notes';

// ───── Countdown hook ─────
function useCountdownTo(targetIso: string) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  return useMemo(() => {
    const target = new Date(targetIso);
    const years = Math.max(0, target.getFullYear() - now.getFullYear() - (
      (now.getMonth() > target.getMonth() ||
        (now.getMonth() === target.getMonth() && now.getDate() > target.getDate())) ? 1 : 0
    ));
    const months = Math.max(0, (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth()));
    return { years, months };
  }, [now, targetIso]);
}

// ───── Floating Persona Switch ─────
function FloatingPersonaSwitch({ persona, onSwitch }: { persona: Persona; onSwitch: (p: Persona) => void }) {
  const [open, setOpen] = useState(false);
  const others = personaTeaserSection.options.filter((o) => o.id !== persona);
  // Fallback plumbing sama seperti Insight() — lihat komentar di sana.
  const contentPersona: ContentPersona = persona === 'mahasiswa' ? 'siswa' : persona;

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute bottom-full right-0 mb-2 bg-background border border-border rounded-xl shadow-lg p-1 min-w-[220px]"
          >
            {others.map((o) => (
              <button
                key={o.id}
                onClick={() => { onSwitch(o.id); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
              >
                {o.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-2 text-sm shadow-sm hover:bg-secondary/80 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-foreground">{personaShortLabel[contentPersona]}</span>
        <ChevronUp className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
    </div>
  );
}

// ───── Inline Persona Hint (one-liner under hero) ─────
function PersonaInlineHint({ onSwitch }: { onSwitch: (p: Persona) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="container mx-auto px-6 pb-4 max-w-4xl">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Kamu orang tua atau guru BK? Ada data khusus untukmu.</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-1">
          <div className="flex flex-col min-w-[200px]">
            <button
              onClick={() => { onSwitch('orangtua'); setOpen(false); }}
              className="text-left px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
            >
              Saya orang tua
            </button>
            <button
              onClick={() => { onSwitch('gurubk'); setOpen(false); }}
              className="text-left px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
            >
              Saya guru BK / konselor
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </section>
  );
}

// ───── Penampar Card Item ─────
function PenamparCardItem({ card }: { card: PenamparCard }) {
  return (
    <div className="bg-secondary/60 border border-border rounded-2xl p-6 flex flex-col gap-4 h-full">
      {/* Klaster tag */}
      <span className="inline-flex self-start text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase bg-background/60 border border-border rounded-full px-3 py-1">
        {card.klaster}
      </span>

      {/* Title */}
      <h3 className="font-heading font-medium text-xl text-foreground leading-tight">
        {card.title}
      </h3>

      {/* Hook */}
      <p className="text-sm text-foreground/80 leading-relaxed">
        {card.hook}
      </p>

      {/* Stat block */}
      <div className="border-t border-border pt-4">
        <p className="font-heading font-bold text-2xl md:text-3xl text-[hsl(var(--torch-gold))] leading-tight">
          {card.statNumber}
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-snug">
          {card.statLabel}
        </p>
      </div>

      {/* Peluang */}
      <p className="text-sm text-foreground/80 leading-relaxed mt-auto">
        {card.peluang}
      </p>

      {/* Sumber (No-Overclaim) */}
      <p className="text-[10px] text-muted-foreground/70 leading-snug mt-1">Sumber: {card.source}</p>
    </div>
  );
}

// ───── Evan Insights (accordion) ─────
function EvanInsights() {
  const [open, setOpen] = useState(false);
  const d = evanInsights;

  function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
      <h3 className="font-heading font-semibold text-xl text-foreground mb-1">
        {children}
      </h3>
    );
  }

  const maxJuta = Math.max(...d.kondisi.ageChart.map(r => r.juta));
  function AgeChart() {
    return (
      <div className="space-y-2">
        {d.kondisi.ageChart.map((row) => {
          const pct = (row.juta / maxJuta) * 100;
          const isYoung = row.age === '20–24';
          return (
            <div key={row.age} className="flex items-center gap-3">
              <div className="w-14 text-xs text-right text-muted-foreground shrink-0">{row.age}</div>
              <div className="flex-1 flex items-center gap-2">
                <div
                  className={cn(
                    'h-5 rounded-sm transition-all',
                    isYoung ? 'bg-[hsl(var(--torch-gold))]' : 'bg-secondary border border-border'
                  )}
                  style={{ width: `${pct}%` }}
                />
                <span className={cn('text-xs font-semibold shrink-0', isYoung ? 'text-[hsl(var(--torch-gold))]' : 'text-muted-foreground')}>
                  {row.juta} jt
                </span>
              </div>
            </div>
          );
        })}
        <p className="text-[10px] text-muted-foreground/60 pt-1">{d.kondisi.ageChartNote}</p>
      </div>
    );
  }

  const maxTpt = Math.max(...d.ironi.eduChart.map(r => r.tpt));
  function EduChart() {
    return (
      <div className="space-y-2">
        {d.ironi.eduChart.map((row) => {
          const pct = (row.tpt / maxTpt) * 100;
          return (
            <div key={row.edu} className="flex items-center gap-3">
              <div className="w-20 text-xs text-right text-muted-foreground shrink-0 leading-tight">{row.edu}</div>
              <div className="flex-1 flex items-center gap-2">
                <div
                  className={cn('h-5 rounded-sm', row.highlight ? 'bg-[hsl(var(--torch-gold))]' : 'bg-secondary border border-border')}
                  style={{ width: `${pct}%` }}
                />
                <span className={cn('text-xs font-semibold shrink-0', row.highlight ? 'text-[hsl(var(--torch-gold))]' : 'text-muted-foreground')}>
                  {row.tpt}%
                </span>
              </div>
            </div>
          );
        })}
        <p className="text-[10px] text-muted-foreground/60 pt-1">{d.ironi.eduChartNote}</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 max-w-4xl">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 bg-secondary/60 border border-border rounded-2xl px-6 py-4 hover:bg-secondary/80 transition-colors text-left"
      >
        <div>
          <span className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase block mb-1">INSIGHTS PRAKTISI HR</span>
          <span className="font-heading font-semibold text-base text-foreground">{d.buttonLabel}</span>
        </div>
        <ChevronDown className={cn('w-5 h-5 text-muted-foreground transition-transform shrink-0', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="border border-t-0 border-border rounded-b-2xl bg-background divide-y divide-border">
          {/* Profile */}
          <div className="px-6 py-6">
            <p className="font-heading font-semibold text-base text-foreground">{d.profile.name}</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{d.profile.bio}</p>
          </div>

          {/* Kondisi */}
          <div className="px-6 py-8 space-y-6">
            <SectionTitle>{d.kondisi.title}</SectionTitle>
            <div className="bg-secondary/60 border border-border rounded-2xl p-5">
              <p className="font-heading font-bold text-3xl text-[hsl(var(--torch-gold))] leading-tight">{d.kondisi.highlight}</p>
              <p className="text-sm text-muted-foreground mt-1">{d.kondisi.highlightSub}</p>
              <p className="text-xs text-muted-foreground/60 mt-2">{d.kondisi.highlightSource}</p>
            </div>
            <div className="bg-secondary/40 border border-border rounded-2xl p-5">
              <AgeChart />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">INI BUKAN STATISTIK — INI MANUSIA</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {d.kondisi.kisah.map((k, i) => (
                  <div key={i} className="border-l-2 border-[hsl(var(--torch-gold))] pl-4 py-1">
                    <p className="text-sm font-semibold text-foreground">{k.label}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{k.story}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1 italic">{k.source}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-secondary/40 border border-border rounded-xl p-4">
              <p className="text-sm text-foreground/80 leading-relaxed">{d.kondisi.neetNote}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Sumber: {d.kondisi.neetSource}</p>
            </div>
          </div>

          {/* Ironi */}
          <div className="px-6 py-8 space-y-6">
            <SectionTitle>{d.ironi.title}</SectionTitle>
            <blockquote className="border-l-4 border-[hsl(var(--torch-gold))] pl-4 py-1">
              <p className="font-heading font-semibold text-lg text-foreground leading-snug">"{d.ironi.pullQuote}"</p>
              <p className="text-xs text-muted-foreground mt-1">— {d.ironi.pullQuoteSource}</p>
            </blockquote>
            <div className="bg-secondary/40 border border-border rounded-2xl p-5">
              <p className="text-sm font-semibold text-foreground mb-4">{d.ironi.eduChartTitle}</p>
              <EduChart />
            </div>
            <div className="bg-secondary/60 border border-border rounded-xl p-4">
              <p className="text-sm text-foreground/80 italic leading-relaxed">"{d.ironi.apindoInsight}"</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3">KESENJANGAN SUPPLY & DEMAND</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/40 border border-border rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Yang Ditawarkan</p>
                  <ul className="space-y-2">
                    {d.ironi.supply.map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground leading-relaxed flex gap-2 items-start">
                        <span className="shrink-0 mt-1 text-muted-foreground/50">·</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-secondary/60 border border-[hsl(var(--torch-gold))]/30 rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--torch-gold))] mb-3">Yang Dibutuhkan</p>
                  <ul className="space-y-2">
                    {d.ironi.demand.map((s, i) => (
                      <li key={i} className="text-xs text-foreground/80 leading-relaxed flex gap-2 items-start">
                        <span className="shrink-0 mt-1 text-[hsl(var(--torch-gold))]">·</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <p className="text-sm text-foreground/80">
              <span className="font-semibold text-[hsl(var(--torch-gold))]">63% </span>
              {d.ironi.wef.replace('63% ', '')}
              <span className="text-xs text-muted-foreground"> ({d.ironi.wefSource})</span>
            </p>
          </div>

          {/* Arah */}
          <div className="px-6 py-8 space-y-6">
            <SectionTitle>{d.arah.title}</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {d.arah.tamparan.map((t, i) => (
                <div key={i} className="bg-secondary/60 border border-border rounded-2xl p-4">
                  <p className="font-semibold text-sm text-foreground mb-1">{t.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-secondary/40 border border-border rounded-2xl p-5 space-y-3">
              <p className="font-heading font-bold text-2xl text-foreground">"{d.arah.paradoksPQ}"</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{d.arah.paradoksDesc}</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {d.arah.paradoksStats.map((s, i) => (
                  <div key={i}>
                    <p className="font-heading font-bold text-xl text-[hsl(var(--torch-gold))]">{s.angka}</p>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">{s.sub}</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">{s.source}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="p-5 bg-secondary/60">
                  <p className="font-heading font-bold text-2xl text-muted-foreground">{d.arah.mckinsey.displaced}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{d.arah.mckinsey.displacedLabel}</p>
                </div>
                <div className="p-5 bg-secondary/40">
                  <p className="font-heading font-bold text-2xl text-[hsl(var(--torch-gold))]">{d.arah.mckinsey.created}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{d.arah.mckinsey.createdLabel}</p>
                </div>
              </div>
              <div className="px-5 py-3 bg-background border-t border-border">
                <p className="text-xs text-muted-foreground">{d.arah.mckinsey.note}</p>
                <p className="text-[10px] text-muted-foreground/50 mt-0.5">Sumber<Cite id="mckinsey-automation-id" /></p>
              </div>
            </div>
            <div className="bg-foreground text-background rounded-2xl p-5">
              <p className="font-heading font-semibold text-lg leading-snug">"{d.arah.closing}"</p>
            </div>
          </div>

          {/* Survive */}
          <div className="px-6 py-8 space-y-6">
            <SectionTitle>{d.survive.title}</SectionTitle>
            <blockquote className="border-l-2 border-border pl-4 py-1">
              <p className="text-sm text-foreground/80 italic leading-relaxed">{d.survive.quote}</p>
            </blockquote>
            <div className="bg-secondary/40 border border-border rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">{d.survive.aiCantTitle}</p>
              <ul className="space-y-2 mb-4">
                {d.survive.aiCant.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm text-foreground/80 leading-relaxed">
                    <span className="shrink-0 mt-1 text-[hsl(var(--torch-gold))]">✦</span>{item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground border-t border-border pt-3">{d.survive.aiCantNote}</p>
              <div className="mt-3 text-center">
                <p className="text-base text-foreground/90 leading-relaxed" dir="rtl">{d.survive.ayatAliImran.arabic}</p>
                <p className="text-xs text-muted-foreground italic mt-1">{d.survive.ayatAliImran.translation}</p>
                <p className="text-[10px] text-muted-foreground/60">{d.survive.ayatAliImran.ref}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {d.survive.pilars.map((p, i) => (
                <div key={i} className="bg-secondary/60 border border-border rounded-2xl p-5">
                  <p className="font-semibold text-sm text-foreground mb-3">{p.label}</p>
                  <ul className="space-y-2">
                    {p.points.map((pt, j) => (
                      <li key={j} className="flex gap-2 items-start text-sm text-muted-foreground leading-relaxed">
                        <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-[hsl(var(--torch-gold))]" />{pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Ekosistem */}
          <div className="px-6 py-8 space-y-6">
            <SectionTitle>{d.ekosistem.title}</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {d.ekosistem.items.map((p, i) => (
                <div key={i} className="flex gap-4 bg-secondary/60 border border-border rounded-2xl p-4">
                  <span className="font-heading font-bold text-2xl text-[hsl(var(--torch-gold))] leading-none shrink-0">{p.num}</span>
                  <div>
                    <p className="font-semibold text-sm text-foreground mb-1">{p.label}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">ROADMAP: MULAI DARI SEKARANG</p>
              <div className="space-y-0">
                {d.ekosistem.roadmap.map((r, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-heading font-semibold text-foreground">{r.step}</div>
                      {i < d.ekosistem.roadmap.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1 mb-1 min-h-[1.5rem]" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-semibold text-sm text-foreground">{r.label}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground/70 italic">⚠️ {d.ekosistem.projection}</p>
          </div>

          {/* Footer dalil */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[d.footer.ayat, d.footer.hadith].map((item, i) => (
                <div key={i} className="bg-secondary/40 border border-border rounded-2xl p-5 text-center">
                  <p className="text-lg text-foreground/90 leading-relaxed mb-2" dir="rtl">{item.arabic}</p>
                  <p className="text-sm text-foreground/80 italic leading-relaxed mb-1">{item.translation}</p>
                  <p className="text-xs text-muted-foreground">{item.ref}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ───── StatCard with always-visible "Artinya:" ─────
export type StatCardData = {
  value: string;
  label: string;
  detail: string;
  source: string;
  tone: Tone;
  artinya?: Record<Persona, string>;
  glossaryTerm?: string;
  dampak?: string[];
};

export function StatCard({ card, persona }: { card: StatCardData; persona: Persona }) {
  const [open, setOpen] = useState(false);
  const { shareCard, isSharing } = useShareCard();
  const [thisSharing, setThisSharing] = useState(false);
  // Fallback plumbing sama seperti Insight() — lihat komentar di sana.
  const contentPersona: ContentPersona = persona === 'mahasiswa' ? 'siswa' : persona;
  const valueColor =
    card.tone === 'negative' ? 'text-destructive' :
    card.tone === 'positive' ? 'text-primary' :
    'text-foreground';

  const canShare = !!card.artinya;

  async function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    if (!card.artinya || thisSharing) return;
    setThisSharing(true);
    try {
      const res = await shareCard({
        value: card.value,
        label: card.label,
        artinya: card.artinya[contentPersona],
        persona: contentPersona,
        source: card.source,
      });
      track('share_card', { value: card.value, persona, method: res.ok ? (res as { method: string }).method : 'failed' });
    } finally {
      setThisSharing(false);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((v) => !v); } }}
      className="group text-left w-full bg-secondary/60 hover:bg-secondary border border-border rounded-2xl p-6 transition-all focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      aria-expanded={open}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className={cn('font-heading font-medium tracking-tight text-3xl md:text-4xl', valueColor)}>
            {card.value}
          </div>
          <div className="text-sm text-muted-foreground leading-snug">{card.label}</div>
          {card.artinya && (
            <p className="text-xs text-muted-foreground italic leading-relaxed pt-2">
              Artinya: {card.artinya[contentPersona]}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {canShare && (
            <button
              type="button"
              onClick={handleShare}
              disabled={thisSharing || isSharing}
              aria-label="Bagikan kartu ini"
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-background/60 disabled:opacity-50"
            >
              {thisSharing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Share2 className="w-3 h-3" />
              )}
              <span>Bagikan</span>
            </button>
          )}
          <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
        </div>
      </div>
      <div className={cn('grid transition-all duration-300 ease-out', open ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0')}>
        <div className="overflow-hidden">
          <p className="text-sm text-foreground/80 leading-relaxed">{card.detail}</p>
          {card.dampak && (
            <div className="mt-4">
              <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase mb-2">Dampak Utama</p>
              <ul className="space-y-2">
                {card.dampak.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed">
                    <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-foreground/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {card.glossaryTerm && (
            <div className="mt-3 bg-secondary/40 border border-border rounded-lg p-3">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase mb-1">Istilah ini</p>
              <p className="text-xs text-foreground/75 leading-relaxed">{card.glossaryTerm}</p>
            </div>
          )}
          <div className="mt-3 flex items-center gap-2">
            <p className="text-xs text-muted-foreground italic">{sourcePrefix} {card.source}</p>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">Data terverifikasi</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───── Eyebrow + intro helper ─────
export function SectionHeader({ tag, headline, intro }: { tag?: string; headline?: string; intro?: string }) {
  return (
    <div className="mb-8">
      {tag && <p className="text-xs font-medium tracking-wide text-muted-foreground/80 mb-2">{tag}</p>}
      {headline && <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-3 max-w-2xl">{headline}</h2>}
      {intro && <p className="text-base md:text-lg text-foreground/80 max-w-2xl leading-relaxed">{intro}</p>}
    </div>
  );
}

// ───── DataReveal — progressive disclosure wrapper ─────
export function DataReveal({ children, label = 'Lihat datanya' }: { children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-4">
      <CollapsibleTrigger className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <span>{open ? 'Sembunyikan' : label}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
        <div className="pt-5">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ───── Useful? feedback (1-tap) — subtle, per-section ─────
export function UsefulFeedback({ section, persona }: { section: string; persona: Persona | 'unknown' }) {
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  function handle(value: 'yes' | 'no') {
    if (vote) return;
    setVote(value);
    track('useful_feedback', { section, persona, value });
  }
  return (
    <div className="container mx-auto px-6 max-w-4xl">
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground/70 pb-2">
        {vote ? (
          <span>Terima kasih!</span>
        ) : (
          <>
            <span>Berguna?</span>
            <button
              type="button"
              onClick={() => handle('yes')}
              aria-label="Berguna"
              className="rounded-full px-2 py-1 hover:bg-secondary transition-colors"
            >👍</button>
            <button
              type="button"
              onClick={() => handle('no')}
              aria-label="Tidak berguna"
              className="rounded-full px-2 py-1 hover:bg-secondary transition-colors"
            >👎</button>
          </>
        )}
      </div>
    </div>
  );
}

// ───── Skill Landscape (siswa) ─────
export function SkillLandscape({ persona }: { persona: Persona }) {
  const [tab, setTab] = useState<'growing' | 'declining'>('growing');
  const data = tab === 'growing' ? skillSection.growing : skillSection.declining;
  const accent = tab === 'growing' ? 'border-l-primary' : 'border-l-destructive';

  return (
    <>
      <section id="skill" className="container mx-auto px-6 py-16 max-w-5xl">
        <SectionHeader headline={skillSection.headline} intro={skillSection.intro} />
        <DataReveal>
          <div className="flex gap-2 mb-6">
            {(['growing', 'declining'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm border transition-colors',
                  tab === t ? 'bg-foreground text-background border-foreground' : 'bg-secondary/40 text-muted-foreground border-border hover:bg-secondary'
                )}
              >
                {t === 'growing' ? skillSection.growing.label : skillSection.declining.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-5">{data.subtitle}</p>
          <div className="space-y-3">
            {data.items.map((it, i) => (
              <div key={i} className={cn('bg-secondary/60 border border-border border-l-4 rounded-xl p-5', accent)}>
                <div className="font-heading font-medium text-lg text-foreground mb-1">{it.skill}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{it.note}</div>
                {'href' in it && it.href && (
                  <Link to={it.href} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                    Lihat di Peta Skill <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6 italic">{skillSection.note}</p>
          <p className="text-xs text-muted-foreground mt-2">Sumber<Cite id="wef-mckinsey-skill-landscape" /></p>
        </DataReveal>
      </section>
      <UsefulFeedback section="skill" persona={persona} />
    </>
  );
}

// ───── ROI Section (orangtua) ─────
export function RoiBlock({ persona }: { persona: Persona }) {
  return (
    <>
      <section id="roi" className="container mx-auto px-6 py-16 max-w-6xl">
        <SectionHeader headline={roiSection.headline} intro={roiSection.intro} />
        <DataReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roiSection.cards.map((c, i) => (
              <StatCard key={i} card={c as StatCardData} persona="orangtua" />
            ))}
          </div>
        </DataReveal>
      </section>
      <UsefulFeedback section="roi" persona={persona} />
    </>
  );
}

// ───── BK Section (gurubk) ─────
export function BkBlock({ persona }: { persona: Persona }) {
  return (
    <>
      <section id="bk" className="container mx-auto px-6 py-16 max-w-6xl">
        <SectionHeader headline={bkSection.headline} intro={bkSection.intro} />
        <DataReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bkSection.cards.map((c, i) => (
              <StatCard key={i} card={c as StatCardData} persona="gurubk" />
            ))}
          </div>
        </DataReveal>
      </section>
      <UsefulFeedback section="bk" persona={persona} />
    </>
  );
}

// ───── Waitlist Form ─────
function WaitlistForm({ persona }: { persona: Persona }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const f = ctaSection.waitlist.fields;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !whatsapp.trim()) return;
    setState('submitting');
    const { error } = await supabase
      .from('waitlist_sulu' as never)
      .insert([{ name: name.trim(), email: email.trim(), whatsapp: whatsapp.trim(), persona } as never]);
    setState(error ? 'error' : 'success');
  }

  if (state === 'success') {
    return (
      <div className="bg-secondary/60 border border-border rounded-2xl p-6 text-center">
        <p className="text-foreground">{ctaSection.waitlist.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-secondary/60 border border-border rounded-2xl p-6 md:p-8 space-y-5 text-left">
      <div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{ctaSection.waitlist.headline}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{ctaSection.waitlist.subtext}</p>
      </div>
      <div className="space-y-3">
        <div>
          <Label htmlFor="wl-name" className="text-xs text-muted-foreground">{f.name.label}</Label>
          <Input id="wl-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={f.name.placeholder} required />
        </div>
        <div>
          <Label htmlFor="wl-email" className="text-xs text-muted-foreground">{f.email.label}</Label>
          <Input id="wl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={f.email.placeholder} required />
        </div>
        <div>
          <Label htmlFor="wl-wa" className="text-xs text-muted-foreground">{f.whatsapp.label}</Label>
          <Input id="wl-wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder={f.whatsapp.placeholder} required />
          <p className="text-xs text-muted-foreground mt-1">{f.whatsapp.note}</p>
        </div>
      </div>
      <Button type="submit" disabled={state === 'submitting'} className="w-full">
        {state === 'submitting' ? ctaSection.waitlist.submitting : ctaSection.waitlist.submit}
      </Button>
      {state === 'error' && (
        <p className="text-sm text-destructive">{ctaSection.waitlist.errorMessage}</p>
      )}
    </form>
  );
}

// ───── Footer Sources (collapsible) ─────
function FooterSources() {
  const [open, setOpen] = useState(false);
  return (
    <section className="container mx-auto px-6 py-12 max-w-4xl">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
        {dataSourcesLabel} ({dataSources.length})
      </button>
      <div className={cn('grid transition-all duration-300', open ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0')}>
        <div className="overflow-hidden">
          <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed pl-6 list-disc">
            {dataSources.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
          <Link to="/glossary?tab=data" className="inline-block mt-3 text-xs text-primary underline underline-offset-4 hover:opacity-80">
            Lihat semua rujukan bernomor di Pusat Rujukan →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ───── Babak header (arc 4-babak — urutan = makna) ─────
function BabakHead({ no, kicker, lead }: { no: string; kicker: string; lead?: string }) {
  return (
    <div className="container mx-auto px-6 max-w-4xl pt-20 md:pt-24">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-heading text-sm font-semibold tabular-nums text-[hsl(var(--torch-gold))]">{no}</span>
        <span className="text-[10px] font-semibold tracking-[0.25em] text-muted-foreground uppercase">{kicker}</span>
      </div>
      {lead && <p className="text-base md:text-lg text-foreground/80 max-w-2xl leading-relaxed">{lead}</p>}
    </div>
  );
}

// ───── Catatanku per-babak (sulu_notes_v1, shared dgn Surat Perjalanan) ─────
function Catatanku({ anchor, label }: { anchor: string; label: string }) {
  const existing = getNote('insight', anchor);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(existing?.text ?? '');
  const [savedTs, setSavedTs] = useState<number | null>(existing?.ts ?? null);
  const save = () => {
    const t = text.trim();
    if (t) { upsertNote('insight', anchor, label, t); setSavedTs(Date.now()); }
    else { removeNote('insight', anchor); setSavedTs(null); }
    setOpen(false);
  };
  return (
    <div className="container mx-auto px-6 max-w-4xl pb-4 pt-2">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-[hsl(var(--torch-gold))] font-semibold">+</span>
          {savedTs ? 'Catatanku tersimpan — ubah' : 'Tambah Catatanku'}
        </button>
      ) : (
        <div className="rounded-2xl border border-border bg-secondary/40 p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={'Catatan pribadimu tentang ' + label + '...'}
            className="w-full bg-background border border-input rounded-xl p-3 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={save}>Simpan</Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Hadith barang tambang (Ma'adin) kini di src/data/insightContent.ts (maadinSection) — editable-ready.

// ── STEPPER 4 langkah (Taruhan/Realita/Bekal/Langkah — Manifest Fable 6 Jul, label = BABAK_NAV lama).
// currentStep TIDAK dipersist: reload = mulai dari step 1. Pola = Mukadimah.tsx/JalanBakti.tsx.
const TOTAL_STEPS = 4;
type StepId = 1 | 2 | 3 | 4;

function StepProgress({ step }: { step: StepId }) {
  const labels = stepperSection.labels;
  return (
    <div className="sticky top-[57px] z-20 -mx-6 border-b border-border bg-background/85 px-6 py-3 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between text-xs font-medium text-muted-foreground max-w-4xl">
        {([1, 2, 3, 4] as StepId[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px]',
                s === step
                  ? 'border-[hsl(var(--torch-gold))] bg-[hsl(var(--torch-gold))] text-[hsl(var(--ink-deep))] font-semibold'
                  : s < step
                    ? 'border-[hsl(var(--torch-gold))]/50 bg-[hsl(var(--torch-gold))]/10 text-foreground/70'
                    : 'border-border text-muted-foreground/60',
              )}
            >
              {s}
            </span>
            <span className={cn('hidden sm:inline truncate', s === step && 'text-foreground font-semibold')}>
              {labels[s]}
            </span>
            {i < 3 && <span className="flex-1 h-px bg-border mx-1" aria-hidden />}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepNav({ step, onBack, onNext }: { step: StepId; onBack: () => void; onNext: () => void }) {
  return (
    <div className="container mx-auto px-6 max-w-4xl flex items-center justify-between pt-10 pb-4">
      {step > 1 ? (
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          {stepperSection.kembaliLabel}
        </Button>
      ) : (
        <span />
      )}
      {step < TOTAL_STEPS && (
        <Button onClick={onNext}>
          {stepperSection.lanjutLabel}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// ───── Page ─────
const PERSONA_KEY = 'sulu_insight_persona';

const Insight = () => {
  // Selalu mulai dari siswa setiap halaman dibuka (voice utama siswa-facing).
  // Switcher tetap berfungsi dalam sesi, tapi tidak dipersist sebagai default.
  const [persona, setPersona] = useState<Persona>(personaTeaserSection.defaultPersona);
  // Fallback plumbing (Dua-Pintu Batch 3, 6 Jul): 'mahasiswa' belum punya varian
  // konten (copy dewasa = antrean #5, gate Fable/Raihan). Semua lookup ke Record
  // konten (artinya/subtext/dll) pakai contentPersona, bukan persona mentah, supaya
  // tidak pernah blank/crash. Begitu copy dewasa lands, tinggal isi entri asli.
  const contentPersona: ContentPersona = persona === 'mahasiswa' ? 'siswa' : persona;
  const { years, months } = useCountdownTo(hero.countdown.targetIso);
  const [step, setStep] = useState<StepId>(1);

  const handleSwitch = (p: Persona) => {
    setPersona(p);
    if (typeof window !== 'undefined') {
      localStorage.setItem(PERSONA_KEY, p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goNext = () => {
    setStep((s) => (s < TOTAL_STEPS ? ((s + 1) as StepId) : s));
    window.scrollTo({ top: 0 });
  };
  const goBack = () => {
    setStep((s) => (s > 1 ? ((s - 1) as StepId) : s));
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="border-b border-border sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" linkTo="/" />
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link to="/glossary">Glosarium</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link to="/">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <StepProgress step={step} />

      {step === 1 && (
      <>
      <FirstTimerBanner />

      {/* ════════ BABAK 1 — TARUHAN (hati → stakes) ════════ */}
      <section id="babak-1">
        {/* Hero */}
        <section className="container mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-heading font-semibold tracking-tight text-3xl md:text-5xl leading-[1.1] text-foreground whitespace-pre-line"
          >
            {hero.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-sm md:text-base text-muted-foreground mt-6 max-w-xl"
          >
            {hero.subtext[contentPersona]}
          </motion.p>
          <div className="mt-4">
            <Badge variant="outline" className="text-[10px] text-muted-foreground font-normal">≈ 4 menit</Badge>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <div className="bg-secondary/60 border border-border rounded-full px-4 py-2 text-sm">
              <span className="font-semibold text-foreground">{years}</span>{' '}
              <span className="text-muted-foreground">{hero.countdown.years.suffix}</span>
            </div>
            <div className="bg-secondary/60 border border-border rounded-full px-4 py-2 text-sm">
              <span className="font-semibold text-foreground">{months}</span>{' '}
              <span className="text-muted-foreground">{hero.countdown.months.suffix}</span>
            </div>
            <div className="bg-secondary/60 border border-border rounded-full px-4 py-2 text-sm">
              <span className="font-semibold text-foreground">{hero.countdown.fixed.value}</span>{' '}
              <span className="text-muted-foreground">{hero.countdown.fixed.suffix}</span>
              <Cite id="bappenas-bonus-demografi" />
            </div>
          </motion.div>
        </section>

        {/* Persona inline hint (one-liner, siswa-first + reveal ortu/BK) */}
        <PersonaInlineHint onSwitch={handleSwitch} />

        {/* Kartu penampar — potret Indonesia saat ini */}
        <section className="container mx-auto px-6 py-12 max-w-3xl">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-3 uppercase">POTRET INDONESIA</p>
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-3">
              {penamparSection.headline}
            </h2>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
              Empat kondisi nyata di sekitarmu. Bukan untuk menakut-nakuti, tapi untuk membuka mata pada ruang yang sebenarnya menunggu untuk diisi.
            </p>
          </div>
          <div className="max-w-2xl grid grid-cols-1 gap-5">
            {penamparSection.cards.map((card) => (
              <PenamparCardItem key={card.id} card={card} />
            ))}
          </div>
        </section>

        {/* Mukadimah: kenapa & so-what → membangunkan → jembatan ke Pak Evan */}
        <MismatchMukadimah />

        <Catatanku anchor="babak-1" label="Taruhan: kondisi duniaku" />
        <StepNav step={step} onBack={goBack} onNext={goNext} />
      </section>
      </>
      )}

      {step === 2 && (
      <section id="babak-2">
        {/* ════════ BABAK 2 — REALITA (suara praktisi HR, Pak Evan) ════════ */}
        <BabakHead
          no="02"
          kicker="Realita"
          lead="Kata orang yang puluhan tahun merekrut. Data lapangan, disajikan apa adanya."
        />
        <div className="pt-6">
          <EvanInsights />
        </div>
        <Catatanku anchor="babak-2" label="Realita: suara praktisi" />
        <StepNav step={step} onBack={goBack} onNext={goNext} />
      </section>
      )}

      {step === 3 && (
      <section id="babak-3">
        {/* ════════ BABAK 3 — BEKAL (harapan / agency) ════════ */}
        <BabakHead no="03" kicker="Bekal" />

        {/* Narasi jembatan Pak Evan → Pak Dillo → peta (sequencing IOU Fair).
            Memberi diagram skill-map konteks: kenapa human skills, apa data AI-nya,
            apa yang tersisa bagi manusia. Data terverifikasi (AEI + Stanford). */}
        <section className="container mx-auto px-6 pt-2 pb-8 max-w-4xl">
          <DilloNarasi />
        </section>

        {/* Cara membaca peta + urgensi: apa yang wajib dimiliki di era AI */}
        <section className="container mx-auto px-6 pb-8 max-w-3xl">
          <div className="max-w-2xl">
            <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground tracking-tight leading-tight mb-4">
              Cara membaca peta ini, dan apa yang wajib kamu miliki
            </h3>
            <p className="text-base text-foreground/80 leading-[1.75] mb-5">
              Peta ini punya empat lapis. Bukan semuanya setara, ada yang jadi fondasi yang menentukan kamu bertahan atau tidak, ada yang jadi pintu masuk ke sektor tertentu.
            </p>
            <div className="space-y-3">
              <div className="flex gap-3 items-start rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-3">
                <span className="font-heading text-sm font-bold text-teal-800 shrink-0 mt-0.5">L0&nbsp;+&nbsp;L1</span>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  <strong className="text-foreground">Wajib dimiliki semua orang.</strong> Sikap dasar dan kapasitas manusiawi, inilah human skills yang membuatmu tetap dibutuhkan justru ketika AI ada di mana-mana. Tujuh keterampilan inti yang disebut Pak Dillo hidup di sini: berpikir kritis, komunikasi, kerja sama, adaptabilitas, dan kepemimpinan termasuk di antaranya.
                </p>
              </div>
              <div className="flex gap-3 items-start rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3">
                <span className="font-heading text-sm font-bold text-blue-800 shrink-0 mt-0.5">L2</span>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  <strong className="text-foreground">Dua yang paling menentukan hari ini:</strong> Literasi AI &amp; Data, dan Komunikasi Kompleks. Yang paham mengarahkan AI menggantikan yang tidak, dan yang bisa menjelaskan hal rumit ke beragam orang selalu dicari.
                </p>
              </div>
              <div className="flex gap-3 items-start rounded-xl border border-border bg-secondary/40 px-4 py-3">
                <span className="font-heading text-sm font-bold text-foreground shrink-0 mt-0.5">L3</span>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  <strong className="text-foreground">Sektor-sektor yang sedang "panas" untuk dimasuki.</strong> Di sinilah keahlianmu bertemu kebutuhan riil. Yang ditandai hijau sedang tumbuh dan butuh orang, yang merah tugasnya mulai rentan diotomasi.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mt-5">
              Ketuk simpul mana saja untuk melihat keterkaitannya. Yang ditandai merah bukan untuk ditakuti, tapi untuk dikenali, dan yang hijau untuk kamu tumbuhkan.
            </p>
          </div>
        </section>

        {/* Peta skill — embed inline (komponen yang sama dengan /skill-map) */}
        <section className="container mx-auto px-6 pb-12 max-w-5xl">
          <SkillMapView embedded />
        </section>

        {/* Penutup: what to do with it → jembatan ke Kenali Dirimu */}
        <section className="container mx-auto px-6 pb-12 max-w-4xl">
          <SetelahPeta />
        </section>

        <Catatanku anchor="babak-3" label="Bekal: yang akan kubawa" />
        <StepNav step={step} onBack={goBack} onNext={goNext} />
      </section>
      )}

      {step === 4 && (
      <section id="babak-4">
        {/* ════════ BABAK 4 — LANGKAH (crescendo → satu pintu) ════════ */}

        {/* Peluang SDM — kursi yang masih kosong (dipindah dari Babak 3, ACC Raihan 6 Jul: pivot ke luar, bukan bekal) */}
        <section id="peluang" className="container mx-auto px-6 pt-20 md:pt-24 pb-16 max-w-4xl">
          <div className="max-w-2xl mb-2">
            <SectionHeader headline={opportunitySection.headline} intro={opportunitySection.intro[contentPersona]} />
          </div>
          <DataReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {opportunitySection.items.map((o, i) => (
                <div key={i} className="bg-secondary/60 border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors">
                  <div className="text-xs font-semibold text-primary tabular-nums mb-3">{o.number}</div>
                  <h3 className="font-heading font-semibold text-base md:text-lg text-foreground leading-snug mb-3">{o.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{o.body}</p>
                </div>
              ))}
            </div>
          </DataReveal>
        </section>
        <UsefulFeedback section="peluang" persona={persona} />

        {/* World-Layer W1 — dipindah dari Babak 3 (ACC Raihan 6 Jul): dunia → umat → Palestina → peran (prosa surat, bukan kartu). Copy TIDAK disentuh. */}
        <section id="dunia-umat" className="container mx-auto px-6 pt-16 md:pt-20 pb-8 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-8 uppercase">
            {worldLayerSection.tag}
          </p>
          <div className="space-y-12">
            {worldLayerSection.beats.map((beat, i) => (
              <div key={`w1-${i}`}>
                <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground leading-snug mb-4">
                  {beat.headline}
                </h3>
                <div className="space-y-4">
                  {beat.body.map((p, j) => (
                    <p key={`w1-${i}-${j}`} className="text-base text-foreground/85 leading-[1.75]">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="font-heading text-lg md:text-xl text-foreground/90 italic leading-relaxed mt-12">
            {worldLayerSection.bridge}
          </p>
          <p className="text-xs text-muted-foreground mt-6">
            {sourcePrefix} {worldLayerSection.source}
          </p>
        </section>

        {/* Faktor Penghambat — "ini bukan salahmu" → pivot ke locus of control */}
        <section className="container mx-auto px-6 pt-12 md:pt-16 pb-4 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-4 uppercase">
            {faktorPenghambatSection.kicker}
          </p>
          <p className="font-heading text-xl md:text-2xl text-foreground/90 italic leading-relaxed mb-4">
            {faktorPenghambatSection.opening}
          </p>
          <p className="text-base text-foreground/80 leading-[1.75] mb-8 max-w-2xl">
            {faktorPenghambatSection.ack}
          </p>
          <div className="space-y-5">
            {faktorPenghambatSection.faktor.map((f, i) => (
              <div key={i} className="border-l-2 border-border pl-5">
                <h4 className="font-heading font-medium text-base text-foreground mb-1.5">
                  {f.judul}
                </h4>
                <p className="text-sm text-foreground/75 leading-relaxed">
                  {f.body}
                  {f.cite && <Cite id={f.cite} />}
                </p>
              </div>
            ))}
          </div>
          <p className="text-base text-foreground/85 leading-[1.75] mt-8 max-w-2xl">
            {faktorPenghambatSection.closing}
          </p>
        </section>

        {/* Crescendo */}
        <section className="container mx-auto px-6 pt-12 md:pt-16 pb-4 max-w-3xl">
          <div className="bg-secondary/60 border border-border rounded-2xl p-8 md:p-10">
            <h3 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-4">
              {personaCallout[contentPersona].headline}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {personaCallout[contentPersona].body}
            </p>
          </div>
        </section>

        {/* Satu pintu ke depan: Kenali Dirimu */}
        <section className="container mx-auto px-6 py-16 md:py-20 max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading font-semibold text-3xl md:text-4xl tracking-tight leading-[1.15] text-foreground"
          >
            Sudah lihat dunianya. Sekarang, lihat ke dalam.
          </motion.h2>
          <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-xl mx-auto">
            Langkah berikutnya: kenali apa yang sudah Allah titipkan dalam dirimu: nilai, minat, dan kemampuan.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="group">
              <Link to="/kenali-dirimu">
                Lanjut: Kenali Dirimu
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/">← Kembali ke beranda</Link>
            </Button>
          </div>

          <div className="mt-12">
            <WaitlistForm persona={persona} />
          </div>
        </section>

        <StepNav step={step} onBack={goBack} onNext={goNext} />
      </section>
      )}

      {/* Footer sources */}
      <FooterSources />
    </main>
  );
};

export default Insight;
