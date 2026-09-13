import { useCountUp } from '@/hooks/useCountUp';
import Reveal from '@/components/Reveal';

interface Metric {
  label: string;
  value: string;
  suffix?: string;
  isText?: boolean;
}

const metrics: Metric[] = [
  { label: 'System Health', value: '99.9', suffix: '%' },
  { label: 'Active Servers', value: '6' },
  { label: 'Requests / min', value: '12480' },
  { label: 'Database', value: 'Healthy', isText: true },
  { label: 'Load Balancer', value: 'Healthy', isText: true },
  { label: 'Auto Scaling', value: 'Enabled', isText: true },
];

function MetricItem({ metric, index }: { metric: Metric; index: number }) {
  const numValue = parseInt(metric.value);
  const { ref, value } = useCountUp(isNaN(numValue) ? 0 : numValue);

  return (
    <div className="relative py-8 px-6 border-b border-white/5 last:border-b-0 sm:border-b-0 sm:border-r last:sm:border-r-0 group">
      <div className="absolute inset-0 bg-gradient-to-b from-bronze-700/0 to-bronze-700/0 group-hover:from-bronze-700/5 transition-all duration-700 rounded-lg" />
      <div className="relative">
        <p className="text-xs font-mono text-white/30 tracking-wider uppercase mb-3">{metric.label}</p>
        {metric.isText ? (
          <p className="text-2xl font-light text-cream flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {metric.value}
          </p>
        ) : (
          <p ref={ref} className="text-3xl sm:text-4xl font-light text-cream tabular-nums tracking-tight">
            {value.toLocaleString()}
            {metric.suffix && <span className="text-lg text-white/40 ml-1">{metric.suffix}</span>}
          </p>
        )}
      </div>
      {/* Subtle number watermark */}
      {!metric.isText && (
        <span className="absolute top-2 right-3 text-xs font-mono text-white/5">0{index + 1}</span>
      )}
    </div>
  );
}

export default function CloudControlSection() {
  return (
    <section id="products" className="relative py-24 lg:py-40">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="text-xs font-mono text-bronze-400 tracking-[0.2em] uppercase mb-4">Cloud Control</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-cream leading-tight text-balance">
            Real-time visibility,
            <br />
            <span className="font-display italic text-bronze-300">at your fingertips.</span>
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <div className="relative max-w-4xl mx-auto">
            {/* Ambient glow */}
            <div className="absolute -inset-4 bg-gradient-to-b from-bronze-700/5 to-transparent rounded-3xl blur-2xl" />

            {/* Dashboard preview frame */}
            <div className="relative glass rounded-2xl border border-white/10 overflow-hidden glow-soft">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 ml-3">
                  <div className="h-5 rounded-md bg-white/5 max-w-xs" />
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {metrics.map((m, i) => (
                  <MetricItem key={m.label} metric={m} index={i} />
                ))}
              </div>

              {/* Mini chart area */}
              <div className="p-6 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-mono text-white/30 tracking-wider uppercase">Traffic Overview</p>
                  <p className="text-xs text-white/20">Last 60 min</p>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[40, 55, 35, 70, 45, 80, 60, 90, 50, 75, 65, 85, 45, 60, 70, 50, 80, 55, 90, 65].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-bronze-700/20 to-bronze-400/30 rounded-t-sm transition-all duration-700 hover:from-bronze-700/40 hover:to-bronze-300/50"
                      style={{ height: `${h}%`, transitionDelay: `${i * 30}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
