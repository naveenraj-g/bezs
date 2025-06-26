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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { bookAIDoctorConsultFormSchema } from "../../schemas/book-appointment-form-schema";
import { CustomInput } from "@/shared/ui/custom-input";
import { ProfileAvatar } from "../profile-image";
import { Form } from "@/components/ui/form";
import { createDoctorAppointment } from "../../serveractions/appointment/create-appointment";
import { toast } from "sonner";
import { AppointmentMode } from "../../../../../prisma/generated/telemedicine";
import { Textarea } from "@/components/ui/textarea";
import { getDoctorSuggestion } from "../../serveractions/appointment/ai-doctor/ai-doctor-server-actions";
import { DoctorCard } from "./doctor-card";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
  const [suggestedDoctorId, setSuggestedDoctorId] = useState<string[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loading, setLoading] = useState(false);

  const onClickNext = async () => {
    setLoading(true);
    try {
      const result = await getDoctorSuggestion({
        AiDoctorsList: allDoctorsData,
        notes: note,
      });

      setSuggestedDoctorId(result);
    } catch (err) {
      toast.error("Error!", {
        description: (err as Error).message,
        richColors: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // const AIDoctorAppointmentForm = useForm<TCreateAIDoctorAppointmentFormSchema>(
  //   {
  //     resolver: zodResolver(bookAIDoctorConsultFormSchema),
  //     defaultValues: {
  //       doctorId: doctorData?.id.toString() || "",
  //       note: "",
  //     },
  //   }
  // );

  // const {
  //   formState: { isSubmitting },
  // } = AIDoctorAppointmentForm;

  async function onSubmit(values: TCreateAIDoctorAppointmentFormSchema) {
    if (!session) {
      toast("unauthorized.");
      return;
    }

    if (!values.doctorId || !values.note) {
      toast("Missing required datas!");
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
      setLoading(true);
      const appointmentId = await createDoctorAppointment(appointmentData, {
        userId: session.data?.user.id,
      });
      toast.success("Success", {
        description: "Redirecting to consultation page",
      });
      // AIDoctorAppointmentForm.reset();
      router.push(
        `/bezs/tele-medicine/patient/appointments/online-consultation?appointmentId=${appointmentId}`
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  // const selectDoctorList = allDoctorsData?.map((doctorData) => {
  //   return {
  //     label: (
  //       <div className="flex items-center gap-2">
  //         <ProfileAvatar name={doctorData.name} imgUrl={doctorData.img} />
  //         <div className="flex flex-col items-start">
  //           <span className="font-semibold capitalize">{doctorData.name}</span>
  //           <span className="text-xs">{doctorData.specialization}</span>
  //         </div>
  //       </div>
  //     ),
  //     value: doctorData.id.toString(),
  //   };
  // });

  function handleClose() {
    // AIDoctorAppointmentForm.reset();
    setSuggestedDoctorId([]);
    setSelectedDoctor("");
    setLoading(false);
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
            {suggestedDoctorId.length === 0 ? (
              <div className="mt-4">
                <h2>Add Symptoms or Any Other Details</h2>
                <Textarea
                  placeholder="Add detail here..."
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1.5 h-[100px]"
                />

                {/* <Form {...AIDoctorAppointmentForm}>
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
              </Form> */}
              </div>
            ) : (
              <div className="mt-2">
                <h2 className="font-semibold mb-2">Select Suggested Doctors</h2>
                <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 lg:grid-cols-4 gap-5">
                  {suggestedDoctorId
                    .map((docId) =>
                      allDoctorsData?.find((docData) => docData.id === docId)
                    )
                    .map((docData) => (
                      <div
                        key={docData?.id}
                        className={cn(
                          "flex flex-col items-center border rounded-2xl p-5 shadow cursor-pointer hover:border-blue-600 dark:hover:border-gray-200",
                          selectedDoctor === docData?.id &&
                            "border-blue-600 dark:border-gray-200 border-2"
                        )}
                        onClick={() =>
                          setSelectedDoctor(docData?.id + "" || "")
                        }
                      >
                        <Image
                          src={docData?.img || ""}
                          alt={docData?.specialization || ""}
                          width={70}
                          height={70}
                          className="w-[50px] h-[50px] rounded-4xl object-cover mb-0.5"
                        />
                        <h2 className="font-bold text-sm capitalize text-center">
                          {docData?.name}
                        </h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-300/90 text-center">
                          {docData?.specialization}
                        </p>
                        <p className="line-clamp-2 mt-1 text-xs text-zinc-500 dark:text-zinc-300/90 text-center">
                          {docData?.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          {suggestedDoctorId.length === 0 ? (
            <Button disabled={!note || loading} onClick={onClickNext} size="sm">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Suggesting
                  doctors...
                </>
              ) : (
                <>
                  Next <ArrowRight />
                </>
              )}
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={loading}
              onClick={() => onSubmit({ doctorId: selectedDoctor, note: note })}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                </>
              ) : (
                "Start Consultation"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AiDoctorStartConsultation;
