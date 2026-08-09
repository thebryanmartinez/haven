import type { Id } from "@haven/backend/dataModel";
import type { Account, Fund } from "@/modules/funds/interfaces";

export type FundsProps = {
  funds: Fund[] | undefined;
  account: Account;
  addFund: (name: string) => void;
  deleteFund: (id: Id<"pockets_funds">) => void;
  updateFundBalance: (
    id: Id<"pockets_funds">,
    currentBalance: number,
    amount: number,
  ) => void;
  updateAccountBalance: (
    id: Id<"pockets_accounts">,
    currentBalance: number,
    amount: number,
  ) => void;
};

export type DeleteFundProps = {
  id: Id<"pockets_funds">;
  deleteFund: FundsProps["deleteFund"];
};
