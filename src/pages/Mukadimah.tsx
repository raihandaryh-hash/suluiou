import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { mukadimahBabak as M, type Block } from '@/data/mukadimahBabakContent';

/** Split **bold** and _italic_ run-level markers into React nodes. */
function rich(text: string) {
  const parts = text.split(/(\*\*.+?\*\*|_.+?_)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

function Jeda() {
  return (
    <div className="flex items-center justify-center py-2" aria-hidden="true">
      <span className="text-accent text-lg tracking-[0.5em]">–</span>
    </div>
  );
}

function AyatBlock({ ar, tr, citation }: { ar: string; tr: string; citation: string }) {
  return (
    <div className="my-8 text-center">
      <div className="mx-auto mb-4 h-px w-12 bg-accent/60" />
      <p dir="rtl" lang="ar" className="font-['Amiri'] text-2xl md:text-3xl leading-loose text-primary">
        {ar}
      </p>
      <p className="measure mx-auto mt-4 text-base md:text-[17px] leading-[1.75] text-foreground/90">
        {rich(tr)}
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-wider text-accent">{citation}</p>
      <div className="mx-auto mt-4 h-px w-12 bg-accent/60" />
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  if (block.t === 'ayat') {
    return <AyatBlock ar={block.ar} tr={block.tr} citation={block.ref} />;
  }
  return (
    <p className="text-base md:text-[17px] leading-[1.75] text-foreground/90">{rich(block.x)}</p>
  );
}

function NeetTable() {
  return (
    <div className="measure mx-auto my-8 rounded-2xl border border-border bg-secondary/40 p-6 md:p-8">
      <p className="mb-5 text-sm font-semibold text-foreground">{M.neet.title}</p>
      <div className="space-y-4">
        {M.neet.rows.map((row) => (
          <div key={row.c}>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className={`text-sm ${row.me ? 'font-semibold text-primary' : 'font-medium text-foreground'}`}>
                {row.c}
              </span>
              <span className="flex items-baseline gap-2 tabular-nums">
                <span className={`text-sm ${row.me ? 'font-semibold text-primary' : 'text-foreground'}`}>
                  {row.label}
                </span>
                <span className="text-xs text-muted-foreground">{row.pct}%</span>
              </span>
            </div>
            <div
              className={`h-2 rounded-full overflow-hidden ${row.me ? 'bg-primary/10' : 'bg-background'}`}
            >
              <div
                className={`h-full rounded-full ${row.me ? 'bg-accent' : 'bg-accent/50'}`}
                style={{ width: `${row.w}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-1 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">{M.neet.note}</p>
        <p className="text-xs text-muted-foreground/70 italic">{M.neet.source}</p>
      </div>
    </div>
  );
}

const Mukadimah = () => {
  return (
    <main className="min-h-screen bg-background">
      <header className="py-5">
        <div className="container mx-auto flex items-center justify-between px-6">
          <Logo size="md" linkTo="/" />
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 md:py-16">
        <div className="measure mx-auto">
          <h1 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-8">
            <em>{M.salam.italic}</em>
            {M.salam.rest}
          </h1>

          <div className="space-y-5 text-base md:text-[17px] leading-[1.75] text-foreground/90">
            {M.intro.map((p, i) => (
              <p key={i}>{rich(p)}</p>
            ))}
          </div>

          <Jeda />

          <p className="text-base md:text-[17px] leading-[1.75] text-foreground/90">
            {rich(M.musibah)}
          </p>

          <Jeda />

          <p className="text-base md:text-[17px] leading-[1.75] text-foreground/90">
            {rich(M.faktanya)}
          </p>
          <p className="mt-3 text-base md:text-[17px] leading-[1.75] text-foreground/90">
            {M.neetLead}
          </p>

          <NeetTable />

          <p className="text-base md:text-[17px] leading-[1.75] text-foreground/90">
            {M.rentangUmur}
          </p>

          <Jeda />

          <p className="font-heading font-medium text-lg md:text-xl text-foreground mt-2 mb-10 leading-[1.5]">
            {M.pertanyaan}
          </p>

          <div className="space-y-16">
            {M.steps.map((step) => (
              <section key={step.ord}>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1.5">
                  {step.ord}
                </p>
                <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-5">
                  {step.heading}
                </h2>
                <div className="space-y-5">
                  {step.blocks.map((block, i) => (
                    <BlockRenderer key={i} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-base md:text-[17px] leading-[1.75] text-foreground/90">
              {rich(M.closing)}
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" className="group">
              <Link to={M.cta.to}>
                {M.cta.label}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Mukadimah;
