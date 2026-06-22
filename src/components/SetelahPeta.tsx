import Cite from '@/components/Cite';
import { setelahPeta } from '@/data/skillMapNarasiContent';

/**
 * Penutup SETELAH diagram skill-map: menjawab "apa yang harus dilakukan dengan
 * peta ini?" lalu menjembatani ke /kenali-dirimu. Struktur dari deck Soft Skills
 * (membaca != memiliki; deliberate practice / Ericsson).
 */
export default function SetelahPeta() {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent mb-3 uppercase">{setelahPeta.kicker}</p>
      <h3 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-6">
        {setelahPeta.headline}
      </h3>
      <div className="space-y-4">
        {setelahPeta.poin.map((p, i) => (
          <div key={i} className="border-l-2 border-border pl-5">
            <h4 className="font-heading font-medium text-base text-foreground mb-1">{p.label}</h4>
            <p className="text-sm text-foreground/75 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Prinsip latihan yang disengaja, dari riset Anders Ericsson dan kerangka skill global
        <Cite id={setelahPeta.poinCite} />
      </p>
      <p className="text-base text-foreground/85 leading-[1.75] mt-8">{setelahPeta.bridge}</p>
    </div>
  );
}
