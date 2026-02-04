import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  customerId: string;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsInt()
  @Min(1900)
  year: number;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  vin?: string;
}
