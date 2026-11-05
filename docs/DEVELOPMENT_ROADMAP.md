# Development Roadmap - ITSM Pro

## Overview
This document outlines the 14-phase development plan for ITSM Pro. Each phase builds upon the previous one, ensuring a stable and progressively complete application.

## Phase 0 — Product Planning and Architecture
**Status:** In Progress
- Create all architectural documentation (Blueprint, SRS, ERD, API Docs, Security).
- Define tech stack and versions.
- Set up the project structure and development roadmap.

## Phase 1 — Local Application Foundation
**Goal:** Establish the monorepo and basic application skeleton.
- Initialize Monorepo (Turborepo) with `apps/web`, `apps/api`, `packages/*`.
- Initialize Next.js frontend with Tailwind and shadcn/ui.
- Initialize NestJS backend with TypeScript.
- Set up PostgreSQL and Prisma.
- Create Health Check endpoints (`/health`).
- Set up environment variables (`.env.example`).
- Write initial unit tests.

## Phase 2 — Authentication and Multi-Tenancy
**Goal:** Implement user auth, RBAC, and tenant isolation.
- Prisma schema for Tenant, User, Role, Permission.
- JWT authentication (access/refresh tokens).
- MFA setup.
- Tenant isolation (PostgreSQL RLS).
- Audit logging.
- Registration and login flows.

## Phase 3 — Company Management and Four Portals
**Goal:** Build the UI shells and core company management.
- Platform Owner portal (Super Admin dashboard).
- Company Admin portal (Employee management, departments).
- Employee portal (Basic layout, ticket creation form).
- Technician portal (Basic layout, assigned tickets list).
- Notification foundation.

## Phase 4 — Asset and Inventory Management
**Goal:** Full asset lifecycle management.
- Asset CRUD operations.
- Asset assignment to employees.
- Asset history and lifecycle tracking.
- QR code generation for assets.
- Inventory reports.

## Phase 5 — Windows Agent and Device Monitoring
**Goal:** Build the C# agent and telemetry ingestion.
- C# .NET Worker Service (Windows Agent).
- Agent enrollment API.
- Telemetry ingestion API (CPU, RAM, Disk, etc.).
- Heartbeat and offline detection.
- Device monitoring dashboard.

## Phase 6 — Billing and Subscription
**Goal:** Implement SaaS billing and usage limits.
- Subscription plan management (Super Admin).
- Invoice generation.
- Payment records.
- Usage limit enforcement (max employees, max assets).

## Phase 7 — Smart Troubleshooting
**Goal:** Automated diagnostics and safe remediation.
- Health rule engine.
- Troubleshooting diagnostics.
- Safe remediation actions (allowlisted).
- Approval workflow for sensitive actions.

## Phase 8 — Maintenance, License and SLA
**Goal:** Preventive maintenance and license tracking.
- Preventive maintenance schedules.
- License registration and expiry tracking.
- SLA configuration and tracking.
- Knowledge base articles.

## Phase 9 — Technician and Field Service
**Goal:** Technician job management and partner billing.
- Technician availability and assignment.
- Partner management.
- Field service scheduling.
- Commission and payout tracking.

## Phase 10 — Network Monitoring
**Goal:** SNMP, MikroTik, and network health.
- SNMP v3 integration.
- MikroTik API integration.
- ICMP ping monitoring.
- Site connector for private networks.
- Network alerts.

## Phase 11 — Remote Support
**Goal:** Consent-based remote session management.
- Remote support request workflow.
- Employee consent and technician approval.
- Session tracking and audit logs.
- Integration with secure remote desktop tools (not fake UI).

## Phase 12 — Reports and Analytics
**Goal:** Comprehensive reporting.
- Ticket reports (SLA, volume).
- Asset reports.
- Technician performance reports.
- Revenue reports.
- CSV/PDF export functionality.

## Phase 13 — Application Hardening and Localization
**Goal:** Security review, performance, and accessibility.
- Security audit (OWASP Top 10).
- Performance optimization.
- Accessibility improvements (WCAG 2.1).
- Bangla localization preparation (i18n).

## Phase 14 — Final Acceptance Testing and Handover
**Goal:** Full testing, bug fixing, and packaging.
- End-to-end testing (Playwright).
- Tenant isolation verification.
- Security penetration testing.
- Build verification.
- Final ZIP packaging and documentation.
- Handover.