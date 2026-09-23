import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Fields that every Tally asset type has. `archivedAt` is set one time, when
 * the user archives the asset, and never cleared.
 */
const tallyAssetFields = {
  name: v.string(),
  archivedAt: v.optional(v.number()),
};

/**
 * One Convex deployment holds the tables of every application in the monorepo.
 * Give the tables of a new application a prefix, for example `blog_posts`, so
 * the names of two applications do not collide.
 */
export default defineSchema({
  // Pockets (apps/pockets)

  pockets_accounts: defineTable({
    name: v.string(),
    balance: v.number(),
  }),

  pockets_funds: defineTable({
    name: v.string(),
    balance: v.number(),
    accountId: v.id("pockets_accounts"),
  }).index("by_account", ["accountId"]),

  // Tally (apps/tally). See apps/tally/CONTEXT.md for the terms.
  //
  // Every `at` is a Unix time in milliseconds. Net worth is never stored: it is
  // derived from the latest valuation, holding and price at or before a moment.
  // `currentWorth` and `currentShares` are copies of the latest valuation or
  // holding by `at`. Write them only through `lib/tally.ts`.
  //
  // Read "the latest row at or before T" with a descending scan on the
  // `by_…_at` index: `.eq(id).lte("at", T)`, `.order("desc")`, `.first()`.
  // When two rows have the same `at`, the index orders them by
  // `_creationTime`, so the row inserted last wins.

  tally_assets: defineTable(
    v.union(
      v.object({
        type: v.literal("bank"),
        ...tallyAssetFields,
        currentWorth: v.number(),
      }),
      v.object({
        type: v.literal("stock"),
        ...tallyAssetFields,
        ticker: v.string(),
        currentShares: v.number(),
      }),
      v.object({
        type: v.literal("physical"),
        ...tallyAssetFields,
        currentWorth: v.number(),
      }),
    ),
  ),

  tally_liabilities: defineTable({
    name: v.string(),
    currentWorth: v.number(),
    archivedAt: v.optional(v.number()),
  }),

  // A price belongs to a ticker, never to an asset. It is never backdated.
  tally_prices: defineTable({
    ticker: v.string(),
    price: v.number(),
    at: v.number(),
  }).index("by_ticker_at", ["ticker", "at"]),

  // Only stock assets have holdings.
  tally_holdings: defineTable({
    assetId: v.id("tally_assets"),
    shares: v.number(),
    at: v.number(),
  }).index("by_asset_at", ["assetId", "at"]),

  // Only bank assets, physical assets and liabilities have valuations. Convex
  // IDs are unique across tables, so one index serves both tables.
  tally_valuations: defineTable({
    subjectId: v.union(v.id("tally_assets"), v.id("tally_liabilities")),
    worth: v.number(),
    at: v.number(),
  }).index("by_subject_at", ["subjectId", "at"]),
});
