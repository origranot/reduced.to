import { UrlDto } from './url.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUrlDto extends PartialType(UrlDto) {}
