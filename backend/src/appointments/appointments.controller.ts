import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
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
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get('daily')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.RECEPTION, Role.TECHNICIAN)
  async listDaily(@Query('date') date: string) {
    return this.appointmentsService.listDaily(date);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.RECEPTION)
  async create(@Body() dto: CreateAppointmentDto, @Req() req: { user: { id: string } }) {
    return this.appointmentsService.createInternal(dto, req.user.id);
  }

  @Post('public')
  async createPublic(@Body() dto: PublicAppointmentDto) {
    return this.appointmentsService.createPublic(dto);
  }

  @Put(':id/check-in')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.RECEPTION)
  async checkIn(@Param('id') id: string, @Body() dto: CheckInDto, @Req() req: { user: { id: string } }) {
    return this.appointmentsService.checkIn(id, dto, req.user.id);
  }

  @Put(':id/pipeline')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.RECEPTION, Role.TECHNICIAN)
  async updatePipeline(
    @Param('id') id: string,
    @Body() dto: UpdatePipelineDto,
    @Req() req: { user: { id: string } }
  ) {
    return this.appointmentsService.updatePipeline(id, dto, req.user.id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.RECEPTION)
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.appointmentsService.updateStatus(id, dto);
  }

  @Put(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.RECEPTION)
  async assign(@Param('id') id: string, @Body() dto: AssignMechanicDto) {
    return this.appointmentsService.assignMechanic(id, dto);
  }

  @Post(':id/consumables')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.TECHNICIAN)
  async addConsumable(
    @Param('id') id: string,
    @Body() dto: AddConsumableDto,
    @Req() req: { user: { id: string } }
  ) {
    return this.appointmentsService.addConsumable(id, dto, req.user.id);
  }

  @Put(':id/eta')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.RECEPTION)
  async updateEta(@Param('id') id: string, @Body() dto: UpdateEtaDto) {
    return this.appointmentsService.updateEta(id, dto);
  }
}

@Controller('public')
export class PublicTrackingController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get('track/:trackingCode')
  async track(@Param('trackingCode') trackingCode: string) {
    return this.appointmentsService.track(trackingCode);
  }
}
