"use client";

import { useEffect, useState } from "react";
import { useTelemedicinePatientModal } from "../stores/use-telemedicine-patient-modal-store";
import { getInitialAppointmentBookingData } from "../serveractions/appointment/get-appointmentbooking-data";

// import DatePicker from "react-datepicker";
// import Calendar from "react-calendar";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  // FormControl,
  // FormDescription,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
import { ProfileAvatar } from "../ui/profile-image";
import { bookAppointmentFormSchema } from "../schemas/book-appointment-form-schema";
import { CustomInput } from "../ui/custom-input";
// import { cn } from "@/lib/utils";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { createDoctorAppointment } from "../serveractions/appointment/create-appointment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AppointmentMode } from "../../../../prisma/generated/telemedicine";
import { Skeleton } from "@/components/ui/skeleton";

type PatientDataType = {
  name: string;
  id: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  img: string | null;
  orgId: string;
} | null;

type DoctorsDataType = {
  name: string;
  id: string;
  orgId: string;
  img: string | null;
  specialization: string;
}[];

type BookAppointmentFormSchemaType = z.infer<typeof bookAppointmentFormSchema>;

export const BookAppointmentModal = () => {
  const session = useSession();
  const router = useRouter();

  const closeModal = useTelemedicinePatientModal((state) => state.onClose);
  const userId = useTelemedicinePatientModal((state) => state.mainUserId) || "";
  const modalType = useTelemedicinePatientModal((state) => state.type);
  const isOpen = useTelemedicinePatientModal((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "bookAppointment";

  const [patientData, setPatientData] = useState<PatientDataType>(null);
  const [doctorsData, setDoctorsData] = useState<DoctorsDataType>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId && isModalOpen) {
      (async () => {
        try {
          setError(null);
          setIsLoading(true);
          const data = await getInitialAppointmentBookingData(userId);
          setPatientData(data.patientData);
          setDoctorsData(data.doctorsData || []);
        } catch (err) {
          setError((err as Error)?.message);
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [isModalOpen, userId]);

  const form = useForm<BookAppointmentFormSchemaType>({
    resolver: zodResolver(bookAppointmentFormSchema),
    defaultValues: {
      appointmentType: "",
      date: new Date(),
      doctorId: "",
      note: "",
      appointmentMode: undefined,
      time: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  function handleCloseModal() {
    setPatientData(null);
    setDoctorsData([]);
    setIsLoading(false);
    form.reset();
    closeModal();
  }

  async function onSubmit(values: BookAppointmentFormSchemaType) {
    if (session.data?.user.role !== "telemedicine-patient") {
      return;
    }

    try {
      await createDoctorAppointment(values, {
        patientId: patientData?.id || "",
      });
      toast("Appointment booked successfully.");
      router.refresh();
      form.reset();
      handleCloseModal();
    } catch (err) {
      toast("Error!", {
        description: (err as Error).message,
      });
    }
  }

  const selectList = [
    { label: "General Consultation", value: "consultation" },
    { label: "General Checkup", value: "check up" },
  ];

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

  const appointmentModeSelectList = [
    { label: "Video", value: AppointmentMode.VIDEO },
    { label: "In Person", value: AppointmentMode.INPERSON },
  ];

  const selectDoctorList = doctorsData?.map((data) => {
    return {
      label: (
        <div className="flex items-center gap-2">
          <ProfileAvatar name={data.name} imgUrl={data.img} />
          <div>
            <p>{data.name}</p>
            <span className="text-xs">{data.specialization}</span>
          </div>
        </div>
      ),
      value: data.id,
    };
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          {error ? (
            <p>{error}</p>
          ) : (
            <>
              <DialogDescription asChild className="mt-6">
                <div className="flex items-center justify-center gap-3 w-fit mb-2">
                  {isLoading && (
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    </div>
                  )}
                  {patientData && (
                    <>
                      <ProfileAvatar
                        imgUrl={patientData?.img}
                        name={patientData?.name}
                        avatarClassName="size-12"
                      />
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold text-zinc-800 dark:text-white">
                          {patientData?.name}
                        </h2>
                        <span className="capitalize">
                          {patientData?.gender.toLowerCase()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </DialogDescription>
              <div className="mt-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="flex flex-wrap gap-4 items-center">
                      <CustomInput
                        type="select"
                        name="appointmentType"
                        label="Appointment Type"
                        placeholder="Select a type"
                        control={form.control}
                        formItemClassName="flex-1"
                        className="w-full"
                        selectList={selectList}
                      />
                      <CustomInput
                        type="select"
                        name="doctorId"
                        label="Doctors"
                        placeholder="Select a doctor"
                        control={form.control}
                        formItemClassName="flex-1"
                        className="w-full"
                        selectList={selectDoctorList}
                      />
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                      {/* <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Controller
                            control={form.control}
                            name="date"
                            render={({ field: { value, onChange } }) => (
                              <DatePicker
                                selected={value}
                                onChange={(date) => onChange(date)}
                                placeholderText="Select an available date"
                                className={cn("border px-3 py-1.5 rounded-md")}
                                calendarClassName="!bg-white !border max-h-[150px] overflow-y-scroll !rounded-md !shadow-md"
                              />
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                      <CustomInput
                        type="input"
                        control={form.control}
                        name="date"
                        placeholder="01-05-2000"
                        label="Date of Birth"
                        inputType="date"
                        formItemClassName="flex-1"
                        dateMin={new Date().toISOString().split("T")[0]}
                      />
                      {/* <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Date</FormLabel>
                        <FormControl>
                          <Controller
                            control={form.control}
                            name="date"
                            render={({ field: { value, onChange } }) => (
                              <div className="border rounded-lg p-2 shadow-md">
                                <Calendar
                                  value={value || null}
                                  onChange={(date) => onChange(date as Date)}
                                  className="!w-full !rounded-md !border !shadow-sm"
                                />
                              </div>
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                      <CustomInput
                        type="select"
                        name="time"
                        label="Time"
                        placeholder="Select time"
                        control={form.control}
                        formItemClassName="flex-1"
                        className="w-full"
                        selectList={selectListTime}
                      />
                    </div>
                    <CustomInput
                      type="select"
                      name="appointmentMode"
                      label="Appointment Mode"
                      placeholder="Select time"
                      control={form.control}
                      formItemClassName="flex-1"
                      className="w-full"
                      selectList={appointmentModeSelectList}
                    />
                    <CustomInput
                      type="textarea"
                      name="note"
                      label="Additional Note"
                      placeholder="Additional Note..."
                      control={form.control}
                    />
                    <Button type="submit" disabled={isLoading || isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </form>
                </Form>
              </div>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
