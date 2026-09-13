/*
# CloudGate - Initial Schema

## Overview
Creates the core database tables for the CloudGate scalable web architecture monitoring dashboard.

## New Tables

### users
- Profile table linked to Supabase Auth
- `id` (uuid, PK, references auth.users)
- `full_name` (text) - display name
- `role` (text) - user role (admin, engineer, viewer)
- `avatar_url` (text, nullable)
- `created_at` (timestamptz)

### application_logs
- `id` (uuid, PK)
- `level` (text) - info, warn, error, debug
- `message` (text) - log message
- `source` (text) - source service/component
- `metadata` (jsonb, nullable)
- `created_at` (timestamptz)

### health_checks
- `id` (uuid, PK)
- `service_name` (text)
- `service_type` (text) - web_server, api, database, load_balancer, cache
- `status` (text) - healthy, degraded, down
- `response_time_ms` (integer)
- `details` (jsonb, nullable)
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables
- Users: authenticated can read all profiles, insert/update own
- Application logs: authenticated can read and insert
- Health checks: authenticated can read and insert

## Sample Data
- Demo health check records for web servers, API, database, load balancer, cache
- Demo application log entries covering various levels and sources
*/

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'viewer',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_profiles" ON users;
CREATE POLICY "select_all_profiles" ON users FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_profile" ON users;
CREATE POLICY "insert_own_profile" ON users FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON users;
CREATE POLICY "update_own_profile" ON users FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ==================== APPLICATION_LOGS TABLE ====================
CREATE TABLE IF NOT EXISTS application_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL DEFAULT 'info',
  message text NOT NULL,
  source text NOT NULL DEFAULT 'system',
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE application_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_logs" ON application_logs;
CREATE POLICY "select_logs" ON application_logs FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_logs" ON application_logs;
CREATE POLICY "insert_logs" ON application_logs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "delete_logs" ON application_logs;
CREATE POLICY "delete_logs" ON application_logs FOR DELETE
  TO authenticated USING (true);

-- ==================== HEALTH_CHECKS TABLE ====================
CREATE TABLE IF NOT EXISTS health_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  service_type text NOT NULL,
  status text NOT NULL DEFAULT 'healthy',
  response_time_ms integer NOT NULL DEFAULT 0,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_health_checks" ON health_checks;
CREATE POLICY "select_health_checks" ON health_checks FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_health_checks" ON health_checks;
CREATE POLICY "insert_health_checks" ON health_checks FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "delete_health_checks" ON health_checks;
CREATE POLICY "delete_health_checks" ON health_checks FOR DELETE
  TO authenticated USING (true);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_application_logs_created_at ON application_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_application_logs_level ON application_logs (level);
CREATE INDEX IF NOT EXISTS idx_health_checks_created_at ON health_checks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_checks_service_type ON health_checks (service_type);

-- ==================== SAMPLE DATA: HEALTH CHECKS ====================
INSERT INTO health_checks (service_name, service_type, status, response_time_ms, details, created_at) VALUES
  ('Web Server 01', 'web_server', 'healthy', 45, '{"cpu": 32, "memory": 58, "uptime": "99.98%", "region": "us-east-1a"}', now() - interval '1 minute'),
  ('Web Server 02', 'web_server', 'healthy', 52, '{"cpu": 28, "memory": 61, "uptime": "99.97%", "region": "us-east-1b"}', now() - interval '2 minutes'),
  ('Web Server 03', 'web_server', 'degraded', 180, '{"cpu": 78, "memory": 84, "uptime": "99.92%", "region": "us-east-1c"}', now() - interval '3 minutes'),
  ('Application Load Balancer', 'load_balancer', 'healthy', 12, '{"active_targets": 3, "healthy_hosts": 3, "unhealthy_hosts": 0}', now() - interval '1 minute'),
  ('REST API Gateway', 'api', 'healthy', 89, '{"requests_per_sec": 1240, "error_rate": 0.02, "p99_latency": 120}', now() - interval '1 minute'),
  ('Auth Service', 'api', 'healthy', 34, '{"requests_per_sec": 340, "error_rate": 0.01, "p99_latency": 65}', now() - interval '2 minutes'),
  ('PostgreSQL RDS Primary', 'database', 'healthy', 8, '{"connections": 42, "max_connections": 100, "storage_used_pct": 34}', now() - interval '1 minute'),
  ('PostgreSQL RDS Read Replica', 'database', 'healthy', 11, '{"connections": 28, "replication_lag_ms": 3}', now() - interval '2 minutes'),
  ('ElastiCache Redis', 'cache', 'healthy', 2, '{"hit_rate": 94.2, "memory_used": 1.2, "evictions": 0}', now() - interval '1 minute'),
  ('CloudWatch Monitor', 'monitoring', 'healthy', 5, '{"alarms": 1, "alerts": 0}', now() - interval '1 minute')
