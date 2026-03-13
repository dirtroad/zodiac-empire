import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UseCrystalDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  type: number; // 3穿梭 4加速 5匹配

  @IsOptional()
  @IsString()
  description?: string;
}