import { z } from "zod";
import type { LocalizationKey } from "@/modules/shared/hooks";

export type TransactionType = "deposit" | "withdraw";

export type AddTransactionSchemaProps = {
  amount: number;
};

export type AddTransactionSchemaContext = {
  transactionType: TransactionType;
  currentBalance: number;
};

export const addTransactionSchema = (
  t: (key: LocalizationKey) => string,
  getContext: () => AddTransactionSchemaContext,
) =>
  z
    .object({
      amount: z
        .transform(Number)
        .pipe(
          z
            .number(t("funds.amountMustBeNumber"))
            .positive(t("funds.amountMustNotBeZero")),
        ),
    })
    .superRefine((data, ctx) => {
      const { transactionType, currentBalance } = getContext();

      if (transactionType === "withdraw" && data.amount > currentBalance) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["amount"],
          message: t("funds.insufficientFunds"),
        });
      }
    });
