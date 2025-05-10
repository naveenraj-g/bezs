"use client";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getAdminMenuItems } from "@/modules/admin/serveractions/admin-actions";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { getRolewiseAppMenuItems } from "@/shared/modules-utils/utils";
import {
  Building,
  LayoutGrid,
  Loader2,
  ShieldUser,
  User,
  UserCog,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItemsStateType = {
  name: string;
  slug: string;
  icon: string | null;
  description: string;
}[];

export const AdminSideBar = () => {
  const { data, isPending } = useSession();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const appSlug = pathname.split("/")[2];
  const [menuItems, setMenuItems] = useState<MenuItemsStateType>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending) {
      const rolewiseAppMenus = getRolewiseAppMenuItems(data?.userRBAC, appSlug);
      setMenuItems(rolewiseAppMenus || []);
      if (rolewiseAppMenus?.length === 0 || !rolewiseAppMenus) {
        setError("Failed to get menu data");
      } else {
        setError(null);
      }
    }
  }, [isPending, appSlug, data]);

  return (
    <Sidebar className="!absolute h-full bg-zinc-200/50 dark:bg-zinc-900 w-[12.5rem]">
      <SidebarGroup>
        <SidebarGroupLabel>Admin Management</SidebarGroupLabel>
        {isPending && <Loader2 className="animate-spin" />}
        {error && <p>{error}</p>}
        <SidebarMenu>
          <SidebarMenuItem className="space-y-2">
            {menuItems.map((item, i) => {
              const Icon =
                LucideIcons[item?.icon as keyof typeof LucideIcons] ||
                LucideIcons.LayoutGrid;

              return (
                <SidebarMenuButton
                  key={i}
                  className={
                    pathname.includes(item.slug)
                      ? `bg-primary hover:bg-primary/50 ${resolvedTheme === "zinc-dark" ? "text-zinc-900 hover:text-zinc-100" : "text-zinc-100 hover:text-zinc-100"}`
                      : "hover:bg-primary/20"
                  }
                >
                  <Link
                    href={item.slug}
                    className="flex items-center gap-2 w-full"
                  >
                    {Icon ? <Icon className="w-5 h-5" /> : null} {item.name}
                  </Link>
                </SidebarMenuButton>
              );
            })}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </Sidebar>
  );
};
