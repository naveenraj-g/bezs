"use client";

import { buttonVariants } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const HomePageTab = () => {
  const pathname = usePathname();
  const isDashboard = pathname.includes("dashboard");
  const isApps = pathname.includes("apps");
  const isCalendar = pathname.includes("calendar");

  return (
    <>
      <div className="border-b-2">
        <Link
          href="/bezs/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "rounded-none border-b-2 border-b-transparent border-r-2",
            isDashboard && "text-primary border-b-2 border-b-primary"
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/bezs/apps"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "rounded-none border-b-2 border-b-transparent border-r-2",
            isApps && "text-primary border-b-2 border-b-primary"
          )}
        >
          Apps
        </Link>
        <Link
          href="/bezs/calendar"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "rounded-none border-b-2 border-b-transparent",
            isCalendar && "text-primary border-b-2 border-b-primary"
          )}
        >
          Calendar
        </Link>
      </div>
    </>
  );
};

export default HomePageTab;
