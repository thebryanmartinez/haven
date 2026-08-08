import type { Id } from "@bytefin/backend/dataModel";
import type { Account, Fund } from "@/modules/funds/interfaces";

export type FundsProps = {
  funds: Fund[] | undefined;
  account: Account;
  addFund: (name: string) => void;
  deleteFund: (id: Id<"funds">) => void;
  updateFundBalance: (
    id: Id<"funds">,
    currentBalance: number,
    amount: number,
  ) => void;
  updateAccountBalance: (
    id: Id<"accounts">,
    currentBalance: number,
    amount: number,
  ) => void;
};

export type DeleteFundProps = {
  id: Id<"funds">;
  deleteFund: FundsProps["deleteFund"];
};
