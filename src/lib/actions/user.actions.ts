"use server";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

export const updateUser = async ({
  name,
  username,
  bio,
  image,
  path,
  clerkId,
}: {
  name: string;
  username: string;
  bio: string;
  image: string;
  path: string;
  clerkId: string;
}): Promise<void> => {
  try {
    await prisma.user.upsert({
      where: {
        clerkId,
      },
      update: {
        name,
        username: username.toLowerCase(),
        bio,
        image,
        onboarded: true,
        clerkId,
      },
      create: {
        name,
        username: username.toLowerCase(),
        bio,
        image,
        onboarded: true,
        clerkId,
      },
    });

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update ${error}`);
  }
};

export const fetchUser = async ({ clerkId }: { clerkId: string }) => {
  try {
    return await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update ${error}`);
  }
};
