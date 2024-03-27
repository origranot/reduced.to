import { Role } from '@rt/prisma';

export interface UserContext {
  id: string;
  email: string;
  name: string;
  role: Role;
  refreshToken?: string;
  verificationToken?: string;
  verified: boolean;
}
