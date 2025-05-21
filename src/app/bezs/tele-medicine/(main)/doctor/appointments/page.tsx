import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { getDoctorAppointments } from "@/modules/telemedicine/serveractions/doctor/appointment-actions";
import { DoctorAppointmentsListTable } from "@/modules/telemedicine/ui/tables/doctor-appointments-list-table";
import { redirect } from "next/navigation";
import React from "react";

const AppointmentsPage = async () => {
  const session = await getServerSession();

  if (!session) redirect("/");

  const userId = await prismaTeleMedicine.doctor.findUnique({
    where: {
      userId: session?.user?.id,
    },
    select: {
      id: true,
    },
  });

  const { appointmentsData, appointmentsCount } = await getDoctorAppointments(
    userId?.id
  );

  return (
    <>
      <DoctorAppointmentsListTable
        appointmentsData={appointmentsData}
        appointmentsCount={appointmentsCount}
      />
    </>
  );
};

export default AppointmentsPage;
