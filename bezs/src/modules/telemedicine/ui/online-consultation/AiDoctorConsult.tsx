"use client";

import { Circle, PhoneCall } from "lucide-react";
import { TAppointmentData } from "../../types/online-consult-types";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const AiDoctorConsult = ({
  appointmentData,
}: {
  appointmentData: TAppointmentData | null;
}) => {
  return (
    <div className="p-8 border rounded-2xl bg-secondary/10">
      <div className="flex items-center justify-between gap-2">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className="h-4 w-4" /> Not Connected
        </h2>
        <h2 className="font-bold text-xl text-gray-400 dark:text-gray-300/90">
          00:00
        </h2>
      </div>

      <div className="flex items-center flex-col mt-10">
        <Image
          src={appointmentData?.doctor.img || ""}
          alt={appointmentData?.doctor.specialization || ""}
          width={120}
          height={120}
          className="h-[100px] w-[100px] object-cover rounded-full"
        />
        <h2 className="mt-2 text-lg">
          {appointmentData?.doctor.specialization}
        </h2>
        <p className="text-sm text-gray-400">AI Doctor Voice Agent</p>

        <div className="mt-20">
          <h2 className="text-gray-400">Assistant Msg</h2>
          <h2 className="text-lg">User Msg</h2>
        </div>

        <Button className="mt-10" size="sm">
          <PhoneCall /> Start Call
        </Button>
      </div>
    </div>
  );
};
