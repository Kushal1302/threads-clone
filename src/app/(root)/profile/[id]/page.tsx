import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>; // Match the expected structure
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  if (!id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser({ clerkId: user.id });
  if (!userInfo?.onboarded) redirect("/onboarding");

  return <div>Profile Page</div>;
};

export default Page;
