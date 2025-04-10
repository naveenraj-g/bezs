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

import { House, LogOut, Settings2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";

const items = [
  {
    title: "Home",
    url: "/bezs",
    icon: House,
  },
];

const AppSidebar = () => {
  const router = useRouter();
  const path = usePathname();

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

  return (
    <Sidebar
      className="w-fit bg-zinc-200/50 dark:bg-zinc-900"
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
                        path === item.url && "bg-sidebar-accent",
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
              <DropdownMenu>
                <DropdownMenuTrigger className="px-2 py-1 cursor-pointer hover:bg-sidebar-accent rounded">
                  EN
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>EN</DropdownMenuItem>
                  <DropdownMenuItem>HI</DropdownMenuItem>
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
                  onClick={() => {
                    router.push("/bezs/settings");
                    router.refresh();
                  }}
                >
                  <Settings2 className="!w-5 !h-5" />
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
