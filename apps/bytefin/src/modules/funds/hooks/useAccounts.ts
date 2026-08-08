import { api } from "@bytefin/backend/api";
import type { Id } from "@bytefin/backend/dataModel";
import { useMutation, useQuery } from "convex/react";

export const useAccounts = () => {
  const accounts = useQuery(api.accounts.get);

  const updateAccountBalance = useMutation(api.accounts.updateAccountBalance);

  const handleUpdateAccountBalance = (
    id: Id<"accounts">,
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
