-- ============================================================
-- CloudGate Database Schema
-- PostgreSQL / RDS compatible
-- ============================================================

-- Users table (application-level profiles)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL DEFAULT '',
    role VARCHAR(20) NOT NULL DEFAULT 'viewer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Application logs table
CREATE TABLE IF NOT EXISTS application_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(10) NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'system',
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Health checks table
CREATE TABLE IF NOT EXISTS health_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'healthy',
    response_time_ms INTEGER NOT NULL DEFAULT 0,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_application_logs_created_at ON application_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_application_logs_level ON application_logs (level);
CREATE INDEX IF NOT EXISTS idx_health_checks_created_at ON health_checks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_checks_service_type ON health_checks (service_type);

-- ============================================================
-- Sample Data
-- ============================================================

INSERT INTO health_checks (service_name, service_type, status, response_time_ms, details, created_at) VALUES
    ('Web Server 01', 'web_server', 'healthy', 45, '{"cpu": 32, "memory": 58, "uptime": "99.98%", "region": "us-east-1a"}', NOW() - INTERVAL '1 minute'),
    ('Web Server 02', 'web_server', 'healthy', 52, '{"cpu": 28, "memory": 61, "uptime": "99.97%", "region": "us-east-1b"}', NOW() - INTERVAL '2 minutes'),
    ('Web Server 03', 'web_server', 'degraded', 180, '{"cpu": 78, "memory": 84, "uptime": "99.92%", "region": "us-east-1c"}', NOW() - INTERVAL '3 minutes'),
    ('Application Load Balancer', 'load_balancer', 'healthy', 12, '{"active_targets": 3, "healthy_hosts": 3, "unhealthy_hosts": 0}', NOW() - INTERVAL '1 minute'),
    ('REST API Gateway', 'api', 'healthy', 89, '{"requests_per_sec": 1240, "error_rate": 0.02, "p99_latency": 120}', NOW() - INTERVAL '1 minute'),
    ('Auth Service', 'api', 'healthy', 34, '{"requests_per_sec": 340, "error_rate": 0.01, "p99_latency": 65}', NOW() - INTERVAL '2 minutes'),
    ('PostgreSQL RDS Primary', 'database', 'healthy', 8, '{"connections": 42, "max_connections": 100, "storage_used_pct": 34}', NOW() - INTERVAL '1 minute'),
    ('PostgreSQL RDS Read Replica', 'database', 'healthy', 11, '{"connections": 28, "replication_lag_ms": 3}', NOW() - INTERVAL '2 minutes'),
    ('ElastiCache Redis', 'cache', 'healthy', 2, '{"hit_rate": 94.2, "memory_used": 1.2, "evictions": 0}', NOW() - INTERVAL '1 minute'),
    ('CloudWatch Monitor', 'monitoring', 'healthy', 5, '{"alarms": 1, "alerts": 0}', NOW() - INTERVAL '1 minute')
ON CONFLICT DO NOTHING;

INSERT INTO application_logs (level, message, source, metadata, created_at) VALUES
    ('info', 'Auto Scaling Group launched new instance i-0abc123 in us-east-1a', 'autoscaling', '{"instance_id": "i-0abc123", "desired_capacity": 3}', NOW() - INTERVAL '5 minutes'),
    ('info', 'Health check passed for all EC2 targets in ALB', 'load_balancer', '{"healthy_hosts": 3}', NOW() - INTERVAL '10 minutes'),
    ('warn', 'Web Server 03 CPU usage exceeded 75% threshold', 'cloudwatch', '{"instance": "i-0def456", "cpu": 78}', NOW() - INTERVAL '15 minutes'),
    ('info', 'Database connection pool initialized with 42 connections', 'database', '{"pool_size": 42, "max": 100}', NOW() - INTERVAL '20 minutes'),
    ('error', 'Failed login attempt from IP 203.0.113.42', 'auth_service', '{"ip": "203.0.113.42", "attempts": 3}', NOW() - INTERVAL '25 minutes'),
    ('info', 'API request rate: 1,240 req/sec (within normal range)', 'api_gateway', '{"rps": 1240, "p99": 120}', NOW() - INTERVAL '30 minutes'),
    ('debug', 'Cache hit ratio for Redis cluster: 94.2%', 'cache', '{"hit_rate": 94.2}', NOW() - INTERVAL '35 minutes'),
    ('info', 'SSL certificate renewed for api.cloudgate.io', 'ssl_manager', '{"domain": "api.cloudgate.io", "expiry": "2026-12-13"}', NOW() - INTERVAL '40 minutes'),
    ('warn', 'Read replica lag detected: 3ms (threshold: 5ms)', 'database', '{"replica": "rds-read-01", "lag_ms": 3}', NOW() - INTERVAL '45 minutes'),
    ('info', 'Deployment v2.4.1 rolled out successfully to 3 instances', 'deployment', '{"version": "2.4.1", "instances": 3}', NOW() - INTERVAL '50 minutes'),
    ('error', 'Web Server 03 failed health check (timeout after 5000ms)', 'load_balancer', '{"target": "i-0def456", "timeout": 5000}', NOW() - INTERVAL '55 minutes'),
    ('info', 'Bastion host SSH session opened by admin@cloudgate.io', 'bastion', '{"user": "admin", "session_id": "sess-789"}', NOW() - INTERVAL '60 minutes'),
    ('info', 'Security Group sg-prod-web updated: port 443 rule added', 'security', '{"sg_id": "sg-prod-web", "port": 443}', NOW() - INTERVAL '70 minutes'),
    ('debug', 'Request trace: GET /api/health completed in 8ms', 'api_gateway', '{"method": "GET", "path": "/api/health", "duration_ms": 8}', NOW() - INTERVAL '75 minutes'),
    ('warn', 'Auto Scaling Group approaching max capacity (3/5)', 'autoscaling', '{"current": 3, "max": 5}', NOW() - INTERVAL '80 minutes')
ON CONFLICT DO NOTHING;
