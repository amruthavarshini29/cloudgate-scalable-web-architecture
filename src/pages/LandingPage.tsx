import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import ArchitectureSection from '@/components/landing/ArchitectureSection';
import CloudControlSection from '@/components/landing/CloudControlSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import SecuritySection from '@/components/landing/SecuritySection';
import Footer from '@/components/landing/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-ink-950 noise">
      <AnimatedBackground variant="subtle" />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <ArchitectureSection />
          <CloudControlSection />
          <FeaturesSection />
          <SecuritySection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
