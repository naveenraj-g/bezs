"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { Check, ChevronRight, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const themes: string[] = [
  "zinc",
  "red",
  "rose",
  "orange",
  "green",
  "blue",
  "yellow",
  "violet",
];

const themeModes: string[] = ["light", "dark"];

export const ThemeSwitcher = ({ isAppNav }: { isAppNav?: boolean }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // const [customTheme, setCustomTheme] = useState<string>("zinc");
  // const [customThemeMode, setCustomThemeMode] = useState<string>("dark");
  // let customTheme = "zinc";
  // let customThemeMode = "dark";

  useEffect(() => {
    const storedTheme = localStorage?.getItem("theme") || "zinc-dark";

    const [themeName, themeMode] = storedTheme.split("-");

    const newTheme = `${themeName}-${themeMode}`;
    if (newTheme !== resolvedTheme) {
      setTheme(newTheme);
    }
    // setCustomTheme(themeName);
    // setCustomThemeMode(themeMode);
    setIsMounted(true);
  }, [setTheme, resolvedTheme]);

  // useEffect(() => {
  //   const storedTheme = localStorage?.getItem("theme") || "zinc-dark";

  //   const [themeName, themeMode] = storedTheme.split("-");

  //   setCustomTheme(themeName);
  //   setCustomThemeMode(themeMode);
  // }, []);

  // useEffect(() => {
  //   if (customTheme && customThemeMode) {
  //     const newTheme = `${customTheme}-${customThemeMode}`;
  //     setTheme(newTheme);
  //   }
  // }, [customTheme, customThemeMode, setTheme]);

  function handleCustomTheme(themeName: string) {
    const [theme, themeMode] = resolvedTheme?.split("-");
    // setCustomTheme(themeName);
    // customTheme = themeName;
    setTheme(`${themeName}-${themeMode}`);
  }

  function handleCustomThemeMode(themeModeName: string) {
    // setCustomThemeMode(themeModeName);
    const [theme, themeMode] = resolvedTheme?.split("-");
    // customThemeMode = themeModeName;
    setTheme(`${theme}-${themeModeName}`);
  }

  if (!isMounted) return null;

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer mr-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className={cn(isAppNav && "pointer-events-none")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:text-white" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:text-white" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            {isAppNav && <p>Change Theme</p>}
            {isAppNav && (
              <ChevronRight className="!h-[1.2rem] !w-[1.2rem] ml-auto dark:text-white" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={isAppNav ? "center" : "end"}
          className="p-2"
          sideOffset={10}
          side={isAppNav ? "left" : "bottom"}
        >
          <div className="flex items-center gap-1 mb-3">
            {themeModes.map((themeMode, index) => {
              return (
                <div
                  key={index}
                  className={cn(
                    "cursor-pointer flex-1/2 hover:bg-secondary/70 text-md py-0.5 px-1 rounded",
                    resolvedTheme?.split("-")[1] === themeMode && "bg-secondary"
                  )}
                  onClick={() => handleCustomThemeMode(themeMode)}
                >
                  {themeMode}
                </div>
              );
            })}
          </div>
          <div className="flex justify-evenly gap-2 flex-wrap">
            {themes.map((theme, i) => {
              return (
                <button
                  key={i}
                  className={cn(
                    "rounded-full w-4 h-4 cursor-pointer flex items-center justify-center",
                    `bg-${theme}-600`
                  )}
                  onClick={() => handleCustomTheme(theme)}
                >
                  {resolvedTheme?.split("-")[0] === theme && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </button>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
