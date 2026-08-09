import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  addTransactionSchema,
  type TransactionType,
} from "@/modules/funds/forms";
import type { LocalizationKey } from "@/modules/shared/hooks";

export const useAddTransaction = (
  t: (key: LocalizationKey) => string,
  currentBalance: number,
) => {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("deposit");

  const contextRef = useRef({ transactionType, currentBalance });
  contextRef.current = { transactionType, currentBalance };

  const formSchema = useMemo(
    () => addTransactionSchema(t, () => contextRef.current),
    [t],
  );

  const addTransactionForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const handleTransactionTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    addTransactionForm.reset({ amount: 0 });
  };

  const isFormDisabled = !!addTransactionForm.formState.errors.amount;

  return {
    addTransactionForm,
    isFormDisabled,
    transactionType,
    handleTransactionTypeChange,
  };
};
