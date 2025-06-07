"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import ActionTooltipProvider from "@/modules/auth/providers/action-tooltip-provider";

import { Check, House, LogOut, Settings2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { useLocale } from "next-intl";
import Link from "next/link";

const items = [
  {
    title: "Home",
    url: "/bezs/dashboard",
    icon: House,
  },
];

const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

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

  if (pathname.includes("app") || pathname.includes("calendar")) {
    return null;
  }

  return (
    <Sidebar
      className="w-fit h-full bg-zinc-200/50 dark:bg-zinc-900 border-r-2"
      collapsible="none"
    >
      <SidebarContent className="py-3 px-1">
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <ActionTooltipProvider
                key={item.title}
                label={item.title}
                side="bottom"
                align="center"
              >
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        pathname.includes(item.url) && "bg-sidebar-accent",
                        "px-3 py-5"
                      )}
                    >
                      <item.icon className="!w-5 !h-5" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </ActionTooltipProvider>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-3">
        <SidebarGroup>
          <SidebarMenu className="flex flex-col gap-2">
            <SidebarMenuItem>
              {/* <DropdownMenu>
                <DropdownMenuTrigger className="px-2 py-1 cursor-pointer hover:bg-sidebar-accent rounded">
                  EN
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>EN</DropdownMenuItem>
                  <DropdownMenuItem>HI</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
              <DropdownMenu>
                <DropdownMenuTrigger className="px-2 py-1 cursor-pointer flex items-center justify-between w-full hover:bg-sidebar-accent rounded">
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
                    onClick={() => {}}
                  >
                    EN
                    {currentLocale === "en" && (
                      <Check className="!h-[1.2rem] !w-[1.2rem]" />
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex items-center justify-between px-1.5 py-1 cursor-pointer hover:bg-secondary"
                    onClick={() => {}}
                  >
                    HI
                    {currentLocale === "hi" && (
                      <Check className="!h-[1.2rem] !w-[1.2rem]" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <ActionTooltipProvider
                label="Log Out"
                align="center"
                side="right"
              >
                <SidebarMenuButton
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="!w-5 !h-5" />
                </SidebarMenuButton>
              </ActionTooltipProvider>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <ActionTooltipProvider
                label="Settings"
                align="center"
                side="right"
              >
                <SidebarMenuButton
                  className="cursor-pointer"
                  // onClick={() => {
                  //   router.push("/bezs/settings");
                  //   router.refresh();
                  // }}
                >
                  <Link href="/bezs/dashboard/settings">
                    <Settings2 className="!w-5 !h-5" />
                  </Link>
                </SidebarMenuButton>
              </ActionTooltipProvider>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
