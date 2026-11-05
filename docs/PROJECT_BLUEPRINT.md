# ITSM Pro - Project Blueprint

## 1. Product Overview
**Name:** ITSM Pro (Smart IT Operations & Managed Support Platform)
**Type:** Multi-Tenant, White-Label ITSM and Managed IT Services SaaS Platform.
**Target Audience:** SMBs, IT Service Providers, MSPs.

## 2. Core Objective
To build a scalable, secure, commercially usable IT management platform combining Helpdesk, Asset Management, Remote Support, and Network Monitoring into a single, unified system.

## 3. Four Main Portals
1. **Super Admin (Platform Owner):** Manages tenants, subscriptions, global analytics, and billing.
2. **Company Admin (IT Admin):** Manages employees, assets, tickets, and company-specific settings.
3. **Employee (End-User):** Self-service portal to raise tickets, request assets, and track progress.
4. **Technician:** Manages assigned tickets, field visits, maintenance, and troubleshooting.

## 4. Technology Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend:** NestJS, TypeScript, REST API, WebSockets.
- **Database:** PostgreSQL with Prisma ORM (Row-Level Security enabled for tenant isolation).
- **Background Jobs:** Redis + BullMQ.
- **Windows Agent:** C# (.NET Worker Service).
- **Monitoring:** SNMP v3, ICMP, MikroTik API.

## 5. Architecture Strategy
- **Monorepo:** Maintained using Turborepo.
- **Modular Monolith:** The backend is a single NestJS application divided into clear domain modules (Auth, Tenants, Tickets, Assets, Monitoring, Billing).
- **Tenant Isolation:** Enforced at the application level (NestJS Guards) and database level (PostgreSQL RLS).

## 6. Security Principles
- Zero trust between tenants.
- All sensitive data encrypted at rest and in transit.
- Strict RBAC and permission-based authorization.
- Audit logs for all state-changing operations.