import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TableComp } from "./table";
import { TableCell, TableRow } from "@/components/ui/table";
import { AppointmentType } from "../../types/data-types";
import { ProfileAvatar } from "../profile-image";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { AppointmentStatusIndicator } from "../appointments/appointment-status-indicator";
import { ViewAppointment } from "../appointments/view-appointment";

interface DataProps {
  data: any[];
}

const columns = [
  { header: "Info", key: "name" },
  {
    header: "Date",
    key: "appointment_date",
    className: "",
  },
  {
    header: "Time",
    key: "time",
    className: "",
  },
  {
    header: "Doctor",
    key: "doctor",
    className: "",
  },
  {
    header: "Status",
    key: "status",
    className: "",
  },
  {
    header: "Actions",
    key: "action",
  },
];

export const RecentAppointmentsTable = ({ data }: DataProps) => {
  const renderRow = (item: AppointmentType) => {
    return (
      <TableRow key={item?.id}>
        <TableCell>
          <div className="flex items-center gap-2 2xl:gap-4 py-2">
            <ProfileAvatar
              imgUrl={item?.patient?.img}
              name={item?.patient?.name}
            />
            <div className="font-semibold">
              <h3>{item?.patient?.name}</h3>
              <span className="text-xs capitalize">
                {item?.patient.gender.toLowerCase()}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell>{format(item?.appointment_date, "dd-MMM-yyyy")}</TableCell>
        <TableCell>{item?.time}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2 2xl:gap-4 py-2">
            <ProfileAvatar
              imgUrl={item?.doctor?.img}
              name={item?.doctor?.name}
            />
            <div className="font-semibold">
              <h3>{item?.doctor?.name}</h3>
              <span className="text-xs capitalize">
                {item?.doctor?.specialization}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <AppointmentStatusIndicator status={item?.status} />
        </TableCell>
        <TableCell>
          <div className="flex flex-col items-start gap-1">
            <ViewAppointment id={item?.id} />
            {/* <Link
              href={`/bezs/tele-medicine/patient/record/appointments/${item?.id}`}
              className="hover:underline"
            >
              See all
            </Link> */}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className="rounded-xl p-4">
      <CardTitle>
        <div className="flex justify-between items-center flex-wrap">
          <h1 className="text-lg font-semibold">Recent Appointments</h1>
          <Button asChild variant="outline" size="sm">
            <Link href="/bezs/tele-medicine/patient/record/appointments">
              View All
            </Link>
          </Button>
        </div>
      </CardTitle>
      <CardDescription>
        <TableComp columns={columns} renderRow={renderRow} data={data} />
      </CardDescription>
    </Card>
  );
};
