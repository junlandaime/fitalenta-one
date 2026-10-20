import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

interface AdminSeed {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: "admin" | "editor";
}

const admins: AdminSeed[] = [
  {
    email: "admin@fitalenta.id",
    password: "Admin@123",
    name: "Super Admin",
    phone: "081234567890",
    role: "admin",
  },
  {
    email: "editor@fitalenta.id",
    password: "Editor@123",
    name: "Editor Fitalenta",
    phone: "081234567891",
    role: "editor",
  },
];

async function seedAdmins() {
  let count = 0;

  for (const admin of admins) {
    const existing = await prisma.user.findUnique({
      where: { email: admin.email },
    });

    const hashedPassword = await bcrypt.hash(admin.password, 10);

    const data = {
      email: admin.email,
      password: hashedPassword,
      name: admin.name,
      phone: admin.phone ?? null,
      role: admin.role,
      emailVerifiedAt: new Date(),
    };

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data,
      });
      console.log(`✔ Updated: ${admin.email} (${admin.role})`);
    } else {
      await prisma.user.create({ data });
      console.log(`✔ Created: ${admin.email} (${admin.role})`);
    }

    count++;
  }

  console.log(`\n${count} akun admin berhasil di-seed.`);
}

async function main() {
  await seedAdmins();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
