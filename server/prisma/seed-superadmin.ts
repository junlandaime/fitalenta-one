import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

const superAdminData = {
  email: process.env.SUPERADMIN_EMAIL || "superadmin@fitalenta.id",
  password: process.env.SUPERADMIN_PASSWORD || "SuperAdmin@123",
  name: "Super Admin",
  phone: "081234567899",
  role: "superadmin" as const,
};

async function seedSuperAdmin() {
  const existing = await prisma.user.findUnique({
    where: { email: superAdminData.email },
  });

  const hashedPassword = await bcrypt.hash(superAdminData.password, 10);

  const data = {
    email: superAdminData.email,
    password: hashedPassword,
    name: superAdminData.name,
    phone: superAdminData.phone,
    role: superAdminData.role,
    emailVerifiedAt: new Date(),
  };

  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data });
    console.log(`✔ Updated: ${superAdminData.email} (superadmin)`);
  } else {
    await prisma.user.create({ data });
    console.log(`✔ Created: ${superAdminData.email} (superadmin)`);
  }

  console.log("\nAkun superadmin berhasil di-seed.");
  console.log(`Email   : ${superAdminData.email}`);
  console.log(`Password: ${superAdminData.password}`);
}

async function main() {
  await seedSuperAdmin();
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
