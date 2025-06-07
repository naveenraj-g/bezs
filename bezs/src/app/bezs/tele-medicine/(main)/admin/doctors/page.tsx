import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { redirect } from "next/navigation";
import { getAllDoctors } from "@/modules/telemedicine/serveractions/admin/doctorActions";
import { AdminDoctorListTable } from "@/modules/telemedicine/ui/tables/admin-doctor-list-table";

const DoctorDashboardPage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  const { doctorsData, doctorsSize } = await getAllDoctors();

  return (
    <>
      <AdminDoctorListTable
        doctorsData={doctorsData}
        doctorsSize={doctorsSize}
      />
    </>
  );
};

export default DoctorDashboardPage;
