"use client";

import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";

const STORAGE_KEY = "pockets:privacy-mode";

interface PrivacyModeContextValue {
  isPrivacyModeOn: boolean;
  togglePrivacyMode: () => void;
}

export const PrivacyModeContext = createContext<PrivacyModeContextValue | null>(
  null,
);

export const PrivacyModeProvider = ({ children }: { children: ReactNode }) => {
  const [isPrivacyModeOn, setIsPrivacyModeOn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setIsPrivacyModeOn(stored === "true");
  }, []);

  const togglePrivacyMode = () => {
    setIsPrivacyModeOn((previous) => {
      const next = !previous;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <PrivacyModeContext.Provider value={{ isPrivacyModeOn, togglePrivacyMode }}>
      {children}
    </PrivacyModeContext.Provider>
  );
};
