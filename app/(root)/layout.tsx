import React from 'react';
import Image from "next/image";
import RightSidebar from "@/components/RightSidebar";
import LeftSidebar from "@/components/LeftSidebar";
import MobileMenu from "@/components/MobileMenu";
import { Toaster } from "@/components/ui/toaster";
import AudioPlayer from '@/components/AudioPlayer';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      <main className="relative flex bg-black-900">
        <LeftSidebar />
        <section className="  min-h-screen px-4 sm:px-12 flex-1 flex-col ">
          <div className="mx-auto flex sm:px-4 w-full max-w-5xl flex-col">
            <div className="flex items-center h-14 md:hidden justify-between">
              <Image
                src="/icons/podcasts.svg"
                width={30}
                height={30}
                alt="no img"
              />
              <MobileMenu />
            </div>
            <div className="flex flex-col md:pb-12">
             <Toaster/>
              {children}
              {/* it is the page in the root folder */}
            </div>
          </div>
        </section>
        <RightSidebar />
      </main>
      <AudioPlayer/>
    </div>
  );
}
