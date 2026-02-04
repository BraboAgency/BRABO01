-- Create enums
CREATE TYPE "Role" AS ENUM ('MANAGER', 'TECHNICIAN', 'RECEPTION', 'CUSTOMER');
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED', 'NO_SHOW');
CREATE TYPE "PipelineStatus" AS ENUM ('RECIBIDO', 'REVISION', 'PRUEBA_MANEJO', 'SERVICIO', 'PREPARACION', 'LISTO');
CREATE TYPE "InvoiceStatus" AS ENUM ('SOLICITADA', 'EN_PROCESO', 'ENVIADA', 'RECHAZADA');
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'WHATSAPP', 'PUSH');
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  "phone" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "RefreshToken" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "User"("id"),
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Customer" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "notificationEmail" BOOLEAN NOT NULL DEFAULT TRUE,
  "notificationWhatsApp" BOOLEAN NOT NULL DEFAULT FALSE,
  "notificationPush" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Vehicle" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "customerId" UUID NOT NULL REFERENCES "Customer"("id"),
  "make" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "plate" TEXT,
  "vin" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Appointment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "customerId" UUID NOT NULL REFERENCES "Customer"("id"),
  "vehicleId" UUID NOT NULL REFERENCES "Vehicle"("id"),
  "scheduledAt" TIMESTAMP NOT NULL,
  "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
  "pipelineStatus" "PipelineStatus" NOT NULL DEFAULT 'RECIBIDO',
  "assignedMechanicId" UUID REFERENCES "User"("id"),
  "createdById" UUID REFERENCES "User"("id"),
  "checkInAt" TIMESTAMP,
  "checkInNotes" TEXT,
  "odometer" INTEGER,
  "eta" TIMESTAMP,
  "trackingCode" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "AppointmentStatusEvent" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "appointmentId" UUID NOT NULL REFERENCES "Appointment"("id"),
  "pipelineStatus" "PipelineStatus" NOT NULL,
  "notes" TEXT,
  "createdById" UUID REFERENCES "User"("id"),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Consumable" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "appointmentId" UUID NOT NULL REFERENCES "Appointment"("id"),
  "oilBrand" TEXT NOT NULL,
  "oilSpec" TEXT NOT NULL,
  "oilQuantity" DOUBLE PRECISION NOT NULL,
  "filterBrand" TEXT,
  "filterCode" TEXT,
  "applies" BOOLEAN NOT NULL DEFAULT TRUE,
  "notes" TEXT,
  "createdById" UUID NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "InvoiceRequest" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "appointmentId" UUID NOT NULL REFERENCES "Appointment"("id"),
  "status" "InvoiceStatus" NOT NULL DEFAULT 'SOLICITADA',
  "note" TEXT,
  "pdfUrl" TEXT,
  "requestedById" UUID,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "NotificationLog" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "appointmentId" UUID NOT NULL REFERENCES "Appointment"("id"),
  "channel" "NotificationChannel" NOT NULL,
  "destination" TEXT NOT NULL,
  "template" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "AuditEvent" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "actorId" UUID NOT NULL REFERENCES "User"("id"),
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");
CREATE INDEX "Appointment_pipeline_idx" ON "Appointment"("pipelineStatus");
CREATE INDEX "Appointment_scheduled_idx" ON "Appointment"("scheduledAt");
