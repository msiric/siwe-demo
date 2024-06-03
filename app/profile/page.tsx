import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import ProfileWrapper from "./wrapper";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session?.userId ?? "" },
  });

  if (!user) {
    notFound();
  }

  return <ProfileWrapper user={user} />;
}