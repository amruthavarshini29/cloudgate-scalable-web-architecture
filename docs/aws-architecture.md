# AWS Architecture — CloudGate Scalable Web Architecture

## Overview

CloudGate is designed for deployment on AWS using a **3-tier architecture** across multiple Availability Zones (AZs) for high availability and fault tolerance.

## Architecture Diagram

```
                          ┌─────────────────────────────────────────────────┐
                          │                   INTERNET                       │
                          │              (HTTPS / Port 443)                  │
                          └──────────────────────┬──────────────────────────┘
                                                 │
                          ┌──────────────────────▼──────────────────────────┐
                          │              Route 53 (DNS)                      │
                          │         api.cloudgate.io → ALB                   │
                          └──────────────────────┬──────────────────────────┘
                                                 │
                 ┌───────────────────────────────▼───────────────────────────────┐
                 │                        VPC (10.0.0.0/16)                       │
                 │                                                               │
                 │    ┌────────────────────────────────────────────────────┐     │
                 │    │              PUBLIC SUBNETS                          │     │
                 │    │   10.0.1.0/24  |  10.0.2.0/24  |  10.0.3.0/24      │     │
                 │    │                                                     │     │
                 │    │   ┌─────────────────┐    ┌─────────────────┐        │     │
                 │    │   │ Application Load │    │  Bastion Host    │        │     │
                 │    │   │    Balancer      │    │  (Jump Server)   │        │     │
                 │    │   │  (Multi-AZ)      │    │  SSH Port 22     │        │     │
                 │    │   └────────┬────────┘    └─────────────────┘        │     │
                 │    └────────────┼─────────────────────────────────────────┘     │
                 │                 │                                               │
                 │    ┌────────────▼─────────────────────────────────────────┐     │
                 │    │           PRIVATE SUBNETS (App Tier)                   │     │
                 │    │   10.0.11.0/24  |  10.0.12.0/24  |  10.0.13.0/24      │     │
                 │    │                                                     │     │
                 │    │   ┌───────────────────────────────────────────┐      │     │
                 │    │   │         AUTO SCALING GROUP                  │      │     │
                 │    │   │   Min: 2  |  Desired: 3  |  Max: 5          │      │     │
                 │    │   │                                             │      │     │
                 │    │   │  ┌─────────┐  ┌─────────┐  ┌─────────┐    │      │     │
                 │    │   │  │ EC2 #1   │  │ EC2 #2   │  │ EC2 #3   │    │      │     │
                 │    │   │  │us-east-1a│  │us-east-1b│  │us-east-1c│    │      │     │
                 │    │   │  │Node.js   │  │Node.js   │  │Node.js   │    │      │     │
                 │    │   │  │Express   │  │Express   │  │Express   │    │      │     │
                 │    │   │  └─────┬────┘  └─────┬────┘  └─────┬────┘    │      │     │
                 │    │   └──────────┼─────────────┼─────────────┼──────┘      │     │
                 │    └──────────────┼─────────────┼─────────────┼──────────────┘     │
                 │                   │             │             │                    │
                 │    ┌──────────────▼─────────────▼─────────────▼──────────────┐     │
                 │    │         PRIVATE SUBNETS (Data Tier)                       │     │
                 │    │   10.0.21.0/24  |  10.0.22.0/24  |  10.0.23.0/24         │     │
                 │    │                                                          │     │
                 │    │   ┌──────────────────┐    ┌──────────────────┐           │     │
                 │    │   │  RDS PostgreSQL   │───▶│  RDS Read Replica │           │     │
                 │    │   │  Primary (Writer) │    │  (Reader)          │           │     │
                 │    │   └──────────────────┘    └──────────────────┘           │     │
                 │    │                                                          │     │
                 │    │   ┌──────────────────┐                                   │     │
                 │    │   │  ElastiCache      │                                   │     │
                 │    │   │  Redis             │                                   │     │
                 │    │   └──────────────────┘                                   │     │
                 │    └──────────────────────────────────────────────────────────┘     │
                 │                                                               │
                 └───────────────────────────────────────────────────────────────┘

                          ┌─────────────────────────────────────────────────┐
                          │              CloudWatch Monitoring               │
                          │  Metrics · Alarms · Dashboards · Log Insights    │
                          └─────────────────────────────────────────────────┘
```

## Request Flow

```
User → Route 53 (DNS) → Application Load Balancer (Public Subnet)
    → EC2 Instance (Private Subnet, Auto Scaling Group)
    → RDS PostgreSQL / ElastiCache Redis (Private Data Subnet)
```

