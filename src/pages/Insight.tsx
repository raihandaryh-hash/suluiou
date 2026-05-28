import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import { type StatCardContent } from '@/data/insightContent';
import { useInsightContent } from '@/lib/insightContentStore';

// ---------- Helpers ----------
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
    const totalMonths = Math.max(
      0,
      (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
    );
    return { years, months: totalMonths };
  }, [now, targetIso]);
}

// ---------- Stat Card (collapsible) ----------
function StatCard({
  card,
  sourcePrefix,
}: {
  card: StatCardContent;
  sourcePrefix: string;
}) {
  const { value, label, detail, source, tone = 'neutral' } = card;
  const [open, setOpen] = useState(false);
  const valueColor =
    tone === 'negative' ? 'text-destructive' :
    tone === 'positive' ? 'text-primary' :
    'text-foreground';

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={cn(
        'group text-left w-full bg-secondary/60 hover:bg-secondary',
        'border border-border rounded-2xl p-6 transition-all',
        'focus:outline-none focus:ring-2 focus:ring-ring'
      )}
      aria-expanded={open}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className={cn('font-heading font-medium tracking-tight text-3xl md:text-4xl', valueColor)}>
            {value}
          </div>
          <div className="text-sm text-muted-foreground leading-snug">{label}</div>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform',
            open && 'rotate-180'
          )}
        />
      </div>
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          open ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-foreground/80 leading-relaxed">{detail}</p>
          <p className="text-xs text-muted-foreground mt-3 italic">
            {sourcePrefix} {source}
          </p>
        </div>
      </div>
    </button>
  );
}

// ---------- Page ----------
const Insight = () => {
  const { content } = useInsightContent();
  const { years, months } = useCountdownTo(content.meta.countdownTargetIso);

  return (
    <main className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="border-b border-border sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" linkTo="/" />
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to={content.nav.backHref}>
              <ArrowLeft className="w-4 h-4" /> {content.nav.backLabel}
            </Link>
          </Button>
        </div>
      </header>

      {/* SECTION 1 — Hero */}
      <section className="container mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-heading font-semibold tracking-tight text-3xl md:text-5xl leading-[1.1] text-foreground"
        >
          {content.hero.titleLine1}
          <br />
          <span className="text-muted-foreground">{content.hero.titleLine2}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-sm md:text-base text-muted-foreground mt-6 max-w-xl"
        >
          {content.hero.subtitle}
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <div className="bg-secondary/60 border border-border rounded-full px-4 py-2 text-sm">
            <span className="font-semibold text-foreground">{years}</span>{' '}
            <span className="text-muted-foreground">{content.hero.countdown.yearsSuffix}</span>
          </div>
          <div className="bg-secondary/60 border border-border rounded-full px-4 py-2 text-sm">
            <span className="font-semibold text-foreground">{months}</span>{' '}
            <span className="text-muted-foreground">{content.hero.countdown.monthsSuffix}</span>
          </div>
          <div className="bg-secondary/60 border border-border rounded-full px-4 py-2 text-sm">
            <span className="font-semibold text-foreground">
              {content.hero.countdown.demographic.value}
            </span>{' '}
            <span className="text-muted-foreground">
              {content.hero.countdown.demographic.label}
            </span>
          </div>
        </motion.div>

        <div className="mt-10">
          <Button asChild size="lg" className="gap-2">
            <Link to={content.hero.cta.href}>
              {content.hero.cta.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* SECTION 2 — Indonesia hari ini */}
      <section className="container mx-auto px-6 py-16 max-w-6xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-6">
          {content.indonesiaSection.eyebrow}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.indonesiaSection.cards.map((c, i) => (
            <StatCard key={`${c.label}-${i}`} card={c} sourcePrefix={content.labels.sourcePrefix} />
          ))}
        </div>
      </section>

      {/* SECTION 3 — NEET ASEAN bar chart */}
      <section className="container mx-auto px-6 py-16 max-w-4xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-6">
          {content.neetSection.eyebrow}
        </p>
        <div className="bg-secondary/60 border border-border rounded-2xl p-6 md:p-8 space-y-5">
          {content.neetSection.rows.map((row, i) => (
            <div key={`${row.country}-${i}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{row.country}</span>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {row.value.toString().replace('.', ',')}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-background overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full', row.color)}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(row.value / content.meta.neetChartMaxPercent) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground italic pt-2">
            {content.neetSection.source}
          </p>
        </div>
      </section>

      {/* SECTION 4 — Dunia yang sedang berubah */}
      <section className="container mx-auto px-6 py-16 max-w-6xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-6">
          {content.worldSection.eyebrow}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.worldSection.cards.map((c, i) => (
            <StatCard key={`${c.label}-${i}`} card={c} sourcePrefix={content.labels.sourcePrefix} />
          ))}
        </div>
      </section>

      {/* SECTION 5 — Peluang yang belum diisi */}
      <section className="container mx-auto px-6 py-16 max-w-6xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-6">
          {content.opportunitiesSection.eyebrow}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.opportunitiesSection.items.map((o, i) => (
            <div
              key={`${o.title}-${i}`}
              className="bg-secondary/60 border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors"
            >
              <div className="text-xs font-semibold text-primary tabular-nums mb-3">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="font-heading font-semibold text-base md:text-lg text-foreground leading-snug mb-3">
                {o.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 — CTA */}
      <section className="container mx-auto px-6 py-20 md:py-28 max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-semibold text-3xl md:text-4xl tracking-tight leading-[1.15]"
        >
          {content.ctaSection.titleLine1}
          <br />
          <span className="text-primary">{content.ctaSection.titleLine2}</span>
        </motion.h2>
        <div className="mt-8">
          <Button asChild size="lg" className="gap-2 text-base">
            <Link to={content.ctaSection.primaryCta.href}>
              {content.ctaSection.primaryCta.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-16 pt-10 border-t border-border max-w-xl mx-auto">
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed whitespace-pre-line">
            {content.ctaSection.footer.body}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to={content.ctaSection.footer.cta.href}>
              {content.ctaSection.footer.cta.label}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Insight;
