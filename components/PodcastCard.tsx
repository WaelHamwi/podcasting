import React from "react";
import Image from "next/image";
import { Podcast } from "@/types"; 
import { useRouter } from 'next/navigation'

const PodcastCard = ({
  podcastId,
  thumbnailUrl,
  title,
  description,
}:Podcast) => {
  const router = useRouter()

  const handleViews = () => {
    router.push(`/details/${podcastId}`, {
      scroll: true
    })
  }

  return (
    <div className="cursor-pointer" onClick={handleViews}>
      <figure className="flex gap-1 flex-col">
        <Image className="xl:size-[100px] aspect-square rounded-xl h-fit w-80 justify-center self-center" src={thumbnailUrl} alt={title} width={120} height={120} />
        <div className="flex flex-col">
          <h2 className="text-10 font-bold text-white-200 truncate self-center">{title}</h2>
          <h3 className="text-8 truncate capitalize text-white-300 font-normal self-center">{description}</h3>
        </div>
      </figure>
    </div>
  );
};

export default PodcastCard;
