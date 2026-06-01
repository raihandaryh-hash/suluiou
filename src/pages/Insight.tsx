import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import FirstTimerBanner from '@/components/FirstTimerBanner';
import { supabase } from '@/integrations/supabase/client';
import { track } from '@/lib/track';
import {
  hero,
  personaTeaserSection,
  personaShortLabel,
  indonesiaSection,
  linkMatchSection,
  neetSection,
  laborRealitySection,
  skillSection,
  roiSection,
  bkSection,
  worldSection,
  expertSection,
  opportunitySection,
  jabarSection,
  alumniSection,
  skillMapTeaser,
  personaCallout,
  ctaSection,
  dataSources,
  dataSourcesLabel,
  sourcePrefix,
  type Persona,
  type Tone,
} from '@/data/insightContent';

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
        <span className="text-foreground">{personaShortLabel[persona]}</span>
        <ChevronUp className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
    </div>
  );
}

// ───── Persona Teaser (soft, non-blocking) ─────
function PersonaTeaser({ persona, onSwitch }: { persona: Persona; onSwitch: (p: Persona) => void }) {
  return (
    <section className="container mx-auto px-6 pb-8 max-w-4xl">
      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-4 uppercase">
        {personaTeaserSection.headline}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {personaTeaserSection.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSwitch(opt.id)}
            className={cn(
              'text-left rounded-xl border p-4 transition-all',
              persona === opt.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-secondary/40 hover:bg-secondary'
            )}
          >
            <p className={cn(
              'font-heading font-semibold text-sm mb-1',
              persona === opt.id ? 'text-primary' : 'text-foreground'
            )}>
              {opt.label}
            </p>
            <p className="text-xs text-muted-foreground leading-snug">{opt.description}</p>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">{personaTeaserSection.subtext}</p>
    </section>
  );
}

// ───── StatCard with always-visible "Artinya:" ─────
type StatCardData = {
  value: string;
  label: string;
  detail: string;
  source: string;
  tone: Tone;
  artinya?: Record<Persona, string>;
  glossaryTerm?: string;
  dampak?: string[];
};

function StatCard({ card, persona }: { card: StatCardData; persona: Persona }) {
  const [open, setOpen] = useState(false);
  const valueColor =
    card.tone === 'negative' ? 'text-destructive' :
    card.tone === 'positive' ? 'text-primary' :
    'text-foreground';

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="group text-left w-full bg-secondary/60 hover:bg-secondary border border-border rounded-2xl p-6 transition-all focus:outline-none focus:ring-2 focus:ring-ring"
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
              Artinya: {card.artinya[persona]}
            </p>
          )}
        </div>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform', open && 'rotate-180')} />
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
    </button>
  );
}

// ───── Eyebrow + intro helper ─────
function SectionHeader({ tag, intro }: { tag: string; intro?: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-3">{tag}</p>
      {intro && <p className="text-base md:text-lg text-foreground/80 max-w-2xl leading-relaxed">{intro}</p>}
    </div>
  );
}

// ───── DataReveal — progressive disclosure wrapper ─────
function DataReveal({ children, label = 'Lihat datanya' }: { children: ReactNode; label?: string }) {
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
function UsefulFeedback({ section, persona }: { section: string; persona: Persona | 'unknown' }) {
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
function SkillLandscape({ persona }: { persona: Persona }) {
  const [tab, setTab] = useState<'growing' | 'declining'>('growing');
  const data = tab === 'growing' ? skillSection.growing : skillSection.declining;
  const accent = tab === 'growing' ? 'border-l-primary' : 'border-l-destructive';

  return (
    <>
      <section id="skill" className="container mx-auto px-6 py-16 max-w-5xl">
        <SectionHeader tag={skillSection.tag} intro={skillSection.intro} />
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
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6 italic">{skillSection.note}</p>
        <p className="text-xs text-muted-foreground mt-2">{sourcePrefix} {skillSection.source}</p>
      </section>
      <UsefulFeedback section="skill" persona={persona} />
    </>
  );
}

// ───── ROI Section (orangtua) ─────
function RoiBlock({ persona }: { persona: Persona }) {
  return (
    <>
      <section id="roi" className="container mx-auto px-6 py-16 max-w-6xl">
        <SectionHeader tag={roiSection.tag} intro={roiSection.intro} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roiSection.cards.map((c, i) => (
            <StatCard key={i} card={c as StatCardData} persona="orangtua" />
          ))}
        </div>
      </section>
      <UsefulFeedback section="roi" persona={persona} />
    </>
  );
}

// ───── BK Section (gurubk) ─────
function BkBlock({ persona }: { persona: Persona }) {
  return (
    <>
      <section id="bk" className="container mx-auto px-6 py-16 max-w-6xl">
        <SectionHeader tag={bkSection.tag} intro={bkSection.intro} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bkSection.cards.map((c, i) => (
            <StatCard key={i} card={c as StatCardData} persona="gurubk" />
          ))}
        </div>
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
        </div>
      </div>
    </section>
  );
}

// ───── Page ─────
const PERSONA_KEY = 'sulu_insight_persona';

