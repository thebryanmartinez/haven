import { Card, CardContent } from "@bytefin/ui/components";
import { Wallet } from "lucide-react";
import {
  AddFundDialog,
  AddTransactionDialog,
  DeleteFundButton,
} from "@/modules/funds/components";
import type { FundsProps } from "@/modules/funds/interfaces";
import { EmptyState } from "@/modules/shared/components";
import { useLocalization } from "@/modules/shared/hooks";

export const Funds = ({
  funds,
  account,
  addFund,
  deleteFund,
  updateFundBalance,
  updateAccountBalance,
}: FundsProps) => {
  const { t } = useLocalization();

  return (
    <section className="space-y-4">
      <div>
        <div className="flex w-full justify-between items-center pb-1">
          <h2 className="text-lg font-bold ">{t("funds.title")}</h2>
          <AddFundDialog addFund={addFund} />
        </div>
      </div>
      <div className="pb-4 max-h-[calc(100vh-400px)] w-full overflow-y-auto overflow-x-hidden scrollbar-none">
        {!funds || funds.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title={t("funds.noFundsYet")}
            description={t("funds.noFundsDescription")}
          />
        ) : (
          <div className="space-y-3">
            {funds.map((fund) => (
              <Card className="py-3 bg-secondary-background" key={fund._id}>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col justify-between">
                      <span className="text-base font-semibold">
                        {fund.name}
                      </span>
                      <span className="text-sm text-gray-400">
                        ${fund.balance.toFixed(2)}
                      </span>
                    </div>

                    <div className="space-x-2">
                      <DeleteFundButton id={fund._id} deleteFund={deleteFund} />
                      <AddTransactionDialog
                        fundId={fund._id}
                        account={account}
                        updateFundBalance={updateFundBalance}
                        updateAccountBalance={updateAccountBalance}
                        currentBalance={fund.balance}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Funds;
