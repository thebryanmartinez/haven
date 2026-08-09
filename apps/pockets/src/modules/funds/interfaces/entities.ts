import type { Id } from "@haven/backend/dataModel";

export type Fund = {
  _id: Id<"pockets_funds">;
  name: string;
  balance: number;
  accountId: string;
};

export type Account = {
  _id: Id<"pockets_accounts">;
  name: string;
  balance: number;
};
