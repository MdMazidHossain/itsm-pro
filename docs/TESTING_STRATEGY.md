# Testing Strategy - ITSM Pro

## 1. Testing Philosophy
Testing is not an afterthought; it is integral to every phase. We follow the **Testing Pyramid**:
- **Unit Tests (70%):** Fast, isolated tests for individual functions.
- **Integration Tests (20%):** Test interactions between modules (e.g., API + Database).
- **End-to-End Tests (10%):** Test full user flows in a browser.

## 2. Types of Tests

### 2.1 Unit Tests (Jest)
- **Scope:** Individual services, utility functions, DTO validators.
- **Location:** `*.spec.ts` files next to the source code.
- **Coverage Target:** 80% for critical business logic.
- **Examples:**
  - Test `TicketService.create()` validates required fields.
  - Test `AuthService.hashPassword()` produces different hashes for the same password (salt).

### 2.2 Integration Tests (Supertest + Jest)
- **Scope:** API endpoints interacting with a test database.
- **Setup:** Uses a separate test database (`itsm_pro_test`) seeded before each test suite.
- **Examples:**
  - `POST /api/v1/tickets` returns 201 and creates a record in the DB.
  - `GET /api/v1/tickets` returns only tickets for the current tenant.

### 2.3 End-to-End Tests (Playwright)
- **Scope:** Full user journeys in a real browser.
- **Setup:** Runs against a locally running application (frontend + backend).
- **Examples:**
  - Employee logs in → creates a ticket → sees it in the list.
  - Admin assigns ticket → Technician accepts → updates status → Employee sees the update.
  - Super Admin logs in → suspends a tenant → Tenant users cannot log in.

### 2.4 Tenant Isolation Tests (Critical)
- **Scope:** Ensure no cross-tenant data leaks.
- **Approach:** Automated tests that attempt to access Tenant B's data using Tenant A's token.
- **Expected:** All such requests return 403 Forbidden or 404 Not Found.
- **Examples:**
  - `GET /api/v1/tickets/:id` where ticket belongs to Tenant B, but user is from Tenant A → 404.
  - `GET /api/v1/assets` → returns only Tenant A's assets.

### 2.5 Security Tests
- **Authentication:** Unauthenticated requests to protected endpoints return 401.
- **Authorization:** Employee cannot access `/api/v1/users` (Admin only) → 403.
- **Input Validation:** Malformed payloads return 400.
- **Rate Limiting:** Exceeding 100 requests/minute returns 429.
- **SQL Injection:** Attempts with `' OR 1=1 --` are safely parameterized.

## 3. Test Automation & CI
- **Local Testing:** Run `pnpm test` in each app.
- **Pre-commit Hook:** Husky runs ESLint and unit tests before every commit.
- **CI Pipeline (Future):** GitHub Actions runs:
  1. `pnpm lint`
  2. `pnpm typecheck`
  3. `pnpm test`
  4. `pnpm build`
  5. Playwright E2E tests on a staging server.

## 4. Testing Per Phase
| Phase | Focus Area | Test Type |
| :--- | :--- | :--- |
| Phase 1 | Health endpoints, DB connection | Unit + Integration |
| Phase 2 | Auth, RBAC, Tenant Isolation | Integration + E2E |
| Phase 3 | Portal login flows | E2E |
| Phase 4 | Asset CRUD, assignment | Integration |
| Phase 5 | Agent enrollment, telemetry ingestion | Integration |
| Phase 6 | Billing, subscription limits | Integration |
| Phase 7 | Troubleshooting rules | Unit |
| Phase 8 | SLA tracking, maintenance | Integration |
| Phase 9 | Technician job flows | E2E |
| Phase 10 | Network device polling (mocked) | Unit |
| Phase 11 | Remote session consent flow | E2E |
| Phase 12 | Report generation | Integration |
| Phase 13 | Security audit (OWASP) | Manual + Automated |
| Phase 14 | Full regression | All types |

## 5. Bug Reporting Protocol
When a bug is found:
1. Create an issue in `TODO.md` with steps to reproduce.
2. Assign a priority (Critical, High, Medium, Low).
3. Fix, write a test to prevent regression, then close.

## 6. Definition of Done
A feature is "done" only when:
- Code is written and reviewed.
- Unit and integration tests pass.
- E2E test covers the happy path.
- Tenant isolation is verified (if applicable).
- Documentation is updated.