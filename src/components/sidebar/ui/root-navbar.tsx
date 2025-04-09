"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { ThemeSwitcher } from "@/theme/theme-switcher";
import Link from "next/link";

const RootNavBarPage = () => {
  const { data } = useSession();

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-1 bg-white dark:bg-zinc-800/60 shadow-md">
        <div>
          <h1>Bezs</h1>
        </div>
        <ul className="flex items-center gap-2">
          <li>
            <Button variant="ghost" className="cursor-pointer" size="sm">
              EN
            </Button>
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
                  Log in
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
                  Sign up
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
                Open app
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default RootNavBarPage;
