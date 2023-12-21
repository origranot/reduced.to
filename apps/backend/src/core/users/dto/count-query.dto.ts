import { IsOptional, IsBoolean, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CountQueryDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  verified: boolean;
}
