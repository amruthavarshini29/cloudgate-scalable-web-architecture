import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHealthChecks, useApplicationLogs, useDashboardMetrics } from '@/hooks/useDashboardData';
import DashboardSidebar, { Topbar } from '@/components/dashboard/DashboardSidebar';
import StatRow from '@/components/dashboard/StatRow';
import MiniChart from '@/components/dashboard/MiniChart';
import { ServiceList } from '@/components/dashboard/ServiceList';
import { LogList } from '@/components/dashboard/LogList';
import { Cpu, MemoryStick, HardDrive, Activity, Database, Shuffle, TrendingUp, Globe } from 'lucide-react';
import type { HealthCheck, ApplicationLog } from '@/types';

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('overview');
  const { healthChecks, loading: healthLoading } = useHealthChecks();
  const { logs, loading: logsLoading } = useApplicationLogs(50);
  const { metrics, trafficData } = useDashboardMetrics();

  const hc = healthChecks as HealthCheck[];
  const appLogs = logs as ApplicationLog[];

  return (
    <div className="relative min-h-screen bg-ink-950 flex">
      <DashboardSidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {activeView === 'overview' && <OverviewView metrics={metrics} trafficData={trafficData} healthChecks={hc} healthLoading={healthLoading} logs={appLogs} logsLoading={logsLoading} />}
          {activeView === 'infrastructure' && <InfrastructureView healthChecks={hc} loading={healthLoading} />}
          {activeView === 'servers' && <ServersView healthChecks={hc} loading={healthLoading} />}
          {activeView === 'load-balancer' && <LoadBalancerView healthChecks={hc} loading={healthLoading} />}
          {activeView === 'auto-scaling' && <AutoScalingView healthChecks={hc} loading={healthLoading} />}
          {activeView === 'database' && <DatabaseView healthChecks={hc} loading={healthLoading} />}
          {activeView === 'monitoring' && <MonitoringView metrics={metrics} trafficData={trafficData} />}
          {activeView === 'logs' && <LogsView logs={appLogs} loading={logsLoading} />}
          {activeView === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
}

// ─── Overview ───────────────────────────────────────────────
function OverviewView({ metrics, trafficData, healthChecks, healthLoading, logs, logsLoading }: {
  metrics: ReturnType<typeof useDashboardMetrics>['metrics'];
  trafficData: { time: string; requests: number; errors: number }[];
  healthChecks: HealthCheck[];
  healthLoading: boolean;
  logs: ApplicationLog[];
  logsLoading: boolean;
}) {
  const { profile } = useAuth();
  const chartData = trafficData.map((d) => ({ time: d.time, requests: d.requests }));

  return (
    <>
      <Topbar title={`Welcome back, ${profile?.full_name?.split(' ')[0] || 'Engineer'}`} subtitle="Real-time infrastructure overview" />

      {/* Health banner */}
      <div className="relative overflow-hidden bg-ink-900 border border-white/5 rounded-2xl p-6 mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze-700/5 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-8">
          <HealthGauge value={Math.round((metrics.healthyServices / Math.max(metrics.totalServices, 1)) * 100)} />
          <div>
            <h2 className="text-lg font-light text-cream">System Health</h2>
            <p className="text-sm text-white/40 mt-1">
              {metrics.healthyServices} of {metrics.totalServices} services operational
            </p>
            <div className="flex gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {metrics.healthyServices} Healthy
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {metrics.totalServices - metrics.healthyServices} Degraded
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <StatRow stats={[
          { label: 'Requests / sec', value: metrics.requestsPerSec },
          { label: 'Avg Response', value: metrics.avgResponseTime, suffix: 'ms' },
          { label: 'Error Rate', value: '0.02%', isText: true },
          { label: 'Connections', value: metrics.activeConnections },
        ]} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <MiniChart data={chartData} />
        </div>
        <ResourcePanel metrics={metrics} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ServiceList healthChecks={healthChecks} loading={healthLoading} title="Infrastructure Services" />
        <LogList logs={logs} loading={logsLoading} maxItems={8} />
      </div>
    </>
  );
}

function HealthGauge({ value }: { value: number }) {
  return (
    <div className="relative flex-shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#b8853f" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 264} 264`} className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-light text-cream">{value}%</span>
      </div>
    </div>
  );
}

function ResourcePanel({ metrics }: { metrics: ReturnType<typeof useDashboardMetrics>['metrics'] }) {
  return (
    <div className="bg-ink-900 rounded-2xl border border-white/5 p-6">
      <h3 className="text-sm font-medium text-cream mb-5">Resource Utilization</h3>
      <div className="space-y-4">
        <ResourceBar label="CPU Average" value={metrics.cpuAvg || 46} icon={Cpu} />
        <ResourceBar label="Memory" value={metrics.memoryAvg || 68} icon={MemoryStick} />
        <ResourceBar label="Storage" value={34} icon={HardDrive} />
        <ResourceBar label="Network I/O" value={62} icon={Activity} />
      </div>
      <div className="mt-5 pt-5 border-t border-white/5 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Uptime (30d)</span>
          <span className="text-cream">{metrics.uptime}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Total Requests</span>
          <span className="text-cream tabular-nums">{metrics.totalRequests.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function ResourceBar({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Cpu }) {
  const color = value > 75 ? 'from-red-500/60 to-amber-500/60' : value > 50 ? 'from-bronze-500/40 to-bronze-300/50' : 'from-bronze-700/30 to-bronze-400/40';
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-2 text-xs text-white/50">
          <Icon className="w-3.5 h-3.5 text-white/30" />
          {label}
        </span>
        <span className="text-xs text-cream tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// ─── Infrastructure ─────────────────────────────────────────
function InfrastructureView({ healthChecks, loading }: { healthChecks: HealthCheck[]; loading: boolean }) {
  return (
    <>
      <Topbar title="Infrastructure" subtitle="Complete system topology across all tiers" />
      <div className="bg-ink-900 rounded-2xl border border-white/5 p-8 mb-6">
        <div className="flex flex-col items-center gap-0 max-w-2xl mx-auto">
          {[
            { name: 'Users', service: 'Route 53', icon: Globe, status: 'healthy' },
            { name: 'Application Load Balancer', service: 'ALB', icon: Shuffle, status: 'healthy' },
            { name: 'Auto Scaling Group (3 EC2)', service: 'EC2 + ASG', icon: TrendingUp, status: 'healthy' },
            { name: 'PostgreSQL RDS', service: 'RDS', icon: Database, status: 'healthy' },
          ].map((tier, i, arr) => (
            <div key={tier.name} className="w-full flex flex-col items-center">
              <div className="w-full max-w-md flex items-center gap-4 p-4 rounded-xl bg-ink-850 border border-white/5 hover:border-bronze-500/20 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-bronze-500/10 flex items-center justify-center text-bronze-300 group-hover:bg-bronze-500/15 transition-colors">
                  <tier.icon className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-cream">{tier.name}</p>
                  <p className="text-xs text-white/30 font-mono">{tier.service}</p>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              {i < arr.length - 1 && (
                <div className="w-px h-6 bg-gradient-to-b from-white/10 to-white/5" />
              )}
            </div>
          ))}
        </div>
      </div>
      <ServiceList healthChecks={healthChecks} loading={loading} title="All Services" />
    </>
  );
}

// ─── Servers ────────────────────────────────────────────────
function ServersView({ healthChecks, loading }: { healthChecks: HealthCheck[]; loading: boolean }) {
  const servers = healthChecks.filter((c) => c.service_type === 'web_server');
  return (
    <>
      <Topbar title="Servers" subtitle="EC2 application servers across availability zones" />
      <div className="mb-6">
        <StatRow stats={[
          { label: 'Active Servers', value: 3 },
          { label: 'Avg CPU', value: 46, suffix: '%' },
          { label: 'Avg Memory', value: 68, suffix: '%' },
          { label: 'Total Storage', value: 240, suffix: 'GB' },
        ]} />
      </div>
      <ServiceList healthChecks={servers} loading={loading} title="EC2 Instances" />
    </>
  );
}

// ─── Load Balancer ──────────────────────────────────────────
function LoadBalancerView({ healthChecks, loading }: { healthChecks: HealthCheck[]; loading: boolean }) {
  const alb = healthChecks.filter((c) => c.service_type === 'load_balancer');
  return (
    <>
      <Topbar title="Load Balancer" subtitle="Application Load Balancer with health-based routing" />
      <div className="mb-6">
        <StatRow stats={[
          { label: 'Active Targets', value: 3 },
          { label: 'Healthy Hosts', value: 3 },
          { label: 'Unhealthy', value: 0 },
          { label: 'Avg Latency', value: 12, suffix: 'ms' },
        ]} />
      </div>
      <ServiceList healthChecks={alb} loading={loading} title="Load Balancer Status" />
    </>
  );
}

// ─── Auto Scaling ───────────────────────────────────────────
function AutoScalingView({ healthChecks, loading }: { healthChecks: HealthCheck[]; loading: boolean }) {
  const asg = healthChecks.filter((c) => c.service_type === 'web_server');
  return (
    <>
      <Topbar title="Auto Scaling" subtitle="Elastic capacity management across availability zones" />
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-ink-900 rounded-2xl border border-white/5 p-6 text-center">
          <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-2">Min</p>
          <p className="text-4xl font-light text-cream">2</p>
        </div>
        <div className="bg-ink-900 rounded-2xl border border-bronze-500/20 p-6 text-center">
          <p className="text-xs font-mono text-bronze-400 uppercase tracking-wider mb-2">Desired</p>
          <p className="text-4xl font-light text-bronze-300">3</p>
        </div>
        <div className="bg-ink-900 rounded-2xl border border-white/5 p-6 text-center">
          <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-2">Max</p>
          <p className="text-4xl font-light text-cream">5</p>
        </div>
      </div>
      <ServiceList healthChecks={asg} loading={loading} title="Scaling Group Instances" />
    </>
  );
}

// ─── Database ───────────────────────────────────────────────
function DatabaseView({ healthChecks, loading }: { healthChecks: HealthCheck[]; loading: boolean }) {
  const db = healthChecks.filter((c) => c.service_type === 'database');
  const cache = healthChecks.filter((c) => c.service_type === 'cache');
  return (
    <>
      <Topbar title="Database" subtitle="PostgreSQL RDS and ElastiCache status" />
      <div className="mb-6">
        <StatRow stats={[
          { label: 'Connections', value: 70, suffix: '/100' },
          { label: 'Storage Used', value: 34, suffix: '%' },
          { label: 'Replica Lag', value: 3, suffix: 'ms' },
          { label: 'Cache Hit Rate', value: '94.2%', isText: true },
        ]} />
      </div>
      <ServiceList healthChecks={[...db, ...cache]} loading={loading} title="Data Tier Services" />
    </>
  );
}

// ─── Monitoring ─────────────────────────────────────────────
function MonitoringView({ metrics, trafficData }: {
  metrics: ReturnType<typeof useDashboardMetrics>['metrics'];
  trafficData: { time: string; requests: number; errors: number }[];
}) {
  const chartData = trafficData.map((d) => ({ time: d.time, requests: d.requests }));
  return (
    <>
      <Topbar title="Monitoring" subtitle="CloudWatch metrics and system health" />
      <div className="mb-6">
        <StatRow stats={[
          { label: 'Requests / sec', value: metrics.requestsPerSec },
          { label: 'Avg Response', value: metrics.avgResponseTime, suffix: 'ms' },
          { label: 'Error Rate', value: '0.02%', isText: true },
          { label: 'P99 Latency', value: 120, suffix: 'ms' },
        ]} />
      </div>
      <MiniChart data={chartData} />
    </>
  );
}

// ─── Logs ───────────────────────────────────────────────────
function LogsView({ logs, loading }: { logs: ApplicationLog[]; loading: boolean }) {
  return (
    <>
      <Topbar title="Logs" subtitle="Real-time application and infrastructure events" />
      <LogList logs={logs} loading={loading} maxItems={50} />
    </>
  );
}

// ─── Settings ───────────────────────────────────────────────
function SettingsView() {
  const { profile } = useAuth();
  return (
    <>
      <Topbar title="Settings" subtitle="Account and configuration preferences" />

      <div className="space-y-6 max-w-2xl">
        {/* Profile */}
        <div className="bg-ink-900 rounded-2xl border border-white/5 p-6">
          <h3 className="text-sm font-medium text-cream mb-5">Profile</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-bronze-400 to-bronze-700 flex items-center justify-center text-ink-950 text-xl font-semibold">
              {(profile?.full_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-base font-medium text-cream">{profile?.full_name || 'User'}</p>
              <p className="text-sm text-white/40 capitalize">{profile?.role || 'viewer'}</p>
            </div>
          </div>
          <div className="space-y-4">
            <SettingRow label="Full Name" value={profile?.full_name || ''} />
            <SettingRow label="Role" value={profile?.role || 'viewer'} />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-ink-900 rounded-2xl border border-white/5 p-6">
          <h3 className="text-sm font-medium text-cream mb-5">Notifications</h3>
          <div className="space-y-3">
            {[
              { label: 'CPU threshold alerts', desc: 'Notify when CPU exceeds 80%' },
              { label: 'Database connection alerts', desc: 'Notify when connections exceed 80%' },
              { label: 'Error rate spikes', desc: 'Notify when error rate exceeds 1%' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-cream">{item.label}</p>
                  <p className="text-xs text-white/30">{item.desc}</p>
                </div>
                <Toggle defaultOn />
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-ink-900 rounded-2xl border border-white/5 p-6">
          <h3 className="text-sm font-medium text-cream mb-5">Security</h3>
          <div className="space-y-4">
            <SettingRow label="Region" value="us-east-1" />
            <SettingRow label="Availability Zones" value="3 (a, b, c)" />
            <SettingRow label="Encryption at Rest" value="Enabled (KMS)" />
            <SettingRow label="TLS Version" value="1.3" />
          </div>
        </div>
      </div>
    </>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm text-cream capitalize">{value}</span>
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`w-9 h-5 rounded-full transition-colors relative ${on ? 'bg-bronze-500/40' : 'bg-white/10'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-cream transition-all ${on ? 'left-4' : 'left-0.5'}`} />
    </button>
  );
}
