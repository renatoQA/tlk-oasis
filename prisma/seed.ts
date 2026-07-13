import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const TEAMS = [
  { name: "TLK Karma", slug: "karma" },
  { name: "TLK Alfa", slug: "alfa" },
  { name: "TLK Omega", slug: "omega" },
];

async function main() {
  for (const team of TEAMS) {
    await db.team.upsert({
      where: { slug: team.slug },
      update: {},
      create: team,
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@tlk.gg";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "TrocarSenha123!";

  const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.user.create({
      data: {
        email: adminEmail,
        name: "Admin TLK",
        role: "ADMIN",
        passwordHash,
      },
    });
    console.log(`Admin criado: ${adminEmail} / ${adminPassword} (troque a senha após o primeiro login)`);
  } else {
    console.log(`Admin já existe: ${adminEmail}`);
  }

  console.log("Seed concluído: times Karma/Alfa/Omega garantidos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
