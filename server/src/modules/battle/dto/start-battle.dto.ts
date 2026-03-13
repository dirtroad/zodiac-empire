import { IsNumber } from 'class-validator';

export class StartBattleDto {
  @IsNumber()
  targetId: number;
}