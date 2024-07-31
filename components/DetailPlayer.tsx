"use client";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { useAudio } from '@/providers/AudioProvider';
import { DetailPlayerProps } from "@/types";

import LoaderSpinner from "./ui/LoaderSpinner";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const DetailPlayer = ({
  generatedAudioUrl,
  title,
  author,
  thumbnailUrl,
  podcastId,
  imageStorageId,
  audioStorageId,
  isOwner,
  authorImageUrl,
  authorId,
}: DetailPlayerProps) => {
  const router = useRouter();
  const { setAudio } = useAudio();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePodcast = useMutation(api.podcasts.deletePodcast);

  const handleDelete = async () => {
    try {
      await deletePodcast({ podcastId, imageStorageId, audioStorageId });
      toast({
        title: "Podcast deleted",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting podcast", error);
      toast({
        title: "Error deleting podcast",
        variant: "destructive",
      });
    }
  };

  const handlePlay = () => {
    setAudio({
      title: title,
      generatedAudioUrl,
      thumbnailUrl,
      authorId,
      podcastId,
    });
  };

  if (!thumbnailUrl || !authorImageUrl) return <div className="flex flex-col justify-center items-center"><p className="text-orange-600">loading.....</p></div>;

  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <Image
          src={thumbnailUrl}
          width={250}
          height={250}
          alt="Podcast image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-8 max-md:items-center md:gap-12">
          <article className="flex flex-col gap-2 max-md:items-center">
            <h2 className="text-20 mb-2 mr-4 font-extrabold tracking-[-0.42px] text-white-200">
              {title}
            </h2>
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                router.push(`/profile/${authorId}`);
              }}
            >
              <Image
                src={authorImageUrl}
                width={80}
                height={80}
                alt="Caster icon"
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-24 font-normal text-white-200">{author}</h2>
            </figure>
          </article>

          <Button
            onClick={handlePlay}
            className="text-20 w-50 max-w-[140px] bg-orange-600 font-extrabold text-white-300 "
          >
            <Image
              src="/icons/play.png"
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; launch podcast
          </Button>
        </div>
      </div>
      {isOwner && (
        <div className="relative mt-12">
          <Image
            src="/icons/dots.webp"
            width={30}
            height={30}
            alt="dots icon"
            className="cursor-pointer"
            onClick={() => setIsDeleting((prev) => !prev)}
          />
          {isDeleting && (
            <div
              className="absolute -left-32 -top-2 z-10 flex w-32 cursor-pointer justify-center gap-2 rounded-md bg-black-6 py-1.5 hover:bg-black-2"
              onClick={handleDelete}
            >
              <Image
                src="/icons/delete.svg"
                width={16}
                height={16}
                alt="Delete icon"
              />
              <h2 className="text-20 font-extrabold text-white-100">Delete</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailPlayer;
