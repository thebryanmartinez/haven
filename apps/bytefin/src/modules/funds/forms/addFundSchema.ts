import { z } from "zod";
import type { LocalizationKey } from "@/modules/shared/hooks";

export type AddFundSchemaProps = {
  fundName: string;
};

export const addFundSchema = (t: (key: LocalizationKey) => string) =>
  z.object({
    fundName: z
      .string()
      .min(1, t("funds.fundRequired"))
      .max(30, t("funds.fundMaxLength")),
  });
