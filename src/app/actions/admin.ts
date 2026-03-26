"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

async function checkAdmin() {
  const session = await getServerSession();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function uploadArticles(
  articles: { id: string; content: string }[],
) {
  await checkAdmin();
  try {
    const result = await prisma.article.createMany({
      data: articles.map((a) => ({
        id: String(a.id),
        content: String(a.content),
        status: "PENDING",
      })),
      skipDuplicates: true,
    });
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Upload Error:", error);
    return { error: "Failed to upload articles" };
  }
}

export async function getStats() {
  await checkAdmin();
  const totalArticles = await prisma.article.count();
  const completedArticles = await prisma.article.count({
    where: { status: "COMPLETED" },
  });

  const usersCount = await prisma.user.findMany({
    select: {
      email: true,
      _count: {
        select: { annotations: true },
      },
    },
    orderBy: {
      annotations: {
        _count: "desc",
      },
    },
  });

  return { totalArticles, completedArticles, leaderboard: usersCount };
}

export async function exportAnnotations() {
  await checkAdmin();
  const annotations = await prisma.annotation.findMany({
    include: {
      article: true,
      user: {
        select: { email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return annotations.map((a: any) => ({
    annotationId: a.id,
    question: a.question,
    createdAt: a.createdAt,
    articleId: a.article.id,
    articleContent: a.article.content,
    userEmail: a.user.email,
  }));
}
