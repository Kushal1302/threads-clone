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
  return <div>Profile Page</div>;
};

export default page;
