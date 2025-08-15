"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { UserRound, LockKeyhole, UserCog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const generalsettings = [
  {
    name: "Account",
    url: "/bezs/dashboard/settings/account",
    icon: UserRound,
  },
  {
    name: "Security",
    url: "/bezs/dashboard/settings/security",
    icon: LockKeyhole,
  },
];

const userManagement = [
  {
    name: "Roles",
    url: "/bezs/dashboard/settings/roles",
    icon: UserCog,
  },
];

const AppSettingsSidebar = () => {
  const path = usePathname();

  if (!path.includes("settings")) return null;

  return (
    <div className="w-[14rem] p-2 bg-zinc-100/50 dark:bg-zinc-900">
      <SidebarContent className="w-full">
        <SidebarGroup>
          <SidebarGroupLabel>GENERAL SETTINGS</SidebarGroupLabel>
          <SidebarGroupContent className="mt-1">
            <SidebarMenu>
              {generalsettings.map((setting) => (
                <SidebarMenuItem
                  key={setting.name}
                  className={cn(
                    path.includes(setting.name.toLowerCase()) &&
                      "bg-sidebar-accent rounded"
                  )}
                >
                  <SidebarMenuButton asChild>
                    <Link href={setting.url}>
                      {" "}
                      <setting.icon />
                      <span>{setting.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>User Management</SidebarGroupLabel>
          <SidebarGroupContent className="mt-1">
            <SidebarMenu>
              {userManagement.map((setting) => (
                <SidebarMenuItem
                  key={setting.name}
                  className={cn(
                    path.includes(setting.name.toLowerCase()) &&
                      "bg-sidebar-accent rounded"
                  )}
                >
                  <SidebarMenuButton asChild>
                    <Link href={setting.url}>
                      {" "}
                      <setting.icon />
                      <span>{setting.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </div>
  );
};

export default AppSettingsSidebar;
