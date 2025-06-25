import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prismaTeleMedicine } from "@/lib/prisma";
import AiDoctorStartConsultation from "@/modules/telemedicine/ui/list-doctors/ai-doctor-start-consultation";
import { DoctorCard } from "@/modules/telemedicine/ui/list-doctors/doctor-card";

const DoctorsPage = async () => {
  const doctors = await prismaTeleMedicine.doctor.findMany({
    select: {
      id: true,
      name: true,
      img: true,
      specialization: true,
      description: true,
      doctorType: true,
      ratings: {
        select: {
          rating: true,
        },
      },
    },
  });

  const humanDoctors = doctors.filter(
    (doctor) => doctor.doctorType === "HUMAN_DOCTOR"
  );

  const AIDoctors = doctors.filter(
    (doctor) => doctor.doctorType === "AI_DOCTOR"
  );

  return (
    <div>
      <Tabs defaultValue="ai-doctors">
        <TabsList className="mb-8">
          <TabsTrigger value="ai-doctors" className="cursor-pointer">
            AI Doctors
          </TabsTrigger>
          <TabsTrigger value="human-doctors" className="cursor-pointer">
            Human Doctors
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ai-doctors">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="font-bold text-xl">AI Specialist Doctors Agent</h2>
            <AiDoctorStartConsultation
              isGeneralAiDoctorAppointment={true}
              allDoctorsData={AIDoctors}
            />
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-4 mt-8">
            {AIDoctors.map((doctor) => (
              <div key={doctor.id}>
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="human-doctors">
          <h2 className="font-bold text-xl">Human Specialist Doctors</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-4 mt-5">
            {humanDoctors.map((doctor) => (
              <div key={doctor.id}>
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorsPage;
