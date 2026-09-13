import { Link } from 'react-router-dom';
import { Cloud, ArrowLeft } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-ink-950 noise overflow-hidden">
      {/* Left: Branding visual (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <AnimatedBackground variant="default" />

        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-bronze-700/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-bronze-600/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md px-12">
          <Link to="/" className="flex items-center gap-2.5 mb-12 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-bronze-400 to-bronze-700 flex items-center justify-center transition-transform group-hover:scale-105">
              <Cloud className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-cream">CloudGate</span>
          </Link>

          <h2 className="text-4xl font-light text-cream leading-tight mb-6">
            Cloud infrastructure,
            <br />
            <span className="font-display italic text-bronze-300">built to scale.</span>
          </h2>

          <p className="text-white/40 leading-relaxed mb-12">
            Design, deploy and monitor highly available cloud applications with confidence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '6', label: 'AZs' },
              { value: '12K+', label: 'Req/min' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-light text-cream tabular-nums">{stat.value}</p>
                <p className="text-xs text-white/30 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col relative">
        <AnimatedBackground variant="subtle" />

        {/* Mobile logo */}
        <div className="lg:hidden p-6 relative z-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-bronze-400 to-bronze-700 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-cream">CloudGate</span>
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-cream transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-light text-cream tracking-tight mb-2">{title}</h1>
            <p className="text-white/40 mb-10">{subtitle}</p>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
