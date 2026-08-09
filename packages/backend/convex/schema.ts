import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * One Convex deployment holds the tables of every application in the monorepo.
 * Give the tables of a new application a prefix, for example `blog_posts`, so
 * the names of two applications do not collide.
 *
 * The tables below belong to Pockets (apps/pockets).
 */
export default defineSchema({
  pockets_accounts: defineTable({
    name: v.string(),
    balance: v.number(),
  }),

  pockets_funds: defineTable({
    name: v.string(),
    balance: v.number(),
    accountId: v.id("pockets_accounts"),
  }).index("by_account", ["accountId"]),
});
