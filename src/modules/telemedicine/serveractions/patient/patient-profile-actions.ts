/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { headers } from "next/headers";
import { prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { PatientFormSchema } from "../../schemas/patient-form-schema";

function findOrgId(userRBAC: any, appSlug: string): string {
  // let orgId: string = "";
  // userRBAC.forEach((data: any) => {
  //   data.organization.appOrganization.forEach((appData: any) => {
  //     if (appData.app.slug === appSlug) {
  //       orgId = appData.organizationId;
  //     }
  //   });
  // });
  // return orgId;

  return (
    userRBAC
      .flatMap((data: any) => data.organization.appOrganization)
      .find((appData: any) => appData.app.slug === appSlug)?.organizationId ||
    ""
  );
}

export async function createPatientProfile(patientProfileData: any) {
  const session = await getServerSession();
  const referer = (await headers()).get("referer");
  const validateData = PatientFormSchema.safeParse(patientProfileData);

  const url = new URL(referer!);
  const pathname = url.pathname;

  const pathSplitedArray = pathname.split("/");
  const appSlug = `/${pathSplitedArray[1]}/${pathSplitedArray[2]}`;

  if (!session || session?.user?.role !== "telemedicine-patient") {
    throw new Error("Unauthorized");
  }

  const orgId = findOrgId(session?.userRBAC, appSlug);

  if (!validateData.success) {
    throw new Error("Invalid data");
  }

  await prismaTeleMedicine.patient.create({
    data: {
      userId: session?.user?.id,
      role: session?.user?.role,
      img: session?.user?.image || "",
      orgId,
      ...validateData.data,
    },
  });
}

export async function updatePatientProfile(patientProfileData: any) {
  const session = await getServerSession();
  const validateData = PatientFormSchema.safeParse(patientProfileData);

  if (!session || session?.user?.role !== "telemedicine-patient") {
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
