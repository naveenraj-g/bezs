"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { ThemeSwitcher } from "@/theme/theme-switcher";
import { Check } from "lucide-react";
import { Locale, useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";

const RootNavBarPage = () => {
  const { data } = useSession();
  const t = useTranslations("HomePage.navbar");

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = useLocale();
  console.log(currentLocale);
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(lang: string) {
    startTransition(() => {
      router.replace(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        { pathname, params },
        { locale: lang as Locale }
      );
    });
    // startTransition(() => {
    //   const newPath = pathname.replace(`/${currentLocale}`, `/${lang}`);
    //   router.push(newPath);
    // });
  }

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-1.5 bg-white dark:bg-zinc-800/60 shadow-md">
        <div>
          <h1>
            <Link href="/">Bezs</Link>
          </h1>
        </div>
        <ul className="flex items-center gap-2">
          <li>
            {/* <Button variant="ghost" className="cursor-pointer" size="sm">
              EN
            </Button> */}

            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer flex items-center justify-between w-full">
                <p>{currentLocale.toUpperCase()}</p>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                side="bottom"
                sideOffset={18}
                className="space-y-1"
              >
                <DropdownMenuItem
                  className="flex items-center justify-between px-1.5 py-1 cursor-pointer hover:bg-secondary"
                  onClick={() => handleLocaleChange("en")}
                >
                  EN
                  {currentLocale === "en" && (
                    <Check className="!h-[1.2rem] !w-[1.2rem]" />
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="flex items-center justify-between px-1.5 py-1 cursor-pointer hover:bg-secondary"
                  onClick={() => handleLocaleChange("hi")}
                >
                  HI
                  {currentLocale === "hi" && (
                    <Check className="!h-[1.2rem] !w-[1.2rem]" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <li>
            <ThemeSwitcher />
          </li>
          <li className="flex items-center gap-2">
            {!data ? (
              <>
                <Link
                  href="signin"
                  className={cn(
                    "cursor-pointer",
                    buttonVariants({
                      variant: "link",
                      size: "sm",
                      className: "!no-underline",
                    })
                  )}
                >
                  {t("loginBtnLable")}
                </Link>
                <Link
                  href="signup"
                  className={cn(
                    "cursor-pointer",
                    buttonVariants({
                      variant: "default",
                      size: "sm",
                      className: "!no-underline",
                    })
                  )}
                >
                  {t("signupBtnLable")}
                </Link>
              </>
            ) : (
              <Link
                href="/bezs"
                className={cn(
                  "cursor-pointer",
                  buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "!no-underline",
                  })
                )}
              >
                {t("title")}
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default RootNavBarPage;
