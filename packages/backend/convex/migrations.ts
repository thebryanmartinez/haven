import { mutation } from "./_generated/server";

/**
 * One-off migration for the ByteFin -> Pockets rename. Copies rows out of the
 * pre-rename `accounts` / `funds` tables (no longer declared in schema.ts, so
 * they're queried by string name without type-checked validators) into
 * `pockets_accounts` / `pockets_funds`, remapping `accountId` references.
 *
 * Run this once from the Convex dashboard's Functions tab after pushing the
 * updated schema, then verify the pockets_* tables look right before running
 * `deleteLegacyAccountsAndFunds`.
 */
export const migrateAccountsAndFundsToPockets = mutation({
  args: {},
  handler: async (ctx) => {
    // biome-ignore lint/suspicious/noExplicitAny: legacy tables no longer declared in schema.ts
    const db = ctx.db as any;
    const legacyAccounts: Array<{
      _id: string;
      name: string;
      balance: number;
    }> = await db.query("accounts").collect();
    const legacyFunds: Array<{
      _id: string;
      name: string;
      balance: number;
      accountId: string;
    }> = await db.query("funds").collect();

    const accountIdMap = new Map<string, string>();

    for (const account of legacyAccounts) {
      const newId = await db.insert("pockets_accounts", {
        name: account.name,
        balance: account.balance,
      });
      accountIdMap.set(account._id, newId);
    }

    for (const fund of legacyFunds) {
      const newAccountId = accountIdMap.get(fund.accountId);
      if (!newAccountId) {
        throw new Error(
          `Fund ${fund._id} references account ${fund.accountId}, which was not migrated.`,
        );
      }
      await db.insert("pockets_funds", {
        name: fund.name,
        balance: fund.balance,
        accountId: newAccountId,
      });
    }

    return {
      migratedAccounts: legacyAccounts.length,
      migratedFunds: legacyFunds.length,
    };
  },
});

/**
 * Deletes the legacy `accounts` / `funds` rows. Only run this after
 * confirming the pockets_* tables hold everything you expect.
 */
export const deleteLegacyAccountsAndFunds = mutation({
  args: {},
  handler: async (ctx) => {
    // biome-ignore lint/suspicious/noExplicitAny: legacy tables no longer declared in schema.ts
    const db = ctx.db as any;
    const legacyAccounts: Array<{ _id: string }> = await db
      .query("accounts")
      .collect();
    const legacyFunds: Array<{ _id: string }> = await db
      .query("funds")
      .collect();

    for (const fund of legacyFunds) {
      await db.delete("funds", fund._id);
    }
    for (const account of legacyAccounts) {
      await db.delete("accounts", account._id);
    }

    return {
      deletedAccounts: legacyAccounts.length,
      deletedFunds: legacyFunds.length,
    };
  },
});
