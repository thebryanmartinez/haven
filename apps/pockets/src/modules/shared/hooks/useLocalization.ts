import { createUseLocalization } from "@haven/localization";
import enLocale from "@/modules/shared/localization/en.json";

export const useLocalization = createUseLocalization(enLocale);

export type LocalizationKey = Parameters<
  ReturnType<typeof useLocalization>["t"]
>[0];
