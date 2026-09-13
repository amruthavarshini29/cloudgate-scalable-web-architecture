import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroVisual from '@/components/landing/HeroVisual';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-bronze-700/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-bronze-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light border border-white/10 mb-8 animate-fade-in"
              style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/50 font-medium tracking-wide">All systems operational</span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-cream leading-[1.05] animate-fade-in-up text-balance"
              style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
            >
              Cloud infrastructure,
              <br />
              <span className="font-display italic text-bronze-300">built to scale.</span>
            </h1>

            <p
              className="mt-6 text-lg text-white/50 leading-relaxed max-w-md mx-auto lg:mx-0 animate-fade-in-up"
              style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}
            >
              Design, deploy and monitor highly available cloud applications with confidence.
            </p>

            <div
              className="mt-10 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}
            >
              <button
                onClick={() => navigate('/signup')}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-cream text-ink-950 rounded-full font-medium text-sm hover:bg-white transition-all duration-300 hover:scale-[1.02]"
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => {
                  document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/15 text-cream rounded-full font-medium text-sm hover:border-white/30 hover:bg-white/5 transition-all duration-300"
              >
                Explore Architecture
              </button>
            </div>
          </div>

          {/* Right: Visual */}
          <div
            className="animate-fade-in"
            style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}
          >
            <HeroVisual />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
