/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { PatientFormSchema } from "../../schemas/patient-form-schema";

export async function createPatientProfile(patientProfileData: any) {
  const session = await getServerSession();
  const validateData = PatientFormSchema.safeParse(patientProfileData);

  if (!session || session?.user?.role !== "patient") {
    throw new Error("Unauthorized");
  }

  if (!validateData.success) {
    throw new Error("Invalid data");
  }

  await prismaTeleMedicine.patient.create({
    data: {
      userId: session?.user?.id,
      ...validateData.data,
    },
  });
}

export async function updatePatientProfile(patientProfileData: any) {
  const session = await getServerSession();
  const validateData = PatientFormSchema.safeParse(patientProfileData);

  if (!session || session?.user?.role !== "patient") {
    throw new Error("Unauthorized");
  }

  if (!validateData.success) {
    throw new Error("Invalid data");
  }

  await prismaTeleMedicine.patient.update({
    where: {
      userId: session?.user?.id,
    },
    data: {
      ...validateData.data,
    },
  });
}
