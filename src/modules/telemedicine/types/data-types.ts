import {
  AppointmentStatus,
  Doctor,
  Patient,
} from "../../../../prisma/generated/telemedicine";

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
