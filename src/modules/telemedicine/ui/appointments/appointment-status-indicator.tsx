import { cn } from "@/lib/utils";
import { AppointmentStatus } from "../../../../../prisma/generated/telemedicine";
import { Badge } from "@/components/ui/badge";

const status_color = {
  PENDING: "bg-yellow-600/15 text-yellow-600",
  SCHEDULED: "bg-emerald-600/15 text-emerald-600",
  CANCELLED: "bg-red-600/15 text-red-600",
  COMPLETED: "bg-blue-600/15 text-blue-600",
};

export function AppointmentStatusIndicator({
  status,
}: {
  status: AppointmentStatus;
}) {
  return (
    <Badge
      className={cn(
        "capitalize text-xs lg:text-sm px-2 py-1 rounded-full",
        status_color[status?.toUpperCase() as keyof typeof status_color]
      )}
    >
      {status?.toUpperCase()}
    </Badge>
  );
}
