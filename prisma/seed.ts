// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Buat Jabatan
  const positionManager = await prisma.position.create({
    data: { name: 'Manager' },
  });

  const positionSupervisor = await prisma.position.create({
    data: { name: 'Supervisor' },
  });

  const positionStaff = await prisma.position.create({
    data: { name: 'Staff' },
  });

  const positionParttime = await prisma.position.create({
    data: { name: 'Part Time' },
  });

  const positionFulltime = await prisma.position.create({
    data: { name: 'Full Time' },
  });

  const positions = [
    positionManager,
    positionSupervisor,
    positionStaff,
    positionParttime,
    positionFulltime,
  ];

  // Buat Unit
  const unitIT = await prisma.unit.create({
    data: {
      name: 'IT Department',
    },
  });

  const unitHR = await prisma.unit.create({
    data: { name: 'HR Department' },
  });

  const unitAcc = await prisma.unit.create({
    data: { name: 'Accounting Department' },
  });

  const unitCln = await prisma.unit.create({
    data: { name: 'Cleaning Department' },
  });

  const units = [unitIT, unitHR, unitAcc, unitCln];

  // Buat 100 Karyawan
  const users = [];
  for (let i = 1; i <= 100; i++) {
    const randomUnit = units[Math.floor(Math.random() * units.length)];
    const randomPositions = positions
      .sort(() => Math.random() - 0.5) // Shuffle
      .slice(0, Math.floor(Math.random() * positions.length) + 1); // Pilih 1-3 jabatan

    const salt = await bcrypt.genSalt();
    const user = await prisma.user.create({
      data: {
        // name: `employee_${i}`,
        name: `Employee ${i}`,
        username: `employee_${i}`,
        password: await bcrypt.hash('admin', salt),
        joinDate: new Date(),
        // jumlahLogin: 25,
        unit: {
          connect: { id: randomUnit.id },
        },
        positions: {
          connect: randomPositions.map((jabatan) => ({ id: jabatan.id })),
        },
      },
    });
    users.push(user);
  }

  console.log('Users created:', users);

  // Buat 200 Data Login
  const logins = [];
  for (let i = 1; i <= 200; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomTimestamp = new Date(
      Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within 1 year
    );

    const login = await prisma.login.create({
      data: {
        userId: randomUser.id,
        timestamp: randomTimestamp,
      },
    });
    logins.push(login);
  }

  console.log('Seeding success', users, logins);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
