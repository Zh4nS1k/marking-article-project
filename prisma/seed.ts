import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10); // nosec

  const admin = await prisma.user.upsert({
    where: { email: "admin@legalannotator.com" },
    update: {},
    create: {
      email: "admin@legalannotator.com",
      password: hashedPassword, // nosec
      role: "ADMIN",
    },
  });

  console.log(`Created admin user with email: ${admin.email}`);

  const articles = [
    {
      id: "art-1",
      content: "The defendant shall pay the sum of $10,000.",
      status: "PENDING",
    },
    {
      id: "art-2",
      content: "Force majeure clauses excuse non-performance.",
      status: "PENDING",
    },
    {
      id: "art-3",
      content: "Intellectual property rights remain with the creator.",
      status: "COMPLETED",
    },
    {
      id: "art-4",
      content: "Either party may terminate the agreement with 30 days notice.",
      status: "PENDING",
    },
    {
      id: "art-5",
      content:
        "Confidentiality obligations survive termination binding successors.",
      status: "PENDING",
    },
  ];

  for (const article of articles) {
    // @ts-ignore
    await prisma.article.upsert({
      where: { id: article.id },
      update: {},
      create: article,
    });
  }

  console.log("Seeded 5 articles.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
