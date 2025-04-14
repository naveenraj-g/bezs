"use client";

import { Link } from "@/i18n/navigation";
import { appLists } from "../mockdatas/app-list-data";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ChangeEvent, useState } from "react";

function createLinkFromName(name: string): string {
  const splittedName = name.toLowerCase().split(" ");
  return splittedName.join("-");
}

type appStateType = {
  name: string;
  imgUrl: string;
}[];

const AppsList = ({ isNavItem }: { isNavItem?: boolean }) => {
  const [apps, setApps] = useState<appStateType>(appLists);

  function handleAppSearch(e: ChangeEvent<HTMLInputElement>) {
    setApps(() => {
      return appLists.filter((app) =>
        app.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
  }

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
        {apps.map((appList, i) => (
          <Link
            key={i}
            href={createLinkFromName(appList.name)}
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
                src={appList.imgUrl}
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
