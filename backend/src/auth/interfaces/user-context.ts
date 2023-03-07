import { Role } from '@prisma/client';

export interface UserContext {
  id: string;
  email: string;
  name: string;
  refreshToken: string;
  role: Role;
  verificationToken: string;
  verified: boolean;
}
