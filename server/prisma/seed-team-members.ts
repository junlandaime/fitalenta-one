import "dotenv/config";
import fs from "fs";
import path from "path";
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

interface TeamMemberSeed {
  name: string;
  position: string;
  bio: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
}

function readJson<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "prisma", "data", filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

async function seedTeamMembers() {
  const members = readJson<TeamMemberSeed[]>("team-members.json");

  let count = 0;
  for (const m of members) {
    const existing = await prisma.teamMember.findFirst({ where: { name: m.name } });

    const data = {
      name: m.name,
      position: m.position,
      bio: m.bio,
      image: m.image,
      order: m.order,
      isActive: m.isActive,
    };

    if (existing) {
      await prisma.teamMember.update({ where: { id: existing.id }, data });
    } else {
      await prisma.teamMember.create({ data });
    }
    count++;
  }
  console.log(`${count} anggota tim berhasil di-seed`);
}

async function main() {
  await seedTeamMembers();
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