import { SetMetadata } from '@nestjs/common';

export const IS_VERFIED_KEY = 'isVerified';
export const IsVerified = () => SetMetadata(IS_VERFIED_KEY, true);
