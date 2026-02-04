import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AppointmentStatus, PipelineStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsString()
  customerId: string;

  @IsString()
  vehicleId: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsString()
  assignedMechanicId?: string;
}

export class PublicAppointmentDto {
  @IsString()
  customerName: string;

  @IsString()
  customerPhone: string;

  @IsString()
  customerEmail: string;

  @IsDateString()
  scheduledAt: string;

  @IsString()
  vehicleMake: string;

  @IsString()
  vehicleModel: string;

  @IsInt()
  @Min(1900)
  vehicleYear: number;

  @IsOptional()
  @IsString()
  vehiclePlate?: string;

  @IsOptional()
  @IsString()
  serviceNotes?: string;
}

export class CheckInDto {
  @IsDateString()
  checkInAt: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  odometer?: number;
}

export class UpdatePipelineDto {
  @IsEnum(PipelineStatus)
  pipelineStatus: PipelineStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}

export class AssignMechanicDto {
  @IsString()
  mechanicId: string;
}

export class AddConsumableDto {
  @IsString()
  oilBrand: string;

  @IsString()
  oilSpec: string;

  @IsInt()
  @Min(0)
  oilQuantity: number;

  @IsOptional()
  @IsString()
  filterBrand?: string;

  @IsOptional()
  @IsString()
  filterCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateEtaDto {
  @IsDateString()
  eta: string;
}
