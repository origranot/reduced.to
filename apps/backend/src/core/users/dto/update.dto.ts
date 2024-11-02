import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @MinLength(3)
  displayName: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}
