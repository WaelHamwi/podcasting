import { ConvexError, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { Podcast } from "lucide-react";

export const getUserById = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();
    if (!user) {
      throw new ConvexError("The user has not been found");
    }
    return user;
  },
});
export const getActiveUsers= query({ //get the users that have most podcasts
  args: {},
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const userData = await Promise.all(
      users.map(async (user) => {
        const podcasts = await ctx.db
          .query("podcasts")
          .filter((q) => q.eq(q.field("authorId"), user.clerkId))
          .collect();

        const orderedPodcastsBasedOnViewers = podcasts.sort(
          (a, b) => b.viewCount - a.viewCount
        );

        return {
          ...user,
          totalPodcasts: podcasts.length,
          podcasts: orderedPodcastsBasedOnViewers.map((podcast) => ({
            podcastTitle: podcast.title,
            podcastId: podcast._id, // Assuming _id is the field that holds the podcast ID
          })),
        };
      })
    );
    // Returning the top user based on podcast count
    const sortedUsers = userData.sort(
      (a, b) => b.totalPodcasts - a.totalPodcasts
    );
    return sortedUsers;
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      imageUrl: args.imageUrl,
      name: args.name,
    });
  },
});
export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Query for the user by clerkId
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();
    
    // Throw an error if the user is not found
    if (!user) {
      throw new ConvexError("The user is not found!");
    }

    // Update the user's imageUrl and email
    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl,
      email: args.email,
    });

    // Query for all podcasts by the user's clerkId
    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("authorId"), args.clerkId))
      .collect();

    // Update the authorImageUrl for all found podcasts
    await Promise.all(
      podcasts.map(async (podcast) => {
        await ctx.db.patch(podcast._id, {
          authorImageUrl: args.imageUrl,
        });
      })
    );
  },
});

export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(user._id);
  },
});
