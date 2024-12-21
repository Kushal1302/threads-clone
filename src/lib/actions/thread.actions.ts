"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";

interface Props {
  userId: string;
  text: string;
  communityId: string | null;
  path: string;
  imageUrls: string[];
}

export const createThread = async ({
  userId,
  text,
  communityId,
  path,
  imageUrls,
}: Props) => {
  try {
    await prisma.threads.create({
      data: {
        userId,
        text,
        communityId,
        parentId: null,
        imageUrls,
      },
    });
    revalidatePath(path);
  } catch (error) {
    throw new Error(`Failed to create thread ${error}`);
  }
};

export const fetchPosts = async ({ pageNumber = 1, pageSize = 20 }) => {
  try {
    const [posts, postCount] = await Promise.all([
      prisma.threads.findMany({
        where: {
          parentId: null,
        },
        skip: Number(pageNumber - 1) * Number(pageSize),
        take: Number(pageSize),
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          children: {
            include: {
              user: true,
            },
          },
          community: true,
        },
      }),
      prisma.threads.count({
        where: {
          parentId: null,
        },
      }),
    ]);
    const isNext =
      postCount > Number((pageNumber - 1) * pageSize) + posts.length;
    return {
      posts,
      postCount,
      isNext,
    };
  } catch (error) {
    throw new Error(`Failed to fetch threads ${error}`);
  }
};

export const fetchThreadById = async ({ threadId }: { threadId: string }) => {
  try {
    const thread = await prisma.threads.findUnique({
      where: {
        id: threadId,
      },
      include: {
        user: true,
        children: {
          include: {
            user: true,
            community: true,
            children: {
              include: {
                user: true,
              },
            },
          },
        },
        community: true,
      },
    });
    return thread;
  } catch (error) {
    throw new Error(`Failed to fetch threads ${error}`);
  }
};

export const addCommentToThread = async ({
  threadId,
  userId,
  commentText,
  path,
}: {
  threadId: string;
  userId: string;
  path: string;
  commentText: string;
}) => {
  try {
    await prisma.threads.create({
      data: {
        text: commentText,
        parentId: threadId,
        userId,
      },
    });
    revalidatePath(path);
  } catch (error) {
    throw new Error(`Failed to add comment threads ${error}`);
  }
};
