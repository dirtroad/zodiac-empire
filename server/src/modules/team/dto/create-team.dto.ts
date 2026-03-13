import { IsString, IsOptional, IsNumber, MaxLength, Min, Max } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(10)
  maxMembers?: number;
}