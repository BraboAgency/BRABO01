import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async summary() {
    const [totalAppointments, delivered, averagePerStage] = await Promise.all([
      this.prisma.appointment.count(),
      this.prisma.appointment.count({ where: { status: 'DELIVERED' } }),
      this.prisma.appointmentStatusEvent.groupBy({
        by: ['pipelineStatus'],
        _count: { pipelineStatus: true }
      })
    ]);

    return {
      totalAppointments,
      delivered,
      byStage: averagePerStage
    };
  }
}
