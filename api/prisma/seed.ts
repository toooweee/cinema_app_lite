import { PrismaClient } from '../generated/prisma';
import * as argon from 'argon2';

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

  const adminUserData = {
    email: 'admin@example.com',
    password: 'string',
    isActivated: true,
    activationLink: 'adminactivated.ru',
  };

  const hashedPassword = await argon.hash(adminUserData.password);

  const user = await prisma.user.upsert({
    where: {
      email: adminUserData.email,
    },
    update: {
      ...adminUserData,
      password: hashedPassword,
    },
    create: {
      ...adminUserData,
      password: hashedPassword,
    },
  });

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: {
      name: 'Admin',
    },
  });

  const adminEmployeeData = {
    name: 'Гадиляев Ислам Ильгамович',
    employmentDate: new Date(),
    role: adminRole,
  };

  await prisma.employee.upsert({
    where: {
      userId: user.id,
    },
    update: {
      name: adminEmployeeData.name,
      employmentDate: adminEmployeeData.employmentDate,
      userId: user.id,
      roleId: adminRole.id,
    },
    create: {
      ...adminEmployeeData,
      user: {
        connect: { id: user.id },
      },
      role: {
        connect: { id: adminRole.id },
      },
    },
  });
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
