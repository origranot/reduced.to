import { IsDefined, IsString, MaxLength } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsDefined()
  @MaxLength(30)
  category: string;

  @IsString()
  @IsDefined()
  @MaxLength(50)
  link: string;
}
