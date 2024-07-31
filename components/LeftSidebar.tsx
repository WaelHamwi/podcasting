"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { sidebarLinks } from "@/constants/index";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <section className="bg-black-600 lg:w-64 xs:bg-red-400 hidden md:flex flex-col justify-between">
      <nav className="flex flex-col gap-5 lg:pl-2 h-full">
        <Link
          href="/"
          className="flex cursor-pointer items-center max-lg:justify-center gap-3 pb-11"
        >
          <Image
            src="/icons/podcasts.svg"
            alt="podcastImg"
            width={25}
            height={25}
          />
          <h2 className="text-24 text-white-200 max-lg:hidden font-extrabold">
            Podcasting
          </h2>
        </Link>
        {sidebarLinks.map((obj, i) => {
          const isActive = pathname === obj.route;
          return (
            <Link
              href={obj.route}
              key={i}
              className={cn(
                "flex md:gap-1 lg:gap-2 text-white-200 xl:px-4 pl-5 lg:justify-start items-center py-3",
                { "bg-sidebar-active border-r-2 border-orange-600": isActive }
              )}
            >
              <Image src={obj.imgURL} width={22} height={22} alt={obj.label} />
              <p className="text-sm md:text-8 lg:text-12">{obj.label}</p>
            </Link>
          );
        })}
      </nav>
      <div className="flex flex-col items-center justify-center pb-14 px-4">
        <SignedOut>
          <Button
            asChild
            className="text-15 font-extrabold text-white-300 w-40 bg-orange-600 mx-auto"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <Button
            className="text-15 text-white-300 font-extrabold w-40 bg-orange-600 mx-auto"
            onClick={() => signOut(() => router.push("/"))}
          >
            Logout
          </Button>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
