import {
  AppointmentMode,
  DoctorType,
  Gender,
} from "../../../../prisma/generated/telemedicine";

export type TAIDoctorData = {
  id: string;
  orgId: string;
  name: string;
  specialization: string;
  description: string | null;
  agentPrompt: string | null;
  voiceId: string | null;
  img: string | null;
  doctorType: DoctorType;
};

export type TAppointmentData = {
  id: number;
  patient: {
    name: string;
    id: string;
    email: string;
    userId: string;
    orgId: string;
    date_of_birth: Date;
    gender: Gender;
    blood_group: string | null;
    img: string | null;
  };
  patient_id: string;
  doctor_id: string;
  appointment_date: Date;
  time: string;
  note: string | null;
  appointment_mode: AppointmentMode;
  doctor: {
    name: string;
    id: string;
    description: string | null;
    orgId: string;
    img: string | null;
    specialization: string;
    agentPrompt: string | null;
    voiceId: string | null;
    doctorType: DoctorType;
  };
};
