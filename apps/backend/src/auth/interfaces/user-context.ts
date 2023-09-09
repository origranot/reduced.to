import { Role } from '@reduced.to/prisma';

export interface UserContext {
  id: string;
  email: string;
  name: string;
  refreshToken: string;
  role: Role;
  verificationToken: string;
  verified: boolean;
}
