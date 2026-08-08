const MASKED_AMOUNT = "$****";

export const formatCurrency = (value: number, isMasked = false): string => {
  if (isMasked) return MASKED_AMOUNT;

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
