# Software Requirements Specification (SRS) - ITSM Pro

## 1. Introduction
### 1.1 Purpose
This document defines the functional and non-functional requirements for ITSM Pro, a multi-tenant SaaS platform designed for IT service management and managed IT services.

### 1.2 Scope
ITSM Pro will provide four distinct portals (Super Admin, Company Admin, Employee, Technician) integrated into a single codebase. It includes Helpdesk, Asset Management, Network Monitoring, Windows Agent telemetry, Billing, and Field Service Management.

## 2. Functional Requirements

### 2.1 Authentication & Access Control (Module 1)
- **FR-1.1:** Users must be able to log in with email and password.
- **FR-1.2:** System must support Multi-Factor Authentication (MFA) for privileged roles (Super Admin, Company Admin).
- **FR-1.3:** Implement Role-Based Access Control (RBAC) with granular permissions.
- **FR-1.4:** System must lock accounts after 5 failed login attempts.
- **FR-1.5:** Password reset via secure email token.

### 2.2 Multi-Tenant Architecture (Module 2)
- **FR-2.1:** Single codebase must serve multiple independent companies (tenants).
- **FR-2.2:** Data isolation must be strictly enforced. Tenant A cannot access Tenant B's data.
- **FR-2.3:** Each tenant must have customizable branding (logo, primary color).
- **FR-2.4:** Tenant-specific subscriptions and usage limits.

### 2.3 Helpdesk & Ticket Management (Module 3)
- **FR-3.1:** Employees can create tickets with subject, description, priority, and attachments.
- **FR-3.2:** Company Admins can assign tickets to Technicians.
- **FR-3.3:** Technicians can update ticket status (Open, In Progress, Resolved, Closed).
- **FR-3.4:** Internal notes visible only to technicians/admins.
- **FR-3.5:** SLA tracking and automatic escalation for breached SLAs.

### 2.4 IT Asset Management (Module 4)
- **FR-4.1:** Register assets (Desktops, Laptops, Printers, Network Devices, Servers).
- **FR-4.2:** Track asset lifecycle, purchase info, warranty, and assignment history.
- **FR-4.3:** Generate QR codes for asset tagging.
- **FR-4.4:** Assign assets to specific employees.

### 2.5 Windows Monitoring Agent (Module 5)
- **FR-5.1:** Agent must run as a Windows Service.
- **FR-5.2:** Collect CPU, RAM, Disk usage, OS info, IP, and uptime.
- **FR-5.3:** Send heartbeat data securely to the backend API every X minutes.
- **FR-5.4:** Collect installed software inventory.
- **FR-5.5:** Secure device enrollment using a unique tenant-specific key.

### 2.6 Network Monitoring (Module 6)
- **FR-6.1:** Support SNMP v3 for network devices.
- **FR-6.2:** ICMP ping for latency and uptime monitoring.
- **FR-6.3:** Support MikroTik API integration for bandwidth utilization.
- **FR-6.4:** Alert generation for device offline or high latency.

### 2.7 Smart Troubleshooting (Module 7)
- **FR-7.1:** Automated diagnostics for common issues (High CPU, Low Disk).
- **FR-7.2:** Safe remediation actions only (allowlisted commands).
- **FR-7.3:** Require explicit approval from Admin before executing remediation.

### 2.8 Preventive Maintenance (Module 8)
- **FR-8.1:** Create recurring maintenance schedules.
- **FR-8.2:** Maintain checklists and service history.

### 2.9 Software & License Management (Module 9)
- **FR-9.1:** Track software licenses and expiration dates.
- **FR-9.2:** Alert Admins 30 days before license expiration.

### 2.10 Technician & Field Service (Module 10)
- **FR-10.1:** Technicians can accept/reject job assignments.
- **FR-10.2:** Schedule field visits with location and time.
- **FR-10.3:** Track working hours and generate service charges.

### 2.11 Remote Support (Module 11)
- **FR-11.1:** Employee initiates request and provides consent.
- **FR-11.2:** Session audit logs for security compliance.
- **FR-11.3:** Integration with secure remote desktop tools (not fake UI).

### 2.12 SaaS Subscription & Billing (Module 12)
- **FR-12.1:** Subscription plans (Starter, Business, Professional).
- **FR-12.2:** Automated invoice generation.
- **FR-12.3:** Usage limits enforcement (e.g., max employees, max assets).

### 2.13 Notification System (Module 13)
- **FR-13.1:** In-app notifications for tickets, SLAs, and maintenance.
- **FR-13.2:** Email notifications via SMTP.

### 2.14 Reports & Analytics (Module 14)
- **FR-14.1:** Export reports in CSV/PDF format.
- **FR-14.2:** Filter by date range, role, and department.

### 2.15 Knowledge Base (Module 15)
- **FR-15.1:** Create public/internal articles.
- **FR-15.2:** Search functionality with categories.

## 3. Non-Functional Requirements

### 3.1 Security
- All API endpoints must be authenticated (except login/register).
- Data must be encrypted in transit (HTTPS/TLS).
- Passwords hashed using bcrypt/argon2.
- Protection against SQL Injection, XSS, and CSRF.

### 3.2 Performance
- API response time < 500ms for 95% of requests.
- Support up to 10,000 concurrent devices (telemetry).

### 3.3 Availability
- 99.9% uptime target for production deployment.

### 3.4 Scalability
- Database design must support horizontal scaling.
- Background jobs must be offloaded to Redis workers.

## 4. User Roles & Permissions Matrix
| Feature | Super Admin | Company Admin | Technician | Employee |
| :--- | :---: | :---: | :---: | :---: |
| Manage Tenants | ✅ | ❌ | ❌ | ❌ |
| Manage Employees | ❌ | ✅ | ❌ | ❌ |
| Create Tickets | ❌ | ✅ | ✅ | ✅ |
| Assign Tickets | ❌ | ✅ | ❌ | ❌ |
| Update Ticket Status | ❌ | ✅ | ✅ | ❌ |
| Manage Assets | ❌ | ✅ | ❌ | ❌ |
| View Monitoring Data | ❌ | ✅ | ✅ | ❌ |
| Manage Billing | ✅ | ✅ | ❌ | ❌ |