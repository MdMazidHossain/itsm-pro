# System Architecture - ITSM Pro

## 1. High-Level Architecture Overview
ITSM Pro is built using a **Modular Monolith** architecture. This means we have a single backend application (NestJS) and a single frontend application (Next.js), but the backend is divided into strictly separated domain modules.

We avoid microservices initially to reduce deployment complexity and development time, while keeping the code modular enough to split into microservices later if scaling demands it.

## 2. Monorepo Structure
We use a Monorepo (Turborepo) to manage the entire codebase.

```text
itsm-pro/
├── apps/
│   ├── web/               # Next.js Frontend (All 4 Portals)
│   ├── api/               # NestJS Backend (REST API + WebSockets)
│   └── windows-agent/     # C# .NET Worker Service
├── packages/
│   ├── shared/            # Shared business logic and utilities
│   ├── types/             # Shared TypeScript interfaces and DTOs
│   ├── config/            # ESLint, TypeScript, and Tailwind configs
│   └── ui/                # Shared React components (shadcn/ui based)
├── infrastructure/        # Docker, Nginx, and deployment scripts
├── scripts/               # PowerShell setup and utility scripts
├── docs/                  # All documentation
├── package.json           # Root package.json
└── turbo.json             # Turborepo configuration

3. Frontend Architecture (Next.js)
Framework: Next.js (App Router) with React and TypeScript.

Styling: Tailwind CSS + shadcn/ui for accessible, premium components.

State Management: React Context for Auth, TanStack Query for server state.

Routing Structure:

/admin -> Super Admin Portal

/company -> Company Admin Portal

/employee -> Employee Self-Service Portal

/technician -> Technician Portal

API Communication: REST via fetch wrapped in Axios instances.

4. Backend Architecture (NestJS)
The backend is organized into the following domain modules:

AuthModule: JWT, MFA, Login, RBAC.

TenantsModule: Tenant CRUD, subscription mapping.

UsersModule: Employees, Technicians, Admins.

TicketsModule: Helpdesk, SLA, comments, attachments.

AssetsModule: IT Inventory, assignments, lifecycle.

MonitoringModule: Telemetry ingestion, heartbeat, alerts.

NetworkModule: SNMP, ICMP, MikroTik integrations.

BillingModule: Invoices, subscriptions, payments.

JobsModule: BullMQ background tasks (emails, SLA checks, device offline checks).

5. Database Architecture (PostgreSQL + Prisma)
5.1 Tenant Isolation Strategy
We use a Shared Database, Shared Schema approach with Row-Level Security (RLS) enforced at the PostgreSQL level.

Every table (except global platform tables) has a tenantId column.

Prisma middleware or PostgreSQL RLS policies ensure that queries only return data where tenantId = current_tenant.

Rule: The tenantId is extracted from the JWT token, NEVER from the request body.

5.2 Key Entities
Tenant (Company)

User (belongs to Tenant, has Role)

Ticket (belongs to Tenant, created by User)

Asset (belongs to Tenant, assigned to User)

Device (Telemetry data, belongs to Tenant)

SubscriptionPlan (Global, managed by Super Admin)

Invoice (belongs to Tenant)

6. Windows Agent Architecture (C#)
Type: .NET Worker Service running as a Windows Service.

Communication: HTTPS REST API requests to the NestJS backend.

Authentication: The agent uses a unique EnrollmentKey to register with the tenant. After registration, it receives an AgentToken (rotated periodically).

Data Collected: CPU, RAM, Disk, OS Info, IP, Uptime, Installed Software. (No keystrokes or personal files).

Heartbeat: Sends telemetry every 60 seconds (configurable).

7. Network Monitoring Architecture
Site Connector: For private networks, a lightweight agent (or VPN tunnel) is deployed on the client's local network. The cloud backend talks to the Site Connector, which then queries the local SNMP/MikroTik devices.

SNMP v3: Uses secure authentication (authPriv) for querying network devices.

ICMP: Basic ping sweeps for up/down status.

8. Security Architecture
Authentication: JWT (Access + Refresh tokens). Access token expires in 15 mins.

Authorization: NestJS Guards validate role and permissions.

Data Validation: All incoming requests are validated using class-validator DTOs.

File Uploads: Secured via S3 pre-signed URLs. Files are scanned before serving.

Audit Logs: Every sensitive action (login, ticket delete, asset edit) is recorded in an AuditLog table.

9. Deployment Architecture (Future)
Frontend: Vercel or Docker container behind Nginx.

Backend: Docker container behind Nginx.

Database: Managed PostgreSQL (AWS RDS or DigitalOcean).

Redis: Managed Redis instance for BullMQ.

Storage: AWS S3 or MinIO (self-hosted).