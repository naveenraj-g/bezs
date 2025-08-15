"use client";

import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { useRouter } from "next/navigation";
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
import { createDoctorAppointment } from "../../serveractions/appointment/create-appointment";
import { toast } from "sonner";
import { AppointmentMode } from "../../../../../prisma/generated/telemedicine";
import { Textarea } from "@/components/ui/textarea";
import { getDoctorSuggestion } from "../../serveractions/appointment/ai-doctor/ai-doctor-server-actions";
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
  className?: string;
  doctorId?: string | number;
};

function AiDoctorStartConsultation({
  isGeneralAiDoctorAppointment,
  allDoctorsData,
  doctorId,
  className,
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

  function handleClose() {
    setSuggestedDoctorId([]);
    setSelectedDoctor("");
    setLoading(false);
  }

  return (
    <Dialog onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm" className={className}>
          {isGeneralAiDoctorAppointment ? (
            <>
              <Plus /> Consult with AI Doctor
            </>
          ) : (
            <>
              Start Consultation <ArrowRight />
            </>
          )}
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
          {suggestedDoctorId.length === 0 && isGeneralAiDoctorAppointment ? (
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
              onClick={() =>
                onSubmit({ doctorId: doctorId || selectedDoctor, note: note })
              }
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
