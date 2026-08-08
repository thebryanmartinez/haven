"use client";

import type { Id } from "@bytefin/backend/dataModel";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldError,
  FieldLabel,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@bytefin/ui/components";
import { Plus } from "lucide-react";
import { Controller } from "react-hook-form";
import type {
  AddTransactionSchemaProps,
  TransactionType,
} from "@/modules/funds/forms";
import { useAddTransaction } from "@/modules/funds/hooks";
import type { FundsProps } from "@/modules/funds/interfaces";
import {
  useDialog,
  useLocalization,
  usePrivacyMode,
} from "@/modules/shared/hooks";
import { formatCurrency } from "@/modules/shared/lib/formatCurrency";

interface AddTransactionDialogProps {
  fundId: Id<"funds">;
  account: FundsProps["account"];
  updateFundBalance: FundsProps["updateFundBalance"];
  currentBalance?: number;
  updateAccountBalance: FundsProps["updateAccountBalance"];
}

export const AddTransactionDialog = ({
  fundId,
  account,
  updateFundBalance,
  currentBalance = 0,
  updateAccountBalance,
}: AddTransactionDialogProps) => {
  const { t } = useLocalization();
  const {
    addTransactionForm,
    isFormDisabled,
    transactionType,
    handleTransactionTypeChange,
  } = useAddTransaction(t, currentBalance);
  const { isOpen, handleClose, handleOpenChange } = useDialog();
  const { isPrivacyModeOn } = usePrivacyMode();

  const resetTransaction = () => handleTransactionTypeChange("deposit");

  const handleUpdateBalance = async (data: AddTransactionSchemaProps) => {
    try {
      const signedAmount =
        transactionType === "withdraw" ? -data.amount : data.amount;
      updateFundBalance(fundId, currentBalance, signedAmount);
      updateAccountBalance(account._id, account.balance, signedAmount);
      handleClose(resetTransaction);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => handleOpenChange(!isOpen, resetTransaction)}
    >
      <DialogTrigger asChild>
        <Button variant="neutral" size="sm">
          <Plus className="w-3 h-3 mr-1" />
          {t("common.add")}
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-auto">
        <DialogHeader>
          <DialogTitle>{t("funds.addTransactionTitle")}</DialogTitle>
        </DialogHeader>
        <Tabs
          value={transactionType}
          onValueChange={(value) =>
            handleTransactionTypeChange(value as TransactionType)
          }
        >
          <TabsList className="grid w-full grid-cols-2 gap-0 p-0 overflow-hidden">
            <TabsTrigger
              value="deposit"
              className="h-full w-full rounded-none border-0 data-[state=inactive]:bg-secondary-background"
            >
              {t("funds.deposit")}
            </TabsTrigger>
            <TabsTrigger
              value="withdraw"
              className="h-full w-full rounded-none border-0 data-[state=inactive]:bg-secondary-background"
            >
              {t("funds.withdraw")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <form
          className="space-y-4 pt-4"
          id="form-add-transaction"
          onSubmit={addTransactionForm.handleSubmit(handleUpdateBalance)}
        >
          <div className="space-y-4">
            <Controller
              name="amount"
              control={addTransactionForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={field.name}>
                    {t("funds.amount")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder={t("funds.amountPlaceholder")}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-error"
                    />
                  )}
                </Field>
              )}
            />
            <div className="text-sm text-gray-500">
              Current Balance: {formatCurrency(currentBalance, isPrivacyModeOn)}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="neutral"
              onClick={() => handleClose(resetTransaction)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              form="form-add-transaction"
              disabled={isFormDisabled}
            >
              {transactionType === "withdraw"
                ? t("funds.withdraw")
                : t("funds.deposit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
