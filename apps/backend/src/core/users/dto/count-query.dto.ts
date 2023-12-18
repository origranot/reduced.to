import { IsOptional, IsBoolean, IsDateString, IsString, IsBooleanString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @IsBooleanString()
  verified: boolean;
}
