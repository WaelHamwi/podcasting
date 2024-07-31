"use client";

import { useQuery } from "convex/react";
import NoSuggestion from "@/components/NoSuggestion";
import LoaderSpinner from "@/components/ui/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/convex/_generated/api";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const podcastData = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: params.profileId,
  });

  if (!user || !podcastData) {
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-200 max-md:text-center">
        Podcaster Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-200">All Podcasts</h1>
        {podcastData && podcastData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcastData.podcasts.slice(0, 4).map((podcast) => (
              <PodcastCard
                key={podcast._id}
                thumbnailUrl={podcast.thumbnailUrl!}
                title={podcast.title!}
                description={podcast.description}
                podcastId={podcast._id}
              />
            ))}
          </div>
        ) : (
          <NoSuggestion
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
