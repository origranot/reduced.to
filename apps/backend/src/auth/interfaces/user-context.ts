import { Role } from '@reduced.to/prisma';
import { PLAN_LEVELS } from '@reduced.to/subscription-manager';

export interface UserContext {
  id: string;
  email: string;
  name: string;
  role: Role;
  plan?: keyof typeof PLAN_LEVELS;
  refreshToken?: string;
  verificationToken?: string;
  verified: boolean;
}
