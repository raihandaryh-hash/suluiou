import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Cite from '@/components/Cite';
import {
  dilloIntro,
  aiSudahDiSini,
  yangKenaBukanYangKamuKira,
  pergeseranFungsi,
  jembatanKePeta,
} from '@/data/skillMapNarasiContent';

/**
 * Narasi jembatan Babak 2 (Pak Evan) → Peta Skill, mengikuti sequencing IOU Fair
 * (Evan = lanskap, Dillo = bekal/human skills). Dirender DI ATAS diagram skill-map
 * di Babak 3 Insight, memberi diagram itu konteks & alasan.
 *
 * Semua angka terverifikasi ke sumber primer (AEI + Stanford); lihat
 * skillMapNarasiContent.ts untuk catatan provenance.
 */
export default function DilloNarasi() {
  return (
    <div className="space-y-16 max-w-2xl">
      {/* 3.0 — Perkenalan Pak Dillo sebagai penerus Pak Evan */}
      <section>
        <p className="text-xs font-semibold tracking-[0.2em] text-accent mb-3 uppercase">{dilloIntro.kicker}</p>
        <h3 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-4">
          {dilloIntro.headline}
        </h3>
        <p className="text-base text-foreground/80 leading-[1.75]">{dilloIntro.body}</p>
      </section>

      {/* 3.1 — AI sudah di sini (data Anthropic, terverifikasi) */}
      <section>
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-3 uppercase">{aiSudahDiSini.kicker}</p>
        <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground tracking-tight leading-tight mb-4">
          {aiSudahDiSini.headline}
        </h3>
        <p className="text-base text-foreground/80 leading-[1.75]">
          {aiSudahDiSini.body}
          <Cite id={aiSudahDiSini.cite} />
        </p>
        <p className="text-base text-foreground/80 leading-[1.75] mt-3">
          {aiSudahDiSini.augmentNote}
          <Cite id={aiSudahDiSini.augmentCite} />
        </p>
      </section>

      {/* 3.2 — Yang kena bukan yang kamu kira (twist) */}
      <section>
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-3 uppercase">{yangKenaBukanYangKamuKira.kicker}</p>
        <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground tracking-tight leading-tight mb-4">
          {yangKenaBukanYangKamuKira.headline}
        </h3>
        <p className="text-base text-foreground/80 leading-[1.75]">
          {yangKenaBukanYangKamuKira.body}
          <Cite id={yangKenaBukanYangKamuKira.bodyCite} />
        </p>
        <p className="text-base text-foreground/80 leading-[1.75] mt-3">
          {yangKenaBukanYangKamuKira.stanford}
          <Cite id={yangKenaBukanYangKamuKira.stanfordCite} />
        </p>
        <Link
          to={yangKenaBukanYangKamuKira.link.href}
          className="inline-flex items-center gap-1.5 mt-4 text-sm text-primary underline underline-offset-4 hover:opacity-80"
        >
          {yangKenaBukanYangKamuKira.link.label}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* 3.3 — Pergeseran fungsi manusia */}
      <section>
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-3 uppercase">{pergeseranFungsi.kicker}</p>
        <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground tracking-tight leading-tight mb-4">
          {pergeseranFungsi.headline}
        </h3>
        <p className="text-base text-foreground/80 leading-[1.75] mb-6">{pergeseranFungsi.body}</p>
        <div className="space-y-4">
          {pergeseranFungsi.tersisa.map((t, i) => (
            <div key={i} className="border-l-2 border-accent/60 pl-5">
              <h4 className="font-heading font-medium text-base text-foreground mb-1">{t.label}</h4>
              <p className="text-sm text-foreground/75 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-base text-foreground/85 leading-[1.75] mt-6">{pergeseranFungsi.closing}</p>
      </section>

      {/* 3.4 — Jembatan ke peta */}
      <section>
        <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground tracking-tight leading-tight mb-4">
          {jembatanKePeta.headline}
        </h3>
        <p className="text-base text-foreground/80 leading-[1.75]">{jembatanKePeta.body}</p>
      </section>
    </div>
  );
}
