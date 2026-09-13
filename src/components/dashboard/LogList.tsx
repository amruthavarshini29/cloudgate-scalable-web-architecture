import type { ApplicationLog } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { Info, AlertTriangle, Bug, XCircle } from 'lucide-react';

const levelConfig = {
  info: { icon: Info, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  warn: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  debug: { icon: Bug, color: 'text-white/40', bg: 'bg-white/5' },
};

export function LogList({ logs, loading, maxItems = 20 }: { logs: ApplicationLog[]; loading: boolean; maxItems?: number }) {
  return (
    <div className="bg-ink-900 rounded-2xl border border-white/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-cream">Activity Logs</h3>
        <span className="flex items-center gap-1.5 text-xs text-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>

      {loading ? (
        <div className="p-6 space-y-3 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
          {logs.slice(0, maxItems).map((log) => {
            const cfg = levelConfig[log.level];
            const Icon = cfg.icon;
            return (
              <div key={log.id} className="flex items-start gap-3 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-cream/80 leading-snug">{log.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] uppercase font-mono ${cfg.color}`}>{log.level}</span>
                    <span className="text-xs text-white/20">{log.source}</span>
                    <span className="text-xs text-white/20">{formatRelativeTime(log.created_at)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
