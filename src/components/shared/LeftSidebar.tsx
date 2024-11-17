"use client";
import Link from "next/link";
import React from "react";
import { sidebarLinks } from "../../contants";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

const LeftSidebar = () => {
  const pathname = usePathname();
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex flex-1 w-full flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive = pathname.includes(link.route);
          return (
            <Link
              key={link.route}
              href={link.route}
              className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                height={24}
                width={24}
                alt={link.label}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton
            redirectUrl="/sign-in"
          >
            <div className="flex cursor-pointer p-4 gap-4">
              <LogOut className="text-white hover:scale-105" size={18} />
              <p className="text-light-2 max-lg:hidden ">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
