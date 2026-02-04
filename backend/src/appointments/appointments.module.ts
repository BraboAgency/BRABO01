import { Module } from '@nestjs/common';
import { AppointmentsController, PublicTrackingController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [AppointmentsController, PublicTrackingController],
  providers: [AppointmentsService]
})
export class AppointmentsModule {}
