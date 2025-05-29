"use client";

import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { useRouter } from "next/navigation";
import { useTelemedicineDoctorModal } from "../stores/use-telemedicine-doctor-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { reschedulePatientAppointment } from "../serveractions/doctor/appointment-actions";
import { ModalAppointmentDetails } from "../ui/doctor/modal-appointment-details";
import { Loader2 } from "lucide-react";
import { CustomInput } from "../../../shared/ui/custom-input";
import { useForm } from "react-hook-form";
import { scheduleAppointmentFormSchema } from "../schemas/schedule-appointment-form-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useEffect } from "react";

type ScheduleAppointmentFormSchemaType = z.infer<
  typeof scheduleAppointmentFormSchema
>;

const selectListTime = [
  { label: "09:00 AM", value: "09:00" },
  { label: "09:30 AM", value: "09:30" },
  { label: "10:00 AM", value: "10:00" },
  { label: "10:30 AM", value: "10:30" },
  { label: "11:00 AM", value: "11:00" },
  { label: "11:30 AM", value: "11:30" },
  { label: "12:00 PM", value: "12:00" },
  { label: "12:30 PM", value: "12:30" },
  { label: "01:00 PM", value: "13:00" },
  { label: "01:30 PM", value: "13:30" },
  { label: "02:00 PM", value: "14:00" },
  { label: "02:30 PM", value: "14:30" },
  { label: "03:00 PM", value: "15:00" },
  { label: "03:30 PM", value: "15:30" },
  { label: "04:00 PM", value: "16:00" },
  { label: "04:30 PM", value: "16:30" },
  { label: "05:00 PM", value: "17:00" },
];

export const RescheduleAppointmentDoctorModal = () => {
  const session = useSession();
  const router = useRouter();

  const closeModal = useTelemedicineDoctorModal((state) => state.onClose);
  const appointmentId =
    useTelemedicineDoctorModal((state) => state.appointmentId) || "";
  const appointmentData = useTelemedicineDoctorModal(
    (state) => state.appointmentData
  );
  const modalType = useTelemedicineDoctorModal((state) => state.type);
  const isOpen = useTelemedicineDoctorModal((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "rescheduleAppointment";

  const form = useForm<ScheduleAppointmentFormSchemaType>({
    resolver: zodResolver(scheduleAppointmentFormSchema),
    defaultValues: {
      date: new Date(),
      time: appointmentData?.time,
    },
  });

  useEffect(() => {
    form.reset({
      date: appointmentData?.appointment_date,
      time: appointmentData?.time,
    });
  }, [
    isModalOpen,
    appointmentData?.appointment_date,
    appointmentData?.time,
    form,
  ]);

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: ScheduleAppointmentFormSchemaType) {
    if (!session) {
      return;
    }

    try {
      await reschedulePatientAppointment(
        values,
        appointmentId ? Number(appointmentId) : undefined
      );
      toast("Appointment Rescheduled.");
      router.refresh();
      handleCloseModal();
    } catch (err) {
      toast("Error", {
        description: (err as Error)?.message,
      });
    }
  }

  function handleCloseModal() {
    closeModal();
  }

  console.log(appointmentData?.time);

  // const formattedDate = appointmentData?.appointment_date
  //   .toISOString()
  //   .split("T")[0];
  // console.log(formattedDate);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().split("T")[0];

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Are you sure to reschedule this appointment?
          </DialogDescription>
        </DialogHeader>
        {appointmentData ? (
          <ModalAppointmentDetails appointmentData={appointmentData} />
        ) : (
          <p>Details for this appointment are not yet available.</p>
        )}
        <DialogFooter className="block">
          <div className="space-y-2">
            <h3>Reschedule details:</h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="date"
                    placeholder="01-05-2000"
                    label="Date of Birth"
                    inputType="date"
                    formItemClassName="flex-1"
                    dateMin={formattedDate}
                  />
                  <CustomInput
                    type="select"
                    name="time"
                    label="Time"
                    placeholder="Select time"
                    control={form.control}
                    formItemClassName="flex-1"
                    className="w-full"
                    selectList={selectListTime}
                    defaultValue={appointmentData?.time}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" disabled={isSubmitting}>
                    Confirm
                    {isSubmitting && <Loader2 className="animate-spin" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleCloseModal()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
