import { Shield, TrendingUp, Shuffle, Activity } from 'lucide-react';
import Reveal from '@/components/Reveal';

interface Feature {
  num: string;
  title: string;
  description: string;
  icon: typeof Shield;
}

const features: Feature[] = [
  {
    num: '01',
    title: 'High Availability',
    description: 'Keep applications available even when individual servers fail. Multi-AZ deployment ensures continuous operation.',
    icon: Shield,
  },
  {
    num: '02',
    title: 'Auto Scaling',
    description: 'Automatically adapt infrastructure to changing traffic. Scale from 2 to 5 instances based on real-time demand.',
    icon: TrendingUp,
  },
  {
    num: '03',
    title: 'Load Balancing',
    description: 'Distribute traffic intelligently across application servers. Health-based routing removes unhealthy targets.',
    icon: Shuffle,
  },
  {
    num: '04',
    title: 'Monitoring',
    description: 'Track infrastructure health, requests and system events. CloudWatch integration with real-time alerting.',
    icon: Activity,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-40 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <Reveal className="mb-20">
          <p className="text-xs font-mono text-bronze-400 tracking-[0.2em] uppercase mb-4">Capabilities</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-cream leading-tight max-w-2xl text-balance">
            Everything you need to run
            <span className="font-display italic text-bronze-300"> production-grade infrastructure.</span>
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-x-16 gap-y-0">
          {features.map((feature, i) => (
            <Reveal key={feature.num} delay={i * 100}>
              <div className="group py-10 border-t border-white/5 first:border-t-0 lg:first:border-t-0 transition-all duration-500 hover:pl-2">
                <div className="flex items-start gap-6">
                  <span className="text-xs font-mono text-white/20 tabular-nums mt-1">{feature.num}</span>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-bronze-500/10 group-hover:text-bronze-300 transition-all duration-500">
                        <feature.icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-2xl font-light text-cream">{feature.title}</h3>
                    </div>
                    <p className="text-base text-white/40 leading-relaxed max-w-md ml-12">{feature.description}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
