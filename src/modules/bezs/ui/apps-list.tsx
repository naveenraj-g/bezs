"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { getRoleOrgWiseApps } from "@/shared/modules-utils/utils";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";

function createLinkFromName(name: string): string {
  const splittedName = name.toLowerCase().split(" ");
  return splittedName.join("-");
}

type appStateType = {
  name: string;
  imgUrl: string | null;
  slug: string;
}[];

const AppsList = ({ isNavItem }: { isNavItem?: boolean }) => {
  const { data, isPending } = useSession();

  const [appLists, setAppLists] = useState<appStateType>([]);
  const [apps, setApps] = useState<appStateType>([]);
  const [error, setError] = useState<string | null>(null);

  function handleAppSearch(e: ChangeEvent<HTMLInputElement>) {
    setApps(() => {
      return appLists.filter((app) =>
        app.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
  }

  useEffect(() => {
    if (!isPending) {
      const rbacAppsLists =
        getRoleOrgWiseApps(data?.userRBAC || [], data?.user.role) || [];
      setAppLists(rbacAppsLists || []);
      setApps(rbacAppsLists || []);
      console.log(rbacAppsLists);
      if (rbacAppsLists.length === 0 || !rbacAppsLists) {
        setError("Failed to get apps data or no apps found to your role");
      } else {
        setError(null);
      }
    }
  }, [isPending, data]);

  return (
    <>
      {isNavItem && (
        <div className="w-[20rem] relative mx-auto mb-4">
          <Input
            placeholder="Find Bezs apps"
            className="bg-zinc-100 pl-8 border-0 border-b-2 outline-0 focus-visible:ring-0"
            onChange={handleAppSearch}
          />
          <Search className="dark:text-zinc-300 absolute w-[1.1rem] h-[1.1rem] top-[25%] left-2" />
        </div>
      )}
      <div
        className={cn(
          "h-full flex flex-wrap items-center justify-center gap-x-8 gap-y-14",
          isNavItem && "gap-x-4 gap-y-4 py-2"
        )}
      >
        {isPending && !error && (
          <>
            Loading... <Loader2 className="animate-spin" />
          </>
        )}
        {!isPending && error && <p>{error}</p>}
        {apps.length > 0 &&
          apps.map((appList, i) => (
            <Link
              key={i}
              href={appList.slug}
              className={cn(
                "flex flex-col gap-3 items-center w-[130px] h-[130px]",
                isNavItem && "w-[105px] h-[100px]"
              )}
            >
              <div
                className={cn(
                  "p-4 shadow-[0_0_10px_rgba(0,0,0,0.15)] rounded  dark:shadow-[0_0_10px_rgba(108,108,108,108.01)]",
                  isNavItem && "p-2"
                )}
              >
                <Image
                  src={`/app-icons/${appList.name.toLowerCase().split(" ").join("-")}.svg`}
                  alt={appList.name}
                  width={isNavItem ? 30 : 50}
                  height={isNavItem ? 30 : 50}
                />
              </div>
              <p className="text-sm">{appList.name}</p>
            </Link>
          ))}
      </div>
    </>
  );
};

export default AppsList;
