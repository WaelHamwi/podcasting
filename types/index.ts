import { Id } from "@/convex/_generated/dataModel";
//podcast creation
export interface CreatePodcastProps {
    voicePrompt: string;
    setDuration: (duration: number) => void;
    setVoicePrompt: (prompt: string) => void;
    setAudioStorage: (id: Id<'_storage'> | null) => void;
    setAudioUrl: (url: string) => void;
    generatedAudioUrl: string;
    voiceType: string | null; 
}

// thumbnail creation
export interface CreateThumbnailProps {
    thumbnailPrompt: string;
    setThumbnailPrompt: (prompt: string) => void;
    setImageStorage: (id: Id<'_storage'> | null) => void;
    setThumbnailUrl: (url: string) => void;
    thumbnailUrl: string;
  }
  


//tables
export interface Podcast {
    audioStorageId?: string;
    imageStorageId?: string;
    title: string;
    description: string;
    generatedAudioUrl?: string;
    thumbnailUrl?: string;
    authorName: string;
    authorId: string;
    authorImageUrl: string;
    voicePrompt: string;
    imagePrompt: string;
    voiceType: string;
    audioDuration: number;
    viewCount: number;
    userId: string;
}

export interface User {
    email: string;
    clerkId: string;
    imageUrl: string;
    name: string;
}

export interface Task {
    text: string;
    _creationTime: number;
}
export interface EmptyStateProps {
    title: string;
    search?: boolean;
    buttonText?: string;
    buttonLink?: string;
  }
  export interface DetailPlayerProps {
    generatedAudioUrl: string;
    title: string;
    author: string;
    isOwner: boolean;
    thumbnailUrl: string;
    podcastId: Id<"podcasts">;
    imageStorageId: Id<"_storage">;
    audioStorageId: Id<"_storage">;
    authorImageUrl: string;
    authorId: string;
  }
  export interface AudioProps {
    title: string;
    generatedAudioUrl: string;
    author: string;
    thumbnailUrl: string;
    podcastId: string;
  }
  
  export interface AudioContextType {
    audio: AudioProps | undefined;
    setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>;
  }
  export interface topActiveUsers {
    _id: Id<"users">;
    _creationTime: number;
    email: string;
    imageUrl: string;
    clerkId: string;
    name: string;
    podcasts: {
      podcastTitle: string;
      podcastId: Id<"podcasts">;
    }[];
    totalPodcasts: number;
  }
  export interface CarouselProps {
    viewersDetails: topActiveUsers[];
  }
  export interface PodcastProps {
    _id: Id<"podcasts">;
    _creationTime: number;
    audioStorageId: Id<"_storage"> | null;
    user: Id<"users">;
     title: string;
    description: string;
    generatedAudioUrl: string | null;
    thumbnailUrl: string | null;
    imageStorageId: Id<"_storage"> | null;
    author: string;
    authorId: string;
    authorImageUrl: string;
    voicePrompt: string;
    imagePrompt: string | null;
    voiceType: string;
    audioDuration: number;
    viewCount: number;
  }
  
  export interface ProfilePodcastProps {
    podcasts: PodcastProps[];
    listeners: number;
  }
  export interface ProfileCardProps {
    podcastData: ProfilePodcastProps;
    imageUrl: string;
    userFirstName: string;
  }