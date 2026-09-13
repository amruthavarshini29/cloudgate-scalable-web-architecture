# CloudGate — Scalable Web Architecture

A production-grade cloud infrastructure monitoring dashboard demonstrating a scalable 3-tier AWS architecture. Built as a portfolio project to showcase full-stack development, cloud engineering, and DevOps practices.

![CloudGate](https://img.shields.io/badge/CloudGate-v2.4.1-sky)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/Node.js-20-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## Project Overview

CloudGate is a real-time infrastructure monitoring dashboard for a distributed web application. It provides visibility into application health, server status, API performance, database connectivity, and traffic analytics — all through a polished, cloud-engineering style interface.

The application itself is a working demonstration of the architecture it monitors: a React frontend, Node.js/Express backend API, and PostgreSQL database, all containerized with Docker and designed for AWS deployment.

## Features

### Frontend Dashboard
- **Real-time health monitoring** — Live status of all infrastructure services
- **Server status tracking** — CPU, memory, uptime per EC2 instance
- **API response metrics** — Request rate, latency, error rate, P99
- **Database connection status** — Active connections, storage, replication lag
- **Traffic analytics** — Request volume charts with error overlay
- **Activity log streaming** — Real-time application and infrastructure logs
- **System health overview** — Visual health gauge with service breakdown
- **AWS architecture diagram** — Interactive visual of the 3-tier architecture
- **Responsive design** — Optimized for desktop, tablet, and mobile
- **Authentication** — Secure login with Supabase Auth

### Backend API
- **REST API** with Express.js
- **Health check endpoint** (`/api/health`) — Used by ALB and CloudWatch
- **Server info endpoint** (`/api/info`) — Runtime metadata
- **Application logs API** — Full CRUD for log entries
- **Health checks API** — Service health records
- **Statistics endpoint** — Aggregated dashboard metrics
- **Request logging** with Morgan
- **Rate limiting** with express-rate-limit
- **Security headers** with Helmet
- **CORS configuration**
- **Error handling middleware**

### Database
- **users** — User profiles with roles (admin, engineer, viewer)
- **application_logs** — Log entries with level, source, and metadata
- **health_checks** — Service health records with response times and details
- **Sample data** included for demo purposes

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript-ready JS |
| Database | PostgreSQL (Supabase / RDS) |
| Auth | Supabase Auth (email/password) |
| Icons | Lucide React |
| Container | Docker, Docker Compose |
| Cloud | AWS (EC2, ALB, RDS, VPC, CloudWatch) |

## Project Structure

```
cloudgate/
├── src/                        # Frontend React application
│   ├── components/             # Reusable UI components
│   │   ├── ActivityLogList.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── ServiceStatusList.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   └── TrafficChart.tsx
│   ├── contexts/               # React context providers
│   │   └── AuthContext.tsx
│   ├── hooks/                  # Custom data hooks
│   │   └── useDashboardData.ts
│   ├── lib/                    # Utilities and configuration
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── pages/                  # Page-level views
│   │   ├── Architecture.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DetailViews.tsx
│   │   └── Login.tsx
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── backend/                    # Express REST API
│   ├── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── database/                   # SQL schema and migrations
│   └── schema.sql
├── docs/                       # Documentation
│   └── aws-architecture.md
├── frontend/                   # Frontend Docker config
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml          # Full-stack container orchestration
├── .env.example                # Environment variable template
├── .gitignore
└── README.md
```

## Architecture

CloudGate follows a classic 3-tier architecture:

```
User → Route 53 → Application Load Balancer → EC2 (Node.js/Express) → PostgreSQL RDS
                                                       ↕
                                                  ElastiCache Redis
```

- **Presentation Tier**: React SPA served via Nginx, behind an ALB
- **Application Tier**: Node.js/Express EC2 instances in an Auto Scaling Group
- **Data Tier**: PostgreSQL RDS (Multi-AZ) with Redis caching

For the full architecture diagram, security group configuration, network topology, and deployment steps, see [docs/aws-architecture.md](docs/aws-architecture.md).

## AWS Services Used

| Service | Purpose |
|---------|---------|
| EC2 | Application servers (Node.js/Express) |
| Application Load Balancer | Traffic distribution + health checks |
| Auto Scaling Group | Elastic capacity (min 2, max 5) |
| VPC | Network isolation with public/private subnets |
| RDS PostgreSQL | Managed database with Multi-AZ failover |
| ElastiCache Redis | In-memory caching |
| CloudWatch | Monitoring, metrics, and alarms |
| Route 53 | DNS routing |
| IAM | Access management |
| Security Groups | Instance-level firewalls |
| NAT Gateway | Outbound internet for private subnets |
| Bastion Host | Secure SSH access to private instances |
| ACM | SSL/TLS certificates |
| Secrets Manager | Credential storage |
| S3 | Static asset hosting (optional) |

## Local Setup

### Prerequisites
- Node.js 20+
- npm or yarn
- PostgreSQL 16+ (or use Docker)

### Frontend (Development)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend runs on `http://localhost:5173`.

### Backend (Development)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

The API runs on `http://localhost:8080`.

### Database Setup

If using a local PostgreSQL:

```bash
createdb cloudgate
psql cloudgate -f database/schema.sql
```

If using Supabase (as configured in this project), the database tables are already provisioned via migrations.

## Docker Setup

### Full Stack with Docker Compose

```bash
# Copy environment template
cp .env.example .env
# Edit .env with your settings

# Build and start all services
docker-compose up --build

# Services:
# - Frontend: http://localhost:3000
# - Backend:  http://localhost:8080
# - Database: localhost:5432
```

### Individual Containers

**Frontend:**
```bash
cd frontend
docker build -t cloudgate-frontend .
docker run -p 3000:80 cloudgate-frontend
```

**Backend:**
```bash
cd backend
docker build -t cloudgate-backend .
docker run -p 8080:8080 \
  -e DB_HOST=your-db-host \
  -e DB_PASSWORD=your-password \
  cloudgate-backend
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | System health check (ALB target) |
| GET | `/api/info` | Server information and metadata |
| GET | `/api/logs` | Application logs (query: `limit`, `level`) |
| GET | `/api/logs/:id` | Single log entry |
| POST | `/api/logs` | Create a log entry |
| GET | `/api/health-checks` | Service health records |
| POST | `/api/health-checks` | Create a health check record |
| GET | `/api/stats` | Aggregated dashboard statistics |
| GET | `/api/users` | User list |

### Health Check Response Example

```json
{
  "status": "ok",
  "timestamp": "2026-09-13T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0",
  "services": {
    "database": {
      "status": "healthy",
      "responseTimeMs": 8,
      "connections": 5,
      "idleConnections": 3
    }
  },
  "responseTimeMs": 12
}
```

## Deployment Steps (AWS)

> **Note:** The AWS infrastructure is documented and configured for future deployment. The project runs locally first. No fake deployment claims.

### 1. Infrastructure Setup
- Create VPC (10.0.0.0/16) with 3 public and 6 private subnets across 3 AZs
- Configure Internet Gateway and 3 NAT Gateways (one per AZ)
- Create security groups: ALB, app servers, database, bastion

### 2. Database
- Provision RDS PostgreSQL with Multi-AZ in private data subnets
- Enable automated backups and point-in-time recovery
- Run `database/schema.sql` to create tables and load sample data

### 3. Application Servers
- Create EC2 launch template with Node.js + application code
- Configure Auto Scaling Group (min 2, desired 3, max 5)
- Set scaling policies based on CPU utilization

### 4. Load Balancer
- Create Application Load Balancer in public subnets
- Configure target group with health check on `/api/health`
- Set up listener rules for HTTPS (port 443)

### 5. Frontend
- Build frontend and serve via Nginx on EC2 or S3+CloudFront
- Configure DNS in Route 53 to point to ALB

### 6. Monitoring
- Create CloudWatch alarms for CPU, error rate, and database connections
- Set up SNS notifications for alarm states
- Create CloudWatch dashboard for visualization

### 7. Security
- Deploy Bastion Host in public subnet for SSH access
- Store database credentials in Secrets Manager
- Enable CloudTrail for API audit logging
- Configure WAF rules on the ALB

## Security Considerations

- **Network isolation**: Application servers and database in private subnets (no direct internet access)
- **Least privilege**: Security groups restrict traffic to only required ports and sources
- **Encryption in transit**: TLS 1.3 via ACM certificates, SSL termination at ALB
- **Encryption at rest**: RDS and S3 encryption enabled
- **Secret management**: Database credentials stored in AWS Secrets Manager (never in code)
- **Rate limiting**: API rate limiting to prevent abuse
- **Security headers**: Helmet middleware adds CSP, HSTS, and other headers
- **Bastion host**: SSH access restricted to corporate IP via security group
- **IAM roles**: EC2 instances use IAM roles, not access keys
- **VPC Flow Logs**: Enabled for network audit trail

## Screenshots

> Add screenshots here after running the application:

```
docs/screenshots/
├── login.png
├── dashboard.png
├── server-status.png
├── api-health.png
├── database-status.png
├── activity-logs.png
└── architecture.png
```

## Future Improvements

- [ ] WebSocket support for real-time log streaming (no polling)
- [ ] Custom dashboard layouts (drag-and-drop widgets)
- [ ] Alerting rules with configurable thresholds
- [ ] Multi-region deployment with Route 53 latency-based routing
- [ ] Terraform IaC for reproducible infrastructure
- [ ] CI/CD pipeline with GitHub Actions
- [ ] OpenTelemetry distributed tracing
- [ ] Grafana integration for advanced visualizations
- [ ] SAML/OIDC SSO authentication
- [ ] Audit log with immutable storage
- [ ] Blue/green deployment strategy
- [ ] Cost optimization dashboard

## License

MIT License — see LICENSE file for details.

## Author

Built as a portfolio project demonstrating full-stack development, cloud architecture, and DevOps practices.
