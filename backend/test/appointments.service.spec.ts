import { AppointmentsService } from '../src/appointments/appointments.service';
import { PipelineStatus } from '@prisma/client';

const prisma = {
  appointment: {
    findUnique: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn()
  },
  appointmentStatusEvent: { create: jest.fn() },
  customer: { create: jest.fn() },
  vehicle: { create: jest.fn() },
  consumable: { create: jest.fn() }
};

const notifications = { logNotification: jest.fn() };

describe('AppointmentsService', () => {
  it('updates pipeline status and logs event', async () => {
    prisma.appointment.findUnique.mockResolvedValue({ id: 'app-1', pipelineStatus: PipelineStatus.RECIBIDO });
    prisma.appointment.update.mockResolvedValue({ id: 'app-1', customer: { email: 'c@c.com', name: 'Carlos' } });

    const service = new AppointmentsService(prisma as any, notifications as any);
    const result = await service.updatePipeline(
      'app-1',
      { pipelineStatus: PipelineStatus.SERVICIO, notes: 'En servicio' },
      'user-1'
    );

    expect(result.id).toEqual('app-1');
    expect(prisma.appointmentStatusEvent.create).toHaveBeenCalled();
  });
});
