import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './vehicles.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.vehicle.findMany({ include: { customer: true } });
  }

  async create(dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        customerId: dto.customerId,
        make: dto.make,
        model: dto.model,
        year: dto.year,
        plate: dto.plate,
        vin: dto.vin
      }
    });
  }
}
