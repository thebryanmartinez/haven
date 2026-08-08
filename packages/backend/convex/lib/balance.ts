/**
 * Adds an amount to a balance. A deposit uses a positive amount and a
 * withdrawal uses a negative amount.
 *
 * The Convex functions and the application forms both use this function, so
 * the fund balance and the account balance always change by the same rule.
 */
export const getNewBalance = (currentBalance: number, amount: number) => {
  return currentBalance + amount;
};
