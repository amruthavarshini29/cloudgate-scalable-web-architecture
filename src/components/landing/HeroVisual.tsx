import { useEffect, useState } from 'react';

/**
 * Cinematic animated infrastructure hero visual.
 * Renders an SVG-based architecture diagram with flowing data lines,
 * pulsing nodes, and animated connection paths.
 */
export default function HeroVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] max-w-2xl mx-auto">
      {/* Ambient glow */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(184,133,63,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <svg
        viewBox="0 0 600 400"
        className="w-full h-full"
        fill="none"
        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1s ease' }}
      >
        <defs>
          <linearGradient id="lineFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b8853f" stopOpacity="0" />
            <stop offset="50%" stopColor="#d4b48a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#b8853f" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineFlowRev" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#b8853f" stopOpacity="0" />
            <stop offset="50%" stopColor="#d4b48a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#b8853f" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="nodeGlow">
            <stop offset="0%" stopColor="#d4b48a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d4b48a" stopOpacity="0" />
          </radialGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Layer 1: Users (top) */}
        <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.2s' }}>
          {[200, 300, 400].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={40} r={14} fill="url(#nodeGlow)" />
              <rect x={x - 8} y={32} width={16} height={16} rx={3} fill="#1a1a1e" stroke="#3a3a42" strokeWidth="1" />
              <circle cx={x} cy={40} r={3} fill="#d4b48a" className="animate-pulse-glow" style={{ animationDelay: `${i * 0.5}s` }} />
            </g>
          ))}
        </g>

        {/* Connection lines: Users → ALB */}
        {[200, 300, 400].map((x, i) => (
          <line
            key={`u-alb-${i}`}
            x1={x} y1={56}
            x2={300} y2={100}
            stroke="url(#lineFlow)"
            strokeWidth="1"
            strokeDasharray="3 6"
            className="animate-data-flow"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}

        {/* Layer 2: Load Balancer */}
        <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}>
          <rect x={240} y={90} width={120} height={28} rx={14} fill="#131316" stroke="#b8853f" strokeWidth="1" opacity="0.8" />
          <text x={300} y={108} textAnchor="middle" fill="#d4b48a" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="0.5">LOAD BALANCER</text>
        </g>

        {/* Connection lines: ALB → EC2 */}
        {[180, 300, 420].map((x, i) => (
          <line
            key={`alb-ec2-${i}`}
            x1={300} y1={118}
            x2={x} y2={160}
            stroke="url(#lineFlow)"
            strokeWidth="1"
            strokeDasharray="3 6"
            className="animate-data-flow"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}

        {/* Layer 3: EC2 Instances */}
        <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.6s' }}>
          {[180, 300, 420].map((x, i) => (
            <g key={`ec2-${i}`}>
              <circle cx={x} cy={180} r={20} fill="url(#nodeGlow)" />
              <rect x={x - 18} y={164} width={36} height={32} rx={6} fill="#1a1a1e" stroke="#3a3a42" strokeWidth="1" />
              <rect x={x - 14} y={168} width={28} height={4} rx={1} fill="#2c2c33" />
              <rect x={x - 14} y={174} width={28} height={4} rx={1} fill="#2c2c33" />
              <rect x={x - 14} y={180} width={20} height={4} rx={1} fill="#2c2c33" />
              <rect x={x - 14} y={186} width={24} height={4} rx={1} fill="#2c2c33" />
              <circle cx={x + 12} cy={170} r={2} fill="#6bbb6b" className="animate-pulse-glow" style={{ animationDelay: `${i * 0.7}s` }} />
            </g>
          ))}
        </g>

        {/* Connection lines: EC2 → Database */}
        {[180, 300, 420].map((x, i) => (
          <line
            key={`ec2-db-${i}`}
            x1={x} y1={196}
            x2={300} y2={250}
            stroke="url(#lineFlowRev)"
            strokeWidth="1"
            strokeDasharray="3 6"
            className="animate-data-flow-reverse"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}

        {/* Layer 4: Database */}
        <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.8s' }}>
          <ellipse cx={300} cy={275} rx={40} ry={8} fill="#131316" stroke="#b8853f" strokeWidth="1" opacity="0.6" />
          <ellipse cx={300} cy={268} rx={40} ry={8} fill="#131316" stroke="#3a3a42" strokeWidth="1" />
          <ellipse cx={300} cy={261} rx={40} ry={8} fill="#131316" stroke="#3a3a42" strokeWidth="1" />
          <ellipse cx={300} cy={254} rx={40} ry={8} fill="#131316" stroke="#3a3a42" strokeWidth="1" />
          <text x={300} y={300} textAnchor="middle" fill="#d4b48a" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="0.5">POSTGRESQL RDS</text>
        </g>

        {/* Side labels */}
        <text x={60} y={44} fill="#5a5a62" fontSize="7" fontFamily="JetBrains Mono, monospace" letterSpacing="1">USERS</text>
        <text x={60} y={106} fill="#5a5a62" fontSize="7" fontFamily="JetBrains Mono, monospace" letterSpacing="1">EDGE</text>
        <text x={60} y={182} fill="#5a5a62" fontSize="7" fontFamily="JetBrains Mono, monospace" letterSpacing="1">COMPUTE</text>
        <text x={60} y={272} fill="#5a5a62" fontSize="7" fontFamily="JetBrains Mono, monospace" letterSpacing="1">DATA</text>

        {/* Scan line */}
        <rect x={0} y={0} width={600} height={1} fill="url(#lineFlow)" className="animate-scan-line" opacity="0.3" />
      </svg>

      {/* Floating stats overlay */}
      <div
        className="absolute top-[15%] right-[5%] glass rounded-xl px-3 py-2 border border-white/5 animate-float-slow"
        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 0.8s' }}
      >
        <p className="text-[10px] text-white/40 font-mono">RESPONSE</p>
        <p className="text-sm text-cream font-medium tabular-nums">8ms</p>
      </div>
      <div
        className="absolute bottom-[20%] left-[5%] glass rounded-xl px-3 py-2 border border-white/5 animate-float-slow-2"
        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 1s' }}
      >
        <p className="text-[10px] text-white/40 font-mono">THROUGHPUT</p>
        <p className="text-sm text-cream font-medium tabular-nums">12.4K/s</p>
      </div>
    </div>
  );
}
