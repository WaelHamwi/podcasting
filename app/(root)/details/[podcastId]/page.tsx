"use client"; //using host with it

import NoSuggestion from "@/components/NoSuggestion";
import LoaderSpinner from "@/components/ui/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import DetailPlayer from "@/components/DetailPlayer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";

const PodcastDetails = ({
  params: { podcastId },
}: {
  params: { podcastId: Id<"podcasts"> };
}) => {
  const { user } = useUser();

  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId });

  const suggestedPodcasts = useQuery(api.podcasts.getSimilarVoiceTyepPodcast, {
    podcastId,
  });

  const isOwner = user?.id === podcast?.authorId;

  if (!suggestedPodcasts || !podcast) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <p className="text-orange-600"> loading.............</p>
      </div>
    );
  }
  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-200">Current podcast</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphones.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-200">
            {podcast?.viewCount}
          </h2>
        </figure>
      </header>

      <DetailPlayer isOwner={isOwner} podcastId={podcast._id} {...podcast} />

      <p className="text-white-200 text-16 pb-8 pt-[45px] font-medium max-md:text-center">
        {podcast?.description}
      </p>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-orange-600">Transcription</h1>
          <p className="text-16 font-medium text-white-200">
            {podcast?.voicePrompt}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-orange-600">
            Thumbnail Prompt
          </h1>
          <p className="text-16 font-medium text-white-200">
            {podcast.thumbnailPrompt
              ? podcast.thumbnailPrompt
              : "no thumbnail added to this podcast"}
          </p>
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-extrabold text-center text-orange-600">Similar Podcasts</h1>

        {suggestedPodcasts && suggestedPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {suggestedPodcasts?.map(
              ({ _id, title, description, thumbnailUrl }) => (
                <PodcastCard
                  key={_id}
                  thumbnailUrl={thumbnailUrl as string}
                  title={title}
                  description={description}
                  podcastId={_id}
                />
              )
            )}
          </div>
        ) : (
          <>
            <NoSuggestion
              className="mb-10"
              title="No suggestion podcasts found"
              buttonLink="/explore"
              buttonText="explore more podcasts"
            />
          </>
        )}
      </section>
    </section>
  );
};

export default PodcastDetails;
