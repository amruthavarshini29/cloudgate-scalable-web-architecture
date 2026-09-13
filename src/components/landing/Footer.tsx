import { Cloud, ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Brand */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-bronze-400 to-bronze-700 flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
                </div>
                <span className="text-lg font-semibold tracking-tight text-cream">CloudGate</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed max-w-sm">
                Cloud infrastructure, built to scale. Design, deploy and monitor highly available cloud applications with confidence.
              </p>
            </div>

            {/* Links */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { title: 'Platform', links: ['Products', 'Architecture', 'Security', 'Pricing'] },
                { title: 'Solutions', links: ['High Availability', 'Auto Scaling', 'Load Balancing', 'Monitoring'] },
                { title: 'Resources', links: ['Documentation', 'API Reference', 'Architecture Guide', 'Blog'] },
                { title: 'Company', links: ['About', 'Careers', 'Contact', 'GitHub'] },
              ].map((col) => (
                <div key={col.title}>
                  <p className="text-xs font-mono text-white/30 tracking-wider uppercase mb-4">{col.title}</p>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-sm text-white/50 hover:text-cream transition-colors flex items-center gap-1 group">
                          {link}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">© 2026 CloudGate. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/30 hover:text-cream transition-colors">Privacy</a>
            <a href="#" className="text-xs text-white/30 hover:text-cream transition-colors">Terms</a>
            <span className="flex items-center gap-1.5 text-xs text-white/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
