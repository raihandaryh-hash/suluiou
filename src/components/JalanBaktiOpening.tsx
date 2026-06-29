import Cite from '@/components/Cite';
import { jbOpening as O } from '@/data/jalanBaktiOpeningContent';

/**
 * Opening baru Kenali Jalan Bakti. Tiga lapis:
 * 1. "The bomb" — temuan riset person-environment fit (= segitiga Pak Dillo),
 *    jujur (efek nyata namun moderat), bukan klaim Ikigai.
 * 2. Doa Nabi Sulaiman (QS An-Naml 19) sebagai lapisan Islami yang menyertai,
 *    memetakan triad ke ridha tanpa merombak framework. Arab Amiri RTL,
 *    terjemah ROMAN (bukan italic) per disiplin.
 * 3. Framework 3 gerakan (Dengar -> Pahami -> Desain) yang memberi halaman
 *    tulang punggung dan menyiapkan AI sebagai alat riset di gerakan 2.
 */
export default function JalanBaktiOpening() {
  return (
    <div className="space-y-14 max-w-2xl">
      {/* 1. The bomb */}
      <section>
        <p className="text-xs font-semibold tracking-[0.2em] text-[hsl(var(--torch-gold))] mb-3 uppercase">
          {O.bombKicker}
        </p>
        <p className="text-base md:text-[17px] text-foreground/85 leading-[1.8]">{O.bombLead}</p>
        <p className="text-lg md:text-xl text-foreground font-semibold leading-snug mt-4">
          {O.bombEmphasis}
          <Cite id={O.bombCite} />
        </p>
        <p className="text-base text-foreground/80 leading-[1.8] mt-4">{O.bombAfter}</p>
      </section>

      {/* 2. Doa Nabi Sulaiman */}
      <section>
        <p className="text-base text-foreground/85 leading-[1.8] mb-5">{O.doaIntro}</p>
        <div className="rounded-2xl border border-border bg-secondary/40 p-5 md:p-6">
          <p
            className="font-['Amiri',serif] text-2xl md:text-[28px] leading-[2] text-foreground text-right mb-4"
            dir="rtl"
            lang="ar"
          >
            {O.ayat.arabic}
          </p>
          <p className="text-[15px] text-foreground/90 leading-relaxed">{O.ayat.terjemah}</p>
          <p className="text-xs text-muted-foreground mt-2">{O.ayat.rujukan}</p>
        </div>

        <div className="mt-6 space-y-4">
          {O.doaMapping.map((m, i) => (
            <div key={i} className="border-l-2 border-[hsl(var(--torch-gold))]/50 pl-5">
              <p className="text-sm font-semibold text-foreground mb-1">{m.frasa}</p>
              <p className="text-sm text-foreground/75 leading-relaxed">{m.makna}</p>
            </div>
          ))}
        </div>
        <p className="text-base text-foreground/85 leading-[1.8] mt-6">{O.doaClosing}</p>
      </section>

      {/* 3. Framework: 3 gerakan */}
      <section>
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-2 uppercase">
          {O.gerakanKicker}
        </p>
        <p className="text-base text-foreground/85 leading-relaxed mb-5">{O.gerakanLead}</p>
        <div className="space-y-4">
          {O.gerakan.map((g) => (
            <div key={g.no} className="flex gap-4 rounded-xl border border-border bg-card px-5 py-4">
              <span className="font-heading text-lg font-bold text-[hsl(var(--torch-gold))] tabular-nums shrink-0">
                {g.no}
              </span>
              <div>
                <h4 className="font-heading font-semibold text-base text-foreground mb-1">{g.judul}</h4>
                <p className="text-sm text-foreground/75 leading-relaxed">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed mt-5 italic">{O.gerakanClosing}</p>
      </section>
    </div>
  );
}
