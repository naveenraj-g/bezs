"use client";

import { Session } from "@/modules/auth/types/auth-types";
import { format } from "date-fns";
import {
  Bell,
  Check,
  ChevronRight,
  Globe,
  LogOut,
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

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/theme/theme-switcher";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { capitalizeString } from "@/utils/helper";

const AppNavbar = ({ session }: { session: Session }) => {
  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname);

  const {
    user: { name, email, image },
  } = session;

  const today = new Date();

  async function handleLogout() {
    console.log("logout button clicked.");
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

  const pathSegments = pathname.split("/").filter(Boolean);
  const pathSegmentsLength = pathSegments.length;

  return (
    <nav className="flex items-center justify-between">
      {pathname.includes("settings") ? (
        <Breadcrumb>
          <BreadcrumbList>
            {pathSegments.map((pathSegment, index) => {
              return index + 1 === pathSegmentsLength ? (
                <BreadcrumbItem key={pathSegment}>
                  <BreadcrumbPage className="text-base">
                    {capitalizeString(pathSegment)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbList key={pathSegment}>
                  <BreadcrumbItem key={pathSegment}>
                    <BreadcrumbLink
                      href={
                        pathSegment === "bezs"
                          ? "/bezs"
                          : `/bezs/${pathSegment}`
                      }
                      className="text-base"
                    >
                      {pathSegment === "bezs"
                        ? "Home"
                        : capitalizeString(pathSegment)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="[&>svg]:size-4.5" />
                </BreadcrumbList>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : (
        <div>
          <h1 className="text-2xl mb-0.5">Welcome back, {name} 👋</h1>
          <p className="text-zinc-300">{format(today, "MMMM dd, yyy")}</p>
        </div>
      )}
      <div className="flex items-center gap-6">
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
                  <p>{name}</p>
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
                    <div className="flex items-center justify-between px-1 py-0.5 cursor-pointer hover:bg-secondary">
                      <p>EN</p>
                      <Check className="!h-[1.2rem] !w-[1.2rem]" />
                    </div>
                    <div className="px-1 py-0.5 cursor-pointer hover:bg-secondary">
                      <p>HI</p>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuItem>

              {/* Third element */}
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push("/bezs/settings")}
              >
                <Settings2 className="!h-[1.2rem] !w-[1.2rem] dark:text-white" />
                <p>Settings</p>
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
