import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { RequestInvoiceDto, UpdateInvoiceDto } from './invoices.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Get()
  @Roles(Role.MANAGER, Role.RECEPTION)
  async list() {
    return this.invoicesService.list();
  }

  @Put(':id')
  @Roles(Role.MANAGER, Role.RECEPTION)
  async update(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, dto);
  }
}

@Controller('public')
export class PublicInvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Post('appointments/:id/invoice')
  async requestInvoice(
    @Param('id') appointmentId: string,
    @Body() dto: RequestInvoiceDto,
    @Req() req: { user?: { id: string } }
  ) {
    return this.invoicesService.request(appointmentId, dto, req.user?.id);
  }
}
