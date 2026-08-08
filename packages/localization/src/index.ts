/**
 * Builds a `useLocalization` hook for one application.
 *
 * Each application keeps its own `en.json` file. The hook that this factory
 * returns gives typed, dot-delimited access to the keys of that file, so the
 * editor shows the available keys and stops unknown keys.
 *
 * @example
 * import en from "@/modules/shared/localization/en.json";
 * export const useLocalization = createUseLocalization(en);
 */
export type NestedKey<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${string & K}.${string & NestedKey<T[K]>}`
        : K;
    }[keyof T]
  : never;

export const createUseLocalization = <T extends object>(locale: T) => {
  const translate = (key: NestedKey<T>): string => {
    const keys = String(key).split(".");
    let value: unknown = locale;

    for (const part of keys) {
      if (typeof value !== "object" || value === null) return String(key);
      value = (value as Record<string, unknown>)[part];
    }

    return typeof value === "string" ? value : String(key);
  };

  return () => ({ t: translate });
};
