import { useState } from 'react';
import { Users, Shuffle, Server, Database, ArrowDown } from 'lucide-react';
import Reveal from '@/components/Reveal';

interface ArchComponent {
  id: string;
  name: string;
  purpose: string;
  health: 'healthy' | 'degraded';
  awsService: string;
  icon: typeof Users;
}

const components: ArchComponent[] = [
  { id: 'users', name: 'Users', purpose: 'End users accessing the application over HTTPS via Route 53 DNS routing.', health: 'healthy', awsService: 'Route 53', icon: Users },
  { id: 'alb', name: 'Application Load Balancer', purpose: 'Distributes incoming traffic across multiple EC2 instances with health-based routing.', health: 'healthy', awsService: 'ALB', icon: Shuffle },
  { id: 'ec2', name: 'Auto Scaling EC2', purpose: 'Application servers running Node.js/Express, scaling 2–5 instances based on demand.', health: 'healthy', awsService: 'EC2 + ASG', icon: Server },
  { id: 'db', name: 'Database', purpose: 'Managed PostgreSQL with Multi-AZ failover and read replicas for high availability.', health: 'healthy', awsService: 'RDS PostgreSQL', icon: Database },
];

export default function ArchitectureSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="architecture" className="relative py-24 lg:py-40 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-bronze-700/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-20">
          <p className="text-xs font-mono text-bronze-400 tracking-[0.2em] uppercase mb-4">Architecture</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-cream leading-tight text-balance">
            Built for scale.
            <br />
            <span className="font-display italic text-bronze-300">Designed for resilience.</span>
          </h2>
        </Reveal>

        {/* Architecture flow */}
        <div className="flex flex-col items-center gap-0 max-w-2xl mx-auto">
          {components.map((comp, i) => {
            const isActive = hovered === comp.id;
            const isDimmed = hovered !== null && hovered !== comp.id;

            return (
              <div key={comp.id} className="w-full flex flex-col items-center">
                <Reveal delay={i * 150}>
                  <div
                    onMouseEnter={() => setHovered(comp.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`relative w-full max-w-md transition-all duration-500 cursor-pointer group ${
                      isDimmed ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    {/* Glow */}
                    {isActive && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-bronze-700/20 to-bronze-500/10 rounded-2xl blur-xl transition-opacity" />
                    )}

                    <div
                      className={`relative flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 ${
                        isActive
                          ? 'glass border-bronze-500/30 glow-bronze'
                          : 'bg-ink-850/50 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive ? 'bg-bronze-500/15 text-bronze-300' : 'bg-white/5 text-white/40'
                      }`}>
                        <comp.icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-medium text-cream">{comp.name}</h3>
                          <span className={`w-1.5 h-1.5 rounded-full ${comp.health === 'healthy' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                        </div>

                        <div className={`overflow-hidden transition-all duration-500 ${
                          isActive ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <p className="text-sm text-white/50 mt-2 leading-relaxed">{comp.purpose}</p>
                          <p className="text-xs font-mono text-bronze-400 mt-2">{comp.awsService}</p>
                        </div>

                        {!isActive && (
                          <p className="text-xs text-white/30 mt-1">Hover to explore</p>
                        )}
                      </div>

                      <span className={`text-xs font-mono px-2.5 py-1 rounded-full transition-colors ${
                        isActive ? 'bg-bronze-500/15 text-bronze-300' : 'bg-white/5 text-white/30'
                      }`}>
                        {comp.awsService}
                      </span>
                    </div>
                  </div>
                </Reveal>

                {i < components.length - 1 && (
                  <div className="py-2">
                    <div className="flex flex-col items-center">
                      <div className="w-px h-8 bg-gradient-to-b from-white/10 to-white/5" />
                      <ArrowDown className="w-3 h-3 text-white/20" />
                      <div className="w-px h-8 bg-gradient-to-b from-white/5 to-white/10" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
