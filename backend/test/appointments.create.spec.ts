import { AppointmentsService } from '../src/appointments/appointments.service';
import { PipelineStatus } from '@prisma/client';

const prisma = {
  appointment: { create: jest.fn() },
  appointmentStatusEvent: { create: jest.fn() }
};
const notifications = { logNotification: jest.fn() };

describe('AppointmentsService createInternal', () => {
  it('creates appointment and logs initial event', async () => {
    prisma.appointment.create.mockResolvedValue({ id: 'app-2', customer: {}, vehicle: {} });

    const service = new AppointmentsService(prisma as any, notifications as any);
    const result = await service.createInternal(
      {
        customerId: 'cust-1',
        vehicleId: 'veh-1',
        scheduledAt: new Date().toISOString()
      },
      'user-1'
    );

    expect(result.id).toEqual('app-2');
    expect(prisma.appointmentStatusEvent.create).toHaveBeenCalledWith({
      data: {
        appointmentId: 'app-2',
        pipelineStatus: PipelineStatus.RECIBIDO,
        notes: 'Cita creada',
        createdById: 'user-1'
      }
    });
  });
});
