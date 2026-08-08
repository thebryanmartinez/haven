import { useContext } from "react";
import { PrivacyModeContext } from "@/modules/shared/components/PrivacyModeProvider";

export const usePrivacyMode = () => {
  const context = useContext(PrivacyModeContext);

  if (!context) {
    throw new Error(
      "usePrivacyMode must be used within a <PrivacyModeProvider />",
    );
  }

  return context;
};
