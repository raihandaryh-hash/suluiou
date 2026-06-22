import Cite from '@/components/Cite';
import { mismatchMukadimah as M } from '@/data/mismatchContent';

/**
 * Mukadimah Insight: menjembatani Kartu Penampar (kebutuhan riil Indonesia) ke
 * Babak 2 (Pak Evan). Menyampaikan "kenapa" & "so-what": ada mismatch antara
 * kebutuhan riil dan arah anak muda + pendidikan. Membangunkan, lalu mengajak
 * masuk ke materi Pak Evan. Semua siswa-facing. Lebar kolom dijaga max-w-2xl
 * agar selevel dengan narasi tengah lain.
 */
export default function MismatchMukadimah() {
  return (
    <section className="container mx-auto px-6 py-12 max-w-3xl">
      <div className="max-w-2xl space-y-12">
        {/* Reframe kartu penampar */}
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent mb-3 uppercase">{M.snapshotKicker}</p>
          <p className="text-base md:text-[17px] text-foreground/85 leading-[1.75]">{M.snapshotLead}</p>
        </div>

        {/* The turn — mismatch */}
        <div>
          <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground tracking-tight leading-tight mb-4">
            {M.turnKicker}
          </h3>
          <p className="text-base md:text-[17px] text-foreground/85 leading-[1.75]">{M.turnLead}</p>
        </div>

        {/* Structural reality */}
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-4 uppercase">{M.realitaKicker}</p>
          <div className="space-y-5">
            {M.realita.map((r, i) => (
              <div key={i} className="border-l-2 border-border pl-5">
                <h4 className="font-heading font-medium text-base text-foreground mb-1">{r.judul}</h4>
                <p className="text-sm text-foreground/75 leading-relaxed">
                  {r.body}
                  {r.cite && <Cite id={r.cite} />}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The danger */}
        <div>
          <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground tracking-tight leading-tight mb-4">
            {M.bahayaKicker}
          </h3>
          <p className="text-base md:text-[17px] text-foreground/85 leading-[1.75]">{M.bahayaLead}</p>
        </div>

        {/* Wake-up + bridge to Pak Evan */}
        <div className="border-t border-border pt-8">
          <p className="text-base md:text-[17px] text-foreground/90 leading-[1.75] font-medium">{M.bridgeLead}</p>
        </div>
      </div>
    </section>
  );
}
