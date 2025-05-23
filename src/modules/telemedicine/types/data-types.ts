import { z } from "zod";
import {
  AppointmentStatus,
  Gender,
  Doctor,
  Patient,
  Appointment,
} from "../../../../prisma/generated/telemedicine";
import { createDoctorFormSchema } from "../schemas/create-doctor-form-schema";
import { scheduleAppointmentFormSchema } from "../schemas/schedule-appointment-form-schema";

export type AppointmentChartProps = {
  name: string;
  appointment: number;
  completed: number;
}[];

export type AppointmentType = {
  id: number;
  patient_id: string;
  doctor_id: string;
  type: string;
  appointment_date: string;
  time: string;
  status: AppointmentStatus;

  patient: Patient;
  doctor: Doctor;
};

export type AppointmentTablePatient = {
  name: string;
  id: string;
  date_of_birth: Date;
  gender: Gender;
  phone: string;
  img: string | null;
  colorCode: string | null;
};

export type AppointmentTableDoctor = {
  name: string;
  id: string;
  img: string | null;
  colorCode: string | null;
  specialization: string;
};

export type AppointmentTableDataType = {
  id: number;
  status: AppointmentStatus;
  type: string;
  patient: AppointmentTablePatient;
  patient_id: string;
  doctor_id: string;
  appointment_date: Date;
  time: string;
  doctor: AppointmentTableDoctor;
  appointment_mode: "VIDEO" | "INPERSON";
  livekit_room_id: string;
};

export type DoctorAppointmentTableDataType = Appointment & {
  patient: {
    id: string;
    userId: string;
    name: string;
    gender: Gender;
    img: string | null;
  };
};

export type AdminDoctorsDataType = {
  name: string;
  id: string;
  email: string;
  specialization: string;
  phone: string;
  license_number: string;
  created_at: Date;
};

export type CreateDoctorDataType = z.infer<typeof createDoctorFormSchema>;

export type UserWithDoctorRoleDataType = {
  user: {
    name: string;
    id: string;
    email: string;
    username: string | null;
  };
  role: {
    name: string;
  };
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  organizationId: string;
  roleId: string;
};

export type ScheduleAppointmentFormSchemaType = z.infer<
  typeof scheduleAppointmentFormSchema
>;
