import React, { useState } from "react";
import { CreatePodcastProps } from "@/types";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "./ui/textarea";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "./ui/use-toast";
import { useUploadFiles } from "@xixixao/uploadstuff/react";

const useCreatePodcast = ({
  setAudioUrl,
  voicePrompt,
  voiceType,
  setAudioStorage,
  setVoicePrompt,
}: CreatePodcastProps) => {
  const [isCreated, setIsCreated] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getPodcastGeneratedAudio = useAction(api.API.generateAudioAction);
  const getAudioUrl = useMutation(api.podcasts.getUrl);
  const { toast } = useToast();

  const createPodcast = async () => {
    setIsCreated(true);
    setAudioUrl("");

    if (!voicePrompt || !voiceType) {
      toast({
        title: "Please provide a voiceType to generate a podcast",
      });
      return setIsCreated(false);
    }

    try {
      const response = await getPodcastGeneratedAudio({
        voice: voiceType,
        input: voicePrompt,
      });

      const base64Audio = response.base64Audio;
      const blob = new Blob([Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))], { type: "audio/mp3" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorage(storageId);
      const audioUrl = await getAudioUrl({ storageId });
      setAudioUrl(audioUrl!);
      setIsCreated(false);
      toast({
        title: "Congrats the podcast has been created successfully",
      });
    } catch (error) {
      console.log("Error generating the podcast audio", error);
      toast({
        title: "Error has happened while creating the podcast!",
        variant: "destructive",
        description: "The file you have just inserted is not voice type",
      });
      setIsCreated(false);
    }
  };

  return {
    isCreated,
    createPodcast,
  };
};

const CreatePodcast = (props: CreatePodcastProps) => {
  const { isCreated, createPodcast } = useCreatePodcast(props);

  return (
    <>
      <div className="flex flex-col text-white-200 gap-3">
        <Label htmlFor="">Using google API to generate the audio from text</Label>
        <Textarea
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
          rows={4}
          placeholder="Write a text to build audio for you"
          className="input-class mb-4 focus-visible:ring-offset-orange-600 font-light"
        />
      </div>
      <div className="w-full mt-4 max-w-[200px]">
        <Button
          onClick={createPodcast}
          type="submit"
          className="transition-all duration-600 hover:bg-blue-900 bg-orange-600 font-light mb-4"
        >
          {isCreated ? (
            <>
              Building...
              <Loader size={30} className="animate-spin ml-2.5" />
            </>
          ) : (
            "Autogenerate"
          )}
        </Button>
      </div>
      {props.audioUrl && (
        <audio
          className="mt-3 mb-10"
          src={props.audioUrl}
          autoPlay
          controls
          onLoadedMetadata={(e) => props.setDuration(e.currentTarget.duration)}
        />
      )}
    </>
  );
};

export default CreatePodcast;
