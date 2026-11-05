# Database ERD & Schema Definition - ITSM Pro

## 1. Database Strategy
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Tenant Isolation:** Shared Database, Shared Schema with Row-Level Security (RLS). Every tenant-specific table has a `tenantId` column.

## 2. Entity Relationship Overview
Below is a high-level description of the core tables and their relationships.

### 2.1 Global Tables (Not Tenant-Specific)
These tables are managed by the Super Admin.

**`Tenant` (Company)**
- `id` (UUID, PK)
- `name` (String)
- `subdomain` (String, Unique) - e.g., "acme" for acme.itsmpro.com
- `status` (Enum: ACTIVE, SUSPENDED, TRIAL)
- `brandingConfig` (JSON) - Logo URL, primary color.
- `createdAt` (DateTime)
- `subscriptionPlanId` (FK to SubscriptionPlan)

**`SubscriptionPlan`**
- `id` (UUID, PK)
- `name` (String) - e.g., Starter, Business, Professional
- `price` (Decimal)
- `billingCycle` (Enum: MONTHLY, YEARLY)
- `features` (JSON) - e.g., maxEmployees, maxAssets, windowsAgentAllowed.
- `isActive` (Boolean)

**`PlatformAdmin` (Super Admin)**
- `id` (UUID, PK)
- `email` (String, Unique)
- `passwordHash` (String)
- `mfaSecret` (String, Nullable)

---

### 2.2 Tenant-Specific Tables (Has `tenantId`)
These tables belong to a specific company.

**`User` (Employees, Company Admins, Technicians)**
- `id` (UUID, PK)
- `tenantId` (UUID, FK to Tenant)
- `email` (String, Unique per tenant)
- `passwordHash` (String)
- `firstName` (String)
- `lastName` (String)
- `role` (Enum: COMPANY_ADMIN, TECHNICIAN, EMPLOYEE)
- `departmentId` (UUID, FK to Department, Nullable)
- `mfaSecret` (String, Nullable)
- `status` (Enum: ACTIVE, INACTIVE, SUSPENDED)
- `createdAt` (DateTime)

**`Department`**
- `id` (UUID, PK)
- `tenantId` (UUID, FK to Tenant)
- `name` (String)

**`Asset`**
- `id` (UUID, PK)
- `tenantId` (UUID, FK to Tenant)
- `name` (String)
- `type` (Enum: LAPTOP, DESKTOP, PRINTER, SERVER, NETWORK_DEVICE, UPS, OTHER)
- `serialNumber` (String, Nullable)
- `status` (Enum: IN_USE, IN_STORAGE, UNDER_MAINTENANCE, RETIRED)
- `assignedToUserId` (UUID, FK to User, Nullable)
- `purchaseDate` (DateTime, Nullable)
- `warrantyExpiry` (DateTime, Nullable)

**`Ticket`**
- `id` (UUID, PK)
- `tenantId` (UUID, FK to Tenant)
- `ticketNumber` (String, Unique per tenant)
- `subject` (String)
- `description` (Text)
- `priority` (Enum: LOW, MEDIUM, HIGH, URGENT)
- `status` (Enum: OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- `createdByUserId` (UUID, FK to User)
- `assignedToUserId` (UUID, FK to User, Nullable - Technician)
- `slaDeadline` (DateTime, Nullable)
- `createdAt` (DateTime)

**`TicketComment`**
- `id` (UUID, PK)
- `tenantId` (UUID, FK to Tenant)
- `ticketId` (UUID, FK to Ticket)
- `userId` (UUID, FK to User)
- `message` (Text)
- `isInternalNote` (Boolean) - If true, employee cannot see it.
- `createdAt` (DateTime)

**`Device` (Windows Agent Telemetry)**
- `id` (UUID, PK)
- `tenantId` (UUID, FK to Tenant)
- `hostname` (String)
- `agentId` (String, Unique) - Assigned during enrollment
- `osInfo` (String)
- `ipAddress` (String)
- `lastHeartbeat` (DateTime)
- `status` (Enum: ONLINE, OFFLINE)
- `assignedToUserId` (UUID, FK to User, Nullable)

**`DeviceTelemetry`**
- `id` (UUID, PK)
- `tenantId` (UUID, FK to Tenant)
- `deviceId` (UUID, FK to Device)
- `cpuUsage` (Float)
- `ramUsage` (Float)
- `diskUsage` (Float)
- `uptimeSeconds` (BigInt)
- `collectedAt` (DateTime)

**`Invoice`**
- `id` (UUID, PK)
- `tenantId` (UUID, FK to Tenant)
- `invoiceNumber` (String, Unique)
- `amount` (Decimal)
- `status` (Enum: PENDING, PAID, OVERDUE)
- `dueDate` (DateTime)
- `paidAt` (DateTime, Nullable)

**`AuditLog`**
- `id` (UUID, PK)
- `tenantId` (UUID, FK to Tenant, Nullable - null for platform admin actions)
- `userId` (UUID, FK to User, Nullable)
- `action` (String) - e.g., "USER_LOGIN", "TICKET_CREATED"
- `entity` (String)
- `entityId` (String)
- `changes` (JSON)
- `ipAddress` (String)
- `createdAt` (DateTime)

---

## 3. Relationships
- **Tenant to User:** One-to-Many (A company has many users).
- **Tenant to Asset:** One-to-Many.
- **Tenant to Ticket:** One-to-Many.
- **User (Employee) to Ticket:** One-to-Many (CreatedBy).
- **User (Technician) to Ticket:** One-to-Many (AssignedTo).
- **Ticket to TicketComment:** One-to-Many.
- **Device to DeviceTelemetry:** One-to-Many (Time-series data).
- **Tenant to SubscriptionPlan:** Many-to-One.

## 4. Prisma Schema Snippet (Example)
```prisma
model Tenant {
  id               String    @id @default(uuid())
  name             String
  subdomain        String    @unique
  status           TenantStatus @default(TRIAL)
  subscriptionPlanId String
  subscriptionPlan SubscriptionPlan @relation(fields: [subscriptionPlanId], references: [id])
  users            User[]
  assets           Asset[]
  tickets          Ticket[]
  devices          Device[]
  createdAt        DateTime  @default(now())

  @@index([subdomain])
}

model User {
  id           String   @id @default(uuid())
  tenantId     String
  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  email        String
  passwordHash String
  role         UserRole @default(EMPLOYEE)
  // ... other fields

  @@unique([tenantId, email])
  @@index([tenantId])
}

enum TenantStatus {
  ACTIVE
  SUSPENDED
  TRIAL
}

enum UserRole {
  COMPANY_ADMIN
  TECHNICIAN
  EMPLOYEE
}