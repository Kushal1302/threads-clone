import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const user = await currentUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userInfo: any = await fetchUser({ clerkId: user?.id ?? "" });

  const userData = {
    id: user?.id ?? userInfo.clerkId,
    ObjectId: userInfo?._id,
    username: user?.username || userInfo?.username,
    name: user?.firstName || userInfo?.name,
    bio: userInfo?.bio || "",
    image: user?.imageUrl || userInfo?.image,
  };
  return (
    <main className="mx-auto flex flex-col max-w-3xl justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="text-light-2 text-base-regular-mt-3">
        Complete your profile to use Threads
      </p>

      <section className="bg-dark-2 p-10  mt-9">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
};

export default page;
