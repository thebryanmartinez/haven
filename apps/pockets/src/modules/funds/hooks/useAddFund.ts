import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { addFundSchema } from "@/modules/funds/forms";
import type { LocalizationKey } from "@/modules/shared/hooks";

export const useAddFund = (t: (key: LocalizationKey) => string) => {
  const formSchema = addFundSchema(t);

  const addFundForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fundName: "",
    },
  });

  const isFormDisabled = !!addFundForm.formState.errors.fundName;

  return {
    addFundForm,
    isFormDisabled,
  };
};
