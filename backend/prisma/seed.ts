import { PrismaClient, Role, PipelineStatus, AppointmentStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'admin@taller.com' },
    update: {},
    create: {
      email: 'admin@taller.com',
      passwordHash,
      name: 'Gerente General',
      role: Role.MANAGER,
      phone: '+52 55 0000 0000'
    }
  });

  const reception = await prisma.user.upsert({
    where: { email: 'recepcion@taller.com' },
    update: {},
    create: {
      email: 'recepcion@taller.com',
      passwordHash: await bcrypt.hash('Recepcion123!', 10),
      name: 'Recepción',
      role: Role.RECEPTION,
      phone: '+52 55 1111 1111'
    }
  });

  const technician = await prisma.user.upsert({
    where: { email: 'tecnico@taller.com' },
    update: {},
    create: {
      email: 'tecnico@taller.com',
      passwordHash: await bcrypt.hash('Tecnico123!', 10),
      name: 'Técnico Asignado',
      role: Role.TECHNICIAN,
      phone: '+52 55 2222 2222'
    }
  });

  const customer = await prisma.customer.create({
    data: {
      name: 'Carlos Ramírez',
      email: 'carlos@email.com',
      phone: '+52 55 3333 3333',
      notificationEmail: true,
      notificationWhatsApp: true
    }
  });

  const vehicle = await prisma.vehicle.create({
    data: {
      customerId: customer.id,
      make: 'Toyota',
      model: 'Corolla',
      year: 2018,
      plate: 'ABC-123'
    }
  });

  const appointment = await prisma.appointment.create({
    data: {
      customerId: customer.id,
      vehicleId: vehicle.id,
      scheduledAt: new Date(new Date().setHours(8, 0, 0, 0)),
      status: AppointmentStatus.CONFIRMED,
      pipelineStatus: PipelineStatus.RECIBIDO,
      assignedMechanicId: technician.id,
      createdById: reception.id,
      trackingCode: randomUUID().split('-')[0]
    }
  });

  await prisma.appointmentStatusEvent.create({
    data: {
      appointmentId: appointment.id,
      pipelineStatus: PipelineStatus.RECIBIDO,
      notes: 'Auto recibido y verificado en entrada.',
      createdById: reception.id
    }
  });

  await prisma.consumable.create({
    data: {
      appointmentId: appointment.id,
      oilBrand: 'Valvoline',
      oilSpec: 'ATF Dexron VI',
      oilQuantity: 6.5,
      filterBrand: 'OEM',
      filterCode: 'TR-234',
      applies: true,
      notes: 'Cambio completo',
      createdById: technician.id
    }
  });

  await prisma.invoiceRequest.create({
    data: {
      appointmentId: appointment.id,
      status: 'SOLICITADA',
      note: 'Enviar factura a correo',
      requestedById: manager.id
    }
  });
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
