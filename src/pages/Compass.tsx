import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  compassHero,
  compassSections,
  compassCTA,
  compassSources,
  type CompassSection,
} from "@/data/compassContent";

const sectionColors: Record<
  CompassSection["color"],
  { bg: string; border: string; tag: string; badge: string; accent: string }
> = {
  navy: {
    bg: "bg-primary/[0.04]",
    border: "border-primary/15",
    tag: "text-primary/70",
    badge: "bg-primary text-primary-foreground",
    accent: "text-primary",
  },
  gold: {
    bg: "bg-accent/10",
    border: "border-accent/25",
    tag: "text-accent-foreground/70",
    badge: "bg-accent text-accent-foreground",
    accent: "text-accent-foreground",
  },
  teal: {
    bg: "bg-[hsl(180_45%_95%)]",
    border: "border-[hsl(180_40%_75%)]/40",
    tag: "text-[hsl(180_45%_30%)]",
    badge: "bg-[hsl(180_45%_30%)] text-white",
    accent: "text-[hsl(180_45%_30%)]",
  },
  blue: {
    bg: "bg-[hsl(213_55%_96%)]",
    border: "border-[hsl(213_55%_70%)]/40",
    tag: "text-[hsl(var(--mid-blue))]",
    badge: "bg-[hsl(var(--mid-blue))] text-white",
    accent: "text-[hsl(var(--mid-blue))]",
  },
};

function SectionCard({
  section,
  index,
}: {
  section: CompassSection;
  index: number;
}) {
  const c = sectionColors[section.color];
  return (
    <motion.article
      id={section.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.05 }}
      className={cn(
        "relative rounded-2xl border p-6 md:p-10 lg:p-14",
        c.bg,
        c.border,
      )}
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wider",
            c.badge,
          )}
        >
          {section.day}
        </span>
        <span className="text-xs text-muted-foreground">{section.date}</span>
        <span
          className={cn(
            "ml-auto text-[11px] font-semibold tracking-[0.18em] uppercase",
            c.tag,
          )}
        >
          {section.tag}
        </span>
      </div>

      <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight text-foreground whitespace-pre-line mb-6">
        {section.headline}
      </h2>

      <div className="flex items-start gap-3 mb-8 pb-6 border-b border-border/60">
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm md:text-base">
            {section.speaker}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
            {section.role}
          </p>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none">
        {section.body.split("\n\n").map((p, i) => (
          <p
            key={i}
            className="text-foreground/85 leading-[1.8] text-base md:text-[17px] mb-5"
          >
            {p}
          </p>
        ))}
      </div>

      {section.assessmentNote && (
        <div
          className={cn(
            "mt-8 rounded-xl border p-5 text-sm leading-relaxed text-foreground/80",
            c.border,
            "bg-background/60",
          )}
        >
          <span className={cn("font-semibold", c.accent)}>Catatan: </span>
          {section.assessmentNote}
        </div>
      )}

      <div className="mt-10 grid gap-4">
        <p
          className={cn(
            "text-[11px] font-semibold tracking-[0.2em] uppercase",
            c.tag,
          )}
        >
          Pertanyaan untuk Direnungkan
        </p>
        {section.questions.map((q, i) => (
          <div
            key={i}
            className={cn(
              "rounded-xl border bg-background/70 p-5 md:p-6",
              c.border,
            )}
          >
            <div className="flex gap-3">
              <span
                className={cn(
                  "shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                  c.badge,
                )}
              >
                {i + 1}
              </span>
              <p className="text-foreground/90 leading-relaxed text-[15px] md:text-base">
                {q}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "mt-10 rounded-xl border-l-4 px-5 py-4 bg-background/50",
          section.color === "navy"
            ? "border-primary"
            : section.color === "gold"
              ? "border-accent"
              : section.color === "teal"
                ? "border-[hsl(180_45%_30%)]"
                : "border-[hsl(var(--mid-blue))]",
        )}
      >
        <p
          className={cn(
            "text-[10px] font-semibold tracking-[0.2em] uppercase mb-2",
            c.tag,
          )}
        >
          Inti
        </p>
        <p className="text-foreground/90 text-[15px] md:text-base leading-relaxed italic">
          {section.keyInsight}
        </p>
      </div>
    </motion.article>
  );
}

function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const { fields, submit, successMessage } = compassCTA.waitlist;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !whatsapp.trim()) {
      toast.error("Mohon lengkapi semua kolom.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("waitlist_sulu").insert({
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      persona: "compass",
    });
    setLoading(false);
    if (error) {
      toast.error("Gagal menyimpan. Coba lagi sebentar.");
      return;
    }
    setDone(true);
    toast.success(successMessage);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
          <Check className="h-6 w-6" />
        </div>
        <p className="font-heading text-xl text-foreground mb-2">
          Terima kasih, {name.split(" ")[0]}.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
          {successMessage}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
    >
      <h3 className="font-heading text-2xl text-foreground mb-2">
        {compassCTA.waitlist.headline}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        {compassCTA.waitlist.subtext}
      </p>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cw-name">{fields.name.label}</Label>
          <Input
            id="cw-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={fields.name.placeholder}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cw-email">{fields.email.label}</Label>
          <Input
            id="cw-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={fields.email.placeholder}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cw-wa">{fields.whatsapp.label}</Label>
          <Input
            id="cw-wa"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder={fields.whatsapp.placeholder}
            required
          />
        </div>
        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading ? "Menyimpan…" : submit}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}

export default function Compass() {
  const [showSources, setShowSources] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-7 w-auto" />
          </Link>
          <Link
            to="/insight"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali ke Insight</span>
            <span className="sm:hidden">Insight</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 md:px-6 pt-16 md:pt-28 pb-16 md:pb-24 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] md:text-xs font-semibold tracking-[0.25em] text-accent-foreground/80 uppercase mb-5">
            {compassHero.tag}
          </p>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-foreground whitespace-pre-line mb-6">
            {compassHero.headline}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {compassHero.subtext}
          </p>
        </motion.div>

        {/* Section nav */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-2"
        >
          {compassSections.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="group flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs hover:border-primary/40 hover:bg-primary/[0.03] transition-colors"
            >
              <span className="font-semibold text-muted-foreground group-hover:text-primary">
                0{i + 1}
              </span>
              <span className="text-foreground/80 truncate">{s.tag}</span>
            </a>
          ))}
        </motion.nav>
      </section>

      {/* Sections */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl space-y-12 md:space-y-20 pb-20">
        {compassSections.map((s, i) => (
          <SectionCard key={s.id} section={s} index={i} />
        ))}
      </section>

      {/* CTA + Waitlist */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl pb-20 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-heading text-3xl md:text-5xl tracking-tight text-foreground mb-4">
            {compassCTA.headline}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            {compassCTA.subtext}
          </p>
        </motion.div>
        <WaitlistForm />
      </section>

      {/* Sources */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl pb-24">
        <button
          type="button"
          onClick={() => setShowSources((v) => !v)}
          className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground transition-colors"
        >
          Sumber & Referensi
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              showSources && "rotate-180",
            )}
          />
        </button>
        {showSources && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-5 space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5"
          >
            {compassSources.map((src, i) => (
              <li key={i}>{src}</li>
            ))}
          </motion.ul>
        )}
      </section>
    </main>
  );
}
