// seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Predefined hashed password for all users
  const hashedPassword = "$2a$10$jCqevNo/mkg./m8Izyp4Pel.oToZ8lXEDqBHGyrr2m7LcrSfVHT4a";

  // Create an array to hold all the user data
  const userData = [];

  // Add an admin user first
  userData.push({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
    verified: true,
    password: hashedPassword,
  });

  // Generate regular users
  for (let index = 0; index < 750; index++) {
    const UserName = 'User ' + index;
    userData.push({
      name: UserName,
      email: UserName + '@example.com',
      role: 'USER',
      verified: true,
      password: hashedPassword,
    });
  }

  // Map userData to promises of user creation
  const userCreationPromises = userData.map(user => prisma.user.create({ data: user }));

  // Use Promise.all to execute all the user creation promises concurrently
  const users = await Promise.all(userCreationPromises);

  // Log the IDs of the created users
  users.forEach(user => console.log(`Created user with id: ${user.id}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });