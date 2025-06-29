import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient({});

const main = async () => {
  const roles = ['Client', 'Manager', 'Admin'];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role,
      },
      create: {
        name: role,
      },
      update: {
        name: role,
      },
    });
  }
};

main()
  .then(async () => {
    console.log('All seeds ran successfully');
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  });
