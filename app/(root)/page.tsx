"use client";
import PodcastCard from '@/components/PodcastCard';
//import { podcasts } from '@/constants/index';
import React from "react";
import { useQuery } from "convex/react";
import {api} from "@/convex/_generated/api";

const HomePage = () => {
  const podcasts=useQuery(api.podcasts.getPodcasts);
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="md:overflow-hidden flex flex-col gap-8 mt-8">
      <section className="flex flex-col gap-4">
        <h1 className="font-bold text-white-200 text-20">podcasting</h1>
        
        <div className="grid_cards">
          {podcasts?.map(({ _id, thumbnailUrl, title, description }) => (
            <PodcastCard
              key={_id}
              podcastId={_id}
              thumbnailUrl={thumbnailUrl}
              title={title}
              description={description}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
