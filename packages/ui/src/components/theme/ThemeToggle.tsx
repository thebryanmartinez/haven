"use client";

import { Button } from "@haven/ui/components/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = () => {
    if (theme === "dark") setTheme("light");
    else setTheme("dark");
  };

  return (
    <Button variant="neutral" size="icon" onClick={handleThemeChange}>
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
};
