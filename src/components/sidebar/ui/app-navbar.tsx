"use client";

import { Session } from "@/modules/auth/types/auth-types";
import {
  Bell,
  Check,
  ChevronRight,
  Globe,
  Grip,
  LogOut,
  Search,
  Settings2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/theme/theme-switcher";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
// import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import AppsList from "@/modules/bezs/ui/apps-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LangSwitcherBtn } from "@/shared/langSwitch/lang-switcher-btn";
import Link from "next/link";

const AppNavbar = ({ session }: { session: Session }) => {
  // const t = useTranslations("bezs");
  console.log(session);

  const router = useRouter();

  const {
    user: { name, email, image, username },
  } = session;

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess() {
          toast("Success!");
          router.push("/");
        },
        onError(ctx) {
          toast("Error!", {
            description: ctx.error.message,
          });
        },
      },
    });
  }

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-zinc-200/50 dark:bg-zinc-900 shadow">
      <div className="mt-1.5">
        {/* <h1 className="text-2xl mb-0.5">
            {t("welcome")}, {name} 👋
          </h1>
          <p className="text-zinc-300">{format(today, "MMMM dd, yyy")}</p> */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Grip className="h-6 w-6 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="shadow py-2" sideOffset={15}>
            {/* <DropdownMenuItem className="hover:bg-none"> */}
            <ScrollArea className="h-[500px] w-[500px]">
              <AppsList isNavItem />
            </ScrollArea>
            {/* </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-[20rem] relative">
        <Input placeholder="Search" className="pl-8 border-zinc-500" />
        <Search className="dark:text-zinc-300 absolute w-[1.1rem] h-[1.1rem] top-[25%] left-2" />
      </div>
      <div className="flex items-center gap-6">
        <div>
          <LangSwitcherBtn />
        </div>
        <Bell className="h-5 w-5 text-zinc-500 dark:text-zinc-300 cursor-pointer" />
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Avatar>
              <AvatarImage src={image || "https://github.com/shadcn.png"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            sideOffset={10}
            asChild
          >
            <div>
              <DropdownMenuLabel className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={image || "https://github.com/shadcn.png"} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p>
                    {name} (@{username || "no username"})
                  </p>
                  <p>{email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* First element */}
              <DropdownMenuItem className="p-0 cursor-pointer w-full">
                <ThemeSwitcher isAppNav />
              </DropdownMenuItem>

              {/* Second element */}
              <DropdownMenuItem className="cursor-pointer">
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Globe className="!h-[1.1rem] !w-[1.1rem] dark:text-white" />
                      <p>Change language</p>
                    </div>
                    <ChevronRight className="!h-[1.2rem] !w-[1.2rem] dark:text-white" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    side="left"
                    sideOffset={18}
                    className="space-y-1"
                  >
                    <div
                      className="flex items-center justify-between px-1.5 py-1 cursor-pointer hover:bg-secondary"
                      onClick={() => {}}
                    >
                      EN
                      <Check className="!h-[1.2rem] !w-[1.2rem]" />
                    </div>

                    <div
                      className="px-1 py-0.5 cursor-pointer hover:bg-secondary"
                      onClick={() => {}}
                    >
                      HI
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuItem>

              {/* Third element */}
              <DropdownMenuItem
                className="cursor-pointer"
                // onClick={() => router.push("/bezs/settings")}
              >
                <Link
                  href="/bezs/dashboard/settings/account"
                  className="flex items-center gap-2 cursor-pointer w-full"
                >
                  <Settings2 className="!h-[1.2rem] !w-[1.2rem] dark:text-white" />
                  <p>Settings</p>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Fourth element */}
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="!h-[1.2rem] !w-[1.2rem] dark:text-white" />
                <p>Logout</p>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default AppNavbar;
