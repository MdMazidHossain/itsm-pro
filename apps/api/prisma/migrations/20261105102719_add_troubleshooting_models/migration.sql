-- CreateEnum
CREATE TYPE "DiagnosticSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RemediationStatus" AS ENUM ('PENDING', 'APPROVED', 'EXECUTED', 'REJECTED', 'FAILED');

-- CreateTable
CREATE TABLE "Diagnostic" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "deviceId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "DiagnosticSeverity" NOT NULL DEFAULT 'INFO',
    "category" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Diagnostic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RemediationAction" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "diagnosticId" TEXT NOT NULL,
    "actionName" TEXT NOT NULL,
    "status" "RemediationStatus" NOT NULL DEFAULT 'PENDING',
    "approvedById" TEXT,
    "executedAt" TIMESTAMP(3),
    "result" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RemediationAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Diagnostic_tenantId_idx" ON "Diagnostic"("tenantId");

-- CreateIndex
CREATE INDEX "Diagnostic_deviceId_idx" ON "Diagnostic"("deviceId");

-- CreateIndex
CREATE INDEX "Diagnostic_severity_idx" ON "Diagnostic"("severity");

-- CreateIndex
CREATE INDEX "RemediationAction_tenantId_idx" ON "RemediationAction"("tenantId");

-- CreateIndex
CREATE INDEX "RemediationAction_status_idx" ON "RemediationAction"("status");

-- AddForeignKey
ALTER TABLE "Diagnostic" ADD CONSTRAINT "Diagnostic_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostic" ADD CONSTRAINT "Diagnostic_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemediationAction" ADD CONSTRAINT "RemediationAction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemediationAction" ADD CONSTRAINT "RemediationAction_diagnosticId_fkey" FOREIGN KEY ("diagnosticId") REFERENCES "Diagnostic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
