import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  if (!id) return null;
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser({ clerkId: user.id });
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById({ threadId: id });
  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread?.id}
          id={thread?.id ?? ""}
          parentId={thread?.parentId ?? ""}
          currentUserClerkId={user?.id ?? ""}
          content={thread.text ?? ""}
          author={thread?.user}
          community={thread?.community}
          comments={thread.children}
          createdAt={thread?.createdAt}
        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={thread?.id ?? ""}
          currentUserImg={userInfo.image ?? ""}
          currentUserId={userInfo.id}
        />
      </div>
      <div className="mt-10">
        {thread?.children.map((comment) => (
          <ThreadCard
            key={comment?.id}
            id={comment?.id ?? ""}
            parentId={comment?.parentId ?? ""}
            currentUserClerkId={user?.id ?? ""}
            content={comment.text ?? ""}
            author={comment?.user}
            community={comment?.community}
            comments={comment.children}
            createdAt={comment?.createdAt}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default page;
