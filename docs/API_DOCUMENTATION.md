# API Documentation - ITSM Pro

## 1. General API Rules
- **Base URL:** `/api/v1`
- **Authentication:** All endpoints (except `/auth/*` and `/tenants/register`) require a valid JWT Access Token in the `Authorization: Bearer <token>` header.
- **Tenant Context:** The `tenantId` is extracted from the JWT. It must NOT be passed in the request body.
- **Response Format:**
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Operation successful"
  }

  {
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Ticket not found"
  }
}

