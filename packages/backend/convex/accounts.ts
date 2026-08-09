import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getNewBalance } from "./lib/balance";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pockets_accounts").collect();
  },
});

export const updateAccountBalance = mutation({
  args: {
    id: v.id("pockets_accounts"),
    currentBalance: v.number(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const newBalance = getNewBalance(args.currentBalance, args.amount);
    await ctx.db.patch("pockets_accounts", args.id, { balance: newBalance });
  },
});
