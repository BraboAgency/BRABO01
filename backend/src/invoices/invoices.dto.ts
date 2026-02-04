import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InvoiceStatus } from '@prisma/client';

export class RequestInvoiceDto {
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateInvoiceDto {
  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  pdfUrl?: string;
}
