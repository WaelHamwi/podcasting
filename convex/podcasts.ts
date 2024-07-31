import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";


export const createPodcast = mutation({// create podcast mutation
  args: {
    audioStorageId: v.id("_storage"),
    title: v.string(),
    description: v.string(),
    generatedAudioUrl: v.string(),
    thumbnailUrl: v.string(),
    imageStorageId: v.id("_storage"),
    voicePrompt: v.string(),
    thumbnailPrompt: v.string(),
    voiceType: v.string(),
    views: v.number(),
    audioDuration: v.number(),
  //  imagePrompt: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await ctx.auth.getUserIdentity();
    console.log("Authenticated user:", authUser);
    
    if (!authUser) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), authUser.email))
      .collect();

    if (user.length === 0) {
      const allUsers = await ctx.db.query("users").collect();
      console.log("All users in the collection:", allUsers);
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("podcasts", {
      userId: user[0]._id,
      title: args.title,
       description: args.description,
       generatedAudioUrl: args.generatedAudioUrl,
      thumbnailUrl: args.thumbnailUrl,
      imageStorageId: args.imageStorageId,
      authorName: user[0].name,
      authorId: user[0].clerkId,
      voicePrompt: args.voicePrompt,
      thumbnailPrompt: args.thumbnailPrompt,
      voiceType: args.voiceType,
      viewCount: args.views,
      authorImageUrl: user[0].imageUrl,
      audioDuration: args.audioDuration,
      audioStorageId: args.audioStorageId,
     // imagePrompt: args.imagePrompt,
    });
    
  },
});


export const getUrl = mutation({// this mutation is required to generate the url after uploading the file to the storage.
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getSimilarVoiceTyepPodcast = query({ //get similar podcasts
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    return await ctx.db
      .query("podcasts")
      .filter((q) =>
        q.and(
          q.eq(q.field("voiceType"), podcast?.voiceType),
          q.neq(q.field("_id"), args.podcastId)
        )
      )
      .collect();
  },
});


export const getAllPodcasts = query({// this query will get all the podcasts.
  handler: async (ctx) => {
    return await ctx.db.query("podcasts").order("desc").collect();
  },
});


export const getPodcastById = query({// the podcast retreived by the podcastId.
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.podcastId);
  },
});


export const getPodcasts = query({//the podcasts based on the views of the podcast
  handler: async (ctx) => {
    const podcast = await ctx.db.query("podcasts").collect();

    return podcast.sort((a, b) => b.viewCount - a.viewCount).slice(0, 8);
  },
});


export const getPodcastByAuthorId = query({// all podcasts by the authorId.
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalListeners = podcasts.reduce(
      (sum, podcast) => sum + podcast.viewCount,
      0
    );

    return { podcasts, listeners: totalListeners };
  },
});


export const getPodcastBySearch = query({
  args: {// the podcast by the search query.
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("podcasts").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("search_author", (q) => q.search("authorName", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("search_title", (q) =>
        q.search("title", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("podcasts")
      .withSearchIndex("search_body", (q) =>
        q.search("description" || "title", args.search)
      )
      .take(10);
  },
});


export const updatePodcastViews = mutation({// this mutation will update the views of the podcast.
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    return await ctx.db.patch(args.podcastId, {
        viewCount: podcast.viewCount + 1,
    });
  },
});


export const deletePodcast = mutation({// this mutation will delete the podcast.
  args: {
    podcastId: v.id("podcasts"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.podcastId);
  },
});
