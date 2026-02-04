import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentStatus, NotificationChannel, PipelineStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  AddConsumableDto,
  AssignMechanicDto,
  CheckInDto,
  CreateAppointmentDto,
  PublicAppointmentDto,
  UpdateEtaDto,
  UpdatePipelineDto,
  UpdateStatusDto
} from './appointments.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async listDaily(date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return this.prisma.appointment.findMany({
      where: { scheduledAt: { gte: start, lt: end } },
      include: { customer: true, vehicle: true, assignedMechanic: true, statusEvents: true }
    });
  }

  async createInternal(dto: CreateAppointmentDto, createdById: string) {
    const appointment = await this.prisma.appointment.create({
      data: {
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        scheduledAt: new Date(dto.scheduledAt),
        assignedMechanicId: dto.assignedMechanicId,
        createdById,
        trackingCode: randomUUID().split('-')[0]
      },
      include: { customer: true, vehicle: true }
    });

    await this.logEvent(appointment.id, PipelineStatus.RECIBIDO, createdById, 'Cita creada');
    return appointment;
  }

  async createPublic(dto: PublicAppointmentDto) {
    const customer = await this.prisma.customer.create({
      data: {
        name: dto.customerName,
        email: dto.customerEmail,
        phone: dto.customerPhone,
        notificationEmail: true,
        notificationWhatsApp: false
      }
    });

    const vehicle = await this.prisma.vehicle.create({
      data: {
        customerId: customer.id,
        make: dto.vehicleMake,
        model: dto.vehicleModel,
        year: dto.vehicleYear,
        plate: dto.vehiclePlate
      }
    });

    const appointment = await this.prisma.appointment.create({
      data: {
        customerId: customer.id,
        vehicleId: vehicle.id,
        scheduledAt: new Date(dto.scheduledAt),
        status: AppointmentStatus.SCHEDULED,
        pipelineStatus: PipelineStatus.RECIBIDO,
        trackingCode: randomUUID().split('-')[0]
      },
      include: { customer: true, vehicle: true }
    });

    await this.logEvent(appointment.id, PipelineStatus.RECIBIDO, null, dto.serviceNotes);

    await this.notificationsService.logNotification({
      appointmentId: appointment.id,
      channel: NotificationChannel.EMAIL,
      destination: appointment.customer.email,
      template: 'appointment_created',
      payload: {
        name: appointment.customer.name,
        scheduledAt: appointment.scheduledAt,
        trackingCode: appointment.trackingCode
      }
    });

    return appointment;
  }

  async checkIn(id: string, dto: CheckInDto, userId: string) {
    const appointment = await this.findById(id);
    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        checkInAt: new Date(dto.checkInAt),
        checkInNotes: dto.notes,
        odometer: dto.odometer,
        status: AppointmentStatus.IN_PROGRESS
      },
      include: { customer: true }
    });

    await this.logEvent(id, appointment.pipelineStatus, userId, 'Check-in realizado');

    await this.notificationsService.logNotification({
      appointmentId: id,
      channel: NotificationChannel.EMAIL,
      destination: updated.customer.email,
      template: 'check_in',
      payload: { name: updated.customer.name }
    });

    return updated;
  }

  async updatePipeline(id: string, dto: UpdatePipelineDto, userId: string) {
    const appointment = await this.findById(id);
    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { pipelineStatus: dto.pipelineStatus },
      include: { customer: true }
    });

    await this.logEvent(id, dto.pipelineStatus, userId, dto.notes);

    await this.notificationsService.logNotification({
      appointmentId: id,
      channel: NotificationChannel.EMAIL,
      destination: updated.customer.email,
      template: 'pipeline_update',
      payload: { name: updated.customer.name, status: dto.pipelineStatus }
    });

    return updated;
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: dto.status }
    });
  }

  async assignMechanic(id: string, dto: AssignMechanicDto) {
    return this.prisma.appointment.update({
      where: { id },
      data: { assignedMechanicId: dto.mechanicId },
      include: { assignedMechanic: true }
    });
  }

  async addConsumable(id: string, dto: AddConsumableDto, userId: string) {
    await this.findById(id);
    return this.prisma.consumable.create({
      data: {
        appointmentId: id,
        oilBrand: dto.oilBrand,
        oilSpec: dto.oilSpec,
        oilQuantity: dto.oilQuantity,
        filterBrand: dto.filterBrand,
        filterCode: dto.filterCode,
        notes: dto.notes,
        createdById: userId
      }
    });
  }

  async updateEta(id: string, dto: UpdateEtaDto) {
    await this.findById(id);
    return this.prisma.appointment.update({
      where: { id },
      data: { eta: new Date(dto.eta) }
    });
  }

  async track(trackingCode: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { trackingCode },
      include: {
        customer: true,
        vehicle: true,
        assignedMechanic: { select: { name: true, role: true } },
        statusEvents: { orderBy: { createdAt: 'asc' } },
        consumables: true,
        invoiceRequests: true
      }
    });

    if (!appointment) {
      throw new NotFoundException('Tracking no encontrado');
    }

    return appointment;
  }

  private async logEvent(
    appointmentId: string,
    pipelineStatus: PipelineStatus,
    createdById: string | null,
    notes?: string
  ) {
    return this.prisma.appointmentStatusEvent.create({
      data: {
        appointmentId,
        pipelineStatus,
        notes,
        createdById: createdById ?? undefined
      }
    });
  }

  private async findById(id: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }
    return appointment;
  }
}
