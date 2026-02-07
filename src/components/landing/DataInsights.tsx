import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Users, Building2, Brain } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString('id-ID')}
      {suffix}
    </span>
  );
}

function StatCard({ icon, value, suffix, label, delay }: StatCardProps) {
  return (
    <motion.div
      className="glass rounded-2xl p-6 md:p-8 text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
        <AnimatedCounter target={value} suffix={suffix} />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

const stats = [
  {
    icon: <Brain className="w-6 h-6" />,
    value: 70,
    suffix: '%',
    label: 'Pekerjaan berubah akibat AI di 2030',
  },
  {
    icon: <Users className="w-6 h-6" />,
    value: 64,
    suffix: ' Juta',
    label: 'Generasi muda usia produktif di 2030',
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    value: 99,
    suffix: '%',
    label: 'Ekonomi Indonesia digerakkan UMKM',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: 3,
    suffix: 'x lipat',
    label: 'Pertumbuhan ekonomi digital Indonesia',
  },
];

const DataInsights = () => {
  return (
    <section id="data-insights" className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            Dunia Sedang <span className="text-gradient">Berubah</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Data tidak berbohong. Apakah kamu sudah punya navigasinya?
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DataInsights;