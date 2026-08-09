import { api } from "@haven/backend/api";
import type { Id } from "@haven/backend/dataModel";
import { useMutation, useQuery } from "convex/react";

export const useAccounts = () => {
  const accounts = useQuery(api.accounts.get);

  const updateAccountBalance = useMutation(api.accounts.updateAccountBalance);

  const handleUpdateAccountBalance = (
    id: Id<"pockets_accounts">,
    currentBalance: number,
    amount: number,
  ) => {
    try {
      updateAccountBalance({ id, currentBalance, amount });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    accounts,
    handleUpdateAccountBalance,
  };
};
