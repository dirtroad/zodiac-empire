import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateListingDto {
  // itemType 支持字符串和数字，自动转换为数字
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const map: Record<string, number> = {
        'equipment': 1, 'weapon': 1, 'armor': 1,
        'resource': 2, 'gold': 2, 'crystal': 2,
        'item': 3, 'prop': 3,
      };
      return map[value.toLowerCase()] || 1;
    }
    return value;
  })
  @IsNumber()
  itemType: number;

  @Type(() => Number)
  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsString()
  itemName?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  price: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  currency?: number; // 1 金币 2 钻石 3 时空晶体
}
