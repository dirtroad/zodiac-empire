import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreateListingDto {
  @IsNumber()
  itemType: number; // 1装备 2资源 3道具

  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsString()
  itemName?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsNumber()
  @Min(1)
  price: number;

  @IsOptional()
  @IsNumber()
  currency?: number; // 1金币 2钻石 3时空晶体
}