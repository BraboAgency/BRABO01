import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateVehicleDto } from './vehicles.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Get()
  @Roles(Role.MANAGER, Role.RECEPTION)
  async list() {
    return this.vehiclesService.list();
  }

  @Post()
  @Roles(Role.MANAGER, Role.RECEPTION)
  async create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }
}
