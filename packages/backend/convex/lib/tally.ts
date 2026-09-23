import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

/**
 * The write rules for Tally's tables. See apps/tally/CONTEXT.md for the terms.
 *
 * `currentWorth` and `currentShares` on an asset or liability are copies of its
 * latest valuation or holding by `at`, not by insert order, because backdating
 * is allowed. Every function here that writes a valuation or holding updates
 * the copy in the same mutation, so the two never disagree. Convex mutations
 * are transactions, so a failed write changes nothing.
 *
 * The history of an archived asset or liability is final: every write to its
 * valuations or holdings is refused.
 */

/** The ID of an asset or a liability, as stored in `tally_valuations`. */
export type SubjectId = Id<"tally_assets"> | Id<"tally_liabilities">;

type Subject =
  | { table: "tally_assets"; doc: Doc<"tally_assets"> }
  | { table: "tally_liabilities"; doc: Doc<"tally_liabilities"> };

const getSubject = async (
  ctx: MutationCtx,
  subjectId: SubjectId,
): Promise<Subject> => {
  const assetId = ctx.db.normalizeId("tally_assets", subjectId);
  if (assetId) {
    const doc = await ctx.db.get("tally_assets", assetId);
    if (doc) return { table: "tally_assets", doc };
  }
  const liabilityId = ctx.db.normalizeId("tally_liabilities", subjectId);
  if (liabilityId) {
    const doc = await ctx.db.get("tally_liabilities", liabilityId);
    if (doc) return { table: "tally_liabilities", doc };
  }
  throw new ConvexError("The asset or liability does not exist.");
};

const patchSubject = async (
  ctx: MutationCtx,
  subject: Subject,
  fields: { currentWorth?: number; archivedAt?: number },
) => {
  if (subject.table === "tally_assets") {
    await ctx.db.patch("tally_assets", subject.doc._id, fields);
  } else {
    await ctx.db.patch("tally_liabilities", subject.doc._id, fields);
  }
};

const assertNotArchived = (doc: { archivedAt?: number }) => {
  if (doc.archivedAt !== undefined) {
    throw new ConvexError("An archived asset or liability cannot change.");
  }
};

const assertValuationWorth = (subject: Subject, worth: number) => {
  if (subject.table === "tally_liabilities" && worth < 0) {
    throw new ConvexError("The worth of a liability cannot be negative.");
  }
};

const assertShares = (shares: number) => {
  if (shares < 0) throw new ConvexError("Shares cannot be negative.");
};

/** Loads an asset or liability whose valuations can change, or throws. */
const getValuedSubject = async (ctx: MutationCtx, subjectId: SubjectId) => {
  const subject = await getSubject(ctx, subjectId);
  if (subject.table === "tally_assets" && subject.doc.type === "stock") {
    throw new ConvexError("A stock asset never has valuations.");
  }
  assertNotArchived(subject.doc);
  return subject;
};

/** Loads a stock asset whose holdings can change, or throws. */
const getHeldStockAsset = async (
  ctx: MutationCtx,
  assetId: Id<"tally_assets">,
) => {
  const asset = await ctx.db.get("tally_assets", assetId);
  if (!asset) throw new ConvexError("The asset does not exist.");
  if (asset.type !== "stock") {
    throw new ConvexError("Only a stock asset has holdings.");
  }
  assertNotArchived(asset);
  return asset;
};

const syncCurrentWorth = async (ctx: MutationCtx, subject: Subject) => {
  const latest = await ctx.db
    .query("tally_valuations")
    .withIndex("by_subject_at", (q) => q.eq("subjectId", subject.doc._id))
    .order("desc")
    .first();
  await patchSubject(ctx, subject, { currentWorth: latest?.worth ?? 0 });
};

const syncCurrentShares = async (
  ctx: MutationCtx,
  assetId: Id<"tally_assets">,
) => {
  const latest = await ctx.db
    .query("tally_holdings")
    .withIndex("by_asset_at", (q) => q.eq("assetId", assetId))
    .order("desc")
    .first();
  await ctx.db.patch("tally_assets", assetId, {
    currentShares: latest?.shares ?? 0,
  });
};

/**
 * Convex removes a field when a patch sets it to `undefined`, so drop those
 * keys before a partial edit.
 */
const withoutUndefined = <T extends object>(changes: T) =>
  Object.fromEntries(
    Object.entries(changes).filter(([, value]) => value !== undefined),
  ) as Partial<T>;

// Creation

/**
 * Creates an asset with its first valuation, or its first holding for a stock
 * asset. The type is locked after this.
 */
export const createAsset = async (
  ctx: MutationCtx,
  asset:
    | { type: "bank" | "physical"; name: string; worth: number; at: number }
    | {
        type: "stock";
        name: string;
        ticker: string;
        shares: number;
        at: number;
      },
) => {
  if (asset.type === "stock") {
    const assetId = await ctx.db.insert("tally_assets", {
      type: "stock",
      name: asset.name,
      ticker: asset.ticker,
      currentShares: 0,
    });
    await addHolding(ctx, { assetId, shares: asset.shares, at: asset.at });
    return assetId;
  }
  const assetId = await ctx.db.insert("tally_assets", {
    type: asset.type,
    name: asset.name,
    currentWorth: 0,
  });
  await addValuation(ctx, {
    subjectId: assetId,
    worth: asset.worth,
    at: asset.at,
  });
  return assetId;
};

