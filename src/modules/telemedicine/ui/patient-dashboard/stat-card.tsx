import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  note: string;
  link?: string;
}

const CardIcon = ({ icon: Icon }: { icon: LucideIcon }) => {
  return <Icon />;
};

export const StatCard = ({
  title,
  value,
  icon,
  className,
  iconClassName,
  note,
  link,
}: StatCardProps) => {
  return (
    <Card className={cn("w-full gap-0 p-0", className)}>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between py-3 capitalize">
        <h3>{title}</h3>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="font-normal text-xs bg-transparent p-2 h-0 hover:underline border-0 shadow-none hover:bg-transparent"
        >
          <Link href={link || ""}>See details</Link>
        </Button>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-10 h-10 bg-violet-50-500/15 rounded-full flex items-center justify-center text-violet-600",
              iconClassName
            )}
          >
            <CardIcon icon={icon} />
          </div>

          <h2 className="text-2xl 2xl:text-3xl font-semibold">
            {formatNumber(value)}
          </h2>
        </div>
      </CardContent>

      <CardFooter className="pb-3">
        <p className="text-sm text-gray-500">{note}</p>
      </CardFooter>
    </Card>
  );
};
