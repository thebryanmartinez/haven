"use client";

import { Button } from "@haven/ui/components";
import { Eye, EyeOff } from "lucide-react";
import { useLocalization, usePrivacyMode } from "@/modules/shared/hooks";

export const PrivacyModeToggle = () => {
  const { t } = useLocalization();
  const { isPrivacyModeOn, togglePrivacyMode } = usePrivacyMode();

  return (
    <Button
      variant="neutral"
      size="icon"
      aria-label={t("header.togglePrivacyMode")}
      aria-pressed={isPrivacyModeOn}
      onClick={togglePrivacyMode}
    >
      {isPrivacyModeOn ? (
        <EyeOff className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Eye className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
};
