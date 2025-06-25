"use client";

import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { bookAIDoctorConsultFormSchema } from "../../schemas/book-appointment-form-schema";
import { CustomInput } from "@/shared/ui/custom-input";
import { ProfileAvatar } from "../profile-image";
import { Form } from "@/components/ui/form";
import { createDoctorAppointment } from "../../serveractions/appointment/create-appointment";
import { toast } from "sonner";
import { AppointmentMode } from "../../../../../prisma/generated/telemedicine";

type TCreateAIDoctorAppointmentFormSchema = z.infer<
  typeof bookAIDoctorConsultFormSchema
>;

type TDoctor = {
  id: number | string;
  name?: string;
  specialization: string;
  description?: string | null;
  img: string | null;
  agentPrompt?: string;
  voiceId?: string;
  ratings?: {
    rating: number;
  }[];
};

type TAiDoctorStartConsultationProps = {
  isGeneralAiDoctorAppointment: boolean;
  allDoctorsData?: TDoctor[];
  doctorData?: TDoctor;
};

function AiDoctorStartConsultation({
  isGeneralAiDoctorAppointment,
  allDoctorsData,
  doctorData,
}: TAiDoctorStartConsultationProps) {
  const session = useSession();
  const router = useRouter();
  const [note, setNote] = useState<string>("");

  const AIDoctorAppointmentForm = useForm<TCreateAIDoctorAppointmentFormSchema>(
    {
      resolver: zodResolver(bookAIDoctorConsultFormSchema),
      defaultValues: {
        doctorId: doctorData?.id.toString() || "",
        note: "",
      },
    }
  );

  const {
    formState: { isSubmitting },
  } = AIDoctorAppointmentForm;

  async function onSubmit(values: TCreateAIDoctorAppointmentFormSchema) {
    if (!session) {
      toast("unauthorized.");
      return;
    }

    const now = new Date();

    const date = now.toISOString().split("T")[0] + "T00:00:00.000Z";
    const time = now.toTimeString().slice(0, 5);

    const appointmentData = {
      ...values,
      appointmentType: "consultation",
      appointmentMode: AppointmentMode.AI_CONSULT,
      date,
      time,
    };

    try {
      const appointmentId = await createDoctorAppointment(appointmentData, {
        userId: session.data?.user.id,
      });
      toast.success("Success", {
        description: "Redirecting to consultation page",
      });
      AIDoctorAppointmentForm.reset();
      router.push(
        `/bezs/tele-medicine/patient/appointments/online-consultation?appointmentId=${appointmentId}`
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  const selectDoctorList = allDoctorsData?.map((doctorData) => {
    return {
      label: (
        <div className="flex items-center gap-2">
          <ProfileAvatar name={doctorData.name} imgUrl={doctorData.img} />
          <div className="flex flex-col items-start">
            <span className="font-semibold capitalize">{doctorData.name}</span>
            <span className="text-xs">{doctorData.specialization}</span>
          </div>
        </div>
      ),
      value: doctorData.id.toString(),
    };
  });

  function handleClose() {
    AIDoctorAppointmentForm.reset();
  }

  return (
    <Dialog onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus /> Consult with AI Doctor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-4">
              <Form {...AIDoctorAppointmentForm}>
                <form
                  onSubmit={AIDoctorAppointmentForm.handleSubmit(onSubmit)}
                  className="space-y-8 flex flex-col"
                >
                  <div className="space-y-4">
                    {isGeneralAiDoctorAppointment && allDoctorsData ? (
                      <>
                        <CustomInput
                          type="select"
                          name="doctorId"
                          label="Doctor"
                          placeholder={
                            allDoctorsData.length === 0
                              ? "No doctor to select"
                              : "Select a doctor"
                          }
                          control={AIDoctorAppointmentForm.control}
                          selectList={selectDoctorList}
                          className="w-full !h-10"
                        />
                      </>
                    ) : null}

                    <CustomInput
                      type="textarea"
                      name="note"
                      label="Add Symptoms or Any Other Details"
                      placeholder="Add detail here..."
                      className="h-[100px]"
                      control={AIDoctorAppointmentForm.control}
                    />
                  </div>

                  <div className="self-end space-x-2">
                    <DialogClose asChild>
                      <Button size="sm" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className=""
                      disabled={isSubmitting}
                      size="sm"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <span className="animate-spin">⌛</span>
                          Loading...
                        </div>
                      ) : isGeneralAiDoctorAppointment ? (
                        "Consult Online"
                      ) : (
                        "Book Appointment"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AiDoctorStartConsultation;
