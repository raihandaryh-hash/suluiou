import { motion } from 'framer-motion';
import { Eye, Fingerprint, Compass, HeartHandshake } from 'lucide-react';

const modules = [
  {
    icon: <Eye className="w-7 h-7" />,
    title: 'The Awakening',
    subtitle: 'Kesadaran',
    description:
      'Data realita tentang masa depan pekerjaan di Indonesia. Lihat fakta, bukan asumsi.',
  },
  {
    icon: <Fingerprint className="w-7 h-7" />,
    title: 'The Mirror',
    subtitle: 'Identitas',
    description:
      'Asesmen Kepribadian & Minat berbasis sains untuk menemukan siapa dirimu sebenarnya.',
  },
  {
    icon: <Compass className="w-7 h-7" />,
    title: 'The Pathway',
    subtitle: 'Arah',
    description:
      'Rekomendasi jalur pendidikan IOU yang selaras dengan kepribadian dan minatmu.',
  },
  {
    icon: <HeartHandshake className="w-7 h-7" />,
    title: 'The Bridge',
    subtitle: 'Jembatan',
    description:
      'Laporan untuk orang tua — menjelaskan potensi anak dengan bahasa yang mereka pahami.',
  },
];

const ModuleShowcase = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] font-heading font-semibold mb-3 leading-tight">
            Empat Langkah Menuju{' '}
            <span className="text-gradient">Yaqazah</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Dari kesadaran sampai aksi — semuanya dirancang untukmu.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              className="group glass rounded-2xl p-6 hover:glow-primary transition-shadow duration-500 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-torch-glow to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                {mod.icon}
              </div>

              <p className="text-xs uppercase tracking-widest text-primary/70 mb-1 font-medium">
                {mod.subtitle}
              </p>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                {mod.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {mod.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModuleShowcase;