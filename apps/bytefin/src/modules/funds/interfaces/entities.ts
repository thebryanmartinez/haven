import type { Id } from "@bytefin/backend/dataModel";

export type Fund = {
  _id: Id<"funds">;
  name: string;
  balance: number;
  accountId: string;
};

export type Account = {
  _id: Id<"accounts">;
  name: string;
  balance: number;
};
