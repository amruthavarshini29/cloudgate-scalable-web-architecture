import { Lock, Network, Shield, KeyRound, Database, Globe } from 'lucide-react';
import Reveal from '@/components/Reveal';

interface SecurityItem {
  name: string;
  description: string;
  icon: typeof Lock;
}

const securityItems: SecurityItem[] = [
  { name: 'Bastion / Jump Server', description: 'Controlled SSH access through a single hardened entry point in the public subnet.', icon: Shield },
  { name: 'Private Subnets', description: 'Application and database servers isolated from direct internet access.', icon: Network },
  { name: 'Security Groups', description: 'Instance-level firewalls with least-privilege inbound and outbound rules.', icon: Lock },
  { name: 'IAM', description: 'Fine-grained access control with roles and policies for every service.', icon: KeyRound },
  { name: 'Encrypted Database', description: 'RDS encryption at rest with KMS-managed keys and TLS in transit.', icon: Database },
  { name: 'HTTPS', description: 'End-to-end encryption with ACM-managed certificates and ALB termination.', icon: Globe },
];

export default function SecuritySection() {
  return (
    <section id="security" className="relative py-24 lg:py-40 border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bronze-700/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left: Heading */}
          <Reveal className="lg:col-span-5 lg:sticky lg:top-32">
            <p className="text-xs font-mono text-bronze-400 tracking-[0.2em] uppercase mb-4">Security</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-cream leading-tight text-balance">
              Secure by
              <br />
              <span className="font-display italic text-bronze-300">architecture.</span>
            </h2>
            <p className="mt-6 text-base text-white/40 leading-relaxed max-w-sm">
              Security isn't an add-on. It's woven into every layer — from network topology to access control to data encryption.
            </p>

            {/* Visual infrastructure stack */}
            <div className="mt-10 hidden lg:block">
              <div className="relative w-full max-w-xs">
                {['Public Subnet', 'Private Subnet (App)', 'Private Subnet (Data)'].map((layer, i) => (
                  <div
                    key={layer}
                    className={`relative rounded-xl p-4 mb-3 border transition-all duration-700 ${
                      i === 0
                        ? 'bg-bronze-700/5 border-bronze-500/10'
                        : i === 1
                        ? 'bg-ink-800/50 border-white/5'
                        : 'bg-ink-850/50 border-white/5'
                    }`}
                    style={{ marginLeft: `${i * 24}px` }}
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-bronze-400/60" strokeWidth={1.5} />
                      <span className="text-sm text-white/50">{layer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: Security items */}
          <div className="lg:col-span-7 space-y-px">
            {securityItems.map((item, i) => (
              <Reveal key={item.name} delay={i * 80}>
                <div className="group flex items-start gap-5 py-6 border-t border-white/5 first:border-t-0 transition-all duration-500">
                  <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-white/30 group-hover:bg-bronze-500/10 group-hover:text-bronze-300 transition-all duration-500">
                    <item.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-cream mb-1">{item.name}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
                  </div>
                  <span className="text-xs font-mono text-white/10 mt-1">0{i + 1}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
