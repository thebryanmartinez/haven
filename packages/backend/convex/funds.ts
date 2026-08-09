import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getNewBalance } from "./lib/balance";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pockets_funds").collect();
  },
});

export const createFund = mutation({
  args: {
    name: v.string(),
    balance: v.number(),
    accountId: v.id("pockets_accounts"),
  },
  handler: async (ctx, args) => {
    const newFundId = await ctx.db.insert("pockets_funds", {
      name: args.name,
      balance: args.balance,
      accountId: args.accountId,
    });
    return newFundId;
  },
});

export const deleteFund = mutation({
  args: { id: v.id("pockets_funds") },
  handler: async (ctx, args) => {
    await ctx.db.delete("pockets_funds", args.id);
  },
});

export const updateFundBalance = mutation({
  args: {
    id: v.id("pockets_funds"),
    currentBalance: v.number(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const newBalance = getNewBalance(args.currentBalance, args.amount);
    await ctx.db.patch("pockets_funds", args.id, { balance: newBalance });
  },
});
