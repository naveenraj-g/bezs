import { format } from "date-fns";
import { DoctorAppointmentTableDataType } from "../../types/data-types";
import { AppointmentStatusIndicator } from "../appointments/appointment-status-indicator";
import { ProfileAvatar } from "../profile-image";

export const ModalAppointmentDetails = ({
  appointmentData,
  needAppointmentTitle = true,
}: {
  appointmentData: DoctorAppointmentTableDataType;
  needAppointmentTitle?: boolean;
}) => {
  return (
    <div>
      {needAppointmentTitle && (
        <h3 className="font-semibold">Appointment Details</h3>
      )}
      <div className="flex items-center gap-2 2xl:gap-3 py-2 mt-1">
        <ProfileAvatar
          imgUrl={appointmentData.patient.img}
          name={appointmentData.patient.name}
          avatarClassName="size-12"
        />
        <div className="font-semibold">
          <h3>{appointmentData.patient.name}</h3>
          <span className="text-xs md:text-sm font-light capitalize">
            {appointmentData.patient.gender.toLowerCase()}
          </span>
        </div>
      </div>
      <div className="mt-2 space-y-3 text-sm border rounded-md p-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-zinc-300">Date</span>
          <span className="font-medium">
            {format(appointmentData.appointment_date, "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-zinc-300">Time</span>
          <span className="font-medium">{appointmentData.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-zinc-300">Type</span>
          <span className="capitalize font-medium">{appointmentData.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-zinc-300">Status</span>
          <AppointmentStatusIndicator status={appointmentData.status} />
        </div>
      </div>
      <div className="mt-4 text-sm">
        <p className="text-gray-600 dark:text-zinc-300 underline">Note:</p>
        <p className="text-gray-800 dark:text-zinc-100">
          {appointmentData.note || "No additional notes provided."}
        </p>
      </div>
    </div>
  );
};
