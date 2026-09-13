import { useCountUp } from '@/hooks/useCountUp';
import Reveal from '@/components/Reveal';

interface Stat {
  label: string;
  value: number | string;
  suffix?: string;
  isText?: boolean;
  color?: string;
}

export default function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
      {stats.map((stat, i) => (
        <StatCell key={i} stat={stat} index={i} />
      ))}
    </div>
  );
}

function StatCell({ stat, index }: { stat: Stat; index: number }) {
  const numValue = typeof stat.value === 'number' ? stat.value : 0;
  const { ref, value } = useCountUp(numValue);
  const displayValue = typeof stat.value === 'number' ? value.toLocaleString() : stat.value;

  return (
    <div className="relative bg-ink-900 p-6 group hover:bg-ink-850 transition-colors duration-500">
      <div className="absolute top-3 right-3 text-[10px] font-mono text-white/10">0{index + 1}</div>
      <p className="text-xs font-mono text-white/30 tracking-wider uppercase mb-3">{stat.label}</p>
      {stat.isText ? (
        <p className="text-2xl font-light text-cream flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${stat.color || 'bg-emerald-400'} animate-pulse`} />
          {stat.value}
        </p>
      ) : (
        <p ref={ref} className="text-3xl font-light text-cream tabular-nums tracking-tight">
          {displayValue}
          {stat.suffix && <span className="text-lg text-white/30 ml-1">{stat.suffix}</span>}
        </p>
      )}
    </div>
  );
}