const Insight = () => {
  const [persona, setPersona] = useState<Persona>(() => {
    if (typeof window === 'undefined') return personaTeaserSection.defaultPersona;
    const stored = localStorage.getItem(PERSONA_KEY);
    return (stored === 'siswa' || stored === 'orangtua' || stored === 'gurubk')
      ? stored as Persona
      : personaTeaserSection.defaultPersona;
  });
  const { years, months } = useCountdownTo(hero.countdown.targetIso);

  const handleSwitch = (p: Persona) => {
    setPersona(p);
    if (typeof window !== 'undefined') {
      localStorage.setItem(PERSONA_KEY, p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <FloatingPersonaSwitch persona={persona} onSwitch={handleSwitch} />

          {/* Top nav */}
          <header className="border-b border-border sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
              <Logo size="sm" linkTo="/" />
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </Link>
              </Button>
            </div>
          </header>

          <FirstTimerBanner />

          {/* SECTION 1 — Hero */}
          <section className="container mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-4xl">
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
              {hero.subtext[persona]}
            </motion.p>
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
              </div>
          </motion.div>
          </section>

          {/* Persona Teaser (non-blocking) */}
          <PersonaTeaser persona={persona} onSwitch={handleSwitch} />

          {/* SECTION 2 — Indonesia hari ini */}
          <section id="indonesia" className="container mx-auto px-6 py-16 max-w-6xl">
            <SectionHeader tag={indonesiaSection.tag} intro={indonesiaSection.intro[persona]} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {indonesiaSection.cards.map((c, i) => (
                <StatCard key={i} card={c as StatCardData} persona={persona} />
              ))}
            </div>
          </section>
          <UsefulFeedback section="indonesia" persona={persona} />

          {/* Link and Match */}
          <section id="link-match" className="container mx-auto px-6 py-12 max-w-4xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-4 uppercase">{linkMatchSection.tag}</p>
            <div className="bg-secondary/60 border border-border rounded-2xl p-6 md:p-8">
              <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-3">{linkMatchSection.headline}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{linkMatchSection.body}</p>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-1">Artinya untuk kamu:</p>
                <p className="text-sm text-foreground/80 leading-relaxed italic">{linkMatchSection.artinya[persona]}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">{sourcePrefix} {linkMatchSection.source}</p>
            </div>
          </section>
          <UsefulFeedback section="link-match" persona={persona} />

          {/* SECTION 3 — NEET ASEAN */}
          <section id="neet" className="container mx-auto px-6 py-16 max-w-4xl">
            <SectionHeader tag={neetSection.tag} intro={neetSection.intro} />
            <div className="bg-secondary/60 border border-border rounded-2xl p-6 md:p-8 space-y-5">
              {neetSection.data.map((row, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{row.country}</span>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {row.value.toString().replace('.', ',')}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-background overflow-hidden">
                    <motion.div
                      className={cn('h-full rounded-full', row.colorClass)}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(row.value / neetSection.maxPercent) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 space-y-1">
                <p className="text-xs text-muted-foreground italic">{sourcePrefix} {neetSection.source}</p>
                <p className="text-xs text-muted-foreground">{neetSection.note}</p>
              </div>
            </div>
          </section>
          <UsefulFeedback section="neet" persona={persona} />

          {/* Realita Dunia Kerja */}
          <section id="realita" className="container mx-auto px-6 py-16 max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-3 uppercase">{laborRealitySection.tag}</p>
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-4 max-w-3xl">{laborRealitySection.headline}</h2>
            <p className="text-base text-foreground/80 max-w-2xl leading-relaxed mb-8">{laborRealitySection.intro[persona]}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {laborRealitySection.cards.map((c, i) => (
                <StatCard key={i} card={c as StatCardData} persona={persona} />
              ))}
            </div>
          </section>
          <UsefulFeedback section="realita" persona={persona} />

          {/* SECTION 4 — Persona-specific middle */}
          {persona === 'siswa' && <SkillLandscape persona={persona} />}
          {persona === 'orangtua' && <RoiBlock persona={persona} />}
          {persona === 'gurubk' && <BkBlock persona={persona} />}

          {/* SECTION 5 — Dunia 2025–2030 */}
          <section id="dunia" className="container mx-auto px-6 py-16 max-w-6xl">
            <SectionHeader tag={worldSection.tag} intro={worldSection.intro[persona]} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {worldSection.cards.map((c, i) => (
                <StatCard key={i} card={c as StatCardData} persona={persona} />
              ))}
            </div>
          </section>
          <UsefulFeedback section="dunia" persona={persona} />

          {/* Konteks Jawa Barat */}
          <section id="jabar" className="container mx-auto px-6 py-16 max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-3 uppercase">{jabarSection.tag}</p>
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-4 max-w-3xl">{jabarSection.headline}</h2>
            <p className="text-base text-foreground/80 max-w-3xl leading-relaxed mb-8">{jabarSection.subtext}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {jabarSection.stats.map((s, i) => {
                const valueColor =
                  s.tone === 'negative' ? 'text-destructive' :
                  s.tone === 'positive' ? 'text-primary' :
                  'text-foreground';
                return (
                  <div key={i} className="bg-secondary/60 border border-border rounded-2xl p-6">
                    <p className="text-xs text-muted-foreground mb-2 leading-snug">{s.label}</p>
                    <div className={cn('font-heading font-medium tracking-tight text-3xl mb-2', valueColor)}>{s.value}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.context}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-foreground/80 italic mt-6 leading-relaxed max-w-3xl">{jabarSection.closingNote[persona]}</p>
            <p className="text-xs text-muted-foreground mt-2 italic">{sourcePrefix} {jabarSection.source}</p>
          </section>
          <UsefulFeedback section="jabar" persona={persona} />

          {/* Expert Quotes */}
          <section className="container mx-auto px-6 py-12 max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-6 uppercase">{expertSection.tag}</p>
            <p className="text-sm text-muted-foreground mb-6">{expertSection.intro[persona]}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expertSection.quotes.map((q, i) => (
                <div key={i} className="bg-secondary/60 border border-border rounded-2xl p-6">
                  <blockquote className="text-sm text-foreground/90 leading-relaxed italic mb-4">&ldquo;{q.quote}&rdquo;</blockquote>
                  <div>
                    <p className="font-heading font-semibold text-sm text-foreground">{q.speaker}</p>
                    <p className="text-xs text-muted-foreground">{q.title}</p>
                    {q.url ? (
                      <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">{q.source} ↗</a>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1 italic">{q.source}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 6 — Peluang SDM */}
          <section id="peluang" className="container mx-auto px-6 py-16 max-w-6xl">
            <SectionHeader tag={opportunitySection.tag} intro={opportunitySection.intro[persona]} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {opportunitySection.items.map((o, i) => (
                <div key={i} className="bg-secondary/60 border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors">
                  <div className="text-xs font-semibold text-primary tabular-nums mb-3">{o.number}</div>
                  <h3 className="font-heading font-semibold text-base md:text-lg text-foreground leading-snug mb-3">{o.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{o.body}</p>
                </div>
              ))}
            </div>
          </section>
          <UsefulFeedback section="peluang" persona={persona} />

          {/* SECTION 7 — Skill Map Teaser */}
          <section className="container mx-auto px-6 py-16 max-w-4xl">
            <div className="bg-secondary/60 border border-border rounded-2xl p-8 md:p-10">
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-3">{skillMapTeaser.tag}</p>
              <h3 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-3">
                {skillMapTeaser.headline}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                {skillMapTeaser.body}
              </p>
              <Button asChild variant="outline" className="gap-2">
                <Link to={skillMapTeaser.href}>
                  {skillMapTeaser.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </section>

          {/* Alumni yang Sudah Membuktikan */}
          <section className="container mx-auto px-6 py-16 max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-3 uppercase">{alumniSection.tag}</p>
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-3 max-w-3xl">{alumniSection.headline}</h2>
            <p className="text-base text-foreground/80 max-w-3xl leading-relaxed mb-8">{alumniSection.subtext}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alumniSection.stories.map((s, i) => (
                <div key={i} className="bg-secondary/60 border border-border rounded-2xl p-6 flex flex-col">
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-primary uppercase mb-3">{s.sector}</p>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-4">{s.story}</p>
                  <p className="text-sm text-foreground/80 italic leading-relaxed mb-4 border-l-2 border-primary/40 pl-3">{s.insight}</p>
                  <p className="text-xs text-muted-foreground mt-auto italic">{sourcePrefix} {s.source}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 8 — Persona Callout */}
          <section className="container mx-auto px-6 py-16 max-w-3xl">
            <div className="bg-secondary/60 border border-border rounded-2xl p-8 md:p-10">
              <h3 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-4">
                {personaCallout[persona].headline}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {personaCallout[persona].body}
              </p>
            </div>
          </section>

          {/* SECTION 9 — CTA dual-path + Waitlist */}
          <section className="container mx-auto px-6 py-20 md:py-24 max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-heading font-semibold text-3xl md:text-4xl tracking-tight leading-[1.15] text-foreground"
            >
              {ctaSection.headline}
            </motion.h2>
            <p className="text-sm md:text-base text-muted-foreground mt-4">
              {ctaSection.subtext[persona]}
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {ctaSection.paths.map((p) => (
                <Link
                  key={p.href}
                  to={p.href}
                  className={cn(
                    'group rounded-2xl border p-6 transition-all',
                    p.variant === 'default'
                      ? 'bg-primary text-primary-foreground border-primary hover:opacity-90'
                      : 'bg-secondary/60 border-border hover:border-primary/40'
                  )}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="font-heading font-semibold text-base md:text-lg">{p.label}</span>
                    <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className={cn('text-sm leading-relaxed', p.variant === 'default' ? 'text-primary-foreground/85' : 'text-muted-foreground')}>
                    {p.description}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-12">
              <WaitlistForm persona={persona} />
            </div>
          </section>

          {/* SECTION 10 — Footer sources */}
          <FooterSources />
    </main>
  );
};

export default Insight;
