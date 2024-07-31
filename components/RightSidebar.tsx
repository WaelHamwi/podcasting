'use client';

import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Header from './Header';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Carousel from './Carousel';

const RightSidebar = () => {
  const { user } = useUser();
  const topActiveUsers= useQuery(api.users.getActiveUsers);//get the users that have most podcasts
  const router = useRouter();


  return (
    <section className={cn('right_sidebar bg-black-600 ')}>
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12 text-white-200 mt-5 ml-3">
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h2 className="text-16 truncate font-semibold text-white-200">{user?.firstName} {user?.lastName}</h2>
            <Image 
              src="/icons/rightArrow.webp"
              alt="arrow"
              width={24}
              height={24}
              className='mr-5'
            />
          </div>
        </Link>
      </SignedIn>
      <section>
        <Header title="podcast's fans" />
       <Carousel viewersDetails={topActiveUsers!}/>
      </section>
      <section className="flex flex-col gap-8 pt-12">
        <Header title=" topActiveUsers" />
        <div className="flex flex-col gap-6 ">
          {topActiveUsers?.slice(0, 3).map((activeUser) => (
            <div key={activeUser._id} className="flex cursor-pointer justify-between " onClick={() => router.push(`/profile/${podcast.clerkId}`)}>
              <figure className="flex items-center gap-2">
                <Image
                  src={activeUser.imageUrl}
                  alt={activeUser.name}
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg ml-3 mt-3"
                />
                <h2 className="text-14 font-semibold text-white-200">{activeUser.name}</h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 font-normal text-white-300">{activeUser.totalPodcasts} podcasts</p>
              </div> 
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default RightSidebar