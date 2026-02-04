import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateCustomerDto } from './customers.dto';
import { CustomersService } from './customers.service';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @Roles(Role.MANAGER, Role.RECEPTION)
  async list() {
    return this.customersService.list();
  }

  @Post()
  @Roles(Role.MANAGER, Role.RECEPTION)
  async create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }
}
