import type { HealthStatus, LogLevel } from '@/types';

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export const statusColors: Record<HealthStatus, { bg: string; text: string; dot: string; border: string; label: string }> = {
  healthy: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500',
    border: 'border-emerald-500/20',
    label: 'Healthy',
  },
  degraded: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    dot: 'bg-amber-500',
    border: 'border-amber-500/20',
    label: 'Degraded',
  },
  down: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    dot: 'bg-red-500',
    border: 'border-red-500/20',
    label: 'Down',
  },
};

export const logLevelColors: Record<LogLevel, { bg: string; text: string; border: string }> = {
  info: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
  warn: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  error: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  debug: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
};

export const serviceTypeIcons: Record<string, string> = {
  web_server: 'server',
  api: 'globe',
  database: 'database',
  load_balancer: 'shuffle',
  cache: 'zap',
  monitoring: 'activity',
};
