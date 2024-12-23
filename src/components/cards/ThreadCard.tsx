/* eslint-disable @typescript-eslint/no-unused-vars */
import { Communities, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface childrenType {
  user: Partial<User>;
  community?: Partial<Communities> | null;
  children?: {
    user: Partial<User> | null;
    community?: Partial<Communities> | null;
  }[];
}

interface Props {
  id: string;
  parentId: string | null;
  community: Partial<Communities> | null;
  user: Partial<User>;
  createdAt: Date | undefined;
  comments: childrenType[];
  currentUserClerkId: string;
  isComment?: boolean;
  content: string;
  imageUrls?: string[]; // Add optional image URL prop
}

const ThreadCard = ({
  id,
  parentId,
  community,
  comments,
  user,
  currentUserClerkId,
  content,
  createdAt,
  isComment,
  imageUrls, // Accept image URL as a prop
}: Props) => {
  console.log(imageUrls);
  return (
    <article
      className={`w-full mt-2 flex flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${user.id}`} className="relative h-11 w-11">
              <Image
                src={user.image ?? ""}
                className="cursor-pointer rounded-full"
                alt="profile photo"
                fill
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex flex-col w-full">
            <Link href={`/profile/${user.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {user.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            {/* Conditionally Render Image */}
            {imageUrls && imageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {imageUrls.map((url, index) => {
                  console.log(url);
                  return (
                    <div
                      key={index}
                      className="relative w-full max-h-60 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={url}
                        alt="Thread image"
                        layout="responsive"
                        width={800}
                        height={450}
                        className="object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3">
                <Image
                  src={"/assets/heart-gray.svg"}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src={"/assets/reply.svg"}
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src={"/assets/repost.svg"}
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src={"/assets/share.svg"}
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
