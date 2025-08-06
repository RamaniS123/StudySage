import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";

export const ensureUserExists = async () => {
  const user = await getUser();
  console.log("AUTH USER:", user); 
  if (!user) return null;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { id: user.id },
        { email: user.email || "" },
      ],
    },
  });

  console.log("PRISMA USER FOUND:", existingUser); 

  if (existingUser) return existingUser;

  const created = await prisma.user.create({
    data: {
      id: user.id,
      email: user.email || "",
    },
  });

  console.log("PRISMA USER CREATED:", created);
  return created;
};
