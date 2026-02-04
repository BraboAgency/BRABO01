import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RequestInvoiceDto, UpdateInvoiceDto } from './invoices.dto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.invoiceRequest.findMany({
      include: { appointment: { include: { customer: true, vehicle: true } } }
    });
  }

  async request(appointmentId: string, dto: RequestInvoiceDto, requestedById?: string) {
    await this.ensureAppointment(appointmentId);
    return this.prisma.invoiceRequest.create({
      data: {
        appointmentId,
        status: InvoiceStatus.SOLICITADA,
        note: dto.note,
        requestedById
      }
    });
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    return this.prisma.invoiceRequest.update({
      where: { id },
      data: {
        status: dto.status,
        note: dto.note,
        pdfUrl: dto.pdfUrl
      }
    });
  }

  private async ensureAppointment(id: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }
    return appointment;
  }
}
