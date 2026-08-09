"use client";

import { useEffect } from "react";
import { useAuth } from "@/modules/authentication/hooks";
import { BalanceChart, Funds } from "@/modules/funds/components";
import { useAccounts, useFunds } from "@/modules/funds/hooks";
import { Header, Loading } from "@/modules/shared/components";
import { useLocalization } from "@/modules/shared/hooks";

export function RegisterServiceWorker() {
  const { t } = useLocalization();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log(t("serviceWorker.registrationSuccess")))
        .catch((err) =>
          console.error(t("serviceWorker.registrationFailed"), err),
        );
    }
  }, [t]);

  return null;
}

export default function Home() {
  const { funds, handleCreateFund, handleDeleteFund, handleUpdateFundBalance } =
    useFunds();
  const { accounts, handleUpdateAccountBalance } = useAccounts();
  const {
    isAuthenticated,
    isLoading: authLoading,
    redirectToLogin,
  } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      redirectToLogin();
    }
  }, [isAuthenticated, authLoading, redirectToLogin]);

  if (authLoading) {
    return (
      <div className="flex justify-center h-full items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-screen w-full justify-center bg-background sm:items-start">
      <div className="flex flex-col w-full max-w-xl px-8 flex-1 h-dvh">
        {!accounts || !funds ? (
          <div className="flex justify-center h-full items-center">
            <Loading />
          </div>
        ) : (
          <>
            <Header balance={accounts[0].balance} />
            <BalanceChart account={accounts[0]} funds={funds} />
            <Funds
              funds={funds}
              account={accounts[0]}
              addFund={handleCreateFund}
              deleteFund={handleDeleteFund}
              updateFundBalance={handleUpdateFundBalance}
              updateAccountBalance={handleUpdateAccountBalance}
            />
          </>
        )}
      </div>
    </main>
  );
}
