import { IsString, IsNumber, IsOptional, IsBoolean, IsUrl, MaxLength } from 'class-validator';

export class UploadCardDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsNumber()
  contentType: number; // 1图片 2视频

  @IsUrl()
  contentUrl: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}