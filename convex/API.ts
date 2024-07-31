import { action } from "./_generated/server";
import { v } from "convex/values";
import fetch from 'node-fetch';
import { config } from 'dotenv';

config(); // Load environment variables

const googleApiKey = process.env.GOOGLE_API_KEY;
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

async function listVoices(): Promise<any[]> {
  const url = `https://texttospeech.googleapis.com/v1/voices?key=${googleApiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.voices;
  } catch (error) {
    console.error("Error fetching voices:", error);
    throw new Error("Failed to fetch voices.");
  }
}

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    try {
      const voices = await listVoices();
      console.log("Available voices:", voices);

      const isValidVoice = voices.some(v => v.name === voice);
      if (!isValidVoice) {
        throw new Error(`Invalid voice: ${voice}. Please choose a valid voice.`);
      }

      console.log("Input text:", input);
      console.log("Voice:", voice);

      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: { text: input },
            voice: { languageCode: 'en-US', name: voice },
            audioConfig: { audioEncoding: 'MP3' }
          }),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('audioContent:', data.audioContent);

      if (!data.audioContent) {
        console.error("No audio content in response:", data);
        throw new Error("No audio content in response.");
      }

      const base64Audio = data.audioContent;
      console.log("Base64 audio data:", base64Audio);

      return { base64Audio };

    } catch (error) {
      console.error("Error generating audio:", error);
      throw new Error("Failed to generate audio.");
    }
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&client_id=${unsplashAccessKey}&per_page=1`;

    const response = await fetch(unsplashUrl);
    if (!response.ok) {
      throw new Error('Error fetching image from Unsplash');
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw new Error('No images found for the given prompt');
    }

    const url = data.results[0].urls.regular;

    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  }
});
