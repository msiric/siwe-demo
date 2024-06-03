"use server";

import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Username is required" })
    .max(20, { message: "Username cannot be over 20 characters long" }),
  bio: z
    .string()
    .trim()
    .max(100, { message: "Bio cannot be over 100 characters long" })
    .optional(),
});

export default async function saveUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions);

  const validatedFields = schema.safeParse({
    username: formData.get("username"),
    bio: formData.get("bio"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, bio } = validatedFields.data;

  try {
    const user = await prisma.user.update({
      where: { id: session?.userId ?? "" },
      data: { username, bio },
    });
    return { user };
  } catch (error) {
    return { error: "Failed to save user profile" };
  }
}