ON CONFLICT DO NOTHING;

-- ==================== SAMPLE DATA: APPLICATION LOGS ====================
INSERT INTO application_logs (level, message, source, metadata, created_at) VALUES
  ('info', 'Auto Scaling Group launched new instance i-0abc123 in us-east-1a', 'autoscaling', '{"instance_id": "i-0abc123", "desired_capacity": 3}', now() - interval '5 minutes'),
  ('info', 'Health check passed for all EC2 targets in ALB', 'load_balancer', '{"healthy_hosts": 3}', now() - interval '10 minutes'),
  ('warn', 'Web Server 03 CPU usage exceeded 75% threshold', 'cloudwatch', '{"instance": "i-0def456", "cpu": 78}', now() - interval '15 minutes'),
  ('info', 'Database connection pool initialized with 42 connections', 'database', '{"pool_size": 42, "max": 100}', now() - interval '20 minutes'),
  ('error', 'Failed login attempt from IP 203.0.113.42', 'auth_service', '{"ip": "203.0.113.42", "attempts": 3}', now() - interval '25 minutes'),
  ('info', 'API request rate: 1,240 req/sec (within normal range)', 'api_gateway', '{"rps": 1240, "p99": 120}', now() - interval '30 minutes'),
  ('debug', 'Cache hit ratio for Redis cluster: 94.2%', 'cache', '{"hit_rate": 94.2}', now() - interval '35 minutes'),
  ('info', 'SSL certificate renewed for api.cloudgate.io', 'ssl_manager', '{"domain": "api.cloudgate.io", "expiry": "2026-12-13"}', now() - interval '40 minutes'),
  ('warn', 'Read replica lag detected: 3ms (threshold: 5ms)', 'database', '{"replica": "rds-read-01", "lag_ms": 3}', now() - interval '45 minutes'),
  ('info', 'Deployment v2.4.1 rolled out successfully to 3 instances', 'deployment', '{"version": "2.4.1", "instances": 3}', now() - interval '50 minutes'),
  ('error', 'Web Server 03 failed health check (timeout after 5000ms)', 'load_balancer', '{"target": "i-0def456", "timeout": 5000}', now() - interval '55 minutes'),
  ('info', 'Bastion host SSH session opened by admin@cloudgate.io', 'bastion', '{"user": "admin", "session_id": "sess-789"}', now() - interval '60 minutes'),
  ('info', 'Security Group sg-prod-web updated: port 443 rule added', 'security', '{"sg_id": "sg-prod-web", "port": 443}', now() - interval '70 minutes'),
  ('debug', 'Request trace: GET /api/health completed in 8ms', 'api_gateway', '{"method": "GET", "path": "/api/health", "duration_ms": 8}', now() - interval '75 minutes'),
  ('warn', 'Auto Scaling Group approaching max capacity (3/5)', 'autoscaling', '{"current": 3, "max": 5}', now() - interval '80 minutes')
ON CONFLICT DO NOTHING;