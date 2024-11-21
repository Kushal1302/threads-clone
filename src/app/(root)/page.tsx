import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const { posts, postCount, isNext } = await fetchPosts({
    pageNumber: 1,
    pageSize: 30,
  });
  return (
    <>
      <section className="mt-9 flex flex-col gap-10">
        {posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {posts.map((post) => (
              <ThreadCard
                key={post.id}
                id={post.id}
                parentId={post.parentId}
                currentUserClerkId={user?.id ?? ""}
                content={post.text}
                author={post.user}
                community={post?.community}
                comments={post.children}
                createdAt={post.createdAt}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
