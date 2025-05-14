import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { getPatientDashboardData } from "@/modules/telemedicine/serveractions/patient/patient-information";
import { AppoinmentChart } from "@/modules/telemedicine/ui/charts/appointment-chart";
import { StatSummaryChart } from "@/modules/telemedicine/ui/charts/stat-summary-chart";
import { StatCard } from "@/modules/telemedicine/ui/patient-dashboard/stat-card";
import { RecentAppointmentsTable } from "@/modules/telemedicine/ui/tables/recent-appointments-table";
import { Briefcase, BriefcaseBusiness, BriefcaseMedical } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const PatientDashboardPage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  const {
    patientData,
    appointmentCounts,
    last5Records,
    totalAppointments,
    avaliableDoctor,
    monthlyData,
  } = await getPatientDashboardData();

  if (!patientData) {
    return null;
  }

  const cardData = [
    {
      title: "appointments",
      value: totalAppointments,
      icon: Briefcase,
      className: "bg-blue-600/15 dark:bg-blue-600/25",
      iconClassName: "bg-blue-600/25 text-blue-600",
      note: "Total appointments",
    },
    {
      title: "cancelled",
      value: appointmentCounts?.CANCELLED,
      icon: Briefcase,
      className: "bg-rose-600/15 dark:bg-rose-600/25",
      iconClassName: "bg-rose-600/25 text-rose-600",
      note: "Cancelled Appointments",
    },
    {
      title: "pending",
      value: appointmentCounts?.PENDING + appointmentCounts?.SCHEDULED,
      icon: BriefcaseBusiness,
      className: "bg-yellow-600/15 dark:bg-yellow-600/25",
      iconClassName: "bg-yellow-600/25 text-yellow-600",
      note: "Pending Appointments",
    },
    {
      title: "completed",
      value: appointmentCounts?.COMPLETED,
      icon: BriefcaseMedical,
      className: "bg-emerald-600/15 dark:bg-emerald-600/25",
      iconClassName: "bg-emerald-600/25 text-emerald-600",
      note: "Successfully appointments",
    },
  ];

  return (
    <>
      <div className="flex flex-col rounded-xl xl:flex-row gap-6">
        {/* Left */}
        <div className="w-full xl:w-[69%]">
          <Card className="rounded-xl mb-8 space-y-4 p-4">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <h1 className="text-lg xl:text-2xl font-semibold">
                Welcome {patientData?.first_name || session?.user?.name}
              </h1>

              <div className="space-x-2">
                <Button size="sm">{new Date().getFullYear()}</Button>
                <Button size="sm" variant="outline" className="hover:underline">
                  <Link href="/bezs/tele-medicine/patient/profile">
                    View Profile
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 3xl:grid-cols-4 gap-4">
              {cardData.map((item, index) => (
                <StatCard key={index} {...item} />
              ))}
            </div>
          </Card>

          <div className="h-[500px]">
            <AppoinmentChart data={monthlyData} />
          </div>

          <div className="bg-white rounded-xl p-4 mt-8">
            <RecentAppointmentsTable data={last5Records} />
          </div>
        </div>
        {/* Right */}
        <div className="w-full xl:w-[30%]">
          <Card className="w-full h-[450px] mb-8 p-4">
            <StatSummaryChart
              data={appointmentCounts}
              total={totalAppointments}
            />
          </Card>

          {/* <AvailableDoctors data={avaliableDoctor} /> */}
          {/* <PatientRatingContainer /> */}
        </div>
      </div>
    </>
  );
};

export default PatientDashboardPage;
