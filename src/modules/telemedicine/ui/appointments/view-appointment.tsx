"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAppointmentById } from "../../serveractions/appointment/appointments-server-action";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calculateAge, formatDateTime } from "../../utils";
import { ProfileAvatar } from "../profile-image";
import { Calendar, Loader2, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export function ViewAppointment({ id }: { id: number | undefined }) {
  const [appointmentData, setAppointmentData] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setError(null);
  //       setIsLoading(true);
  //       const data = await getAppointmentById(id);
  //       setAppointmentData(data);
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     } catch (err) {
  //       setError("Failed to get data.");
  //       setIsLoading(false);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   })();
  // }, [id]);

  // if (!appointmentData) return null;

  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
      >
        View
      </DialogTrigger>
      <DialogContent className="max-w-[425px] max-h-[95%] md:max-w-2xl 2xl:max-w-3xl p-8 overflow-y-auto">
        {/* {isLoading && !error && (
          <DialogHeader>
            <DialogTitle>Patient Appointment</DialogTitle>
            <p>
              <Loader2 className="animate-spin" /> Loading...
            </p>
          </DialogHeader>
        )}
        {error && (
          <DialogHeader>
            <DialogTitle>Patient Appointment</DialogTitle>
            <p>{error}</p>
          </DialogHeader>
        )} */}
        {!isLoading && !error && (
          <>
            <DialogHeader>
              <DialogTitle>Patient Appointment</DialogTitle>
              <DialogDescription>
                This appointment was booked on the{" "}
                {formatDateTime(appointmentData?.created_at.toString())}
              </DialogDescription>
            </DialogHeader>

            {appointmentData?.status === "CANCELLED" && (
              <div className="bg-yellow-100 p-4 mt-4 rounded-md">
                <span className="font-semibold test-sm">
                  This appointment has been cancelled.
                </span>
                <p className="text-sm">
                  <strong>Reason</strong>: {appointmentData?.reason}
                </p>
              </div>
            )}

            <div className="grid gap-4 py-4">
              <p className="w-fit bg-blue-100 text-blue-600 p-1 rounded text-xs md:text-sm">
                Personal Information
              </p>

              <div className="flex flex-col md:flex-row gap-6 mb-16">
                <div className="flex gap-1 w-full md:w-1/2">
                  <ProfileAvatar
                    imgUrl={appointmentData?.patient?.img}
                    name={appointmentData?.patient?.name}
                    size="20"
                  />

                  <div className="space-y-0.5">
                    <h2 className="text-lg md:text-xl font-semibold uppercase">
                      {appointmentData?.patient?.name}
                    </h2>

                    <p className="flex items-center gap-2 text-zinc-600">
                      <Calendar size={20} />
                      {/* {calculateAge(appointmentData?.patient?.date_of_birth)} */}
                    </p>

                    <span className="flex items-center text-sm gap-2">
                      <Phone size={16} />
                      {appointmentData?.patient?.phone}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Address</span>
                  <p className="text-gray-600 capitalize">
                    {appointmentData?.patient?.address}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
