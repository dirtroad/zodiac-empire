import { IsNumber, Min, Max } from 'class-validator';

export class EquipDto {
  @IsNumber()
  @Min(1)
  equipmentId: number;

  @IsNumber()
  @Min(1)
  @Max(6)
  slot: number; // 1武器 2头盔 3衣服 4鞋子 5饰品1 6饰品2
}