import { Injectable } from '@nestjs/common';
import { NotificationChannel, NotificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async logNotification(params: {
    appointmentId: string;
    channel: NotificationChannel;
    destination: string;
    template: string;
    payload: Record<string, unknown>;
    status?: NotificationStatus;
  }) {
    return this.prisma.notificationLog.create({
      data: {
        appointmentId: params.appointmentId,
        channel: params.channel,
        destination: params.destination,
        template: params.template,
        payload: params.payload,
        status: params.status ?? NotificationStatus.PENDING
      }
    });
  }
}
