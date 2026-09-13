interface MiniChartProps {
  data: { time: string; requests: number }[];
}

export default function MiniChart({ data }: MiniChartProps) {
  const max = Math.max(...data.map((d) => d.requests), 1);

  return (
    <div className="relative bg-ink-900 rounded-2xl border border-white/5 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-cream">Traffic Overview</h3>
          <p className="text-xs text-white/30 mt-0.5">Requests per 5-minute interval</p>
        </div>
        <span className="text-xs font-mono text-white/20">Last 60 min</span>
      </div>

      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center group">
            <div className="w-full relative flex justify-center" style={{ height: '100%' }}>
              <div
                className="w-full max-w-[20px] bg-gradient-to-t from-bronze-700/15 to-bronze-400/25 rounded-t-sm transition-all duration-500 group-hover:from-bronze-700/30 group-hover:to-bronze-300/40"
                style={{ height: `${(d.requests / max) * 90}%`, marginTop: 'auto', alignSelf: 'flex-end' }}
              />
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <span className="text-[10px] font-mono text-white/60 bg-ink-800 px-2 py-1 rounded">{d.requests.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-3">
        <span className="text-[10px] font-mono text-white/20">{data[0]?.time}</span>
        <span className="text-[10px] font-mono text-white/20">{data[data.length - 1]?.time}</span>
      </div>
    </div>
  );
}
