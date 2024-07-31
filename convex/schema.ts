import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  podcasts: defineTable({
    audioStorageId: v.optional(v.id("_storage")),
    imageStorageId: v.optional(v.id("_storage")),
    title: v.string(),
    description: v.string(),
    generatedAudioUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()), 
    authorName: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    voicePrompt: v.string(),
    voiceType: v.string(),
    thumbnailPrompt: v.string(), 
    audioDuration: v.number(),
    viewCount: v.number(),
    userId: v.id("users"),
  })
    .searchIndex("search_author", { searchField: "authorName" })
    .searchIndex("search_title", { searchField: "title" })
    .searchIndex("search_body", { searchField: "description" }),
  users: defineTable({
    email: v.string(),
    clerkId: v.string(),
    imageUrl: v.string(),
    name: v.string(),
  }),
  tasks: defineTable({
    text: v.string(),
    _creationTime: v.number(),
  isCompleted: v.boolean(),
  }),

});
