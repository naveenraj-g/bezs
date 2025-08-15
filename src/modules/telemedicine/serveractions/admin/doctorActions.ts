"use server";

import { prismaMain, prismaTeleMedicine } from "@/lib/prisma";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import {
  CreateDoctorDataType,
  TCreateAIDoctorData,
} from "../../types/data-types";
import {
  createAIDoctorFormSchema,
  createDoctorFormSchema,
} from "../../schemas/create-doctor-form-schema";
import { findOrgId } from "../patient/patient-profile-actions";
import { headers } from "next/headers";
import { adminRole } from "../../utils/roles";

export async function getAllDoctors() {
  const session = await getServerSession();

  if (session?.user?.role !== adminRole) {
    throw new Error("Unauthorized");
  }

  try {
    const doctorsData = await prismaTeleMedicine.doctor.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        specialization: true,
        phone: true,
        license_number: true,
        created_at: true,
      },
    });

    const doctorsSize = await prismaTeleMedicine.doctor.count();

    return { doctorsData, doctorsSize };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new Error("Failed to get data");
  }
}

export async function getAllUsersWithTelemedicineDoctorRole() {
  const session = await getServerSession();
  const referer = (await headers()).get("referer");
  const url = new URL(referer!);
  const pathname = url.pathname;

  const pathSplitedArray = pathname.split("/");
  const appSlug = `/${pathSplitedArray[1]}/${pathSplitedArray[2]}`;

  const orgId = await findOrgId(session?.userRBAC, appSlug);

  if (session?.user?.role !== adminRole) {
    throw new Error("Unauthorized");
  }

  try {
    const [doctorRoleData, allOrgDoctorData] = await Promise.all([
      prismaMain.rBAC.findMany({
        where: {
          organizationId: orgId,
          role: {
            name: adminRole,
          },
        },
        include: {
          role: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
            },
          },
        },
      }),
      prismaTeleMedicine.doctor.findMany({
        where: {
          orgId,
        },
        select: {
          userId: true,
        },
      }),
    ]);

    const data = doctorRoleData.filter((data) => {
      const doctorData = allOrgDoctorData.find(
        (docData) => docData.userId === data.userId
      );

      return !doctorData;
    });

    return data;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new Error("Failed to get data");
  }
}

export async function createDoctor(data: CreateDoctorDataType, userData: any) {
  const session = await getServerSession();

  if (session?.user?.role !== adminRole) {
    throw new Error("Unauthorized");
  }

  const validateData = createDoctorFormSchema.safeParse(data);

  if (!validateData.success) {
    throw new Error("Invalid data");
  }

  await prismaTeleMedicine.doctor.create({
    data: {
      ...validateData.data,
      ...userData,
    },
  });
}

export async function createAIDoctor(data: TCreateAIDoctorData) {
  const session = await getServerSession();
  const referer = (await headers()).get("referer");
  const url = new URL(referer!);
  const pathname = url.pathname;

  const pathSplitedArray = pathname.split("/");
  const appSlug = `/${pathSplitedArray[1]}/${pathSplitedArray[2]}`;

  const orgId = await findOrgId(session?.userRBAC, appSlug);

  if (session?.user?.role !== adminRole) {
    throw new Error("Unauthorized");
  }

  const validateData = createAIDoctorFormSchema.safeParse(data);

  if (!validateData.success) {
    throw new Error("Invalid data");
  }

  await prismaTeleMedicine.doctor.create({
    data: {
      ...validateData.data,
      orgId,
      doctorType: "AI_DOCTOR",
    },
  });
}
