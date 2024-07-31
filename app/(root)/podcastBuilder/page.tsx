"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {Button} from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/src/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";
import { voiceDetails } from "@/constants/index";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import CreatePodcast from "@/components/CreatePodcast";
import CreateThumbnail from "@/components/CreateThumbnail";
import { Loader } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation"
const formSchema = z.object({
    title: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    description: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
});
const PodcastBuilder = () => {
    // AI integration
    //image adjustment
    const [imageStorageId, setImageStorageId] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [thumbnailPrompt, setThumbnailPrompt] = useState('');
    // audio and voice adjustment
    const [audioStorageId, setAudioStorageId] = useState(null);
    const [audioPlaybackDuration, setAudioPlaybackDuration] = useState(0);
    const [voiceType, setVoiceType] = useState<string | null>(null); 
    const [voicePrompt, setVoicePrompt] = useState('');
    const [generatedAudioUrl, setGeneratedAudioUrl] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [audioDuration, setAudioDuration] = useState(0);
    const createPodcast = useMutation(api.podcasts.createPodcast);

    //routing navigate
    const router = useRouter()
    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });
    
  
    async function onSubmit(data: z.infer<typeof formSchema>) {
      try {
        setIsSubmitted(true);
        console.log('generatedAudioUrl:', generatedAudioUrl);
        console.log('thumbnailUrl:', thumbnailUrl);
        console.log('voiceType:', voiceType);
        if(!generatedAudioUrl || !thumbnailUrl || !voiceType) {
          toast({
            title: 'Please generate audio and image',
          })
          setIsSubmitted(false);
          throw new Error('Please generate audio and image')
        }
  
        const podcast = await createPodcast({
          title: data.title,
          description: data.description,
          generatedAudioUrl,
          thumbnailUrl,
          voiceType,
          thumbnailPrompt,
          voicePrompt,
          views: 0,
          audioDuration,
          audioStorageId: audioStorageId!,
          imageStorageId: imageStorageId!,
        })
        toast({ title: 'Podcast created' })
        setIsSubmitted(false);
        router.push('/')
      } catch (error) {
        console.log(error);
        toast({
          title: 'Error',
          variant: 'destructive',
        })
        setIsSubmitted(false);
      }
    }

    return (<section className="flex flex-col mt-8">
      <h1 className="text-2xl font-bold mb-6">Podcast Builder</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col mt-6">
          <div className="flex flex-col gap-[30px] border-b border-black-500 pb-8">
            <FormField control={form.control} name="title" render={({ field }) => (<FormItem className="flex flex-col gap-3">
                  <FormLabel className="text-14 text-white-200 font-bold" htmlFor="title">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input className="input-class focus-visible:ring-offset-orange-600" id="title" placeholder="podcast building using SASS, typescript, nextjs " {...field}/>
                  </FormControl>

                  <FormMessage className="text-white-200"/>
                </FormItem>)}/>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="" className="text-white-200 font-bold text-14">
              choose google voice to convert your text
            </Label>
            <Select onValueChange={(value) => setVoiceType(value)}>
              <SelectTrigger className={cn("w-full mb-4 text-white-200   bg-orange-600 border-none text-14")}>
                <SelectValue className="placeholder:text-gray-300 " placeholder="select AI voice"/>
              </SelectTrigger>
              <SelectContent className="border-none text-20 text-white-200 bg-orange-600 ">
                {voiceDetails.map((voice) => (<SelectItem key={voice.id} value={voice.name} className="capitalize  focus:bg-orange-600 focus:text-gray-500  text-white-400">
                    {voice.name}
                  </SelectItem>))}
              </SelectContent>
              {voiceType && (<audio src={`/${voiceType}.mp3`} autoPlay className="hidden"></audio>)}
            </Select>
          </div>
          <FormField control={form.control} name="description" render={({ field }) => (<FormItem className="flex flex-col mb-4 gap-3">
                <FormLabel className="text-14 text-white-200 font-bold" htmlFor="description">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea className="input-class focus-visible:ring-offset-orange-600" id="description" placeholder="Descripte the podcast please" {...field}/>
                </FormControl>

                <FormMessage className="text-white-200"/>
              </FormItem>)}/>
          <div className="flex flex-col pt-12 ">
            <CreatePodcast voiceType={voiceType} voicePrompt={voicePrompt} setVoicePrompt={setVoicePrompt} setDuration={setAudioPlaybackDuration} setAudioStorage={setAudioStorageId} setAudioUrl={setGeneratedAudioUrl} audioUrl={generatedAudioUrl}/>
            <CreateThumbnail thumbnailPrompt={thumbnailPrompt} setThumbnailPrompt={setThumbnailPrompt} setImageStorage={setImageStorageId} setThumbnailUrl={setThumbnailUrl} thumbnailUrl={thumbnailUrl}/>
    
          </div>
          <Button type="submit" className="transition-all w-full duration-600 mb-10 hover:bg-blue-900 bg-orange-600 font-extrabold">
            {isSubmitted ? (<>
                submit...
                <Loader size={30} className="animate-spin ml-2.5"/>
              </>) : ("submitting podcast and publishing")}
          </Button>
        </form>
      </Form>
    </section>);
};
export default PodcastBuilder;
