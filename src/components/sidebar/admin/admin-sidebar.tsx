"use client";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { Building, User, UserCheck } from "lucide-react";
import { useTheme } from "next-themes";

const data = [
  {
    title: "Organizations",
    url: "/bezs/admin/manage-organizations",
    icon: Building,
  },
  {
    title: "Users",
    url: "/bezs/admin/manage-users",
    icon: User,
  },
  {
    title: "Roles",
    url: "/bezs/admin/manage-roles",
    icon: UserCheck,
  },
];

export const AdminSideBar = () => {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  return (
    <Sidebar className="!absolute h-full bg-zinc-200/50 dark:bg-zinc-900 w-[12.5rem]">
      <SidebarGroup>
        <SidebarGroupLabel>Admin Management</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem className="space-y-2">
            {data.map((item, i) => (
              <SidebarMenuButton
                key={i}
                className={
                  pathname.includes(item.url)
                    ? `bg-primary/40 hover:bg-primary/30 ${resolvedTheme === "zinc-dark" ? "text-zinc-100 hover:text-zinc-100" : "text-zinc-100 hover:text-zinc-100"}`
                    : undefined
                }
              >
                <Link
                  href={item.url}
                  className="flex items-center gap-2 w-full"
                >
                  <item.icon className="w-5 h-5" /> {item.title}
                </Link>
              </SidebarMenuButton>
            ))}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </Sidebar>
  );
};
