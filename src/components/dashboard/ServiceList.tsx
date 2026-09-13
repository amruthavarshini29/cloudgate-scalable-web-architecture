import type { HealthCheck } from '@/types';
import { Server, Globe, Database, Shuffle, Zap, Activity, Cpu, MemoryStick } from 'lucide-react';

const typeIcons: Record<string, typeof Server> = {
  web_server: Server,
  api: Globe,
  database: Database,
  load_balancer: Shuffle,
  cache: Zap,
  monitoring: Activity,
};

export function ServiceList({ healthChecks, loading, title }: { healthChecks: HealthCheck[]; loading: boolean; title?: string }) {
  const latest = new Map<string, HealthCheck>();
  for (const c of healthChecks) {
    if (!latest.has(c.service_name)) latest.set(c.service_name, c);
  }
  const services = Array.from(latest.values());

  return (
    <div className="bg-ink-900 rounded-2xl border border-white/5 overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-medium text-cream">{title}</h3>
        </div>
      )}

      {loading ? (
        <div className="p-6 space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {services.map((service) => {
            const Icon = typeIcons[service.service_type] || Server;
            const isHealthy = service.status === 'healthy';
            const details = service.details as Record<string, unknown> | null;
            const cpu = details?.cpu as number | undefined;
            const memory = details?.memory as number | undefined;
            const statusColor = isHealthy ? 'text-emerald-400' : 'text-amber-400';
            const dotColor = isHealthy ? 'bg-emerald-400' : 'bg-amber-400';

            return (
              <div key={service.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-4 h-4 ${statusColor}`} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cream truncate">{service.service_name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-white/30">{service.response_time_ms}ms</span>
                    {typeof cpu === 'number' && (
                      <span className="flex items-center gap-1 text-xs text-white/30">
                        <Cpu className="w-3 h-3" /> {cpu}%
                      </span>
                    )}
                    {typeof memory === 'number' && (
                      <span className="flex items-center gap-1 text-xs text-white/30">
                        <MemoryStick className="w-3 h-3" /> {memory}%
                      </span>
                    )}
                    {typeof details?.region === 'string' && (
                      <span className="text-xs text-white/30">{details.region}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs ${statusColor}`}>{isHealthy ? 'Healthy' : 'Degraded'}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${isHealthy ? 'animate-pulse' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
