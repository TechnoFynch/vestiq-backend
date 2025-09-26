import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit: number = 20;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page: number = 1;
}