## AWS Services Used

| Service | Purpose | Tier |
|---------|---------|------|
| **EC2** | Application servers running Node.js/Express | Compute |
| **Application Load Balancer** | Distributes traffic across EC2 instances | Edge |
| **Auto Scaling Group** | Automatically scales instances based on demand | Compute |
| **VPC** | Isolated network with public/private subnets | Network |
| **RDS PostgreSQL** | Managed relational database with Multi-AZ | Data |
| **ElastiCache Redis** | In-memory caching layer | Data |
| **CloudWatch** | Monitoring, metrics, alarms, and logs | Operations |
| **Route 53** | DNS resolution and health-based routing | Edge |
| **IAM** | Identity and access management | Security |
| **Security Groups** | Instance-level firewall rules | Security |
| **NAT Gateway** | Outbound internet for private subnets | Network |
| **Bastion Host** | Secure SSH access to private instances | Security |
| **ACM** | SSL/TLS certificate management | Security |
| **Secrets Manager** | Database credentials and API secrets | Security |
| **S3** | Static frontend asset hosting (optional) | Storage |

## Network Design

### VPC Configuration
- **CIDR Block**: 10.0.0.0/16
- **Availability Zones**: 3 (us-east-1a, us-east-1b, us-east-1c)

### Subnets

| Subnet | CIDR | Type | Purpose |
|--------|------|------|---------|
| 10.0.1.0/24 | us-east-1a | Public | ALB, Bastion |
| 10.0.2.0/24 | us-east-1b | Public | ALB, Bastion |
| 10.0.3.0/24 | us-east-1c | Public | ALB, Bastion |
| 10.0.11.0/24 | us-east-1a | Private | EC2 App Servers |
| 10.0.12.0/24 | us-east-1b | Private | EC2 App Servers |
| 10.0.13.0/24 | us-east-1c | Private | EC2 App Servers |
| 10.0.21.0/24 | us-east-1a | Private | RDS, ElastiCache |
| 10.0.22.0/24 | us-east-1b | Private | RDS, ElastiCache |
| 10.0.23.0/24 | us-east-1c | Private | RDS, ElastiCache |

### Security Groups

| Security Group | Inbound | Outbound |
|---------------|---------|----------|
| `sg-alb-public` | 443 from 0.0.0.0/0 | 8080 to app servers |
| `sg-app-private` | 8080 from ALB only | 5432 to RDS, 6379 to Redis |
| `sg-database-private` | 5432 from app servers only | None |
| `sg-bastion-public` | 22 from corporate IP only | 22 to private subnets |

## Auto Scaling Policies

- **Scale Out**: CPU > 70% for 5 minutes → +1 instance
- **Scale In**: CPU < 30% for 10 minutes → -1 instance
- **Min**: 2 instances (always running)
- **Max**: 5 instances (cost cap)
- **Desired**: 3 instances (baseline)

## CloudWatch Monitoring

| Metric | Alarm | Action |
|--------|-------|--------|
| CPU Utilization > 80% | High CPU | Scale out + SNS notification |
| ALB 5xx Errors > 1% | Error Rate | SNS notification |
| RDS Connections > 80% | DB Connections | SNS notification |
| ALB Target Health < 2 | Unhealthy Hosts | SNS notification |
| RDS Storage < 20GB | Low Storage | SNS notification |

## High Availability

- Multi-AZ deployment across 3 availability zones
- RDS Multi-AZ with automatic failover
- ALB distributes traffic only to healthy targets
- Auto Scaling replaces failed instances automatically
- NAT Gateway in each AZ for outbound redundancy

## Deployment Strategy

### Phase 1: Infrastructure Setup
1. Create VPC with 3 public and 6 private subnets
2. Configure Internet Gateway and NAT Gateways
3. Create security groups with least-privilege rules
4. Provision RDS PostgreSQL with Multi-AZ

### Phase 2: Application Deployment
1. Create launch template with user data script
2. Configure Auto Scaling Group across private subnets
3. Create Application Load Balancer in public subnets
4. Set up ALB target groups with health checks

### Phase 3: Security & Monitoring
1. Deploy Bastion Host in public subnet
2. Configure CloudWatch alarms and dashboards
3. Set up SNS notifications for alerts
4. Enable CloudTrail for API audit logging

### Phase 4: DNS & TLS
1. Register domain in Route 53
2. Create ACM certificate for TLS
3. Configure Route 53 alias to ALB
4. Enable ALB SSL termination
