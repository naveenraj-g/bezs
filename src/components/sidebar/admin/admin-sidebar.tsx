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
import { Building, LayoutGrid, ShieldUser, User, UserCog } from "lucide-react";
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
    icon: UserCog,
  },
  {
    title: "Apps",
    url: "/bezs/admin/manage-apps",
    icon: LayoutGrid,
  },
  {
    title: "RBAC",
    url: "/bezs/admin/rbac",
    icon: ShieldUser,
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
                    ? `bg-primary hover:bg-primary/50 ${resolvedTheme === "zinc-dark" ? "text-zinc-900 hover:text-zinc-100" : "text-zinc-100 hover:text-zinc-100"}`
                    : "hover:bg-primary/20"
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
