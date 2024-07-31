import React, { useState, useRef } from "react";
import { CreateThumbnailProps } from "@/types";
import { Button } from "@/src/components/ui/button";
//import { Label, Textarea, Input, Image, Loader } from "@/src/components/ui"; // Add necessary imports

import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "./ui/textarea";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
//import { GenerateOut } from "svix";
import { generateUploadUrl } from "@/convex/files";
import { v4 as uuidv4 } from 'uuid';
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "./ui/use-toast";


const CreateThumbnail = ({
  thumbnailPrompt,
  setThumbnailPrompt,
  setImageStorage,
  setThumbnailUrl,
  thumbnailUrl,
}: CreateThumbnailProps) => {
  const [isGeneratedThumbnail, setIsGeneratedThumbnail] = useState(false);
  const [imagePrompt, setImagePrompt] = useState(""); 
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(false); 
  const [image, setImage] = useState(""); 
  const thumbnailRef = useRef<HTMLInputElement | null>(null); 
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const handleGenerateThumbnail = useAction(api.API.generateThumbnailAction)

  const generateImage = async () => {
    try {
      const response = await handleGenerateThumbnail({ prompt: thumbnailPrompt });
      const blob = new Blob([response], { type: 'image/png' });
      handleImage(blob, `thumbnail-${uuidv4()}`);
    } catch (error) {
      console.log(error)
      toast({ title: 'Error generating thumbnail'+" "+ error, variant: 'destructive'})
    }
  }

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsThumbnailLoading(true);
    setImage('');

    try {
      const file = new File([blob], fileName, { type: 'image/png' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorage(storageId);

      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setThumbnailUrl(imageUrl!); 
      setIsThumbnailLoading(false);
      toast({
        title: "Thumbnail generated successfully",
      })
    } catch (error) {
      console.log(error)
      toast({ title: 'Error generating thumbnail', variant: 'destructive'})
    }
  }
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer()
      .then((ab) => new Blob([ab]));

      handleImage(blob, file.name);
    } catch (error) {
      console.log(error)
      toast({ title: 'Error uploading image', variant: 'destructive'})
    }
  }

  return (
    <div className="generate_thumbnail">
      <Button
        onClick={() => setIsGeneratedThumbnail(true)}
        className={cn("mb-4 text-teal-50 mr-10", {
          "bg-orange-600": !isGeneratedThumbnail,
          "bg-green-600": isGeneratedThumbnail,
        })}
        variant="plain"
        type="button"
      >
        Generate Thumbnail
      </Button>

      <Button
        onClick={() => setIsGeneratedThumbnail(false)}
        className={cn("mb-4 text-teal-50", {
          "bg-orange-600": isGeneratedThumbnail,
          "bg-green-600": !isGeneratedThumbnail,
        })}
        variant="plain"
        type="button"
      >
        Upload Custom Thumbnail
      </Button>

      {isGeneratedThumbnail ? (
        <div className="flex flex-col gap-5">
          <div className="mt-5 flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              Prompt Generate Thumbnail
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate thumbnail"
              rows={5}
              value={thumbnailPrompt}
              onChange={(e) => setThumbnailPrompt(e.target.value)}
            />
          </div>
          <div className="w-full max-w-[200px]">
            <Button
              type="submit"
              className="text-16 bg-orange-600 py-4 font-bold text-white-200 mb-4"
              onClick={generateImage}
            >
              {isThumbnailLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="image_div"
          onClick={() => thumbnailRef.current?.click()}
        >
          <Input
            type="file"
            className="hidden"
            ref={thumbnailRef}
            onChange={uploadImage}
          />
          {!isThumbnailLoading ? (
              <div className="flex items-center justify-center h-full w-full">
              <Image
                src="/icons/upload-images.png"
                width={200}
                height={200}
                alt="upload"
                className="cursor-pointer"
              />
            </div>
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-20 font-bold text-orange-600">Upload image</h2>
            <p className="text-12 font-normal text-gray-200 mb-4">
              svg, png, jpg, or gif (max. 1080x1080px)
            </p>
          </div>
        </div>
      )}
      {image && (
        <div className="flex items-center justify-center h-full w-full">
          <Image
            src={image}
            width={200}
            height={200}
            className="mt-5 mb-5"
            alt="thumbnail"
          />
        </div>
      )}
    </div>
  );
};

export default CreateThumbnail;
