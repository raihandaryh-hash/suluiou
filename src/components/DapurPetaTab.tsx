import {
  dapurPetaPembuka,
  dapurPetaSeksiA,
  dapurPetaSeksiB,
  dapurPetaSeksiC,
  dapurPetaSeksiD,
  dapurPetaSeksiE,
  dapurPetaPenutup,
  crosswalkTable,
  getConnectionBasisCounts,
} from "@/data/dapurPetaContent";

/**
 * Tab "Dapur Peta" di Pusat Rujukan — transparansi metodologi Peta Skill:
 * sumbernya, cara disusun, batas yang diketahui, dan catatan koreksi.
 * Ditulis untuk guru BK, orang tua, dan pemeriksa. Copy verbatim dari
 * Sulu_Dapur_Peta_Draft_v1.md (Fable, 11 Jul 2026), nol parafrase.
 * Render statis, tanpa AI runtime.
 */
export default function DapurPetaTab() {
  const counts = getConnectionBasisCounts();

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 mt-8 space-y-10">
      <p className="text-sm text-muted-foreground leading-relaxed">{dapurPetaPembuka.body}</p>

      {/* Seksi A — bukan alat ukur */}
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="font-heading text-lg font-bold text-foreground">{dapurPetaSeksiA.title}</h2>
        <div className="text-sm text-foreground/80 leading-relaxed mt-3 space-y-3">
          {dapurPetaSeksiA.body.split("\n\n").map((para, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g, "<strong class=\"text-foreground\">$1</strong>") }} />
          ))}
        </div>
      </section>

      {/* Seksi B — dari mana isinya + tabel crosswalk */}
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="font-heading text-lg font-bold text-foreground">{dapurPetaSeksiB.title}</h2>
        <div className="text-sm text-foreground/80 leading-relaxed mt-3 space-y-3">
          {dapurPetaSeksiB.bodyBefore.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Tabel crosswalk 25 × 5 */}
        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-secondary/50 text-left">
                <th className="px-3 py-2 font-semibold text-foreground/80 whitespace-nowrap">Kotak Sulu</th>
                <th className="px-3 py-2 font-semibold text-foreground/80 whitespace-nowrap">WEF GST</th>
                <th className="px-3 py-2 font-semibold text-foreground/80 whitespace-nowrap">Education 4.0</th>
                <th className="px-3 py-2 font-semibold text-foreground/80 whitespace-nowrap">O*NET</th>
                <th className="px-3 py-2 font-semibold text-foreground/80 whitespace-nowrap">ESCO</th>
                <th className="px-3 py-2 font-semibold text-foreground/80 whitespace-nowrap">NACE</th>
              </tr>
            </thead>
            <tbody>
              {crosswalkTable.map((row, i) => (
                <tr key={row.nodeId} className={i % 2 === 0 ? "bg-background" : "bg-secondary/20"}>
                  <td className="px-3 py-2 font-medium text-foreground/90 whitespace-nowrap">{row.kotakSulu}</td>
                  <td className="px-3 py-2 text-foreground/70">{row.wefGst}</td>
                  <td className="px-3 py-2 text-muted-foreground/70">{row.education40}</td>
                  <td className="px-3 py-2 text-muted-foreground/70">{row.onet}</td>
                  <td className="px-3 py-2 text-foreground/70">{row.esco}</td>
                  <td className="px-3 py-2 text-foreground/70">{row.nace}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-foreground/80 leading-relaxed mt-5 space-y-3">
          <p>{dapurPetaSeksiB.bodyAfter}</p>
        </div>
      </section>

      {/* Seksi C — dari mana garis-garisnya */}
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="font-heading text-lg font-bold text-foreground">{dapurPetaSeksiC.title}</h2>
        <p className="text-sm text-foreground/80 leading-relaxed mt-3">{dapurPetaSeksiC.intro}</p>

        <div className="mt-4 space-y-4">
          {dapurPetaSeksiC.dasar.map((d) => (
            <div key={d.label}>
              <p className="text-sm font-semibold text-foreground">{d.label}</p>
              <p className="text-sm text-foreground/75 leading-relaxed mt-1">{d.desc}</p>
            </div>
          ))}
        </div>

        {/* Hitungan garis per basis — live dari CONNECTION_BASIS, tidak hardcode */}
        <div className="mt-5 rounded-xl border border-border/60 bg-secondary/20 p-4">
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">
            Dasar garis di peta saat ini
          </p>
          <ul className="text-sm text-foreground/80 leading-relaxed space-y-1">
            <li>
              <strong className="text-foreground">{counts.taxonomy}</strong> garis: satu rumpun taksonomi
            </li>
            <li>
              <strong className="text-foreground">{counts.constructLiterature}</strong> garis: ada literatur yang menghubungkan
            </li>
            <li>
              <strong className="text-foreground">{counts.design}</strong> garis: keputusan pendidikan kami
            </li>
          </ul>
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed mt-4">{dapurPetaSeksiC.ujiLuar}</p>
      </section>

      {/* Seksi D — peran platform, peran manusia */}
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="font-heading text-lg font-bold text-foreground">{dapurPetaSeksiD.title}</h2>
        <div className="text-sm text-foreground/80 leading-relaxed mt-3 space-y-3">
          <p dangerouslySetInnerHTML={{ __html: dapurPetaSeksiD.paragraf1.replace(/\*\*(.+?)\*\*/g, "<strong class=\"text-foreground\">$1</strong>") }} />
          <p>{dapurPetaSeksiD.paragraf2}</p>
          <p>{dapurPetaSeksiD.paragraf3}</p>
        </div>
      </section>

      {/* Seksi E — yang kami rawat dan koreksi */}
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="font-heading text-lg font-bold text-foreground">{dapurPetaSeksiE.title}</h2>
        <p className="text-sm text-foreground/80 leading-relaxed mt-3">{dapurPetaSeksiE.intro}</p>

        <ul className="mt-4 space-y-3">
          {dapurPetaSeksiE.corrections.map((c, i) => (
            <li key={i} className="text-sm text-foreground/80 leading-relaxed rounded-xl bg-secondary/20 px-4 py-3">
              <strong className="text-foreground">{c.title}</strong> {c.body}
            </li>
          ))}
        </ul>

        <p className="text-sm text-foreground/80 leading-relaxed mt-4">{dapurPetaSeksiE.closing}</p>
      </section>

      {/* Penutup */}
      <p className="text-xs text-muted-foreground/80 italic pb-6">
        {dapurPetaPenutup.body} (Kanal koreksi:{" "}
        <a href={`mailto:${dapurPetaPenutup.email}`} className="underline underline-offset-2">
          {dapurPetaPenutup.email}
        </a>
        )
      </p>
    </div>
  );
}
