import { IsDefined, IsString, MaxLength } from 'class-validator';

export class UpdatePlanDto {
  @IsString()
  @IsDefined()
  @MaxLength(40)
  itemId: string;

  @IsString()
  @IsDefined()
  @MaxLength(40)
  planId: string;

  @IsString()
  @IsDefined()
  @MaxLength(40)
  operationType: 'upgrade' | 'downgrade';
}
