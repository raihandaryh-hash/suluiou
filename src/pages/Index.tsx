import Hero from '@/components/landing/Hero';
import DataInsights from '@/components/landing/DataInsights';
import ModuleShowcase from '@/components/landing/ModuleShowcase';
import CTASection from '@/components/landing/CTASection';
import AdminQuickAccess from '@/components/AdminQuickAccess';

const Index = () => {
  return (
    <main>
      <Hero />
      <DataInsights />
      <ModuleShowcase />
      <CTASection />
      <AdminQuickAccess variant="floating" />
    </main>
  );
};

export default Index;