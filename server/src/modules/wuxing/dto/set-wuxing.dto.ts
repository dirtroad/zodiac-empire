import { IsString, IsOptional } from 'class-validator';

export class SetWuxingDto {
  @IsString()
  birthDate: string; // 农历生日 YYYY-MM-DD

  @IsOptional()
  @IsString()
  birthTime?: string; // 出生时辰
}