/** Creates a liability with its first valuation. */
export const createLiability = async (
  ctx: MutationCtx,
  liability: { name: string; worth: number; at: number },
) => {
  const liabilityId = await ctx.db.insert("tally_liabilities", {
    name: liability.name,
    currentWorth: 0,
  });
  await addValuation(ctx, {
    subjectId: liabilityId,
    worth: liability.worth,
    at: liability.at,
  });
  return liabilityId;
};

// Valuations

export const addValuation = async (
  ctx: MutationCtx,
  valuation: { subjectId: SubjectId; worth: number; at: number },
) => {
  const subject = await getValuedSubject(ctx, valuation.subjectId);
  assertValuationWorth(subject, valuation.worth);
  const valuationId = await ctx.db.insert("tally_valuations", valuation);
  await syncCurrentWorth(ctx, subject);
  return valuationId;
};

export const editValuation = async (
  ctx: MutationCtx,
  valuationId: Id<"tally_valuations">,
  changes: { worth?: number; at?: number },
) => {
  const valuation = await ctx.db.get("tally_valuations", valuationId);
  if (!valuation) throw new ConvexError("The valuation does not exist.");
  const subject = await getValuedSubject(ctx, valuation.subjectId);
  if (changes.worth !== undefined) assertValuationWorth(subject, changes.worth);
  await ctx.db.patch(
    "tally_valuations",
    valuationId,
    withoutUndefined(changes),
  );
  await syncCurrentWorth(ctx, subject);
};

export const deleteValuation = async (
  ctx: MutationCtx,
  valuationId: Id<"tally_valuations">,
) => {
  const valuation = await ctx.db.get("tally_valuations", valuationId);
  if (!valuation) throw new ConvexError("The valuation does not exist.");
  const subject = await getValuedSubject(ctx, valuation.subjectId);
  await ctx.db.delete("tally_valuations", valuationId);
  await syncCurrentWorth(ctx, subject);
};

// Holdings

export const addHolding = async (
  ctx: MutationCtx,
  holding: { assetId: Id<"tally_assets">; shares: number; at: number },
) => {
  await getHeldStockAsset(ctx, holding.assetId);
  assertShares(holding.shares);
  const holdingId = await ctx.db.insert("tally_holdings", holding);
  await syncCurrentShares(ctx, holding.assetId);
  return holdingId;
};

export const editHolding = async (
  ctx: MutationCtx,
  holdingId: Id<"tally_holdings">,
  changes: { shares?: number; at?: number },
) => {
  const holding = await ctx.db.get("tally_holdings", holdingId);
  if (!holding) throw new ConvexError("The holding does not exist.");
  await getHeldStockAsset(ctx, holding.assetId);
  if (changes.shares !== undefined) assertShares(changes.shares);
  await ctx.db.patch("tally_holdings", holdingId, withoutUndefined(changes));
  await syncCurrentShares(ctx, holding.assetId);
};

export const deleteHolding = async (
  ctx: MutationCtx,
  holdingId: Id<"tally_holdings">,
) => {
  const holding = await ctx.db.get("tally_holdings", holdingId);
  if (!holding) throw new ConvexError("The holding does not exist.");
  await getHeldStockAsset(ctx, holding.assetId);
  await ctx.db.delete("tally_holdings", holdingId);
  await syncCurrentShares(ctx, holding.assetId);
};

// Lifecycle

/**
 * Archives an asset or liability. Its current worth, or its current shares for
 * a stock asset, must already be zero, so past net worth does not change.
 */
export const archive = async (ctx: MutationCtx, subjectId: SubjectId) => {
  const subject = await getSubject(ctx, subjectId);
  assertNotArchived(subject.doc);
  const currentWorthOrShares =
    "currentShares" in subject.doc
      ? subject.doc.currentShares
      : subject.doc.currentWorth;
  if (currentWorthOrShares !== 0) {
    throw new ConvexError(
      "Bring the worth to zero before you archive the asset or liability.",
    );
  }
  await patchSubject(ctx, subject, { archivedAt: Date.now() });
};

/**
 * Erases an asset or liability that was created by mistake, together with all
 * its valuations and holdings. Prices stay, because they belong to a ticker.
 */
export const deleteSubject = async (ctx: MutationCtx, subjectId: SubjectId) => {
  const subject = await getSubject(ctx, subjectId);
  const valuations = await ctx.db
    .query("tally_valuations")
    .withIndex("by_subject_at", (q) => q.eq("subjectId", subjectId))
    .collect();
  for (const valuation of valuations) {
    await ctx.db.delete("tally_valuations", valuation._id);
  }
  if (subject.table === "tally_assets") {
    const holdings = await ctx.db
      .query("tally_holdings")
      .withIndex("by_asset_at", (q) => q.eq("assetId", subject.doc._id))
      .collect();
    for (const holding of holdings) {
      await ctx.db.delete("tally_holdings", holding._id);
    }
    await ctx.db.delete("tally_assets", subject.doc._id);
  } else {
    await ctx.db.delete("tally_liabilities", subject.doc._id);
  }
};
