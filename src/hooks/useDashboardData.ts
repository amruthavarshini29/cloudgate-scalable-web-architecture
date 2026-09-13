import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { HealthCheck, ApplicationLog } from '@/types';

export function useHealthChecks(refreshInterval = 30000) {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthChecks = useCallback(async () => {
    const { data, error } = await supabase
      .from('health_checks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      setError(error.message);
    } else {
      setHealthChecks(data as HealthCheck[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHealthChecks();
    const interval = setInterval(fetchHealthChecks, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchHealthChecks, refreshInterval]);

  return { healthChecks, loading, error, refetch: fetchHealthChecks };
}

export function useApplicationLogs(limit = 20, refreshInterval = 15000) {
  const [logs, setLogs] = useState<ApplicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    const { data, error } = await supabase
      .from('application_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      setError(error.message);
    } else {
      setLogs(data as ApplicationLog[]);
      setError(null);
    }
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchLogs, refreshInterval]);

  return { logs, loading, error, refetch: fetchLogs };
}

export interface DashboardMetrics {
  totalRequests: number;
  requestsPerSec: number;
  avgResponseTime: number;
  errorRate: number;
  uptime: number;
  activeConnections: number;
  healthyServices: number;
  totalServices: number;
  cpuAvg: number;
  memoryAvg: number;
}

export function useDashboardMetrics(refreshInterval = 30000) {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRequests: 0,
    requestsPerSec: 0,
    avgResponseTime: 0,
    errorRate: 0,
    uptime: 99.97,
    activeConnections: 0,
    healthyServices: 0,
    totalServices: 0,
    cpuAvg: 0,
    memoryAvg: 0,
  });
  const [trafficData, setTrafficData] = useState<{ time: string; requests: number; errors: number }[]>([]);

  useEffect(() => {
    const computeMetrics = async () => {
      const { data: healthData } = await supabase
        .from('health_checks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (healthData && healthData.length > 0) {
        const checks = healthData as HealthCheck[];
        const healthy = checks.filter((c) => c.status === 'healthy').length;
        const total = checks.length;

        const apiChecks = checks.filter((c) => c.service_type === 'api');
        const avgRt = apiChecks.length > 0
          ? Math.round(apiChecks.reduce((sum, c) => sum + c.response_time_ms, 0) / apiChecks.length)
          : 0;

        const webServers = checks.filter((c) => c.service_type === 'web_server');
        const cpuAvg = webServers.length > 0
          ? Math.round(webServers.reduce((sum, c) => sum + (c.details?.cpu as number || 0), 0) / webServers.length)
          : 0;
        const memAvg = webServers.length > 0
          ? Math.round(webServers.reduce((sum, c) => sum + (c.details?.memory as number || 0), 0) / webServers.length)
          : 0;

        const dbChecks = checks.filter((c) => c.service_type === 'database');
        const connections = dbChecks.reduce((sum, c) => sum + (c.details?.connections as number || 0), 0);

        setMetrics({
          totalRequests: 4_872_340,
          requestsPerSec: 1240,
          avgResponseTime: avgRt,
          errorRate: 0.02,
          uptime: 99.97,
          activeConnections: connections,
          healthyServices: healthy,
          totalServices: total,
          cpuAvg,
          memoryAvg: memAvg,
        });
      }

      // Generate traffic data (last 12 intervals)
      const now = new Date();
      const traffic: { time: string; requests: number; errors: number }[] = [];
      for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5 * 60 * 1000);
        const base = 1200 + Math.sin(i * 0.5) * 300;
        const requests = Math.round(base + Math.random() * 200);
        const errors = Math.round(requests * 0.001 + Math.random() * 3);
        traffic.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          requests,
          errors,
        });
      }
      setTrafficData(traffic);
    };

    computeMetrics();
    const interval = setInterval(computeMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { metrics, trafficData };
}
