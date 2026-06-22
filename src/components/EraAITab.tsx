import Cite from '@/components/Cite';

/**
 * Tab "Era AI" di Pusat Rujukan — rumah data mendalam soal AI & masa depan kerja
 * (Anthropic Economic Index + Stanford). Ditautkan dari narasi Babak 3 Insight
 * ("Lihat data dan grafik selengkapnya"). Untuk pembaca kritis yang mau menelusuri
 * sumber penuh. Semua angka terverifikasi ke sumber primer.
 */
export default function EraAITab() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 mt-8 space-y-10">
      <p className="text-sm text-muted-foreground">
        Data di balik narasi "Bekal" di halaman Kenali Dunia: bagaimana AI sebenarnya dipakai di
        dunia kerja, dan siapa yang paling terdampak. Bukan ramalan, melainkan pengukuran dari data nyata.
      </p>

      {/* Anthropic Economic Index */}
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Anthropic Economic Index: bagaimana AI benar-benar dipakai
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed mt-3">
          Alih-alih menebak masa depan, Anthropic menganalisis jutaan percakapan nyata orang dengan
          Claude, lalu memetakannya ke basis data tugas pekerjaan resmi (O*NET) milik Departemen
          Tenaga Kerja AS. Temuan utamanya:
          <Cite id="anthropic-economic-index" />
        </p>
        <ul className="mt-4 space-y-2 text-sm text-foreground/80 leading-relaxed list-disc pl-5">
          <li>Sekitar <strong className="text-foreground">36%</strong> pekerjaan sudah memakai AI untuk minimal seperempat tugasnya; hanya sekitar <strong className="text-foreground">4%</strong> yang memakainya untuk tiga-perempat tugas atau lebih.</li>
          <li>Mayoritas pemakaian bersifat <strong className="text-foreground">augmentasi</strong> (AI menguatkan manusia), bukan otomasi penuh. Pada laporan terbaru November 2025, augmentasi memimpin 52% berbanding 45%.<Cite id="anthropic-aug-vs-auto-2025" /></li>
          <li>Yang paling banyak memakai AI adalah pekerjaan kognitif menengah-atas, seperti programmer, penulis, dan analis data, bukan pekerjaan bergaji terendah maupun tertinggi.</li>
        </ul>

        {/* Grafik beratribusi — infografis resmi Anthropic */}
        <figure className="mt-6">
          <img
            src="https://www-cdn.anthropic.com/images/4zrzovbb/website/eeed8fe5c58c7c956ddcf4a2c05d22204537897e-1968x1787.jpg"
            alt="Infografis Anthropic Economic Index: distribusi penggunaan AI lintas kategori pekerjaan berdasarkan data Claude.ai"
            className="w-full rounded-xl border border-border"
            loading="lazy"
          />
          <figcaption className="text-xs text-muted-foreground/80 mt-2 italic">
            Sumber grafik: Anthropic Economic Index, "The Anthropic Economic Index" (Februari 2025).
            Persentase merujuk pada bagian percakapan dengan Claude yang terkait tiap kategori pekerjaan.
          </figcaption>
        </figure>
      </section>

      {/* Stanford */}
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Studi Stanford: siapa yang paling terdampak
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed mt-3">
          Tim ekonom Stanford (Brynjolfsson, Chandar &amp; Chen) menganalisis data payroll ADP yang
          mencakup jutaan pekerja AS. Temuannya menjelaskan sesuatu yang penting bagi pemuda:
          <Cite id="stanford-entry-level-ai-2025" />
        </p>
        <ul className="mt-4 space-y-2 text-sm text-foreground/80 leading-relaxed list-disc pl-5">
          <li>Pekerja muda usia <strong className="text-foreground">22-25 tahun</strong> di bidang paling terpapar AI mengalami penurunan relatif lapangan kerja sekitar <strong className="text-foreground">13%</strong> sejak akhir 2022.</li>
          <li>Pekerja senior di bidang yang sama justru relatif stabil atau tumbuh. Ini bukan soal seluruh industri runtuh, melainkan soal pintu masuk yang menyempit bagi yang baru mulai.</li>
          <li>Yang krusial: penurunan terkonsentrasi di bidang yang tugasnya <strong className="text-foreground">diotomasi</strong>, bukan yang <strong className="text-foreground">diaugmentasi</strong>. Di bidang tempat AI menguatkan manusia, lapangan kerja pemuda tetap bertahan.</li>
        </ul>
        <p className="text-sm text-foreground/75 leading-relaxed mt-4 border-t border-border/60 pt-4">
          Inilah benang merah yang menghubungkan kedua studi: nasib tiap pekerjaan tidak ditentukan oleh
          seberapa "teknis" ia, melainkan oleh apakah perannya bisa diotomasi penuh, atau justru menjadi
          lebih kuat ketika dipadukan dengan AI. Di sinilah human skills menjadi pembeda.
        </p>
      </section>

      <p className="text-xs text-muted-foreground/80 italic pb-6">
        Catatan: data augmentasi vs otomasi bergeser dari waktu ke waktu seiring perubahan cara orang
        memakai AI. Yang relatif stabil adalah polanya, bahwa pekerjaan kognitif paling bersinggungan
        dengan AI, dan bahwa augmentasi tetap menjadi pola pemakaian yang dominan.
      </p>
    </div>
  );
}
