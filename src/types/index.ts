export type LogLevel = 'info' | 'warn' | 'error' | 'debug';
export type ServiceType = 'web_server' | 'api' | 'database' | 'load_balancer' | 'cache' | 'monitoring';
export type HealthStatus = 'healthy' | 'degraded' | 'down';
export type UserRole = 'admin' | 'engineer' | 'viewer';

export interface User {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface ApplicationLog {
  id: string;
  level: LogLevel;
  message: string;
  source: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface HealthCheck {
  id: string;
  service_name: string;
  service_type: ServiceType;
  status: HealthStatus;
  response_time_ms: number;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface ServiceStatus {
  name: string;
  type: ServiceType;
  status: HealthStatus;
  responseTimeMs: number;
  cpu?: number;
  memory?: number;
  uptime?: string;
  region?: string;
  details?: Record<string, unknown>;
}
