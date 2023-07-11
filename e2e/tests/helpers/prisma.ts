import { PrismaClient } from '../../../apps/backend/node_modules/.prisma/client';

const prisma = new PrismaClient();

// Reset the DB
(async () => {
  await prisma.user.deleteMany();
})();

export default prisma;
