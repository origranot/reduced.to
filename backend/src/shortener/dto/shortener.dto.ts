import { IsUrl } from 'class-validator';

export class ShortenerDTO {
  @IsUrl()
  originalUrl: string;
}
