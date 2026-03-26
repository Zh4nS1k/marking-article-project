"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

const schema = z.object({
  articleId: z.string().min(1),
  question: z.string().min(10, "Question must be at least 10 characters long"),
});

export async function submitAnnotation(formData: FormData) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { error: "User not found in DB" };
  }

  const validatedFields = schema.safeParse({
    articleId: formData.get("articleId"),
    question: formData.get("question"),
  });

  if (!validatedFields.success) {
    const errorMsg =
      validatedFields.error.issues?.[0]?.message || "Invalid form data";
    return { error: errorMsg };
  }

  const { articleId, question } = validatedFields.data;

  try {
    // Transaction to ensure both operations succeed or fail together
    await prisma.$transaction([
      prisma.annotation.create({
        data: {
          question,
          articleId,
          userId: user.id,
        },
      }),
      prisma.article.update({
        where: { id: articleId },
        data: { status: "COMPLETED" },
      }),
    ]);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to save annotation" };
  }
}
