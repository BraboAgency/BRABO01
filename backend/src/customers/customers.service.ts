import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './customers.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.customer.findMany({
      include: { vehicles: true }
    });
  }

  async create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        notificationEmail: dto.notificationEmail ?? true,
        notificationWhatsApp: dto.notificationWhatsApp ?? false,
        notificationPush: dto.notificationPush ?? false
      }
    });
  }
}
