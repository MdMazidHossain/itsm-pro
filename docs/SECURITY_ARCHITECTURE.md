# Security Architecture - ITSM Pro

## 1. Security Principles
- **Zero Trust:** Never trust any request by default. Every request must be authenticated and authorized.
- **Least Privilege:** Users only get the minimum permissions required for their role.
- **Defense in Depth:** Multiple layers of security (Network, Application, Database).
- **Tenant Isolation:** Strict separation of data between different companies.

## 2. Authentication & Authorization
### 2.1 Password Security
- Passwords hashed using **Argon2id** or **bcrypt** (cost factor 12+).
- Minimum password length: 8 characters, must include uppercase, lowercase, number, and special character.
- Passwords are NEVER stored in plain text or logged.

### 2.2 JWT Strategy
- **Access Token:** Short-lived (15 minutes). Contains `userId`, `tenantId`, `role`, and `permissions`.
- **Refresh Token:** Long-lived (7 days). Stored in an `HttpOnly`, `Secure` cookie. 
- Token rotation is implemented on refresh.

### 2.3 Multi-Factor Authentication (MFA)
- Required for Super Admin and Company Admin roles.
- Uses TOTP (Time-based One-Time Password) via Google Authenticator/Authy.
- Backup codes generated and hashed in the database.

### 2.4 Role-Based Access Control (RBAC)
- Roles: `SUPER_ADMIN`, `COMPANY_ADMIN`, `TECHNICIAN`, `EMPLOYEE`.
- Permissions are granular (e.g., `ticket:create`, `asset:delete`, `billing:read`).
- NestJS Guards (`@Roles()` and `@Permissions()`) enforce access control at the controller level.

## 3. Tenant Isolation
- **Database Level:** PostgreSQL Row-Level Security (RLS) policies are enabled. 
  - Every query automatically appends `WHERE tenant_id = current_setting('app.current_tenant')`.
- **Application Level:** The `tenantId` is ALWAYS extracted from the JWT token on the server side. It is NEVER trusted from the request body or query parameters.
- **File Storage:** S3 buckets are partitioned by tenant (e.g., `s3://itsm-pro-files/tenant-uuid/...`). Pre-signed URLs are generated with short expiry (5 mins).

## 4. API Security
- **Rate Limiting:** Applied via `@nestjs/throttler`. Max 100 requests per minute per IP.
- **Input Validation:** All DTOs validated using `class-validator`. Unknown properties are stripped (`whitelist: true`).
- **SQL Injection Prevention:** Prisma ORM uses parameterized queries. Raw SQL is avoided unless absolutely necessary.
- **XSS Protection:** Inputs sanitized on the backend; React escapes output by default on the frontend.
- **CSRF Protection:** Not required for JWT-based APIs (since tokens are sent via headers, not cookies), but CSRF tokens are used if cookies are involved.
- **CORS:** Strictly configured to allow only the frontend domain.

## 5. File Upload Security
- Max file size: 10MB.
- Allowed types: PDF, PNG, JPG, JPEG, DOCX, XLSX, ZIP.
- Files are scanned for malware before being served.
- Pre-signed URLs are used so the backend never handles the actual file bytes.

## 6. Windows Agent Security
- **Enrollment:** Agents register using a unique, tenant-specific `EnrollmentKey`. This key expires after use.
- **Authentication:** After enrollment, the agent receives an `AgentToken` (JWT) with limited scope.
- **Communication:** All API calls are over HTTPS (TLS 1.2+).
- **Credential Rotation:** Agent tokens are rotated every 30 days.
- **Revocation:** Admins can revoke an agent's token instantly from the dashboard.
- **Agent Updates:** Updates are signed with a code-signing certificate. The agent verifies the signature before installing.

## 7. Sensitive Data Handling
- **Encryption at Rest:** Database is encrypted at rest (managed by cloud provider).
- **PII:** Personal Identifiable Information (email, phone) is stored securely. No sensitive data in logs.
- **Secrets Management:** All API keys, database passwords, and JWT secrets are stored in `.env` files (not committed to git) or a secret manager (AWS Secrets Manager / HashiCorp Vault) in production.

## 8. Audit Logging
- Every sensitive action is logged in the `AuditLog` table:
  - User login/logout (success/failure).
  - Role changes.
  - Ticket deletion.
  - Asset assignment.
  - Billing changes.
  - Agent enrollment/revocation.
- Logs include: `userId`, `tenantId`, `action`, `entity`, `entityId`, `changes` (JSON diff), `ipAddress`, `timestamp`.
- Audit logs are immutable (append-only).

## 9. Background Job Security
- BullMQ jobs run in a secure worker process.
- Jobs are authenticated using a shared secret (`QUEUE_SECRET`).
- Job payloads are validated before execution.
- Failed jobs are retried with exponential backoff.

## 10. Incident Response
- **Account Lockout:** 5 failed login attempts → 15-minute lockout.
- **Suspicious Activity:** Multiple failed MFA attempts trigger an alert to the Super Admin.
- **Breach Notification:** Documented process for notifying affected tenants in case of a data breach.