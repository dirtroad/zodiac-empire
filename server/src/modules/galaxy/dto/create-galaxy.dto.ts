import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateGalaxyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  type?: number;
}