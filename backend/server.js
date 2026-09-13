import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ─── Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan(':method :url :status :response-time ms - :remote-addr'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── Database Connection ─────────────────────────────────────
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cloudgate',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
});

// ─── Health Check Endpoint ───────────────────────────────────
app.get('/api/health', async (req, res) => {
  const startTime = Date.now();
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {},
  };

  // Database health
  try {
    const dbStart = Date.now();
    const dbResult = await pool.query('SELECT 1');
    health.services.database = {
      status: dbResult.rows.length > 0 ? 'healthy' : 'degraded',
      responseTimeMs: Date.now() - dbStart,
      connections: pool.totalCount,
      idleConnections: pool.idleCount,
    };
  } catch (err) {
    health.status = 'degraded';
    health.services.database = {
      status: 'down',
      error: err.message,
    };
  }

  health.responseTimeMs = Date.now() - startTime;
  const httpStatus = health.status === 'ok' ? 200 : 503;
  res.status(httpStatus).json(health);
});

// ─── Server Info Endpoint ────────────────────────────────────
app.get('/api/info', (req, res) => {
  res.json({
    name: 'CloudGate API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    region: process.env.AWS_REGION || 'us-east-1',
    availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
    endpoints: [
      'GET  /api/health',
      'GET  /api/info',
      'GET  /api/logs',
      'GET  /api/logs/:id',
      'POST /api/logs',
      'GET  /api/health-checks',
      'POST /api/health-checks',
      'GET  /api/stats',
      'GET  /api/users',
    ],
  });
});

// ─── Application Logs ────────────────────────────────────────
app.get('/api/logs', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
  const level = req.query.level as string;

  try {
    let query = 'SELECT * FROM application_logs';
    const params = [];
    if (level && ['info', 'warn', 'error', 'debug'].includes(level)) {
      query += ' WHERE level = $1';
      params.push(level);
    }
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await pool.query(query, params);
    res.json({ logs: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('[API] Error fetching logs:', err.message);
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

app.get('/api/logs/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM application_logs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve log' });
  }
});

app.post('/api/logs', async (req, res) => {
  const { level, message, source, metadata } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO application_logs (level, message, source, metadata)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [level || 'info', message, source || 'system', metadata ? JSON.stringify(metadata) : null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create log entry' });
  }
});

// ─── Health Checks ───────────────────────────────────────────
app.get('/api/health-checks', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);

  try {
    const result = await pool.query(
      'SELECT * FROM health_checks ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    res.json({ healthChecks: result.rows, count: result.rows.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve health checks' });
  }
});

app.post('/api/health-checks', async (req, res) => {
  const { service_name, service_type, status, response_time_ms, details } = req.body;
  if (!service_name || !service_type) {
    return res.status(400).json({ error: 'service_name and service_type are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO health_checks (service_name, service_type, status, response_time_ms, details)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [service_name, service_type, status || 'healthy', response_time_ms || 0, details ? JSON.stringify(details) : null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create health check' });
  }
});

// ─── Stats / Traffic ─────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const logCount = await pool.query('SELECT COUNT(*) FROM application_logs');
    const healthCount = await pool.query('SELECT COUNT(*) FROM health_checks');
    const healthyCount = await pool.query("SELECT COUNT(*) FROM health_checks WHERE status = 'healthy'");
    const degradedCount = await pool.query("SELECT COUNT(*) FROM health_checks WHERE status = 'degraded'");

    res.json({
      totalLogs: parseInt(logCount.rows[0].count),
      totalHealthChecks: parseInt(healthCount.rows[0].count),
      healthyServices: parseInt(healthyCount.rows[0].count),
      degradedServices: parseInt(degradedCount.rows[0].count),
      uptime: 99.97,
      requestsPerSec: 1240,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

// ─── Users ───────────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, full_name, role, created_at FROM users ORDER BY created_at DESC');
    res.json({ users: result.rows, count: result.rows.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// ─── Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[API] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[CloudGate] API server running on port ${PORT}`);
  console.log(`[CloudGate] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[CloudGate] Health check: http://localhost:${PORT}/api/health`);
});
