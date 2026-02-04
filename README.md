# BRABO01 - Taller de transmisiones automáticas

MVP completo con **Next.js + NestJS + PostgreSQL + Redis** para agenda de citas, tracking de vehículos, solicitudes de factura y CRM básico.

## Arquitectura (resumen)
- **Frontend**: Next.js + Tailwind (cliente + dashboard interno).
- **Backend**: NestJS + Prisma (API REST, JWT + refresh, RBAC).
- **DB**: PostgreSQL.
- **Colas/Jobs**: Redis + BullMQ (stub de notificaciones). 
- **Infra**: Docker Compose.

## Estructura
```
/backend
/frontend
/infra
```

## Configuración rápida
1. Copia variables de entorno.
```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Levanta todo con Docker Compose.
```
cd infra
 docker compose up --build
```

3. Ejecuta migraciones y seeds.
```
docker compose exec backend npm run prisma:generate
 docker compose exec backend npm run prisma:migrate
 docker compose exec backend npm run prisma:seed
```

## Credenciales demo
- **Gerente (admin)**: `admin@taller.com` / `Admin123!`
- **Recepción**: `recepcion@taller.com` / `Recepcion123!`
- **Técnico**: `tecnico@taller.com` / `Tecnico123!`

## Servicios
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Tests mínimos
```
cd backend
npm test
```

## Variables de entorno (backend)
- `DATABASE_URL`: conexión PostgreSQL.
- `JWT_SECRET`: secreto JWT.
- `PORT`: puerto API.
- `REDIS_URL`: conexión Redis.
- `EMAIL_PROVIDER`, `EMAIL_API_KEY`: integración email.
- `WHATSAPP_PROVIDER`, `WHATSAPP_API_KEY`: integración WhatsApp.

## Variables de entorno (frontend)
- `NEXT_PUBLIC_API_URL`: URL base de API.

## Endpoints principales (resumen)
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /appointments/daily?date=YYYY-MM-DD`
- `POST /appointments` (interno)
- `POST /appointments/public` (cliente)
- `PUT /appointments/:id/check-in`
- `PUT /appointments/:id/pipeline`
- `PUT /appointments/:id/assign`
- `POST /appointments/:id/consumables`
- `GET /public/track/:trackingCode`
- `POST /public/appointments/:id/invoice`
- `GET /invoices`
- `PUT /invoices/:id`
- `GET /reports/summary`
