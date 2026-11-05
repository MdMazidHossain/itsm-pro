# TODO List - ITSM Pro

## Phase 0 — Planning & Architecture
- [x] PROJECT_BLUEPRINT.md
- [x] SRS.md
- [x] ARCHITECTURE.md
- [x] DATABASE_ERD.md
- [x] API_DOCUMENTATION.md
- [x] SECURITY_ARCHITECTURE.md
- [x] DEVELOPMENT_ROADMAP.md
- [x] TECH_STACK_VERSIONS.md
- [x] LOCAL_DEVELOPMENT_SETUP.md
- [x] TESTING_STRATEGY.md
- [x] DEPLOYMENT_ARCHITECTURE.md
- [x] DEVELOPMENT_PROGRESS.md
- [x] TODO.md

## Phase 1 — Local Application Foundation
- [ ] Initialize Turborepo monorepo
- [ ] Create `apps/web` with Next.js 14 + Tailwind + shadcn/ui
- [ ] Create `apps/api` with NestJS 10
- [ ] Create `packages/shared` (common utilities)
- [ ] Create `packages/types` (shared TypeScript interfaces)
- [ ] Create `packages/ui` (shared React components)
- [ ] Create `packages/config` (ESLint, TS, Tailwind configs)
- [ ] Set up Prisma ORM and PostgreSQL connection
- [ ] Create initial Prisma schema (Tenant, User, Role)
- [ ] Create Health Check endpoint (`/health`)
- [ ] Set up `.env.example` files
- [ ] Write initial unit tests (Health endpoint)
- [ ] Verify `pnpm build` works for web and api
- [ ] Generate ZIP package: `ITSM-Pro-Phase-01.zip`

## Phase 2 — Authentication and Multi-Tenancy
- [ ] Prisma schema: full Tenant, User, Role, Permission, AuditLog
- [ ] JWT authentication (access + refresh)
- [ ] Password hashing (bcrypt/argon2)
- [ ] Login, Register, Logout endpoints
- [ ] MFA setup (TOTP)
- [ ] RBAC Guards in NestJS
- [ ] Tenant Isolation (RLS + guards)
- [ ] Audit logging middleware
- [ ] Frontend login pages (4 portals)
- [ ] Tenant registration flow
- [ ] Tenant isolation tests
- [ ] Generate ZIP package: `ITSM-Pro-Phase-02.zip`

## Phase 3 — Company Management and Four Portals
- [ ] Super Admin dashboard (tenant list, analytics)
- [ ] Tenant CRUD (create, edit, suspend)
- [ ] Company Admin dashboard
- [ ] Employee management (CRUD, invite)
- [ ] Department management
- [ ] Employee portal layout
- [ ] Technician portal layout
- [ ] Notification foundation
- [ ] Generate ZIP package: `ITSM-Pro-Phase-03.zip`

## Phase 4 — Asset and Inventory Management
- [ ] Asset CRUD operations
- [ ] Asset assignment to employees
- [ ] Asset lifecycle tracking
- [ ] QR code generation
- [ ] Asset reports
- [ ] Frontend asset management UI
- [ ] Generate ZIP package: `ITSM-Pro-Phase-04.zip`

## Phase 5 — Windows Agent and Device Monitoring
- [ ] C# .NET Worker Service project
- [ ] Agent enrollment API
- [ ] Telemetry ingestion API
- [ ] Heartbeat and offline detection
- [ ] Device monitoring dashboard (frontend)
- [ ] Generate ZIP package: `ITSM-Pro-Phase-05.zip`

## Phase 6 — Billing and Subscription
- [ ] Subscription plan management
- [ ] Invoice generation
- [ ] Payment records
- [ ] Usage limit enforcement
- [ ] Billing UI
- [ ] Generate ZIP package: `ITSM-Pro-Phase-06.zip`

## Phase 7 — Smart Troubleshooting
- [ ] Health rule engine
- [ ] Diagnostics engine
- [ ] Safe remediation (allowlisted)
- [ ] Approval workflow
- [ ] Generate ZIP package: `ITSM-Pro-Phase-07.zip`

## Phase 8 — Maintenance, License and SLA
- [ ] Preventive maintenance schedules
- [ ] License tracking and expiry alerts
- [ ] SLA configuration and tracking
- [ ] Knowledge base articles
- [ ] Generate ZIP package: `ITSM-Pro-Phase-08.zip`

## Phase 9 — Technician and Field Service
- [ ] Technician availability
- [ ] Partner management
- [ ] Field service scheduling
- [ ] Commission and payout tracking
- [ ] Generate ZIP package: `ITSM-Pro-Phase-09.zip`

## Phase 10 — Network Monitoring
- [ ] SNMP v3 integration
- [ ] MikroTik API integration
- [ ] ICMP ping monitoring
- [ ] Site connector
- [ ] Network alerts
- [ ] Generate ZIP package: `ITSM-Pro-Phase-10.zip`

## Phase 11 — Remote Support
- [ ] Remote support request workflow
- [ ] Consent and approval
- [ ] Session tracking and audit
- [ ] Generate ZIP package: `ITSM-Pro-Phase-11.zip`

## Phase 12 — Reports and Analytics
- [ ] Ticket reports
- [ ] Asset reports
- [ ] Technician performance reports
- [ ] Revenue reports
- [ ] CSV/PDF export
- [ ] Generate ZIP package: `ITSM-Pro-Phase-12.zip`

## Phase 13 — Application Hardening and Localization
- [ ] Security audit (OWASP)
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Bangla localization (i18n)
- [ ] Generate ZIP package: `ITSM-Pro-Phase-13.zip`

## Phase 14 — Final Acceptance Testing and Handover
- [ ] End-to-end testing
- [ ] Tenant isolation verification
- [ ] Security penetration tests
- [ ] Final build verification
- [ ] Final documentation
- [ ] Generate ZIP package: `ITSM-Pro-Phase-14.zip`