import { api } from "@bytefin/backend/api";
import type { Id } from "@bytefin/backend/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useAccounts } from "./useAccounts";

export const useFunds = () => {
  const { accounts } = useAccounts();
  const funds = useQuery(api.funds.get);

  const createFund = useMutation(api.funds.createFund);
  const deleteFund = useMutation(api.funds.deleteFund);
  const updateFundBalance = useMutation(api.funds.updateFundBalance);

  const handleCreateFund = (name: string) => {
    try {
      if (accounts && accounts.length > 0)
        createFund({ name, balance: 0, accountId: accounts[0]._id });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFund = (id: Id<"funds">) => {
    try {
      deleteFund({ id });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateFundBalance = (
    id: Id<"funds">,
    currentBalance: number,
    amount: number,
  ) => {
    try {
      updateFundBalance({ id, currentBalance, amount });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    funds,
    accounts,
    handleCreateFund,
    handleDeleteFund,
    handleUpdateFundBalance,
  };
};
