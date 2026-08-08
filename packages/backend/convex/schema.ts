import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * One Convex deployment holds the tables of every application in the monorepo.
 * Give the tables of a new application a prefix, for example `blog_posts`, so
 * the names of two applications do not collide.
 *
 * The tables below belong to ByteFin (apps/bytefin).
 */
export default defineSchema({
  accounts: defineTable({
    name: v.string(),
    balance: v.number(),
  }),

  funds: defineTable({
    name: v.string(),
    balance: v.number(),
    accountId: v.id("accounts"),
  }).index("by_account", ["accountId"]),
});
