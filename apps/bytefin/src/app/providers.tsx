"use client";

import { ThemeProvider } from "@bytefin/ui/components/theme";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { PrivacyModeProvider } from "@/modules/shared/components";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <PrivacyModeProvider>{children}</PrivacyModeProvider>
      </ThemeProvider>
    </ConvexProvider>
  );
}
