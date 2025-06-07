"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const LangSwitcherBtn = () => {
  const router = useRouter();
  const [locale, setLocale] = useState<string>("");

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("BEZS_LOCALE="))
      ?.split("=")[1];

    if (cookieLocale) {
      setLocale(cookieLocale);
    } else {
      const browserLocale = navigator.language.slice(0, 2);
      const chosenLocale =
        browserLocale === "en" || browserLocale === "hi" ? browserLocale : "en";
      setLocale(chosenLocale);
      document.cookie = `BEZS_LOCALE=${chosenLocale}; path=/`;
      router.refresh();
    }
  }, [router]);

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    document.cookie = `BEZS_LOCALE=${newLocale}; path=/`;
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer flex items-center justify-between w-full">
        <p>{locale.toUpperCase()}</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="bottom"
        sideOffset={18}
        className="space-y-1"
      >
        <DropdownMenuItem
          className="flex items-center justify-between px-1.5 py-1 cursor-pointer hover:bg-secondary"
          onClick={() => changeLocale("en")}
        >
          EN
          {locale === "en" && <Check className="!h-[1.2rem] !w-[1.2rem]" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center justify-between px-1.5 py-1 cursor-pointer hover:bg-secondary"
          onClick={() => changeLocale("hi")}
        >
          HI
          {locale === "hi" && <Check className="!h-[1.2rem] !w-[1.2rem]" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
