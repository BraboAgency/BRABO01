import { Module } from '@nestjs/common';
import { InvoicesController, PublicInvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  controllers: [InvoicesController, PublicInvoicesController],
  providers: [InvoicesService]
})
export class InvoicesModule {}
